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
}

export default function Vote({ type, typeId }: VoteProps) {
    const { session } = useAuthStore();
    const [voteCount, setVoteCount] = useState(0);
    const [userVoteId, setUserVoteId] = useState<string | null>(null);
    const [userVoteStatus, setUserVoteStatus] = useState<"upvoted" | "downvoted" | null>(null);

    useEffect(() => {
        async function fetchVotes() {
            try {
                const response = await databases.listDocuments(db, voteCollection, [
                    Query.equal("type", type),
                    Query.equal("typeId", typeId),
                ]);

                // Mise à jour du compteur total de votes
                setVoteCount(response.total);

                if (session) {
                    const userVote = response.documents.find((vote) => vote.votedById === session.userId);
                    if (userVote) {
                        setUserVoteId(userVote.$id);
                        setUserVoteStatus(userVote.voteStatus);
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des votes", error);
            }
        }

        fetchVotes();
    }, [type, typeId, session]);

    async function handleVote(voteType: "upvoted" | "downvoted") {
        if (!session) return alert("You must be logged in to vote.");
        if (userVoteStatus === voteType) return;

        try {
            // Si l'utilisateur a déjà voté, supprimer son ancien vote
            if (userVoteId) {
                await databases.deleteDocument(db, voteCollection, userVoteId);
                setVoteCount((prev) => (userVoteStatus === "upvoted" ? prev - 1 : prev + 1));
                setUserVoteId(null);
                setUserVoteStatus(null);
                return;
            }

            // Ajouter un nouveau vote
            const newVote = await databases.createDocument(db, voteCollection, ID.unique(), {
                type,
                typeId,
                voteStatus: voteType,
                votedById: session.userId, // 🔥 Correction ici !
            });

            setVoteCount((prev) => (voteType === "upvoted" ? prev + 1 : prev - 1));
            setUserVoteId(newVote.$id);
            setUserVoteStatus(voteType);
        } catch (error) {
            console.error("Erreur lors du vote", error);
        }
    }

    return (
        <div className="flex flex-col items-center">
            <Button onClick={() => handleVote("upvoted")} variant="ghost">
                <IconArrowUp className={`h-6 w-6 ${userVoteStatus === "upvoted" ? "text-green-500" : "text-gray-500"}`} />
            </Button>
            <span className="text-lg font-semibold">{voteCount}</span>
            <Button onClick={() => handleVote("downvoted")} variant="ghost">
                <IconArrowDown className={`h-6 w-6 ${userVoteStatus === "downvoted" ? "text-red-500" : "text-gray-500"}`} />
            </Button>
        </div>
    );
}
