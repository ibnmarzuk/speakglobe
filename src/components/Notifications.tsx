import React, { useState } from "react";
import { 
  Bell, 
  Check, 
  Trash2, 
  Sparkles, 
  Award, 
  TrendingUp, 
  Circle,
  Clock,
  Volume2,
  CheckCircle2,
  Sliders
} from "lucide-react";

interface CoachNotification {
  id: string;
  title: string;
  message: string;
  type: "progress" | "badge" | "rehearsal" | "system";
  isRead: boolean;
  time: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<CoachNotification[]>([
    {
      id: "not-1",
      title: "Clarity Score Rebound!",
      message: "Your vocabulary score improved by 14% on the compensation rehearsal dialogue today. Great job incorporating active action verbs!",
      type: "progress",
      isRead: false,
      time: "20 mins ago"
    },
    {
      id: "not-2",
      title: "New Badge Unlocked",
      message: "Congratulations! You claimed the 'Silence Master' badge after a rehearsal with zero vocal fillers.",
      type: "badge",
      isRead: false,
      time: "3 hours ago"
    },
    {
      id: "not-3",
      title: "Action Item: Pitch Calibration",
      message: "Your last elevator pitch clocked in at 154 WPM. Practice slowing down by just five WPM to secure optimal pacing metrics.",
      type: "rehearsal",
      isRead: true,
      time: "1 day ago"
    },
    {
      id: "not-4",
      title: "Security Safety Synced",
      message: "Roadmap state checkpoint backups updated successfully. Your metrics are persistent.",
      type: "system",
      isRead: true,
      time: "2 days ago"
    }
  ]);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [visualOverlays, setVisualOverlays] = useState(true);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-8 pb-16 animate-fade-in text-editorial-text font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">PERSONALIZED FEED ALERTS</span>
          <h1 className="text-3xl font-light tracking-tight text-editorial-dark mt-1">Coaching Notifications</h1>
          <p className="text-xs text-editorial-muted font-light mt-1.5 leading-relaxed max-w-xl">
            Stay aligned with instant coaching feedback, milestone achievements, and tailored speech reminders sent by SpeakGlobal's cognitive processor.
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkAllRead}
              className="px-3.5 py-1.5 bg-white hover:bg-editorial-light-gray border border-editorial-border text-[10px] font-mono uppercase text-editorial-dark cursor-pointer font-bold"
            >
              Mark All Read
            </button>
            <button
              onClick={handleClearAll}
              className="px-3.5 py-1.5 bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-200 border border-editorial-border text-[10px] font-mono uppercase text-editorial-muted cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Notifications List (col-span-2) */}
        <div className="lg:col-span-2 space-y-4">
          
          {notifications.length === 0 ? (
            <div className="bg-white border border-editorial-border p-12 text-center space-y-4">
              <Bell size={28} className="mx-auto text-editorial-border" />
              <p className="text-sm font-light text-editorial-muted">All caught up! No active coaching notifications at this time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((not) => {
                const isRead = not.isRead;
                return (
                  <div 
                    key={not.id}
                    className={`p-5 border relative rounded-none flex items-start gap-4 transition-colors ${
                      isRead ? "bg-white border-editorial-border opacity-75" : "bg-white border-indigo-200 shadow-xs"
                    }`}
                  >
                    {!isRead && (
                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-indigo-600" />
                    )}

                    {/* Alert Icon depending on type */}
                    <div className={`p-2.5 shrink-0 rounded-none ${
                      not.type === "progress" ? "bg-emerald-50 text-emerald-700" :
                      not.type === "badge" ? "bg-amber-50 text-amber-700" :
                      not.type === "rehearsal" ? "bg-indigo-50 text-indigo-700" : "bg-neutral-50 text-neutral-600"
                    }`}>
                      {not.type === "progress" && <TrendingUp size={15} />}
                      {not.type === "badge" && <Award size={15} />}
                      {not.type === "rehearsal" && <Sparkles size={15} />}
                      {not.type === "system" && <Sliders size={15} />}
                    </div>

                    <div className="flex-grow min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-xs font-bold ${isRead ? "text-editorial-muted" : "text-editorial-dark"}`}>
                          {not.title}
                        </h3>
                        {!isRead && (
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-editorial-muted font-light leading-relaxed">
                        {not.message}
                      </p>
                      <span className="text-[9px] font-mono text-editorial-muted flex items-center gap-1">
                        <Clock size={10} /> {not.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      {!isRead && (
                        <button
                          onClick={() => handleMarkAsRead(not.id)}
                          className="p-1.5 text-editorial-muted hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="Mark Read"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(not.id)}
                        className="p-1.5 text-editorial-muted hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Alert"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Notification Alerts Control Panel (col-span-1) */}
        <div className="space-y-6">
          <div className="bg-white border border-editorial-border p-6 shadow-xs relative space-y-4">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-indigo-600" />
            <h3 className="text-xs font-mono font-bold text-editorial-dark uppercase tracking-widest border-b border-editorial-border pb-3 flex items-center gap-1.5">
              <Sliders size={13} className="text-indigo-600" /> Alert Feed Settings
            </h3>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-editorial-dark block">Vocal Cue Sound triggers</span>
                  <span className="text-[10px] text-editorial-muted font-light">Play low sine-waves on metrics alert</span>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-editorial-border focus:ring-indigo-500 rounded-none cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-editorial-dark block">Live visual micro-coaching</span>
                  <span className="text-[10px] text-editorial-muted font-light">Show pop-up warnings as you practice</span>
                </div>
                <input
                  type="checkbox"
                  checked={visualOverlays}
                  onChange={(e) => setVisualOverlays(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-editorial-border focus:ring-indigo-500 rounded-none cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-editorial-border text-[11px] text-editorial-muted font-light leading-relaxed">
              We never spam or sell notification logs. Alerts are calculated client-side and saved securely in your browser sandboxed partition.
            </div>
          </div>

          <div className="p-5 bg-indigo-50/20 border border-indigo-100 space-y-3">
            <div className="flex items-center gap-2">
              <Volume2 size={14} className="text-indigo-600" />
              <span className="text-[9px] font-mono text-indigo-950 font-bold uppercase tracking-widest block">COACH'S MICRO-ADVICE</span>
            </div>
            <p className="text-xs font-light text-indigo-900 leading-relaxed">
              "When delivering presentations, keep browser notifications on silent mode. Minimizing peripheral interruptions reduces speaking anxiety by 22%."
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
