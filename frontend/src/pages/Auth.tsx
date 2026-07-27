import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { LogIn, UserPlus, Upload, AlertCircle, Loader2 } from "lucide-react";

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await api.post("/users/login", { email, password });
        const { user, accessToken } = res.data.data;
        login(user, accessToken);
        navigate(from, { replace: true });
      } else {
        if (!avatarFile) {
          setError("Please select an avatar image file to continue.");
          setIsLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("username", username);
        formData.append("fullName", fullName);
        formData.append("avatar", avatarFile);

        await api.post("/users/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const loginRes = await api.post("/users/login", { email, password });
        const { user, accessToken } = loginRes.data.data;
        login(user, accessToken);
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Authentication failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-brand-start/60 focus:ring-1 focus:ring-brand-start/40 transition-all duration-200";

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-bg-surface border border-border-subtle rounded-md p-8 shadow-2xl shadow-black/30 relative overflow-hidden animate-fade-in">
        {/* Brand glow decorations */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-brand-start/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-brand-end/10 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="Playtube" className="w-14 h-14 rounded-2xl shadow-xl mb-3" />
          <h1 className="text-xl font-bold text-text-primary">
            {isLogin ? "Welcome back" : "Join Playtube"}
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            {isLogin ? "Sign in to your account" : "Create your creator account"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-bg-primary p-1 border border-border-subtle mb-6">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              isLogin
                ? "bg-brand-gradient text-white shadow-md shadow-brand-start/20"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              !isLogin
                ? "bg-brand-gradient text-white shadow-md shadow-brand-start/20"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Register
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-5 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-xs leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Register-only fields */}
          {!isLogin && (
            <>
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-2 py-2">
                <label className="relative group cursor-pointer">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-bg-primary border-2 border-dashed border-brand-start/40 flex items-center justify-center group-hover:border-brand-start transition-colors duration-200">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-6 h-6 text-brand-start" />
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-bg-elevated rounded text-[10px] text-brand-start font-medium whitespace-nowrap">
                    Choose Avatar
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Full Name</label>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Priyanshu Tariyal" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Username</label>
                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="priyanshu02" className={inputClass} />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl bg-brand-gradient text-white font-bold text-sm shadow-lg shadow-brand-start/25 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isLogin ? "Sign In to Playtube" : "Create Account"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
