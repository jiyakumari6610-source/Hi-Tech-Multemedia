import { useState, useEffect } from "react";
import { Eye, EyeOff, User, Lock, CheckCircle, Building2 } from "lucide-react";

const SESSION_KEY = "htmm_admin_auth";

type BusinessSettings = {
  business_name: string;
  tagline: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  studio_hours: string;
  instagram: string;
  facebook: string;
};

const EMPTY_SETTINGS: BusinessSettings = {
  business_name: "",
  tagline: "",
  address: "",
  phone: "",
  whatsapp: "",
  email: "",
  studio_hours: "",
  instagram: "",
  facebook: "",
};

async function fetchSettings(): Promise<BusinessSettings> {
  const res = await fetch("/api/settings");
  if (!res.ok) throw new Error("Failed to load settings");
  return res.json();
}

async function saveSettings(body: Partial<BusinessSettings>): Promise<BusinessSettings> {
  const res = await fetch("/api/admin/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Update failed");
  return data;
}

function BusinessInfoForm() {
  const [form, setForm] = useState<BusinessSettings>(EMPTY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then((data) => setForm(data))
      .catch(() => setError("Failed to load business settings"))
      .finally(() => setLoading(false));
  }, []);

  function field(key: keyof BusinessSettings, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setError(""); setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess(false);
    try {
      const updated = await saveSettings(form);
      setForm(updated);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4AF37]/50 text-sm transition-colors";
  const labelClass = "block text-zinc-400 text-xs uppercase tracking-widest mb-1.5";

  if (loading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-zinc-500 text-sm">
        Loading business info…
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
          <Building2 className="w-4 h-4 text-[#D4AF37]" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Business Information</h3>
          <p className="text-zinc-500 text-xs">Shown across the public website</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Business Name</label>
          <input className={inputClass} value={form.business_name} onChange={(e) => field("business_name", e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Tagline</label>
          <input className={inputClass} value={form.tagline} onChange={(e) => field("tagline", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Address</label>
          <input className={inputClass} value={form.address} onChange={(e) => field("address", e.target.value)} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Phone</label>
            <input className={inputClass} value={form.phone} onChange={(e) => field("phone", e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>WhatsApp</label>
            <input className={inputClass} value={form.whatsapp} onChange={(e) => field("whatsapp", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" className={inputClass} value={form.email} onChange={(e) => field("email", e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Studio Hours</label>
          <input className={inputClass} value={form.studio_hours} onChange={(e) => field("studio_hours", e.target.value)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Instagram (URL)</label>
            <input className={inputClass} value={form.instagram} onChange={(e) => field("instagram", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Facebook (URL)</label>
            <input className={inputClass} value={form.facebook} onChange={(e) => field("facebook", e.target.value)} />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm bg-red-950/20 border border-red-900/30 rounded-md px-3 py-2">{error}</p>}
        {success && (
          <div className="flex items-center gap-2 text-green-400 text-sm bg-green-950/20 border border-green-900/30 rounded-md px-3 py-2">
            <CheckCircle className="w-4 h-4" /> Business info updated successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-[#D4AF37] text-zinc-950 font-semibold text-sm rounded-md hover:bg-[#C9A227] transition-colors disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Business Info"}
        </button>
      </form>
    </div>
  );
}

function getSessionUsername(): string {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return "admin";
    const parsed = JSON.parse(raw);
    return parsed.username ?? "admin";
  } catch {
    return "admin";
  }
}

async function updateCredentials(body: {
  currentPassword: string;
  newUsername?: string;
  newPassword?: string;
}) {
  const res = await fetch("/api/admin/credentials", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Update failed");
  return data;
}

function ChangeUsernameForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newUsername.trim()) { setError("New username cannot be empty"); return; }
    setLoading(true); setError(""); setSuccess(false);
    try {
      const data = await updateCredentials({ currentPassword, newUsername });
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...parsed, username: data.username }));
      }
      setSuccess(true);
      setCurrentPassword(""); setNewUsername("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
          <User className="w-4 h-4 text-[#D4AF37]" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Change Username</h3>
          <p className="text-zinc-500 text-xs">Current: <span className="text-zinc-300">{getSessionUsername()}</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-1.5">New Username</label>
          <input
            value={newUsername}
            onChange={(e) => { setNewUsername(e.target.value); setError(""); setSuccess(false); }}
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4AF37]/50 text-sm transition-colors"
            placeholder="Enter new username"
          />
        </div>
        <div>
          <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-1.5">Current Password</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => { setCurrentPassword(e.target.value); setError(""); setSuccess(false); }}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4AF37]/50 text-sm transition-colors pr-10"
              placeholder="Confirm current password"
              required
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm bg-red-950/20 border border-red-900/30 rounded-md px-3 py-2">{error}</p>}
        {success && (
          <div className="flex items-center gap-2 text-green-400 text-sm bg-green-950/20 border border-green-900/30 rounded-md px-3 py-2">
            <CheckCircle className="w-4 h-4" /> Username updated successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#D4AF37] text-zinc-950 font-semibold text-sm rounded-md hover:bg-[#C9A227] transition-colors disabled:opacity-60"
        >
          {loading ? "Updating…" : "Update Username"}
        </button>
      </form>
    </div>
  );
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [show, setShow] = useState({ current: false, new: false, confirm: false });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 4) { setError("Password must be at least 4 characters"); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true); setError(""); setSuccess(false);
    try {
      await updateCredentials({ currentPassword, newPassword });
      setSuccess(true);
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  const toggle = (field: "current" | "new" | "confirm") =>
    setShow((v) => ({ ...v, [field]: !v[field] }));

  function Field({ label, value, onChange, placeholder, field }: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder: string; field: "current" | "new" | "confirm";
  }) {
    return (
      <div>
        <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-1.5">{label}</label>
        <div className="relative">
          <input
            type={show[field] ? "text" : "password"}
            value={value}
            onChange={(e) => { onChange(e.target.value); setError(""); setSuccess(false); }}
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4AF37]/50 text-sm transition-colors pr-10"
            placeholder={placeholder}
            required
          />
          <button type="button" onClick={() => toggle(field)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
            {show[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
          <Lock className="w-4 h-4 text-[#D4AF37]" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Change Password</h3>
          <p className="text-zinc-500 text-xs">Minimum 4 characters required</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Current Password" value={currentPassword} onChange={setCurrentPassword} placeholder="Current password" field="current" />
        <Field label="New Password" value={newPassword} onChange={setNewPassword} placeholder="New password (min. 4 chars)" field="new" />
        <Field label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Re-enter new password" field="confirm" />

        {error && <p className="text-red-400 text-sm bg-red-950/20 border border-red-900/30 rounded-md px-3 py-2">{error}</p>}
        {success && (
          <div className="flex items-center gap-2 text-green-400 text-sm bg-green-950/20 border border-green-900/30 rounded-md px-3 py-2">
            <CheckCircle className="w-4 h-4" /> Password changed successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#D4AF37] text-zinc-950 font-semibold text-sm rounded-md hover:bg-[#C9A227] transition-colors disabled:opacity-60"
        >
          {loading ? "Updating…" : "Change Password"}
        </button>
      </form>
    </div>
  );
}

export default function SettingsTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Account Settings</h2>
        <p className="text-zinc-500 text-sm">Manage your admin credentials. Current password is required for all changes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChangeUsernameForm />
        <ChangePasswordForm />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Business Information</h2>
        <p className="text-zinc-500 text-sm">Update your business name, address, phone number, and other public contact details.</p>
      </div>
      <BusinessInfoForm />

      {/* Info box */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5 text-sm text-zinc-500">
        <p className="font-medium text-zinc-400 mb-2">Security Notes</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Default credentials: <span className="text-zinc-300 font-mono">admin / Admin@9939</span></li>
          <li>After changing credentials, you will need to sign in again on next session.</li>
          <li>Use a strong password — mix letters, numbers, and symbols.</li>
        </ul>
      </div>
    </div>
  );
}
