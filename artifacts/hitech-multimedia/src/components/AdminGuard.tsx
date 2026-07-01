import { useState } from "react";
import { Camera, Eye, EyeOff, Lock } from "lucide-react";

const SESSION_KEY = "htmm_admin_auth";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => !!sessionStorage.getItem(SESSION_KEY));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ username: data.username, ts: Date.now() }));
        setUnlocked(true);
      } else {
        const data = await res.json();
        setError(data.error ?? "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Decorative top line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent mb-12" />

        {/* Logo */}
        <div className="text-center mb-10 space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-[#D4AF37]/8 border border-[#D4AF37]/25 flex items-center justify-center">
                <Camera className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-zinc-950 border border-[#D4AF37]/30 flex items-center justify-center">
                <Lock className="w-3 h-3 text-[#D4AF37]" />
              </div>
            </div>
          </div>
          <div>
            <p className="text-[#D4AF37]/60 text-xs tracking-[0.35em] uppercase mb-2">Studio Management</p>
            <h1 className="font-serif text-4xl text-white">
              Hi-tech <span className="text-[#D4AF37]">Admin</span>
            </h1>
          </div>
          <div className="w-16 h-px bg-[#D4AF37]/30 mx-auto" />
          <p className="text-zinc-500 text-sm">Sign in to access the admin panel</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-zinc-400 text-xs tracking-widest uppercase mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              className="w-full px-4 py-3.5 bg-zinc-900 border border-zinc-700 rounded-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4AF37]/60 focus:bg-zinc-900 transition-colors text-sm"
              placeholder="Enter your username"
              required
              autoFocus
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs tracking-widest uppercase mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full px-4 py-3.5 bg-zinc-900 border border-zinc-700 rounded-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4AF37]/60 transition-colors text-sm pr-12"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 text-red-400 text-sm bg-red-950/20 border border-red-900/30 rounded-sm px-4 py-3">
              <span className="text-red-500 mt-0.5">⚠</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#D4AF37] text-zinc-950 font-bold text-sm tracking-wide rounded-sm hover:bg-[#C9A227] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in…
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center space-y-2">
          <p className="text-zinc-600 text-xs">Default: admin / Admin@9939</p>
          <p className="text-zinc-700 text-xs">Change credentials in Settings after login.</p>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent mt-10" />
      </div>
    </div>
  );
}
