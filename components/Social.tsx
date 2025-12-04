
import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Share2, MoreHorizontal, CornerDownRight } from 'lucide-react';
import { Comment, User } from '../types';

// --- Like Button ---
interface LikeButtonProps {
  liked: boolean;
  count: number;
  onToggle: () => void;
  size?: number;
}
export const LikeButton: React.FC<LikeButtonProps> = ({ liked, count, onToggle, size = 20 }) => (
  <button 
    onClick={onToggle}
    className={`flex items-center gap-1.5 font-bold transition-all active:scale-95 ${liked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-400'}`}
  >
    <Heart size={size} fill={liked ? "currentColor" : "none"} />
    <span>{count}</span>
  </button>
);

// --- Comment Section ---
interface CommentSectionProps {
  comments: Comment[];
  currentUser: User;
  onAddComment: (content: string, parentId?: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ comments, currentUser, onAddComment }) => {
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddComment(text, parentId);
    setText('');
    setReplyTo(null);
  };

  return (
    <div className="mt-4">
      {/* Input Main */}
      <div className="flex gap-3 mb-6">
        <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-slate-200" alt="Me" />
        <form className="flex-1 relative" onSubmit={(e) => handleSubmit(e)}>
          <input 
            type="text" 
            value={text}
            onChange={(e) => !replyTo && setText(e.target.value)}
            className="w-full bg-slate-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-200"
            placeholder="Viết bình luận..."
          />
          <button type="submit" disabled={!text.trim()} className="absolute right-2 top-1.5 text-rose-500 hover:bg-rose-50 p-1 rounded-full disabled:opacity-30">
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* List */}
      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-3">
             <img src={comment.userAvatar} className="w-8 h-8 rounded-full" alt={comment.userName} />
             <div className="flex-1">
                <div className="bg-slate-100 rounded-2xl px-4 py-2 inline-block">
                   <div className="font-bold text-sm text-slate-800">{comment.userName}</div>
                   <div className="text-sm text-slate-600">{comment.content}</div>
                </div>
                <div className="flex items-center gap-4 mt-1 ml-2 text-xs font-bold text-slate-400">
                   <span>{comment.createdAt}</span>
                   <button className="hover:text-rose-500">Thích</button>
                   <button className="hover:text-rose-500" onClick={() => setReplyTo(comment.id)}>Trả lời</button>
                </div>

                {/* Reply Input */}
                {replyTo === comment.id && (
                  <form className="flex gap-2 mt-2" onSubmit={(e) => handleSubmit(e, comment.id)}>
                     <input 
                        autoFocus
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-xs outline-none"
                        placeholder={`Trả lời ${comment.userName}...`}
                     />
                  </form>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-2 pl-4 space-y-3 border-l-2 border-slate-100 ml-2">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="flex gap-2">
                        <img src={reply.userAvatar} className="w-6 h-6 rounded-full" />
                        <div>
                          <div className="bg-slate-100 rounded-2xl px-3 py-1.5 inline-block">
                             <span className="font-bold text-xs text-slate-800 mr-2">{reply.userName}</span>
                             <span className="text-xs text-slate-600">{reply.content}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
