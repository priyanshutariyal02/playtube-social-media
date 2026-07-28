import React from "react";
import { NavLink } from "react-router-dom";
import { Home, MessageSquare, Users, LayoutDashboard } from "lucide-react";
import { AuthRequiredPopup, type AuthPopupAction } from "./AuthRequiredPopup";

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  requiresAuth?: boolean;
  action?: AuthPopupAction;
  popupTitle?: string;
  popupMessage?: string;
}

export const BottomNav: React.FC = () => {
  const navItems: NavItem[] = [
    { name: "Feed", path: "/", icon: Home },
    { name: "Community", path: "/tweets", icon: MessageSquare },
    {
      name: "Subscriptions",
      path: "/subscriptions",
      icon: Users,
      requiresAuth: false,
      action: "subscribe",
      popupTitle: "Your Subscriptions",
      popupMessage:
        "Sign in to see all your subscribed channels, track new uploads, and never miss a stream.",
    },
    {
      name: "Studio",
      path: "/dashboard",
      icon: LayoutDashboard,
      requiresAuth: true,
      action: "default",
      popupTitle: "Creator Studio",
      popupMessage:
        "Sign in to access your Creator Studio, upload videos, and track your broadcast analytics.",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-bg-primary/95 backdrop-blur-md border-t border-border-subtle md:hidden px-2 py-1.5 flex items-center justify-around transition-colors duration-200">
      {navItems.map((item) => {
        const Icon = item.icon;

        const linkElement = (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-3 rounded-md text-[11px] font-medium transition-colors duration-200 outline-none ${
                isActive
                  ? "text-brand-start font-semibold"
                  : "text-text-secondary hover:text-text-primary"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-brand-start" : ""
                  }`}
                />
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        );

        if (item.requiresAuth) {
          return (
            <AuthRequiredPopup
              key={item.path}
              action={item.action || "default"}
              title={item.popupTitle}
              message={item.popupMessage}
              position="top-right"
              className="inline-flex"
            >
              {linkElement}
            </AuthRequiredPopup>
          );
        }

        return linkElement;
      })}
    </nav>
  );
};
