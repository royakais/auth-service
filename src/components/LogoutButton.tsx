"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-slate-300 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300 group shadow-sm"
        >
            <span className="text-xs font-bold uppercase tracking-[0.15em]">
                Logout
            </span>
            <LogOut
                size={14}
                className="text-slate-500 group-hover:text-red-400 transition-colors duration-300"
            />
        </button>
    );
}