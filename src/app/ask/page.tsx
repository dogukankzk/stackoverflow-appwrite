/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/Auth";
import { databases } from "@/models/client/config";
import { db, questionCollection } from "@/models/name";
import { ID } from "appwrite";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export default function AskQuestionPage() {
    const { session } = useAuthStore();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!session) {
        return <p className="text-red-500">You must be logged in to ask a question.</p>;
    }

    // ✅ Ajout d'un tag
    const handleAddTag = () => {
        if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    // ❌ Suppression d'un tag
    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    // ✅ Soumission de la question
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content || tags.length === 0) {
            setError("Please fill out all fields and add at least one tag.");
            return;
        }

        try {
            setIsLoading(true);
            await databases.createDocument(db, questionCollection, ID.unique(), {
                title,
                content,
                tags, 
                authorId: session.userId,
            });

            setTitle("");
            setContent("");
            setTags([]);
            setError("");
        } catch (error) {
            setError("Failed to submit the question.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Ask a Question</h1>

            {error && <p className="text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Title</label>
                    <Input
                        type="text"
                        placeholder="Enter your question title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Content</label>
                    <textarea
                        placeholder="Provide more details about your question..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-2 border rounded text-black"
                        rows={5}
                        required
                    />
                </div>

                {/* ✅ Gestion des Tags */}
                <div>
                    <label className="block font-medium mb-1">Tags</label>
                    <div className="flex space-x-2">
                        <Input
                            type="text"
                            placeholder="Add a tag..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                        />
                        <Button type="button" onClick={handleAddTag}>Add Tag</Button>
                    </div>

                    {/* Affichage des tags sélectionnés */}
                    <div className="mt-2 flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm flex items-center space-x-1"
                            >
                                {tag}
                                <button
                                    type="button"
                                    className="ml-2 text-red-500 hover:text-red-700"
                                    onClick={() => handleRemoveTag(tag)}
                                >
                                    ✕
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Submitting..." : "Submit Question"}
                </Button>
            </form>
        </div>
    );
}
