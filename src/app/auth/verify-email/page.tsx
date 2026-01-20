"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Loader2, CheckCircle2, XCircle, ArrowRight, ShieldAlert } from "lucide-react";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100
        });
    };

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("No verification token provided");
            return;
        }

        fetch(`/api/auth/verify-email?token=${token}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.verified || data.alreadyVerified) {
                    setStatus("success");
                    setMessage(data.message || "Identity verified successfully.");
                    setTimeout(() => router.push("/dashboard"), 3000);
                } else {
                    setStatus("error");
                    setMessage(data.error || "Verification link invalid or expired.");
                }
            })
            .catch(() => {
                setStatus("error");
                setMessage("An error occurred during verification protocols.");
            });
    }, [token, router]);

    return (
        <div
            className="bg-slate-900/40 backdrop-blur-2xl rounded-[32px] p-8 lg:p-10 border border-white/10 shadow-2xl transition-all duration-500"
            onMouseMove={handleMouseMove}
            style={{
                background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(99, 102, 241, 0.15), transparent)`
            }}
        >
            <div className="text-center">
                {/* Dynamic Icon Header */}
                <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/20">
                    {status === "loading" && <Loader2 className="text-white w-8 h-8 animate-spin" />}
                    {status === "success" && <CheckCircle2 className="text-white w-8 h-8 animate-in zoom-in duration-500" />}
                    {status === "error" && <ShieldAlert className="text-white w-8 h-8 animate-in shake duration-500" />}
                </div>

                <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
                    {status === "loading" && "Authenticating..."}
                    {status === "success" && "Verified"}
                    {status === "error" && "Access Denied"}
                </h1>

                <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em] mb-8">
                    Security Handshake
                </p>

                {/* State Content */}
                <div className="space-y-6">
                    <div className={`p-4 rounded-2xl border transition-colors duration-500 ${status === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                            status === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                                "bg-white/5 border-white/10 text-slate-300"
                        }`}>
                        <p className="text-sm font-medium leading-relaxed">{message}</p>
                    </div>

                    {status === "success" && (
                        <div className="flex items-center justify-center gap-3 text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                            Redirecting to Dashboard
                        </div>
                    )}

                    {status === "error" && (
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => router.push("/auth/signin")}
                                className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-900/20"
                            >
                                Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-[500px] h-[500px] bg-indigo-600/15 rounded-full filter blur-[120px] top-[10%] left-[10%] animate-pulse" />
                <div className="absolute w-[500px] h-[500px] bg-blue-600/15 rounded-full filter blur-[120px] bottom-[10%] right-[10%] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 w-full max-w-[420px]">
                <Suspense fallback={
                    <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[32px] p-12 border border-white/10 text-center">
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Initializing Protocol</p>
                    </div>
                }>
                    <VerifyEmailContent />
                </Suspense>

                <p className="text-center text-[10px] font-bold text-slate-600 uppercase tracking-[0.4em] mt-8">
                    © 2026 PRECISION AUTH SYSTEM
                </p>
            </div>
        </div>
    );
}