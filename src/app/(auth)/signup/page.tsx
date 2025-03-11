"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/Auth";

function SignupPage() {
    const { createAccount, login } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Récupération des données
        const formData = new FormData(e.currentTarget);
        const firstName = formData.get("firstname")?.toString();
        const lastName = formData.get("lastname")?.toString();
        const email = formData.get("email")?.toString();
        const password = formData.get("password")?.toString();

        // Validation
        if (!firstName || !lastName || !email || !password) {
            setError("Please fill out all the fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Création du compte
            const response = await createAccount(`${firstName} ${lastName}`, email, password);

            if (response.error) {
                setError(response.error.message);
            } else {
                // Connexion après inscription
                const loginResponse = await login(email, password);
                if (loginResponse.error) {
                    setError(loginResponse.error.message);
                }
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="firstname" placeholder="First Name" required />
                <input type="text" name="lastname" placeholder="Last Name" required />
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit" disabled={loading}>
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </form>
        </div>
    );
}

export default SignupPage;
