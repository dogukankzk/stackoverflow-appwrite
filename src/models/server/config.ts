import { Client, Databases, Storage, Users } from "node-appwrite";
import env from "@/app/env";

const client = new Client()
    .setEndpoint(env.appwrite.endpoint) // API Endpoint
    .setProject(env.appwrite.projectId) // ID du projet
    .setKey(env.appwrite.apiKey); // Clé API (côté serveur uniquement)

const databases = new Databases(client);
const users = new Users(client);
const storage = new Storage(client);

export { databases, users, storage, client };
