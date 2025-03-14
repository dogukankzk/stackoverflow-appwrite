/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { databases } from "@/models/client/config";
import { db, questionCollection, answerCollection } from "@/models/name";
import { Query } from "appwrite";
import { useParams } from "next/navigation";
import Vote from "@/components/Vote";
import { Button } from "@/components/ui/button";

export default function QuestionPage() {
    const params = useParams();
    const [question, setQuestion] = useState<any>(null);
    const [answers, setAnswers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newAnswer, setNewAnswer] = useState("");

    useEffect(() => {
        async function fetchData() {
            if (!params?.id) return;

            try {
                const questionData = await databases.getDocument(db, questionCollection, params.id);
                setQuestion(questionData);

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

    async function handleAddAnswer() {
        if (!newAnswer.trim()) return;
        try {
            const response = await databases.createDocument(db, answerCollection, ID.unique(), {
                questionId: params.id,
                content: newAnswer,
            });
            setAnswers([response, ...answers]);
            setNewAnswer("");
        } catch (error) {
            console.error("Erreur lors de l'ajout de la réponse", error);
        }
    }

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (!question) return <p className="text-red-500">Question not found.</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <div className="flex items-start space-x-4">
                <Vote type="questions" typeId={question.$id} />
                <div>
                    <h1 className="text-2xl font-bold">{question.title}</h1>
                    <p className="text-gray-700 mt-2">{question.content}</p>
                </div>
            </div>

            <div className="mt-6 border-t pt-4">
                <h2 className="text-lg font-semibold">Answers</h2>
                {answers.length > 0 ? (
                    <ul className="mt-2 space-y-4">
                        {answers.map((answer) => (
                            <li key={answer.$id} className="p-4 border rounded-lg shadow">
                                <div className="flex items-start space-x-4">
                                    <Vote type="answers" typeId={answer.$id} />
                                    <p>{answer.content}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 mt-2">No answers yet.</p>
                )}
            </div>

            <div className="mt-6">
                <textarea
                    className="w-full p-2 border rounded-lg"
                    placeholder="Write your answer..."
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                />
                <Button onClick={handleAddAnswer} className="mt-2">Submit Answer</Button>
            </div>
        </div>
    );
}
