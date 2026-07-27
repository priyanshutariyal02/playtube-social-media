import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import type { Video } from "../types";
import { VideoCard, VideoCardSkeleton } from "../components/VideoCard";
import { Search, X } from "lucide-react";

export const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryParam = searchParams.get("q") || "";
  const userIdParam = searchParams.get("userId") || "";

  const {
    data: videos,
    isLoading,
    isError,
  } = useQuery<Video[]>({
    queryKey: ["videos", queryParam, userIdParam],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (queryParam) params.append("query", queryParam);
      if (userIdParam) params.append("userId", userIdParam);
      const queryString = params.toString();
      const endpoint = queryString ? `/videos?${queryString}` : "/videos";
      const res = await api.get(endpoint);
      return (
        res.data?.data?.videos ||
        res.data?.data?.docs ||
        (Array.isArray(res.data?.data) ? res.data.data : [])
      );
    },
  });

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* ── Search / Channel Banner ── */}
      {(queryParam || userIdParam) && (
        <div className="flex items-center justify-between gap-4 p-6 rounded-2xl bg-bg-surface border border-brand-start/25 shadow-xl shadow-brand-start/5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-brand-start text-xs font-semibold uppercase tracking-wider">
              <Search className="w-4 h-4" />{" "}
              {userIdParam ? "Channel Videos" : "Search Filter Active"}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              {userIdParam && queryParam
                ? `Videos by @${queryParam}`
                : queryParam
                  ? `Results for "${queryParam}"`
                  : "Creator Channel Broadcasts"}
            </h1>
            <p className="text-sm text-text-secondary">
              Showing matching video broadcasts and streams.
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-bg-elevated hover:bg-bg-elevated/80 border border-border-subtle text-xs font-semibold text-text-secondary hover:text-text-primary transition-all duration-200"
          >
            <X className="w-4 h-4 text-red-400" />
            <span>Clear Filter</span>
          </button>
        </div>
      )}

      {/* ── Videos Grid ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-bg-surface/50 border border-border-subtle">
          <p className="text-text-secondary text-sm">
            Failed to load video stream feed.
          </p>
          <p className="text-xs text-text-secondary/60 mt-1">
            Ensure the backend server is running on port 8000.
          </p>
        </div>
      ) : videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 text-center rounded-2xl bg-bg-surface/40 border border-border-subtle">
          <h3 className="text-lg font-semibold text-text-primary">
            No Videos Found
          </h3>
          <p className="text-sm text-text-secondary mt-1 max-w-sm">
            {queryParam
              ? `We couldn't find any streams matching "${queryParam}". Try another keyword!`
              : "Be the first creator to upload a video broadcast from the Creator Studio!"}
          </p>
        </div>
      )}
    </div>
  );
};
