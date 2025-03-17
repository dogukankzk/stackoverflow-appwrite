import { db, voteCollection } from "../name"
import { databases } from "./config"
import { Permission } from "node-appwrite"

export default async function createVoteCollection(){
    await databases.createCollection(db, voteCollection, voteCollection, [
        Permission.read("any"),
        Permission.create("users"),
        Permission.delete("users"),
        Permission.update("users")

    ])
    console.log("Vote collection is created")

    await Promise.all([
        databases.createEnumAttribute(db, voteCollection, "type",["answer", "question"], true),
        databases.createEnumAttribute(db, voteCollection, "voteStatus", ["upvoted", "downvoted"], true),
        databases.createStringAttribute(db, voteCollection, "typeId", 50, true),
        databases.createStringAttribute(db, voteCollection, "votedById", 50, true)
    ])
    console.log("Vote attributes created")

    
}