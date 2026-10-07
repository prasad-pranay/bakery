"use client";

import AuthPage from "./authPage";

export default function AuthPageClient() {
    async function handleAuth(
        mode: "signin" | "signup",
        values: {
            name: string;
            email: string;
            password: string;
        }
    ) {
        const endpoint =
            mode === "signin"
                ? "/api/auth/signin"
                : "/api/auth/signup";

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(
                mode === "signup"
                    ? values
                    : {
                        email: values.email,
                        password: values.password,
                    }
            ),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Authentication failed."
            );
        }

        // Redirect only after your backend confirms
        // authentication and establishes the session.
        window.location.href = "/";

    }

    return <AuthPage onSubmit={handleAuth} />;
}