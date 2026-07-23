import React, { useState, useEffect, useRef } from "react";
import { 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  SlidersHorizontal, 
  Zap, 
  ShieldAlert, 
  Info, 
  X,
  Sparkles,
  Activity
} from "lucide-react";
import { 
  EnvironmentMonitorService, 
  EnvironmentNoiseReport, 
  NoiseStatus 
} from "../services/EnvironmentMonitor";

interface EnvironmentMonitorWidgetProps {
  onUnsuitableEnvironmentToast?: (message: string, type: "warning" | "error" | "info") => void;
  isCompact?: boolean;
  className?: string;
}

export default function EnvironmentMonitorWidget({
  onUnsuitableEnvironmentToast,
  isCompact = false,
  className = ""
}: EnvironmentMonitorWidgetProps) {
  const [monitorService, setMonitorService] = useState<EnvironmentMonitorService | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [report, setReport] = useState<EnvironmentNoiseReport | null>(null);
  const [inAppToast, setInAppToast] = useState<{ message: string; type: "warning" | "error" | "info"; timestamp: string } | null>(null);
  const [isExpanded, setIsExpanded] = useState(!isCompact);

  // Initialize service on mount
  useEffect(() => {
    const service = new EnvironmentMonitorService({
      checkIntervalMs: 600,
      onReport: (rep) => {
        setReport(rep);
      },
      onUnsuitableEnvironment: (rep, msg) => {
        const toastType = rep.status === "extreme" ? "error" : "warning";
        
        // Internal Widget Toast
        setInAppToast({
          message: msg,
          type: toastType,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        });

        // Trigger Parent App Toast if provided
        if (onUnsuitableEnvironmentToast) {
          onUnsuitableEnvironmentToast(msg, toastType);
        }
      }
    });

    setMonitorService(service);

    // Auto start monitoring for seamless environment protection
    service.startMonitoring().then(() => {
      setIsMonitoring(true);
    });

    return () => {
      service.stopMonitoring();
    };
  }, [onUnsuitableEnvironmentToast]);

  const toggleMonitoring = async () => {
    if (!monitorService) return;
    if (isMonitoring) {
      monitorService.stopMonitoring();
      setIsMonitoring(false);
    } else {
      await monitorService.startMonitoring();
      setIsMonitoring(true);
    }
  };

  const handleCalibrate = () => {
    if (!monitorService) return;
    const newFloor = monitorService.calibrateNoiseFloor();
    setInAppToast({
      message: `[CALIBRATION COMPLETE] Ambient baseline noise floor set to ${newFloor} dB.`,
      type: "info",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    });
    if (onUnsuitableEnvironmentToast) {
      onUnsuitableEnvironmentToast(`[CALIBRATED] Baseline audio noise floor locked at ${newFloor} dB.`, "info");
    }
  };

  const handleSimulateNoiseSpike = () => {
    if (!monitorService) return;
    monitorService.simulateNoiseSpike(68);
  };

  // Metric visual styling helpers
  const getStatusBadge = (status?: NoiseStatus) => {
    switch (status) {
      case "optimal":
        return {
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
          icon: CheckCircle2,
          label: "Acoustic Health: Optimal"
        };
      case "moderate":
        return {
          bg: "bg-amber-50 text-amber-800 border-amber-200",
          icon: Info,
          label: "Acoustic Health: Moderate"
        };
      case "unsuitable":
        return {
          bg: "bg-orange-50 text-orange-900 border-orange-300 animate-pulse",
          icon: AlertTriangle,
          label: "Acoustic Alert: High Background Noise"
        };
      case "extreme":
        return {
          bg: "bg-red-50 text-red-900 border-red-300 animate-pulse",
          icon: ShieldAlert,
          label: "Severe Acoustic Interference"
        };
      default:
        return {
          bg: "bg-neutral-50 text-neutral-600 border-neutral-200",
          icon: Activity,
          label: "Initializing Telemetry..."
        };
    }
  };

  const badgeInfo = getStatusBadge(report?.status);
  const StatusIcon = badgeInfo.icon;

  const dbPercentage = report ? Math.min(100, Math.max(0, ((report.currentDb - 20) / 70) * 100)) : 20;

  return (
    <div className={`bg-white border border-editorial-border shadow-xs p-4 font-sans relative transition-all ${className}`}>
      {/* Visual Accent Top Bar */}
      <div className={`absolute top-0 left-0 right-0 h-[2.5px] ${
        report?.status === "unsuitable" || report?.status === "extreme" ? "bg-red-600" : "bg-indigo-600"
      }`} />

      {/* Internal Environment Alert Toast Notification */}
      {inAppToast && (
        <div className={`mb-3 p-3 text-xs border font-sans flex items-start justify-between gap-3 animate-slide-down ${
          inAppToast.type === "error" 
            ? "bg-red-50 text-red-900 border-red-200" 
            : inAppToast.type === "warning"
              ? "bg-amber-50 text-amber-900 border-amber-200"
              : "bg-indigo-50 text-indigo-900 border-indigo-200"
        }`}>
          <div className="flex items-start gap-2">
            {inAppToast.type === "error" ? <ShieldAlert size={15} className="text-red-600 shrink-0 mt-0.5" /> :
             inAppToast.type === "warning" ? <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" /> :
             <Info size={15} className="text-indigo-600 shrink-0 mt-0.5" />}
            <div>
              <span className="font-bold block leading-snug">{inAppToast.message}</span>
              <span className="text-[9px] font-mono opacity-70 block mt-0.5">{inAppToast.timestamp}</span>
            </div>
          </div>
          <button 
            onClick={() => setInAppToast(null)} 
            className="text-neutral-500 hover:text-neutral-900 cursor-pointer p-0.5"
            aria-label="Dismiss toast"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 border font-mono ${isMonitoring ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-neutral-100 text-neutral-400 border-neutral-200"}`}>
            <Volume2 size={15} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-editorial-dark">Environment Monitor</span>
              <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider hidden sm:inline">
                [MediaDevices + Web Speech]
              </span>
            </div>
            <p className="text-[10px] text-editorial-muted font-light leading-none mt-0.5">
              Continuous background acoustic suitability & noise detection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span className={`px-2.5 py-1 text-[10px] font-mono uppercase font-bold border flex items-center gap-1.5 ${badgeInfo.bg}`}>
            <StatusIcon size={12} />
            <span className="hidden md:inline">{badgeInfo.label}</span>
            <span className="md:hidden">{report?.status || "Checking"}</span>
          </span>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-editorial-muted hover:text-editorial-dark text-[10px] font-mono border border-editorial-border bg-editorial-light-gray cursor-pointer"
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>

      {/* Expanded Controls & Meter */}
      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-editorial-border space-y-3 animate-fade-in">
          
          {/* Decibel Level Meter Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-editorial-dark font-bold flex items-center gap-1">
                Acoustic Volume: <strong className="text-indigo-600 text-xs">{report?.currentDb || 35} dB</strong>
              </span>
              <span className="text-editorial-muted">
                Baseline Noise Floor: <strong>{report?.noiseFloorDb || 35} dB</strong>
              </span>
            </div>

            <div className="w-full bg-editorial-light-gray border border-editorial-border h-3 relative overflow-hidden">
              {/* Suitability warning marker at 55 dB */}
              <div className="absolute top-0 bottom-0 left-[50%] w-[1.5px] bg-amber-500 z-10" title="Unsuitable Noise Threshold (55 dB)" />
              <div className="absolute top-0 bottom-0 left-[75%] w-[1.5px] bg-red-600 z-10" title="Extreme Interference Threshold (72 dB)" />
              
              <div 
                className={`h-full transition-all duration-300 ${
                  (report?.currentDb || 0) >= 72 ? "bg-red-600" :
                  (report?.currentDb || 0) >= 55 ? "bg-amber-500" : "bg-emerald-600"
                }`}
                style={{ width: `${dbPercentage}%` }}
              />
            </div>

            <div className="flex justify-between text-[8px] font-mono text-editorial-muted uppercase">
              <span>20 dB (Whisper)</span>
              <span className="text-amber-600 font-bold">55 dB (Unsuitable Limit)</span>
              <span className="text-red-600 font-bold">90 dB (Loud Noise)</span>
            </div>
          </div>

          {/* Recommendation Note */}
          {report && (
            <div className="p-2.5 bg-editorial-light-gray/40 border border-editorial-border text-[11px] font-light text-editorial-muted flex items-start gap-2">
              <Info size={13} className="text-indigo-600 shrink-0 mt-0.5" />
              <span>{report.recommendation}</span>
            </div>
          )}

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex gap-2">
              <button
                onClick={toggleMonitoring}
                className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider font-bold border cursor-pointer flex items-center gap-1.5 ${
                  isMonitoring 
                    ? "bg-editorial-dark text-white border-editorial-dark" 
                    : "bg-white text-editorial-dark border-editorial-border hover:bg-editorial-light-gray"
                }`}
              >
                {isMonitoring ? <Volume2 size={12} /> : <VolumeX size={12} />}
                {isMonitoring ? "Monitor Active" : "Start Monitor"}
              </button>

              <button
                onClick={handleCalibrate}
                disabled={!isMonitoring}
                className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider font-bold border bg-white border-editorial-border hover:bg-editorial-light-gray text-editorial-dark cursor-pointer flex items-center gap-1.5"
                title="Lock current ambient sound level as calibrated noise floor"
              >
                <SlidersHorizontal size={12} className="text-indigo-600" />
                Calibrate Floor
              </button>
            </div>

            <button
              onClick={handleSimulateNoiseSpike}
              className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider font-bold border bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100 cursor-pointer flex items-center gap-1.5"
              title="Test suitability alert trigger with a simulated background noise spike"
            >
              <Zap size={12} className="text-amber-600" />
              Simulate Noise Spike
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
