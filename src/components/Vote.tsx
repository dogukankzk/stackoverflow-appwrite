"use client";

import { useEffect, useState } from "react";
import { databases } from "@/models/client/config";
import { db, voteCollection } from "@/models/name";
import { Query, ID } from "appwrite";
import { useAuthStore } from "@/store/Auth";
import { Button } from "@/components/ui/button";
import { IconArrowUp, IconArrowDown } from "@tabler/icons-react";

interface VoteProps {
    type: "questions" | "answers";
    typeId: string;
    onVoteSuccess?: () => void; // ✅ Rafraîchir la page d'accueil après un vote
}

export default function Vote({ type, typeId, onVoteSuccess }: VoteProps) {
    const { session } = useAuthStore();
    const [voteCount, setVoteCount] = useState(0);
    const [userVote, setUserVote] = useState<{ id: string; status: "upvoted" | "downvoted" } | null>(null);

    useEffect(() => {
        async function fetchVotes() {
            try {
                const response = await databases.listDocuments(db, voteCollection, [
                    Query.equal("type", type),
                    Query.equal("typeId", typeId),
                ]);

                // 🔥 Vérification des votes récupérés
                console.log(`📌 Votes pour ${type} ${typeId}:`, response.documents);

                // ✅ Calcul du nombre de votes
                const upvotes = response.documents.filter(vote => vote.voteStatus === "upvoted").length;
                const downvotes = response.documents.filter(vote => vote.voteStatus === "downvoted").length;
                setVoteCount(upvotes - downvotes);

                if (session) {
                    const userVoteData = response.documents.find(vote => vote.votedById === session.userId);
                    if (userVoteData) {
                        setUserVote({ id: userVoteData.$id, status: userVoteData.voteStatus });
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des votes", error);
            }
        }

        fetchVotes();
    }, [type, typeId, session]);

    async function handleVote(voteType: "upvoted" | "downvoted") {
        if (!session) {
            alert("You must be logged in to vote.");
            return;
        }

        try {
            if (userVote) {
                await databases.deleteDocument(db, voteCollection, userVote.id);
                setVoteCount(prev => userVote.status === "upvoted" ? prev - 1 : prev + 1);
                setUserVote(null);

                if (userVote.status === voteType) return;
            }

            const newVote = await databases.createDocument(db, voteCollection, ID.unique(), {
                type,
                typeId,
                voteStatus: voteType,
                votedById: session.userId, 
            });

            setVoteCount(prev => voteType === "upvoted" ? prev + 1 : prev - 1);
            setUserVote({ id: newVote.$id, status: voteType });

            if (onVoteSuccess) {
                onVoteSuccess(); // ✅ Mettre à jour la page d'accueil après un vote
            }
        } catch (error) {
            console.error("Erreur lors du vote", error);
        }
    }

    return (
        <div className="flex flex-col items-center">
            <Button onClick={() => handleVote("upvoted")} variant="ghost">
                <IconArrowUp className={`h-6 w-6 ${userVote?.status === "upvoted" ? "text-green-500" : "text-gray-500"}`} />
            </Button>
            <span className="text-lg font-semibold">{voteCount}</span>
            <Button onClick={() => handleVote("downvoted")} variant="ghost">
                <IconArrowDown className={`h-6 w-6 ${userVote?.status === "downvoted" ? "text-red-500" : "text-gray-500"}`} />
            </Button>
        </div>
    );
}
