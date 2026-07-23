import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Target, 
  Sparkles, 
  TrendingUp, 
  Settings, 
  X, 
  Menu,
  ChevronLeft,
  ChevronRight,
  Clock,
  Award,
  Users,
  BookOpen,
  CreditCard
} from "lucide-react";
import { UserProfile } from "../types";
import Logo from "./Logo";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserProfile;
  theme: "light" | "dark";
  onOpenProfileDropdown?: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  profile, 
  theme,
  onOpenProfileDropdown
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Clean, focused primary navigation items (11 required items)
  const navGroups = [
    {
      title: "Core Practice",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "practice", label: "Practice", icon: Target },
        { id: "coach", label: "AI Coach", icon: Sparkles },
        { id: "sessions", label: "Sessions", icon: Clock },
      ]
    },
    {
      title: "Growth & Progress",
      items: [
        { id: "progress", label: "Progress", icon: TrendingUp },
        { id: "achievements", label: "Achievements", icon: Award },
        { id: "community", label: "Community", icon: Users },
      ]
    },
    {
      title: "Account & Learning",
      items: [
        { id: "resources", label: "Resources", icon: BookOpen },
        { id: "settings", label: "Settings", icon: Settings },
      ]
    }
  ];

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Sticky Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-[60]">
        <button 
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className={`p-3 rounded-none border shadow-md flex items-center justify-center cursor-pointer transition-colors ${
            theme === "dark" 
              ? "bg-neutral-900 border-neutral-800 text-neutral-100 hover:bg-neutral-800" 
              : "bg-white border-editorial-border text-editorial-dark hover:bg-editorial-light-gray"
          }`}
          aria-label="Toggle Navigation"
        >
          {isOpenMobile ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Backdrop overlay for Mobile drawer */}
      {isOpenMobile && (
        <div 
          onClick={() => setIsOpenMobile(false)}
          className="md:hidden fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-50 transition-opacity animate-fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 h-screen z-50 flex flex-col justify-between transition-all duration-300 ease-in-out font-sans border-r
          ${theme === "dark" ? "bg-neutral-950 border-neutral-800 text-neutral-200" : "bg-white border-editorial-border text-editorial-text"}
          ${isOpenMobile ? "translate-x-0 w-[270px]" : "max-md:-translate-x-full"}
          ${isCollapsed ? "md:w-[76px]" : "md:w-[270px]"}
        `}
      >
        {/* Header Block */}
        <div className="flex flex-col shrink-0">
          <div className={`h-16 flex items-center justify-between px-5 border-b ${
            theme === "dark" ? "border-neutral-900" : "border-editorial-border"
          }`}>
            <div className="flex items-center select-none overflow-hidden">
              <Logo size={22} variant={isCollapsed && !isOpenMobile ? "icon-only" : "horizontal"} />
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`hidden md:flex h-6 w-6 rounded-none border items-center justify-center cursor-pointer transition-all ${
                theme === "dark"
                  ? "border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800"
                  : "border-editorial-border bg-white text-editorial-muted hover:text-editorial-dark hover:bg-editorial-light-gray"
              }`}
              aria-label="Collapse Sidebar"
            >
              {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>
          </div>

          {/* Active Goal Pill */}
          {(!isCollapsed || isOpenMobile) && profile && profile.isOnboarded && (
            <div className={`mx-4 mt-4 p-3 border rounded-none ${
              theme === "dark" 
                ? "bg-neutral-900/60 border-neutral-800" 
                : "bg-editorial-light-gray/70 border-editorial-border"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono tracking-widest text-indigo-600 font-bold uppercase block">COACH FOCUS</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className={`text-xs font-bold block truncate mt-0.5 ${
                theme === "dark" ? "text-neutral-100" : "text-editorial-dark"
              }`}>{profile.communicationGoal || "Daily Conversation"}</span>
            </div>
          )}
        </div>

        {/* Scrollable Navigation Groups */}
        <div className="flex-grow overflow-y-auto px-3 py-4 space-y-5">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {(!isCollapsed || isOpenMobile) && (
                <span className="px-3 text-[9px] font-mono font-bold uppercase tracking-widest text-editorial-muted/70 block mb-1.5">
                  {group.title}
                </span>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3.5 py-2 text-xs font-medium transition-all group cursor-pointer relative rounded-none
                      ${isActive 
                        ? (theme === "dark" 
                            ? "text-white font-bold bg-neutral-900 border-l-2 border-indigo-500" 
                            : "text-editorial-dark font-bold bg-editorial-light-gray border-l-2 border-indigo-600")
                        : (theme === "dark"
                            ? "text-neutral-400 hover:text-white hover:bg-neutral-900/40"
                            : "text-editorial-muted hover:text-editorial-dark hover:bg-editorial-light-gray/40")
                      }
                    `}
                  >
                    <Icon size={14} className={`shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? "text-indigo-600" : "text-editorial-muted"
                    }`} />
                    
                    {(!isCollapsed || isOpenMobile) && <span className="truncate">{item.label}</span>}
                    
                    {/* Collapsed Tooltip */}
                    {isCollapsed && !isOpenMobile && (
                      <div className={`absolute left-16 py-1.5 px-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all shadow-md border whitespace-nowrap z-50 text-xs font-mono font-bold ${
                        theme === "dark" 
                          ? "bg-neutral-900 text-white border-neutral-800" 
                          : "bg-white text-editorial-dark border-editorial-border"
                      }`}>
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom User Avatar Trigger */}
        <div className={`p-3 border-t shrink-0 ${
          theme === "dark" ? "border-neutral-900 bg-neutral-950" : "border-editorial-border bg-white"
        }`}>
          <button
            onClick={onOpenProfileDropdown}
            className={`w-full flex items-center gap-3 p-2 border transition-all cursor-pointer text-left rounded-none ${
              theme === "dark" 
                ? "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900" 
                : "bg-editorial-light-gray/40 border-editorial-border hover:border-neutral-400 hover:bg-editorial-light-gray"
            }`}
          >
            {profile.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt={profile.name || "User Avatar"} 
                className="h-8 w-8 rounded-full object-cover shrink-0 border border-indigo-200 shadow-xs"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold tracking-wider text-xs shadow-xs shrink-0">
                {profile.name ? profile.name.slice(0, 2).toUpperCase() : "SG"}
              </div>
            )}
            {(!isCollapsed || isOpenMobile) && (
              <div className="flex flex-col min-w-0 flex-grow">
                <span className={`text-xs font-bold truncate ${
                  theme === "dark" ? "text-neutral-100" : "text-editorial-dark"
                }`}>{profile.name || "Global Member"}</span>
                <span className="text-[10px] text-editorial-muted font-light truncate">{profile.profession || "Global Communicator"}</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

