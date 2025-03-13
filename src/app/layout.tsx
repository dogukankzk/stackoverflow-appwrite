"use client";
import Link from "next/link";
import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const { session, logout } = useAuthStore();
    const router = useRouter();

    console.log("Session actuelle :", session); // ✅ Debug : Voir si Zustand met bien à jour

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <html lang="fr">
            <body>
                <nav className="bg-gray-800 text-white p-4 flex justify-between">
                    <Link href="/" className="font-bold">Forum</Link>
                    <div>
                        <Link href="/ask" className="mr-4">Poser une Question</Link>
                        <Link href="/profile" className="mr-4">Profil</Link>

                        {session ? (
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 px-4 py-2 rounded"
                            >
                                Déconnexion
                            </button>
                        ) : (
                            <>
                                <Link href="/login" className="mr-4">Connexion</Link>
                                <Link href="/signup" className="mr-4">Inscription</Link>
                            </>
                        )}
                    </div>
                </nav>
                <main className="p-6">{children}</main>
            </body>
        </html>
    );
}
