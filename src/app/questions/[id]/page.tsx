"use client";

import { useEffect, useState } from "react";
import { databases } from "@/models/client/config";
import { db, questionCollection, answerCollection } from "@/models/name";
import { Query } from "appwrite";
import { useParams, useRouter } from "next/navigation";
import Vote from "@/components/Vote";
import { useAuthStore } from "@/store/Auth";
import AnswerForm from "@/components/AnswerForm";

interface Question {
    $id: string;
    title: string;
    content: string;
    authorId: string;
}

interface Answer {
    $id: string;
    content: string;
    authorId: string;
}

export default function QuestionPage() {
    const params = useParams();
    const router = useRouter();
    const { session } = useAuthStore();
    const [question, setQuestion] = useState<Question | null>(null);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!params?.id) return;

            try {
                // 🔹 Récupération de la question
                const questionData = await databases.getDocument<Question>(db, questionCollection, params.id);
                setQuestion(questionData);

                // 🔹 Récupération des réponses liées à cette question
                const answersData = await databases.listDocuments<Answer>(db, answerCollection, [
                    Query.equal("questionId", params.id),
                    Query.orderDesc("$createdAt"),
                ]);
                setAnswers(answersData.documents);
            } catch (error: unknown) {
                console.error("Erreur de chargement", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [params.id]);

    // ✅ Supprimer la question si l'utilisateur est l'auteur
    async function handleDeleteQuestion() {
        if (!session || !question || session.userId !== question.authorId) return;

        try {
            await databases.deleteDocument(db, questionCollection, question.$id);
            alert("Question supprimée !");
            router.push("/");
        } catch (error: unknown) {
            console.error("Erreur lors de la suppression de la question", error);
        }
    }

    // ✅ Supprimer une réponse si l'utilisateur est l'auteur
    async function handleDeleteAnswer(answerId: string, authorId: string) {
        if (!session || session.userId !== authorId) return;

        try {
            await databases.deleteDocument(db, answerCollection, answerId);
            setAnswers(answers.filter((a) => a.$id !== answerId));
        } catch (error: unknown) {
            console.error("Erreur lors de la suppression de la réponse", error);
        }
    }

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (!question) return <p className="text-red-500">Question not found.</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                    <Vote type="question" typeId={question.$id} />
                    <div>
                        <h1 className="text-2xl font-bold">{question.title}</h1>
                        <p className="text-gray-700 mt-2">{question.content}</p>
                    </div>
                </div>
                {session?.userId === question.authorId && (
                    <button
                        onClick={handleDeleteQuestion}
                        className="text-red-600 hover:underline text-sm"
                    >
                        Delete
                    </button>
                )}
            </div>

            <div className="mt-6 border-t pt-4">
                <h2 className="text-lg font-semibold">Answers</h2>
                {answers.length > 0 ? (
                    <ul className="mt-2 space-y-4">
                        {answers.map((answer) => (
                            <li key={answer.$id} className="p-4 border rounded-lg shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start space-x-4">
                                        <Vote type="answer" typeId={answer.$id} />
                                        <div>
                                            <p>{answer.content}</p>
                                        </div>
                                    </div>
                                    {session?.userId === answer.authorId && (
                                        <button
                                            onClick={() => handleDeleteAnswer(answer.$id, answer.authorId)}
                                            className="text-red-600 hover:underline text-sm"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 mt-2">No answers yet.</p>
                )}
            </div>

            <AnswerForm questionId={params.id} />
        </div>
    );
}
