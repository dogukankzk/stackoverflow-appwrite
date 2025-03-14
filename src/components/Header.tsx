"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/Auth";
import { Button } from "./ui/button";

export default function Header() {
    const { session, logout } = useAuthStore();

    return (
        <header className="w-full text-black ">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-center items-center">

                {/* 🔹 Navigation */}
                <nav className="flex justify-center space-x-6 ">
                    <Link href="/" className="hover:underline underline-offset-8 transition ">Home</Link>
                    {session && (
                        <>
                            <Link href="/profile" className="hover:underline underline-offset-8 transition">Profile</Link>
                            <Link href="/ask" className="hover:underline underline-offset-8 transition">Ask Question</Link>
                        </>
                    )}
                </nav>

                {/* 🔹 Boutons Connexion / Déconnexion */}
                <div className="flex justify-end space-x-4 cursor-pointer mx-4">
                    {!session ? (
                        <>
                            <Button asChild variant="outline">
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/signup">Register</Link>
                            </Button>
                        </>
                    ) : (
                        <Button variant="destructive" onClick={logout} className="cursor-pointer bg-black ml-4 hover:bg-black">
                            Logout
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
