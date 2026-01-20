"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
    return (
        <button
            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition font-medium"
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        >
            Logout
        </button>
    );
}
