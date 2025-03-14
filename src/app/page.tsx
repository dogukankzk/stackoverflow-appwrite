/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { databases } from "@/models/client/config";
import { db, questionCollection, answerCollection, voteCollection } from "@/models/name";
import { Query } from "appwrite";
import Header from "@/components/Header";

export default function HomePage() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        async function fetchQuestions() {
            try {
                setLoading(true);
                
                // 🔹 Récupérer uniquement les dernières questions
                const response = await databases.listDocuments(db, questionCollection, [
                    Query.orderDesc("$createdAt"),
                ]);

                // 🔹 Récupérer les votes et réponses associées
                const questionsWithDetails = await Promise.all(
                    response.documents.map(async (question) => {
                        const [answersResponse, votesResponse] = await Promise.all([
                            databases.listDocuments(db, answerCollection, [
                                Query.equal("questionId", question.$id),
                                Query.orderDesc("$createdAt"),
                            ]),
                            databases.listDocuments(db, voteCollection, [
                                Query.equal("type", "questions"),
                                Query.equal("typeId", question.$id),
                            ]),
                        ]);

                        return { 
                            ...question, 
                            answers: answersResponse.documents, 
                            votes: votesResponse.total 
                        };
                    })
                );

                setQuestions(questionsWithDetails);
            } catch (err) {
                console.error("Erreur de chargement des questions", err);
                setError("Impossible de charger les questions.");
            } finally {
                setLoading(false);
            }
        }

        fetchQuestions();
    }, []); 

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className=" min-h-screen text-black">
            <Header />
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-4xl font-bold mb-6">Recent Questions</h1>

                <ul className="space-y-4">
                    {questions.length > 0 ? (
                        questions.map((question) => (
                            <li 
                                key={question.$id} 
                                onClick={() => router.push(`/questions/${question.$id}`)}
                                className="bg-white shadow-lg p-6 rounded-xl cursor-pointer transition-transform transform hover:-translate-y-1 hover:scale-[1.02] hover:border border-cyan-600"
                            >
                                <h2 className="text-xl font-semibold">{question.title}</h2>
                                <p className="text-gray-400 mt-2">{question.content.substring(0, 100)}...</p>

                                <div className="flex justify-between items-center mt-4">
                                    <p className="text-gray-500 text-sm">🗨 {question.answers.length} answers</p>
                                    <p className="text-orange-500 text-sm">⬆ {question.votes} votes</p>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">No question yet.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}
