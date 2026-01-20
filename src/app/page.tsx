"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogIn, UserPlus, ShieldCheck, Mail, Zap, Lock, ArrowRight } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function AuthLandingPage() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Generate particles only on the client to avoid hydration errors
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 5 + 3,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  if (!mounted) return <div className="min-h-screen bg-slate-950" />;

  return (
    <div
      className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Keyframes for animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px); opacity: 0.2; }
          50% { transform: translateY(-30px); opacity: 0.6; }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
      `}</style>

      {/* Animated Indigo Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob"
          style={{ top: '10%', left: '15%' }}
        />
        <div
          className="absolute w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob"
          style={{ bottom: '10%', right: '15%', animationDelay: '2s' }}
        />
      </div>

      {/* Floating particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-indigo-400 rounded-full opacity-20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `floatParticle ${particle.duration}s ease-in-out infinite ${particle.delay}s`
          }}
        />
      ))}

      <main className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-16 items-center">

        {/* Left side - Content */}
        <div className="text-white space-y-8">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20 rounded-full px-4 py-1.5">
            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-200">System v2.0 Protocol</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">
            SECURE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
              IDENTITY.
            </span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed max-w-md font-medium">
            Next-generation authentication for high-stakes environments. Fast, private, and encrypted by default.
          </p>

          <div className="flex gap-10 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                <Lock className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500">AES-256</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                <Zap className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500">0.4ms Sync</div>
            </div>
          </div>
        </div>

        {/* Right side - The Compact Indigo Card */}
        <div className="w-full max-w-[380px] lg:ml-auto">
          <div
            className="bg-slate-900/40 backdrop-blur-2xl rounded-[32px] p-10 border border-white/10 shadow-2xl relative overflow-hidden group"
            style={{
              background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(99, 102, 241, 0.15), transparent)`
            }}
          >
            <div className="relative z-10 space-y-8 text-center">
              <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40">
                <ShieldCheck className="w-9 h-9 text-white stroke-[1.5]" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Access Portal</h2>
                <p className="text-slate-400 text-sm mt-1">Select your destination</p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/auth/signin"
                  className="flex items-center justify-between w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-900/20 active:scale-[0.98] group"
                >
                  <span className="flex items-center gap-3">
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/auth/signup"
                  className="flex items-center justify-between w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-4 px-6 rounded-2xl transition-all active:scale-[0.98]"
                >
                  <span className="flex items-center gap-3 text-slate-300">
                    <UserPlus className="w-5 h-5 text-slate-400" />
                    Register
                  </span>
                  <ArrowRight className="w-5 h-5 text-slate-500" />
                </Link>
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-center gap-6">
                <Mail className="w-4 h-4 text-slate-600" />
                <ShieldCheck className="w-4 h-4 text-slate-600" />
                <Zap className="w-4 h-4 text-slate-600" />
              </div>
            </div>
          </div>
        </div>

      </main>

      <footer className="absolute bottom-8 left-8 text-slate-600 text-[10px] font-bold uppercase tracking-[0.5em]">
        © 2026 Roya F. Kais
      </footer>
    </div>
  );
}