import React from "react";
import { Link } from "react-router-dom";
import type { Video } from "../types";
import { useAuth } from "../context/AuthContext";
import { Eye, Clock } from "lucide-react";

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const { user } = useAuth();
  const avatarUrl = video.owner?.avatar;
  const ownerName =
    video.owner?.fullName ||
    (video.owner?.username ? `@${video.owner.username}` : null) ||
    user?.fullName ||
    (user?.username ? `@${user.username}` : null) ||
    "Creator";

  const formatDuration = (seconds: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Just now";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="group flex flex-col gap-3">
      {/* ── Thumbnail ── */}
      <Link
        to={`/watch/${video._id}`}
        className="relative aspect-video rounded-xl overflow-hidden bg-bg-surface border border-border-subtle group-hover:border-brand-start/40 transition-all duration-300 shadow-md group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-brand-start/10"
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Duration badge */}
        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[11px] font-semibold text-white flex items-center gap-1">
          <Clock className="w-3 h-3 text-brand-start" />
          {formatDuration(video.duration)}
        </span>
      </Link>

      {/* ── Metadata ── */}
      <div className="flex gap-3 px-1">
        <img
          src={avatarUrl}
          alt={ownerName}
          className="w-9 h-9 rounded-full object-cover ring-1 ring-border-subtle shrink-0 mt-0.5"
        />
        <div className="flex flex-col min-w-0 flex-1">
          <Link
            to={`/watch/${video._id}`}
            className="text-sm font-semibold text-text-primary group-hover:text-brand-start transition-colors duration-200 line-clamp-2 leading-snug"
          >
            {video.title}
          </Link>
          <span className="text-xs text-text-secondary mt-1 hover:text-text-primary transition-colors cursor-pointer">
            {ownerName}
          </span>
          <div className="flex items-center gap-2 text-[11px] text-text-secondary/70 mt-0.5">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {video.views || 0} views
            </span>
            <span>·</span>
            <span>{formatDate(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Skeleton Loader ── */
export const VideoCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="aspect-video rounded-xl skeleton" />
      <div className="flex gap-3 px-1">
        <div className="w-9 h-9 rounded-full skeleton shrink-0" />
        <div className="flex flex-col flex-1 gap-2 py-1">
          <div className="h-4 skeleton rounded w-11/12" />
          <div className="h-3 skeleton rounded w-2/3" />
          <div className="h-3 skeleton rounded w-1/3" />
        </div>
      </div>
    </div>
  );
};
