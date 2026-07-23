import React, { useState, useRef } from "react";
import { 
  Camera, 
  Upload, 
  X, 
  Check, 
  Trash2, 
  User, 
  Sparkles, 
  Image as ImageIcon 
} from "lucide-react";
import { UserProfile } from "../types";

interface ProfilePictureUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  showToast?: (message: string, type: "success" | "warning" | "error" | "info") => void;
  theme?: "light" | "dark";
}

// Preset default avatars for quick selection
const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80"
];

export default function ProfilePictureUploadModal({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  showToast,
  theme = "light"
}: ProfilePictureUploadModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile.avatarUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      if (showToast) showToast("Please select a valid image file (JPG, PNG, WEBP).", "warning");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      if (showToast) showToast("Image size should be less than 5MB.", "warning");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSave = () => {
    const updatedProfile: UserProfile = {
      ...profile,
      avatarUrl: previewUrl || undefined
    };

    onUpdateProfile(updatedProfile);

    if (showToast) {
      showToast(
        previewUrl ? "Profile picture updated successfully!" : "Profile picture removed.",
        "success"
      );
    }

    onClose();
  };

  const handleRemove = () => {
    setPreviewUrl(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-fade-in font-sans">
      <div className={`w-full max-w-md border shadow-2xl relative p-6 animate-scale-up ${
        theme === "dark" 
          ? "bg-neutral-900 border-neutral-800 text-neutral-100" 
          : "bg-white border-editorial-border text-editorial-dark"
      }`}>
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-indigo-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-editorial-muted hover:text-editorial-dark cursor-pointer p-1"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Camera size={18} />
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Profile Identity</span>
          </div>
          <h2 className="text-xl font-light text-editorial-dark tracking-tight">Upload Profile Picture</h2>
          <p className="text-xs text-editorial-muted font-light mt-1">
            Choose a personal photograph or select a professional avatar for your SpeakGlobal account.
          </p>
        </div>

        {/* Avatar Preview Area */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative group">
            <div className="h-28 w-28 rounded-full border-2 border-indigo-600/30 overflow-hidden bg-editorial-light-gray flex items-center justify-center shadow-inner relative">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt={profile.name || "User Avatar"} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-indigo-600 text-white font-bold text-3xl flex items-center justify-center font-mono">
                  {profile.name ? profile.name.slice(0, 2).toUpperCase() : "SG"}
                </div>
              )}
            </div>

            {previewUrl && (
              <button
                onClick={handleRemove}
                className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                title="Remove picture"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
          <span className="text-[10px] font-mono text-editorial-muted mt-2">
            {previewUrl ? "Custom Avatar Selected" : "Default Initials Badge"}
          </span>
        </div>

        {/* Upload Dropzone */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed p-5 text-center cursor-pointer transition-colors mb-6 ${
            isDragging 
              ? "border-indigo-600 bg-indigo-50/30" 
              : "border-editorial-border hover:border-indigo-500 hover:bg-editorial-light-gray/50"
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <Upload size={22} className="mx-auto text-indigo-600 mb-2" />
          <p className="text-xs font-bold text-editorial-dark">
            Click to upload <span className="font-normal text-editorial-muted">or drag & drop</span>
          </p>
          <p className="text-[10px] text-editorial-muted mt-1 font-mono">
            PNG, JPG, or WEBP (Max 5MB)
          </p>
        </div>

        {/* Presets Grid */}
        <div className="mb-6">
          <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block mb-2">
            Or Choose A Professional Preset Avatar
          </span>
          <div className="grid grid-cols-6 gap-2">
            {PRESET_AVATARS.map((url, index) => (
              <button
                key={index}
                onClick={() => setPreviewUrl(url)}
                className={`h-10 w-10 rounded-full overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 ${
                  previewUrl === url ? "border-indigo-600 ring-2 ring-indigo-600/30" : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <img src={url} alt={`Preset ${index + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2 border-t border-editorial-border">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-editorial-border hover:bg-editorial-light-gray text-editorial-dark text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Check size={14} />
            Save Picture
          </button>
        </div>

      </div>
    </div>
  );
}
