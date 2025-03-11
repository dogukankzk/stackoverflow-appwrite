import { db } from "../name";
import { databases } from "./config";
import createQuestionCollection from "./question.collection";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createVoteCollection from "./vote.collection";

export default async function getOrCreateDB() {
    try {
        // Vérifier si la base de données existe
        const existingDatabases = await databases.list();
        const dbExists = existingDatabases.databases.some(database => database.$id === db);

        if (!dbExists) {
            await databases.create(db, "Main Overflow Database");
            console.log("✅ Database created");
        } else {
            console.log("✅ Database already exists");
        }

        // Appeler les fichiers de création de collections
        await Promise.all([
            createQuestionCollection(),
            createAnswerCollection(),
            createCommentCollection(),
            createVoteCollection()
        ]);

        console.log("✅ All collections created successfully");
    } catch (error) {
        console.error("❌ Error while setting up database:", error);
    }
}
