import { Client, Account, Avatars, Storage, Databases } from "appwrite";
import env from "@/app/env";

// Initialisation du client (sans API Key, car on est côté client)
const client = new Client()
    .setEndpoint(env.appwrite.endpoint)
    .setProject(env.appwrite.projectId);

const databases = new Databases(client);
const account = new Account(client);
const avatars = new Avatars(client);
const storage = new Storage(client);

export { databases, account, avatars, storage, client };
