import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Search,
  LogOut,
  Video,
  X,
  Loader2,
  Sun,
  Moon,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  /* Auto-focus mobile search input when overlay opens */
  useEffect(() => {
    if (isMobileSearchOpen && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  /* Close search dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Live search results */
  const { data: searchResults, isLoading: isSearchLoading } = useQuery<any[]>({
    queryKey: ["navbarSearch", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const res = await api.get(
        `/videos?query=${encodeURIComponent(searchQuery.trim())}&limit=5`
      );
      return (
        res.data?.data?.videos ||
        res.data?.data?.docs ||
        (Array.isArray(res.data?.data) ? res.data.data : [])
      );
    },
    enabled: searchQuery.trim().length > 0 && isSearchOpen,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      setIsMobileSearchOpen(false);
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const renderSearchDropdown = () => (
    <div className="absolute top-full left-0 right-0 mt-2 bg-bg-surface border border-border-subtle rounded-md shadow-2xl shadow-black/40 p-3 z-50 flex flex-col gap-2 max-h-[70vh] overflow-y-auto animate-slide-up">
      <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-text-secondary uppercase tracking-wider border-b border-border-subtle/60">
        <span>Matching Streams</span>
        {isSearchLoading && (
          <Loader2 className="w-3 h-3 animate-spin text-brand-start" />
        )}
      </div>

      {searchResults && searchResults.length > 0 ? (
        <>
          {searchResults.map((video: any) => (
            <div
              key={video._id}
              onClick={() => {
                setIsSearchOpen(false);
                setIsMobileSearchOpen(false);
                navigate(`/watch/${video._id}`);
              }}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-bg-elevated cursor-pointer transition-colors duration-200 group"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-14 h-8 rounded-md object-cover bg-bg-elevated shrink-0"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold text-text-primary group-hover:text-brand-start truncate transition-colors duration-200">
                  {video.title}
                </span>
                <span className="text-[10px] text-text-secondary">
                  {video.owner?.fullName || `@${video.owner?.username}`}{" "}
                  · {video.views || 0} views
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-text-secondary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          ))}
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setIsMobileSearchOpen(false);
              navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
            }}
            className="mt-1 w-full py-2 rounded-md bg-brand-gradient-soft hover:bg-brand-start/15 text-brand-start text-xs font-semibold text-center transition-colors duration-200"
          >
            View all results for &quot;{searchQuery}&quot;
          </button>
        </>
      ) : !isSearchLoading ? (
        <div className="py-6 text-center text-xs text-text-secondary">
          No videos found matching &quot;{searchQuery}&quot;.
        </div>
      ) : null}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle px-4 lg:px-8 py-3 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4 w-full">
        {isMobileSearchOpen ? (
          /* ── Mobile Search Mode: Inline Header Replacement ── */
          <div className="flex items-center gap-2.5 w-full animate-fade-in">
            <button
              onClick={() => {
                setIsMobileSearchOpen(false);
                setIsSearchOpen(false);
              }}
              className="p-1.5 text-text-secondary hover:text-text-primary rounded-md outline-none shrink-0"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div ref={searchRef} className="flex-1 relative">
              <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
                <input
                  ref={mobileInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search videos, creators, streams..."
                  className="w-full bg-bg-surface border border-border-subtle rounded-full pl-4 pr-9 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-brand-start/50 transition-colors duration-200"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearchOpen(false);
                    }}
                    className="absolute right-3 text-text-secondary hover:text-text-primary"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              {isSearchOpen && searchQuery.trim() && renderSearchDropdown()}
            </div>
          </div>
        ) : (
          /* ── Standard Navbar Header ── */
          <>
            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0 outline-none">
              <img
                src="/logo.png"
                alt="Playtube logo"
                className="w-9 h-9 rounded-md group-hover:scale-105 transition-transform duration-200"
              />
              <span className="text-xl font-bold tracking-tight">
                <span className="text-text-primary">Play</span>
                <span className="text-brand-gradient">tube</span>
              </span>
            </Link>

            {/* ── Desktop Search Bar ── */}
            <div ref={searchRef} className="hidden md:flex flex-1 max-w-md relative">
              <form onSubmit={handleSearchSubmit} className="w-full relative">
                <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search videos, creators, streams..."
                  className="w-full bg-bg-surface border border-border-subtle rounded-full pl-10 pr-9 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-brand-start/50 focus:ring-1 focus:ring-brand-start/50 transition-colors duration-200"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearchOpen(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors duration-200"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              {isSearchOpen && searchQuery.trim() && renderSearchDropdown()}
            </div>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-2.5">
              {/* Mobile Search Icon Button */}
              <button
                onClick={() => setIsMobileSearchOpen(true)}
                title="Search"
                aria-label="Search"
                className="md:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors duration-200 outline-none"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Dark / Light Toggle */}
              <button
                onClick={toggle}
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                aria-label="Toggle theme"
                className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors duration-200 outline-none"
              >
                {theme === "dark" ? (
                  <Sun className="w-4.5 h-4.5" />
                ) : (
                  <Moon className="w-4.5 h-4.5" />
                )}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-2.5">
                  {/* Creator Studio */}
                  <Link
                    to="/dashboard"
                    className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-bg-surface hover:bg-bg-elevated border border-border-subtle text-xs font-semibold text-brand-start transition-colors duration-200 outline-none"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Studio</span>
                  </Link>

                  {/* Avatar + Username + Logout */}
                  <div className="flex items-center gap-2 pl-2 border-l border-border-subtle">
                    <img
                      src={
                        user?.avatar ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"
                      }
                      alt={user?.username}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-start/40"
                    />
                    <span className="text-xs font-medium text-text-secondary hidden lg:inline">
                      @{user?.username}
                    </span>
                    <button
                      onClick={handleLogout}
                      title="Logout"
                      aria-label="Logout"
                      className="p-2 rounded-md text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200 outline-none"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-brand-gradient text-white font-semibold text-sm shadow-md shadow-brand-start/25 hover:brightness-110 active:scale-95 transition-all duration-200 outline-none"
                >
                  {/* <LogIn className="w-4 h-4" /> */}
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};
