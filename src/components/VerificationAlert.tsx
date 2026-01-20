"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle2, AlertCircle, SendHorizontal } from "lucide-react";

export function VerificationAlert({ email }: { email: string }) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleResend = async () => {
        setLoading(true);
        setStatus("idle");
        setMessage("");

        try {
            const res = await fetch("/api/auth/send-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage("Security link dispatched to your inbox.");
            } else {
                setStatus("error");
                setMessage(data.error || "Failed to dispatch email.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Protocol error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[24px] p-6 lg:p-8 shadow-2xl flex flex-col md:flex-row items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-700">

            {/* Icon Decoration */}
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                <Mail className={`${status === "success" ? "text-emerald-400" : "text-amber-400"} w-8 h-8 transition-colors duration-500`} />
            </div>

            {/* Content Area */}
            <div className="flex-1 text-center md:text-left">
                <h3 className="text-white font-bold text-lg tracking-tight">
                    Action Required: Verify Identity
                </h3>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                    A verification handshake was sent to <span className="font-mono text-indigo-400">{email}</span>.
                    Complete the process to unlock all platform capabilities.
                </p>

                {status !== "idle" && (
                    <div className={`mt-4 flex items-center justify-center md:justify-start gap-2 text-[13px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-left-2 ${status === "success" ? "text-emerald-400" : "text-red-400"
                        }`}>
                        {status === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                        {message}
                    </div>
                )}
            </div>

            {/* Action Button */}
            <button
                onClick={handleResend}
                disabled={loading || status === "success"}
                className={`shrink-0 w-full md:w-auto px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border
          ${status === "success"
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 cursor-default"
                        : "border-indigo-500 bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/20 active:scale-[0.98] disabled:opacity-50"
                    }`}
            >
                {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : status === "success" ? (
                    "Verified Request"
                ) : (
                    <>
                        Resend Link
                        <SendHorizontal size={14} />
                    </>
                )}
            </button>
        </div>
    );
}