/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { databases } from "@/models/client/config";
import { db, questionCollection, answerCollection } from "@/models/name";
import { Query } from "appwrite";
import { useParams } from "next/navigation";
import Vote from "@/components/Vote";
import AnswerForm from "./answer/page";

export default function QuestionPage() {
    const params = useParams();
    const [question, setQuestion] = useState<any>(null);
    const [answers, setAnswers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!params?.id) return;

            try {
                // 🔹 Récupération de la question
                const questionData = await databases.getDocument(db, questionCollection, params.id);
                setQuestion(questionData);

                // 🔹 Récupération des réponses liées à cette question
                const answersData = await databases.listDocuments(db, answerCollection, [
                    Query.equal("questionId", params.id),
                    Query.orderDesc("$createdAt"),
                ]);
                setAnswers(answersData.documents);
            } catch (error) {
                console.error("Erreur de chargement", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [params.id]);

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (!question) return <p className="text-red-500">Question not found.</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <div className="flex items-start space-x-4">
                {/* 🔹 Système de vote */}
                <Vote type="question" typeId={question.$id} />
                <div>
                    <h1 className="text-2xl font-bold">{question.title}</h1>
                    <p className="text-gray-700 mt-2">{question.content}</p>
                </div>
            </div>

            {/* 🔹 Liste des réponses */}
            <div className="mt-6 border-t pt-4">
                <h2 className="text-lg font-semibold">Answers</h2>
                {answers.length > 0 ? (
                    <ul className="mt-2 space-y-4">
                        {answers.map((answer) => (
                            <li key={answer.$id} className="p-4 border rounded-lg shadow">
                                <div className="flex items-start space-x-4">
                                    <Vote type="answer" typeId={answer.$id} />
                                    <p>{answer.content}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 mt-2">No answers yet.</p>
                )}
            </div>

            {/* 🔹 Formulaire pour ajouter une réponse */}
            <AnswerForm questionId={params.id} />
        </div>
    );
}
