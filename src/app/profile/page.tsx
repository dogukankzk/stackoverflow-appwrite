"use client";

import React from "react";
import { useAuthStore } from "@/store/Auth";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
    const { user, logout } = useAuthStore();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-white text-lg">Vous devez être connecté pour voir votre profil.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-md rounded-none border border-solid border-white/30 bg-white p-4 shadow-input dark:bg-black md:rounded-2xl md:p-8">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                Profile
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                Welcome, <span className="text-orange-500 font-semibold">{user?.name}</span>! <br />
                Manage your profile information here.
            </p>

            <div className="my-8">
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4 p-4 border border-white/20 rounded-lg">
                        <div className="bg-gray-800 text-white flex items-center justify-center w-16 h-16 text-2xl font-bold rounded-full">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">{user?.name}</h3>
                            <p className="text-gray-400">📧 {user?.email}</p>
                            <p className="text-gray-400">🏆 Reputation: {user?.prefs?.reputation || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            <Button
                onClick={logout}
                variant="destructive"
                className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] mt-4"
            >
                Logout 🚪
                <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            </Button>
        </div>
    );
}
