import React, { useState } from "react";
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  Send, 
  Sparkles, 
  Award, 
  Globe, 
  Plus, 
  CheckCircle2 
} from "lucide-react";

interface CommunityPost {
  id: string;
  author: string;
  profession: string;
  avatar: string;
  content: string;
  score: number;
  likes: number;
  liked: boolean;
  comments: string[];
  goalTag: string;
  timestamp: string;
}

export default function Community() {
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: "post-1",
      author: "Sofia Rodriguez",
      profession: "Senior Product Designer",
      avatar: "SR",
      content: "Just managed to shave off 5 filler words from my standup pitch rehearsal using the structural PREP method! The AI coach's recommendation to substitute micro-pauses for 'basically' worked perfectly.",
      score: 88,
      likes: 24,
      liked: false,
      comments: ["Congrats Sofia! Structural pauses feel weird at first but sound extremely professional.", "Awesome clarity progress!"],
      goalTag: "Presentation",
      timestamp: "2 hours ago"
    },
    {
      id: "post-2",
      author: "Kenji Sato",
      profession: "Principal Cloud Engineer",
      avatar: "KS",
      content: "Prepped for my mock system architecture walkthrough yesterday. Highly recommend the 'Explaining Complex Incidents' scenario. It forced me to strip away recursive technical definitions and speak assertively.",
      score: 84,
      likes: 18,
      liked: false,
      comments: ["System architectural communication is indeed tough. Good job!", "Did the coach highlight many filler words?"],
      goalTag: "Meeting",
      timestamp: "5 hours ago"
    },
    {
      id: "post-3",
      author: "Emily Watson",
      profession: "UX Researcher",
      avatar: "EW",
      content: "After three weeks of daily 15-minute rehearsals, my overall speaking speed stabilized at 138 WPM. This matches the exact global executive standard. SpeakGlobal's customized curriculum really keeps you accountable.",
      score: 92,
      likes: 42,
      liked: false,
      comments: ["Consistency pays off! Inspiring metrics.", "Incredible progression, Emily!"],
      goalTag: "Interview",
      timestamp: "1 day ago"
    }
  ]);

  const [newPostText, setNewPostText] = useState("");
  const [newPostTag, setNewPostTag] = useState("Daily Practice");
  const [typedCommentId, setTypedCommentId] = useState<string | null>(null);
  const [typedCommentText, setTypedCommentText] = useState("");

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.liked ? p.likes - 1 : p.likes + 1,
          liked: !p.liked
        };
      }
      return p;
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const added: CommunityPost = {
      id: `post-user-${Date.now()}`,
      author: "Alex Chen",
      profession: "Lead Software Engineer",
      avatar: "AC",
      content: newPostText,
      score: 85, // Assigned randomly for fun
      likes: 1,
      liked: true,
      comments: [],
      goalTag: newPostTag,
      timestamp: "Just now"
    };

    setPosts(prev => [added, ...prev]);
    setNewPostText("");
  };

  const handleAddComment = (postId: string) => {
    if (!typedCommentText.trim()) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, `Alex Chen: ${typedCommentText}`]
        };
      }
      return p;
    }));
    setTypedCommentText("");
    setTypedCommentId(null);
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in text-editorial-text font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">COMMUNITY COLLABORATION HUB</span>
        <h1 className="text-3xl font-light tracking-tight text-editorial-dark mt-1">Speaking Collective</h1>
        <p className="text-xs text-editorial-muted font-light mt-1.5 leading-relaxed max-w-xl">
          Connect with professionals around the globe. Share your speaking metrics, swap architectural presentation tips, and build communication momentum together.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Feed (col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Write a Post */}
          <div className="bg-white border border-editorial-border p-6 shadow-xs relative">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-indigo-600" />
            <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-widest block mb-3">SHARE YOUR PROGRESS</span>
            
            <form onSubmit={handleCreatePost} className="space-y-4">
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Share a speaking win, rhetorical breakthrough, or general coaching update..."
                className="w-full min-h-[90px] p-4 bg-editorial-light-gray text-editorial-dark border border-editorial-border focus:outline-none focus:border-editorial-dark text-xs font-light resize-none leading-relaxed"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-editorial-muted uppercase">Goal Tag:</span>
                  <select
                    value={newPostTag}
                    onChange={(e) => setNewPostTag(e.target.value)}
                    className="px-2.5 py-1 bg-white border border-editorial-border text-[11px] font-mono text-editorial-dark"
                  >
                    <option value="Interview">Interview Prep</option>
                    <option value="Meeting">Meeting Lead</option>
                    <option value="Presentation">Pitching</option>
                    <option value="Daily Practice">Daily Practice</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!newPostText.trim()}
                  className="px-5 py-2.5 bg-editorial-dark hover:bg-neutral-800 disabled:opacity-50 text-white font-mono text-[10px] uppercase tracking-widest cursor-pointer font-bold flex items-center justify-center gap-2"
                >
                  Share to Feed <Plus size={12} />
                </button>
              </div>
            </form>
          </div>

          {/* Feed List */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white border border-editorial-border p-6 shadow-xs space-y-4 relative">
                
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs tracking-wider">
                      {post.avatar}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-editorial-dark">{post.author}</h3>
                      <span className="text-[10px] text-editorial-muted font-light block leading-none mt-0.5">{post.profession}</span>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <span className="text-[9px] font-mono bg-neutral-50 text-neutral-500 border border-neutral-200 px-2 py-0.5">
                      {post.goalTag}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 px-2 py-0.5">
                      Metric: {post.score}%
                    </span>
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs text-editorial-muted font-light leading-relaxed">
                  {post.content}
                </p>

                {/* Engagement panel */}
                <div className="flex items-center gap-6 pt-3 border-t border-editorial-border text-[11px] font-mono text-editorial-muted">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 hover:text-red-600 cursor-pointer transition-colors ${
                      post.liked ? "text-red-600 font-bold" : ""
                    }`}
                  >
                    <Heart size={13} className={post.liked ? "fill-red-600 text-red-600" : ""} />
                    <span>{post.likes} Likes</span>
                  </button>

                  <button 
                    onClick={() => {
                      setTypedCommentId(typedCommentId === post.id ? null : post.id);
                    }}
                    className="flex items-center gap-1.5 hover:text-editorial-dark cursor-pointer transition-colors"
                  >
                    <MessageSquare size={13} />
                    <span>{post.comments.length} Comments</span>
                  </button>

                  <span className="ml-auto text-[10px] text-editorial-muted">{post.timestamp}</span>
                </div>

                {/* Comments block */}
                {post.comments.length > 0 && (
                  <div className="bg-editorial-light-gray/40 p-4 border border-editorial-border space-y-2 text-[11px]">
                    <span className="text-[8px] font-mono text-editorial-muted uppercase tracking-wider block mb-1">CONVERSATION</span>
                    {post.comments.map((comment, index) => (
                      <p key={index} className="text-editorial-muted font-light leading-relaxed">
                        <strong className="text-editorial-dark font-semibold">{comment.split(":")[0]}:</strong>
                        {comment.split(":")[1]}
                      </p>
                    ))}
                  </div>
                )}

                {/* Write a comment */}
                {typedCommentId === post.id && (
                  <div className="flex items-center gap-2 pt-2 animate-slide-up">
                    <input
                      type="text"
                      value={typedCommentText}
                      onChange={(e) => setTypedCommentText(e.target.value)}
                      placeholder="Add high-constructive reply..."
                      className="flex-1 px-3 py-1.5 bg-editorial-light-gray border border-editorial-border text-editorial-dark focus:outline-none focus:border-editorial-dark text-xs font-light"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddComment(post.id);
                      }}
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition-colors"
                    >
                      <Send size={12} />
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>

        </div>

        {/* Right: Collective stats & guidelines (col-span-1) */}
        <div className="space-y-6">
          {/* Daily active members widget */}
          <div className="bg-white border border-editorial-border p-6 shadow-xs relative space-y-4">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-indigo-600" />
            <h3 className="text-xs font-mono font-bold text-editorial-dark uppercase tracking-widest border-b border-editorial-border pb-3 flex items-center gap-1.5">
              <Globe size={13} className="text-indigo-600" /> Global Rehearsers Online
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-editorial-muted font-light">Connected peers</span>
                <span className="font-mono font-bold text-emerald-600">842 online</span>
              </div>
              <div className="flex -space-x-2 overflow-hidden py-1">
                {["SR", "KS", "EW", "AC", "PM"].map((init, i) => (
                  <div key={i} className="h-7 w-7 rounded-full bg-indigo-600 text-white border border-white flex items-center justify-center font-bold text-[9px] tracking-wider shrink-0 shadow-sm">
                    {init}
                  </div>
                ))}
                <div className="h-7 w-7 rounded-full bg-neutral-100 text-neutral-500 border border-white flex items-center justify-center font-bold text-[9px] shrink-0 font-mono">
                  +837
                </div>
              </div>
              <span className="text-[10px] text-editorial-muted font-light block leading-normal">
                SpeakGlobal is used across 42 countries. Practice daily to help support colleagues preparing for global roles.
              </span>
            </div>
          </div>

          {/* Collective Conduct rules */}
          <div className="p-5 bg-indigo-50/20 border border-indigo-100 space-y-3">
            <span className="text-[9px] font-mono text-indigo-950 font-bold uppercase tracking-widest block">FEED CODE OF CONDUCT</span>
            <ul className="space-y-2 text-xs font-light text-indigo-900/95 list-decimal list-inside leading-relaxed">
              <li>Keep all speech feedback encouraging and constructive.</li>
              <li>Encourage diverse global speaking styles and native backgrounds.</li>
              <li>Never criticize accents; prioritize delivery clarity and structured flow.</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}
