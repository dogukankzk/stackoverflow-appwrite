"use client";

import { useState } from "react";
import { databases } from "@/models/client/config";
import { db, answerCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { ID } from "appwrite";

interface AnswerFormProps {
    questionId: string;
}

export default function AnswerForm({ questionId }: AnswerFormProps) {
    const { session } = useAuthStore();
    const [newAnswer, setNewAnswer] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleAddAnswer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            setError("You must be logged in to answer.");
            return;
        }

        try {
            setIsLoading(true);
            await databases.createDocument(db, answerCollection, ID.unique(), {
                questionId,
                content: newAnswer,
                authorId: session.userId,
                authorName: session.name, // 🔥 Ajout du nom de l'auteur
            });
            
            setNewAnswer("");
        } catch (error) {
            setError("Failed to submit the answer.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-6 border-t pt-4">
            <h3 className="text-xl font-semibold">Your Answer</h3>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleAddAnswer} className="mt-4">
                <textarea
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Write your answer..."
                    className="w-full p-2 border rounded text-black"
                    rows={4}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 px-4 py-2 bg-black  text-white rounded cursor-pointer"
                >
                    {isLoading ? "Submitting..." : "Submit Answer"}
                </button>
            </form>
        </div>
    );
}
