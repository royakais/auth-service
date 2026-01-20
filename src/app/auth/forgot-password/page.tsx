"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, SendHorizontal, ShieldCheck, Lock } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong.");
            } else {
                setIsSubmitted(true);
                setMessage(data.message || "Reset link sent to your email.");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) return <div className="min-h-screen bg-[#030712]" />;

    return (
        <div
            className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden"
            onMouseMove={handleMouseMove}
        >
            {/* Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute w-[500px] h-[500px] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob"
                    style={{ top: '20%', right: '20%' }}
                />
                <div
                    className="absolute w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob"
                    style={{ bottom: '20%', left: '20%', animationDelay: '4s' }}
                />
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -20px) scale(1.1); }
                    66% { transform: translate(-20px, 30px) scale(0.9); }
                }
                .animate-blob { animation: blob 15s infinite linear; }
            `}</style>

            <main className="relative z-10 w-full max-w-[400px]">
                <div
                    className="bg-slate-900/40 backdrop-blur-2xl rounded-[32px] p-8 lg:p-10 border border-white/10 shadow-2xl transition-all duration-500"
                    style={{
                        background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(99, 102, 241, 0.12), transparent)`
                    }}
                >
                    <div className="text-center mb-8">
                        <div className="mx-auto w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-5 shadow-2xl shadow-indigo-500/20">
                            <Lock className="text-white w-7 h-7 stroke-[1.5]" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Recover Access</h1>
                        <p className="text-slate-400 text-xs mt-1.5 font-medium uppercase tracking-widest">
                            {isSubmitted ? "Verification Sent" : "Reset Credentials"}
                        </p>
                    </div>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    type="email"
                                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all text-white placeholder:text-slate-600 text-sm"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] font-medium animate-in fade-in slide-in-from-top-1">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-indigo-900/20 flex items-center justify-center group"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Send Reset Link
                                        <SendHorizontal className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-sm font-medium leading-relaxed">
                                {message}
                            </div>
                            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">
                                Checked your spam folder?
                            </p>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <Link
                            href="/auth/signin"
                            className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-400 transition-colors group"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 mr-2 transition-transform group-hover:-translate-x-1" />
                            Return to Portal
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="absolute bottom-8 text-slate-700 text-[10px] font-bold uppercase tracking-[0.5em]">
                © 2026 PRECISION AUTH
            </footer>
        </div>
    );
}