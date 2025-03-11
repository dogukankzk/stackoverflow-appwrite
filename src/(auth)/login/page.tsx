"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/Auth";

function LoginPage() {
    const { login } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Récupération des données
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email")?.toString();
        const password = formData.get("password")?.toString();

        // Validation
        if (!email || !password) {
            setError("Please fill out all the fields");
            return;
        }

        // Gestion du chargement
        setLoading(true);
        setError("");

        try {
            const loginResponse = await login(email, password);

            if (loginResponse.error) {
                setError(loginResponse.error.message);
            }
        } catch (error) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

export default LoginPage;
