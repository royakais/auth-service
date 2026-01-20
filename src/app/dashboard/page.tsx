import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { VerificationAlert } from "@/components/VerificationAlert";
import { ShieldCheck, Mail, User, ShieldAlert, Zap, Lock, Clock } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/signin");

  const isVerified = !!session.user?.emailVerified;
  const userAlias = session.user?.email?.split('@')[0];

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col relative overflow-hidden">

      {/* Animated Background (CSS only for Server Components) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-indigo-600/10 rounded-full filter blur-[120px] top-[-10%] left-[-10%]" />
        <div className="absolute w-[600px] h-[600px] bg-blue-600/10 rounded-full filter blur-[120px] bottom-[-10%] right-[-10%]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 w-full bg-slate-900/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              AuthService
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-2xl">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">
                {session.user?.email}
              </span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-6 py-12 lg:py-20">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
              User Environment
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              WELCOME, <span className="text-indigo-500">{userAlias?.toUpperCase()}</span>
            </h1>
            <p className="text-slate-400 font-medium">Manage your security protocols and profile data.</p>
          </div>

          <div className="flex gap-4">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
              <Clock size={16} className="text-indigo-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Active Session</span>
            </div>
          </div>
        </div>

        {/* Verification Alert Wrapper */}
        {!isVerified && (
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <VerificationAlert email={session.user?.email || ""} />
          </div>
        )}

        {/* Info Grid */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Profile Card (Large) */}
          <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-2xl rounded-[32px] border border-white/10 overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <h2 className="font-bold text-sm uppercase tracking-[0.2em] flex items-center gap-3 text-slate-200">
                <User size={18} className="text-indigo-500" />
                Core Profile Details
              </h2>
              {isVerified ? (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/20 flex items-center gap-2">
                  <ShieldCheck size={12} /> Verified
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-amber-500/20 flex items-center gap-2">
                  <ShieldAlert size={12} /> Unverified
                </span>
              )}
            </div>

            <div className="p-8 space-y-10">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Identity Identifier</label>
                  <div className="bg-white/5 border border-white/10 px-5 py-4 rounded-2xl text-indigo-100 font-mono text-sm break-all">
                    {session.user?.email}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-indigo-400" />
                </div>
                <div>
                  <p className="font-bold text-slate-200">System Notifications</p>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    Primary communication channel for security handshakes and recovery tokens.
                    Ensure <span className="text-indigo-400">2FA</span> is enabled on this address.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Side Stats/Quick Actions */}
          <div className="space-y-6">
            <div className="bg-indigo-600 rounded-[32px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
              <Zap className="absolute right-[-10px] top-[-10px] w-32 h-32 text-white/10 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
              <h3 className="text-xl font-black tracking-tight mb-2 uppercase">Pro Access</h3>
              <p className="text-indigo-100 text-sm leading-relaxed mb-6">Your account is currently operating on the standard security tier.</p>
              <button className="w-full bg-white text-indigo-600 font-bold py-3 rounded-2xl text-sm transition-transform active:scale-95">
                Upgrade Security
              </button>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[32px] p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Lock size={18} className="text-slate-400" />
                <h4 className="font-bold text-xs uppercase tracking-widest text-slate-300">Security Log</h4>
              </div>
              <p className="text-[11px] text-slate-500 font-medium italic">
                No recent unusual activity detected. Your connection is encrypted.
              </p>
            </div>
          </div>

        </div>

        <footer className="mt-20 text-center">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">
            © 2026 PRECISION AUTH PROTOCOL &bull; LEVEL 4 ENCRYPTION
          </p>
        </footer>
      </main>
    </div>
  );
}