import { db, commentCollection } from "../name"
import { databases } from "./config"
import { Permission } from "node-appwrite"

export default async function createCommentCollection(){
    await databases.createCollection(db, commentCollection, commentCollection, [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.delete("users"),
        Permission.update("users")

    ])
    console.log("Comment collection is created")

    await Promise.all([
        databases.createEnumAttribute(db, commentCollection, "type",["answer", "question"], true),
        databases.createStringAttribute(db, commentCollection, "content", 10000, true),
        databases.createStringAttribute(db, commentCollection, "typeId", 50, true),
        databases.createStringAttribute(db, commentCollection, "authorId", 50, true)
    ])
    console.log("Comment attributes created")

    
}