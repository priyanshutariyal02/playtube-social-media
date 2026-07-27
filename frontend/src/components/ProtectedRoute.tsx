import React from "react";
import { Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2, Lock, LogIn } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackType?: "redirect" | "card";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackType = "redirect",
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] w-full">
        <Loader2 className="w-8 h-8 text-brand-start animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallbackType === "card") {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center max-w-md mx-auto animate-fade-in">
          <div className="w-16 h-16 rounded-3xl bg-brand-gradient-soft border border-brand-start/25 flex items-center justify-center text-brand-start mb-4 shadow-xl">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">
            Authentication Required
          </h2>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed">
            Please sign in to your account to view this page and unlock full
            access to Creator Studio and Subscriptions.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2.5 rounded-xl bg-bg-surface hover:bg-bg-elevated border border-border-subtle text-text-secondary hover:text-text-primary text-xs font-semibold transition-all duration-200"
            >
              Go Back
            </button>
            <Link
              to="/auth"
              state={{ from: location }}
              className="px-6 py-2.5 rounded-xl bg-brand-gradient text-white font-bold text-xs shadow-lg shadow-brand-start/25 hover:brightness-110 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign in to Continue</span>
            </Link>
          </div>
        </div>
      );
    }
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
