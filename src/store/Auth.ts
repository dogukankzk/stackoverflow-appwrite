import { create } from "zustand";
import { immer } from "zustand/middleware/immer"; 
import { persist } from "zustand/middleware";

import { AppwriteException, ID, Models } from "appwrite";
import { account } from "@/models/client/config";

// Interface pour les préférences utilisateur
export interface UserPrefs {
    reputation: number;
}

// Interface de l'état global d'authentification
export interface IAuthStore {
    session: Models.Session | null;
    jwt: string | null;
    user: Models.User<UserPrefs> | null;
    hydrated: boolean;

    setHydrated(): void;
    verifySession(): Promise<void>;
    login(email: string, password: string): Promise<{ success: boolean; error?: string }>;
    createAccount(name: string, email: string, password: string): Promise<{ success: boolean; error?: string }>;
    logout(): Promise<void>;
}

// Création du store Zustand avec `persist` pour sauvegarder l’état
export const useAuthStore = create<IAuthStore>()(
    persist(
        immer((set) => ({
            session: null,
            jwt: null,
            user: null,
            hydrated: false,

            // Marquer l'état comme hydraté (utilisé lors du rechargement de l'état)
            setHydrated() {
                set({ hydrated: true });
            },

            // Vérifie si une session existe et met à jour l'état
            async verifySession() {
                try {
                    const session = await account.getSession("current");
                    const user = await account.get<UserPrefs>();
                    set({ session, user });
                } catch (error: unknown) {
                    console.error("Erreur de vérification de session :", error);
                    set({ session: null, user: null, jwt: null });
                }
            },

            // Fonction de connexion
            async login(email: string, password: string) {
                try {
                    // Création de session Appwrite
                    const session = await account.createEmailPasswordSession(email, password);

                    // Récupération de l'utilisateur et création du JWT
                    const [user, jwtToken] = await Promise.all([
                        account.get<UserPrefs>(), // Récupère l'utilisateur actuel
                        account.createJWT() // Génère un JWT pour les requêtes sécurisées
                    ]);

                    // Si `reputation` n'existe pas encore, on l'initialise à 0
                    if (!user.prefs?.reputation) {
                        await account.updatePrefs<UserPrefs>({ reputation: 0 });
                    }

                    // Mise à jour de l'état global
                    set({ session, user, jwt: jwtToken.jwt });

                    return { success: true };
                } catch (error: unknown) {
                    console.error("Erreur de connexion :", error);
                    return {
                        success: false,
                        error: error instanceof AppwriteException ? error.message : "An error occurred during login."
                    };
                }
            },

            // Fonction pour créer un compte
            async createAccount(name: string, email: string, password: string) {
                try {
                    await account.create(ID.unique(), email, password, name);
                    return { success: true };
                } catch (error: unknown) {
                    console.error("Erreur lors de la création du compte :", error);
                    return {
                        success: false,
                        error: error instanceof AppwriteException ? error.message : "An error occurred while creating the account."
                    };
                }
            },

            // Déconnexion
            async logout() {
                try {
                    // ✅ Vérifier si l'utilisateur existe avant de supprimer la session
                    try {
                        await account.get();
                    } catch (error: unknown) {
                        console.warn("L'utilisateur n'existe plus, suppression locale de la session.", error);
                        set({ session: null, jwt: null, user: null });
                        return;
                    }

                    await account.deleteSession("current");
                    window.location.href = "/login";

                    setTimeout(() => {
                        set({ session: null, jwt: null, user: null });
                    }, 100);
                } catch (error: unknown) {
                    console.error("Erreur lors de la déconnexion :", error);
                }
            }

        })),
        {
            name: "auth",
            onRehydrateStorage() {
                return (state, error) => {
                    if (!error) state?.setHydrated();
                };
            }
        }
    )
);
