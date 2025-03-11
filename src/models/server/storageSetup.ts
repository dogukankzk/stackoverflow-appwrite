import { questionAttachmentBucket } from "../name";
import { storage } from "./config";
import { Permission } from "node-appwrite";

export default async function getOrCreateStorage() {
    try {
        await storage.getBucket(questionAttachmentBucket);
        console.log("✅ Storage bucket already exists");
    } catch (error) {
        try {
            await storage.createBucket(
                questionAttachmentBucket,
                questionAttachmentBucket,
                [
                    Permission.read("users"), // ✅ Seuls les utilisateurs connectés peuvent voir les fichiers
                    Permission.create("users"),
                    Permission.delete("users"),
                    Permission.update("users")
                ],
                false,
                undefined,
                undefined,
                ["jpg", "png", "gif", "jpeg", "webp", "heic"]
            );
            console.log("✅ Storage created");
        } catch (err) {
            console.error("❌ Error while creating storage:", err);
        }
    }
}
