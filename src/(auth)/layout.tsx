"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/store/Auth";
import { useRouter, usePathname } from "next/navigation"; // ✅ Ajout de `usePathname`

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { session } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname(); // ✅ Récupérer l'URL actuelle

    // ✅ Liste des pages accessibles sans être connecté
    const publicPages = ["/login", "/signup"];

    useEffect(() => {
        if (session && publicPages.includes(pathname)) {
            router.push("/");
        }
    }, [session, pathname, router]);

    return <div>{children}</div>;
};

export default Layout;
