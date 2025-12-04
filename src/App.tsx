import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { CountingGame, ColoringGame } from './components/Games';
import { LikeButton, CommentSection } from './components/Social.tsx';
import { initialDocuments, initialNotifications, trendingTags, topUsers, initialStories, currentUser } from './services/mockData';
import { Question, DocumentItem, Answer, BlogPost, User, Notification, Comment, Attachment, Story } from './types';
import { Search, Heart, MessageSquare, Download, Lock, Check, Eye, ChevronLeft, Send, Share2, Award, Calendar, Image as ImageIcon, Star, PenTool, Edit3, Camera, Gamepad2, Zap, Trophy, Flame, Sun, MoreHorizontal, Flag, MessageCircle, ThumbsUp, Hash, Users, PlusCircle, Smile, Video, Youtube, PlayCircle, BookOpen, ExternalLink, ArrowRight, X, ChevronRight, Home, Filter, Sparkles, BadgeCheck, Loader2, Database } from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  loginWithGoogle, 
  subscribeToQuestions, 
  subscribeToBlogs, 
  addQuestionToFirestore, 
  addBlogToFirestore, 
  toggleLikeQuestion, 
  addAnswerToFirestore,
  seedDatabase
} from './services/firebaseService';

// --- HELPER: TIME AGO ---
const timeAgo = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        if(isNaN(date.getTime())) return dateStr;
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) return 'Vừa xong';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
        return date.toLocaleDateString('vi-VN');
    } catch(e) {
        return dateStr;
    }
}; 

// --- COMPONENT: VERIFIED BADGE ---
const VerifiedBadge = ({ size = 12 }: { size?: number }) => (
  <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-blue-200 select-none shadow-sm" title="Chuyên gia đã xác thực">
    <BadgeCheck size={size} className="text-blue-600 fill-blue-100" />
    <span>Chuyên gia</span>
  </div>
);

// --- COMPONENT: STORY VIEWER (FULL SCREEN) ---
const StoryViewer = ({ story, onClose }: { story: Story, onClose: () => void }) => {
    useEffect(() => {
        // Auto close after 5 seconds
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [story, onClose]);

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-fade-in">
             <div className="absolute top-4 right-4 z-20">
                 <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full"><X size={32}/></button>
             </div>
             
             {/* Progress Bar */}
             <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
                 <div className="h-full bg-white animate-[width_5s_linear] w-full origin-left"></div>
             </div>

             <div className="relative w-full h-full max-w-md bg-black md:rounded-xl overflow-hidden shadow-2xl">
                 <img src={story.imageUrl} className="w-full h-full object-cover" />
                 
                 <div className="absolute top-4 left-4 flex items-center gap-3">
                     <img src={story.userAvatar} className="w-10 h-10 rounded-full border-2 border-rose-500" />
                     <div>
                         <div className="text-white font-bold text-sm shadow-black drop-shadow-md">{story.userName}</div>
                         <div className="text-white/80 text-xs shadow-black drop-shadow-md">{story.createdAt}</div>
                     </div>
                 </div>

                 <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                     <div className="flex gap-2">
                         <input placeholder="Gửi tin nhắn..." className="bg-transparent border border-white/50 rounded-full px-4 py-2 text-white placeholder-white/70 w-full outline-none" />
                         <button className="text-white p-2 hover:scale-110 transition-transform"><Heart size={28} /></button>
                     </div>
                 </div>
             </div>
        </div>
    );
};

// --- HELPER: MEDIA DISPLAY COMPONENT ---
const MediaDisplay = ({ attachments }: { attachments?: Attachment[] }) => {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="mt-3 grid gap-2">
      {attachments.map((media, idx) => (
        <div key={idx} className="rounded-xl overflow-hidden bg-black/5 relative shadow-sm border border-slate-100 group">
          {media.type === 'image' && (
            <img src={media.url} alt="content" className="w-full max-h-[500px] object-cover transition-transform group-hover:scale-[1.01]" />
          )}
          {media.type === 'video' && (
            <video controls className="w-full max-h-[500px] bg-black">
              <source src={media.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {media.type === 'youtube' && (
             <div className="aspect-video w-full">
               <iframe 
                 width="100%" 
                 height="100%" 
                 src={media.url} 
                 title="YouTube video player" 
                 frameBorder="0" 
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                 allowFullScreen
               ></iframe>
             </div>
          )}
        </div>
      ))}
    </div>
  );
};

// --- VIEW: LOGIN ---
const LoginView = ({ onLogin }: { onLogin: () => void }) => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center text-white font-extrabold text-5xl shadow-2xl shadow-rose-200 mb-8 animate-bounce">
                A
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Chào mừng đến với Asking.vn</h1>
            <p className="text-slate-500 mb-8 text-center max-w-md">Cộng đồng Mẹ & Bé văn minh, hiện đại. Nơi chia sẻ kiến thức và yêu thương.</p>
            
            <button 
                onClick={onLogin}
                className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:border-rose-200 hover:text-rose-500 transition-all flex items-center gap-3"
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" />
                Đăng nhập bằng Google
            </button>
        </div>
    )
}

// --- VIEW: CREATE POST/QUESTION ---
const CreateView = ({ type, onSubmit, currentUser }: { type: 'question' | 'blog', onSubmit: any, currentUser: User }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlType, setUrlType] = useState<'image'|'youtube'>('image');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setAttachments(prev => [...prev, { type: 'image', url }]);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const url = URL.createObjectURL(e.target.files[0]);
        setAttachments(prev => [...prev, { type: 'video', url }]);
      }
  };

  const handleAddUrl = () => {
      if(!urlInput) return;
      let finalUrl = urlInput;
      if (urlType === 'youtube' && urlInput.includes('watch?v=')) {
          finalUrl = urlInput.replace('watch?v=', 'embed/');
      } else if (urlType === 'youtube' && urlInput.includes('youtu.be/')) {
          finalUrl = urlInput.replace('youtu.be/', 'www.youtube.com/embed/');
      }

      setAttachments(prev => [...prev, { type: urlType, url: finalUrl }]);
      setUrlInput('');
      setShowUrlInput(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        await onSubmit({ title, content, attachments });
        navigate(type === 'question' ? '/qa' : '/blog');
    } catch (error) {
        alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in mt-4 mb-20">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
         <h1 className="font-bold text-lg text-slate-800">
           {type === 'question' ? 'Đặt câu hỏi mới' : 'Viết bài chia sẻ'}
         </h1>
         <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600"><ChevronLeft/></button>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
         <div className="flex items-center gap-3 mb-4">
            <img src={currentUser.avatar} className="w-10 h-10 rounded-full" />
            <div>
              <div className="font-bold text-slate-800 flex items-center gap-2">
                {currentUser.name}
                {currentUser.role === 'expert' && <BadgeCheck size={14} className="text-blue-500" fill="currentColor" />}
              </div>
              <div className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full w-fit">
                {type === 'blog' ? 'Bài viết sẽ được duyệt' : 'Công khai'}
              </div>
            </div>
         </div>

         <input 
           className="w-full text-xl font-bold placeholder-slate-400 outline-none" 
           placeholder={type === 'question' ? "Tiêu đề câu hỏi..." : "Tiêu đề bài viết..."}
           value={title}
           onChange={e => setTitle(e.target.value)}
           required
         />
         
         <textarea 
           className="w-full h-40 resize-none outline-none text-slate-600 placeholder-slate-300"
           placeholder={type === 'question' ? "Chi tiết câu hỏi của mẹ..." : "Nội dung bài viết..."}
           value={content}
           onChange={e => setContent(e.target.value)}
           required
         />

         {/* Attachments Preview */}
         <div className="grid grid-cols-2 gap-2">
            {attachments.map((media, i) => (
                <div key={i} className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200 group">
                    {media.type === 'image' && <img src={media.url} className="w-full h-full object-cover" />}
                    {media.type === 'video' && <div className="w-full h-full flex items-center justify-center bg-black text-white"><PlayCircle /></div>}
                    {media.type === 'youtube' && <div className="w-full h-full flex items-center justify-center bg-red-600 text-white"><Youtube /></div>}
                    <button type="button" onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                </div>
            ))}
         </div>

         {showUrlInput && (
             <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex gap-2">
                 <select value={urlType} onChange={(e) => setUrlType(e.target.value as any)} className="bg-white border border-slate-200 rounded px-2 text-sm outline-none">
                     <option value="image">Ảnh (URL)</option>
                     <option value="youtube">YouTube</option>
                 </select>
                 <input 
                    type="text" 
                    placeholder="Dán đường link vào đây..." 
                    className="flex-1 bg-white border border-slate-200 rounded px-3 text-sm outline-none"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                 />
                 <button type="button" onClick={handleAddUrl} className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-bold">Thêm</button>
             </div>
         )}

         <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex gap-2">
                <label className="cursor-pointer flex items-center gap-2 text-slate-500 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors hover:text-emerald-500">
                   <ImageIcon size={20} />
                   <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
                <label className="cursor-pointer flex items-center gap-2 text-slate-500 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors hover:text-blue-500">
                   <Video size={20} />
                   <input type="file" className="hidden" accept="video/*" onChange={handleVideoUpload} />
                </label>
                <button type="button" onClick={() => setShowUrlInput(!showUrlInput)} className="flex items-center gap-2 text-slate-500 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors hover:text-red-500">
                   <Youtube size={20} />
                </button>
            </div>
            <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-rose-500 text-white px-8 py-2 rounded-lg font-bold shadow-md hover:bg-rose-600 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin"/> : 'Đăng'}
            </button>
         </div>
      </form>
    </div>
  );
};

// --- VIEW: QA HUB (REDESIGNED) ---
const QAView = ({ questions }: { questions: Question[] }) => {
    const [filter, setFilter] = useState<'newest' | 'hot' | 'unanswered'>('newest');
    
    // Safety check for questions
    const safeQuestions = Array.isArray(questions) ? questions : [];

    const sortedQuestions = [...safeQuestions].sort((a, b) => {
        if (filter === 'hot') return (b.votes || 0) - (a.votes || 0);
        if (filter === 'unanswered') return (a.answersCount || 0) - (b.answersCount || 0); 
        return (b.createdAt || '').localeCompare(a.createdAt || ''); 
    });

    const displayQuestions = filter === 'unanswered' ? sortedQuestions.filter(q => q.answersCount === 0) : sortedQuestions;

    return (
        <div className="container mx-auto max-w-6xl animate-fade-in pb-10">
            {/* QA Header */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Hỏi đáp & Thảo luận</h1>
                    <p className="text-slate-500">Nơi các mẹ chia sẻ kinh nghiệm và nhận tư vấn từ chuyên gia.</p>
                </div>
                <Link to="/qa/create" className="bg-rose-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-rose-600 hover:shadow-xl transition-all flex items-center gap-2">
                    <PlusCircle size={20} /> Đặt câu hỏi
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Content (8 cols) */}
                <div className="lg:col-span-8 space-y-4">
                    {/* Filters */}
                    <div className="flex items-center gap-2 mb-4 bg-white p-1 rounded-xl w-fit border border-slate-200 shadow-sm">
                        <button onClick={() => setFilter('newest')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'newest' ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:bg-slate-50'}`}>Mới nhất</button>
                        <button onClick={() => setFilter('hot')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'hot' ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:bg-slate-50'}`}>Sôi nổi</button>
                        <button onClick={() => setFilter('unanswered')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'unanswered' ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:bg-slate-50'}`}>Chưa trả lời</button>
                    </div>

                    {/* Question List */}
                    {displayQuestions.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 text-slate-400">Chưa có câu hỏi nào.</div>
                    ) : (
                        displayQuestions.map(q => (
                            <Link to={`/qa/${q.id}`} key={q.id} className="block bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-rose-200 transition-all group relative overflow-hidden">
                                {q.answers?.some(a => a.isAccepted) && (
                                    <div className="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 rounded-bl-xl text-xs font-bold shadow-sm">
                                        Đã giải quyết
                                    </div>
                                )}
                                <div className="flex gap-4">
                                    {/* Stats Column */}
                                    <div className="flex flex-col items-center justify-center gap-2 w-16 text-slate-500 pt-1">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-slate-700">{q.votes || 0}</div>
                                            <div className="text-[10px] font-medium">Vote</div>
                                        </div>
                                        <div className={`text-center px-2 py-1 rounded-lg ${q.answersCount > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'text-slate-400'}`}>
                                            <div className="text-lg font-bold">{q.answersCount || 0}</div>
                                            <div className="text-[10px] font-medium">Trả lời</div>
                                        </div>
                                    </div>

                                    {/* Main Content */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-rose-600 transition-colors line-clamp-2">
                                            {q.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm line-clamp-2 mb-3">{q.content}</p>
                                        
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex gap-2">
                                                {q.tags?.map(t => (
                                                    <span key={t} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium hover:bg-rose-50 hover:text-rose-500">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <span>{timeAgo(q.createdAt)}</span>
                                                <span>bởi <span className="font-bold text-slate-600">{q.author.name}</span></span>
                                                <img src={q.author.avatar} className="w-5 h-5 rounded-full border border-slate-200" />
                                                {q.author.role === 'expert' && <BadgeCheck size={12} className="text-blue-500" fill="currentColor" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    {/* ... Same as before ... */}
                </div>
            </div>
        </div>
    );
};

// --- COMPONENT: FEED POST CARD ---
const PostCard = ({ 
  item, 
  type, 
  onLike,
  isHot 
}: { 
  item: Question | BlogPost, 
  type: 'question' | 'blog', 
  onLike: (id: string, current: number, liked: boolean) => void,
  isHot?: boolean
}) => {
  const isQuestion = type === 'question';
  const q = item as Question;
  const p = item as BlogPost;
  
  const stats = {
    likes: isQuestion ? q.votes : p.likes,
    isLiked: !!(isQuestion ? q.isLiked : p.isLiked),
    comments: isQuestion ? q.answersCount : p.comments?.length || 0,
    views: item.views || 0,
  };

  const attachments = isQuestion ? q.attachments : p.attachments;

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden mb-5 hover:shadow-md transition-shadow relative">
       {/* Hot Badge */}
       {isHot && (
           <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1 z-10">
               <Flame size={12} fill="white" /> Sôi nổi
           </div>
       )}

       {/* Header */}
       <div className="p-4 flex items-start justify-between">
          <div className="flex gap-3">
             <Link to="/profile" className="relative">
                <img src={item.author.avatar} className="w-11 h-11 rounded-full border border-slate-100 object-cover" />
                {item.author.role === 'expert' && <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white"><BadgeCheck size={8} className="text-white" fill="currentColor" /></div>}
             </Link>
             <div>
                <div className="flex items-center gap-2">
                   <span className="font-bold text-slate-800 hover:underline cursor-pointer">{item.author.name}</span>
                   {item.author.role === 'expert' && <VerifiedBadge size={10} />}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                   <span>{timeAgo(item.createdAt)}</span>
                   <span>•</span>
                   <span className="flex items-center gap-0.5"><Eye size={10} /> {stats.views}</span>
                   {isQuestion ? (
                      <span className="ml-1 px-1.5 py-0.5 bg-rose-50 text-rose-500 rounded text-[10px] font-bold">Hỏi đáp</span>
                   ) : (
                      <span className="ml-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-500 rounded text-[10px] font-bold">Blog</span>
                   )}
                </div>
             </div>
          </div>
          <button className="text-slate-400 hover:bg-slate-100 p-2 rounded-full"><MoreHorizontal size={20}/></button>
       </div>

       {/* Content */}
       <div className="px-4 pb-2">
          <Link to={isQuestion ? `/qa/${item.id}` : `/blog/${item.id}`}>
             <h3 className="font-bold text-lg text-slate-800 mb-2 hover:text-rose-600 transition-colors leading-snug">
                {item.title}
             </h3>
             <div className="text-sm text-slate-700 leading-relaxed line-clamp-3 mb-3">
                {isQuestion ? q.content : p.excerpt}
             </div>
          </Link>
          
          <Link to={isQuestion ? `/qa/${item.id}` : `/blog/${item.id}`} className="block">
             <MediaDisplay attachments={attachments} />
             {!attachments && !isQuestion && p.thumbnail && (
                  <img src={p.thumbnail} className="w-full h-64 object-cover rounded-xl mt-2 border border-slate-100" />
             )}
          </Link>
       </div>

       {/* Action Buttons */}
       <div className="grid grid-cols-3 px-2 py-1 gap-1 border-t border-slate-50 mt-2">
          <button 
             onClick={() => onLike(item.id, stats.likes, stats.isLiked)}
             className={`flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-colors ${stats.isLiked ? 'text-rose-500 bg-rose-50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
             <Heart size={18} fill={stats.isLiked ? "currentColor" : "none"} />
             <span>{stats.likes}</span>
          </button>
          <Link 
             to={isQuestion ? `/qa/${item.id}` : `/blog/${item.id}`}
             className="flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm text-slate-500 hover:bg-slate-50 transition-colors"
          >
             <MessageCircle size={18} />
             <span>{stats.comments}</span>
          </Link>
          <button className="flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm text-slate-500 hover:bg-slate-50 transition-colors">
             <Share2 size={18} />
             <span>Chia sẻ</span>
          </button>
       </div>
    </div>
  );
};

// --- VIEW: HOME ---
const HomeView = ({ questions, posts, currentUser, onLikeQ, onLikeP, stories }: any) => {
  const [activeTypeTab, setActiveTypeTab] = useState<'all' | 'qa' | 'blog'>('all');
  const [activeSortTab, setActiveSortTab] = useState<'newest' | 'trending'>('newest');

  const getEngagementScore = (item: any) => {
     const likes = item.votes || item.likes || 0;
     const comments = item.answersCount || item.comments?.length || 0;
     const views = item.views || 0;
     return likes + (comments * 2) + (views / 100);
  }

  const rawFeed = [
    ...questions.map((q: any) => ({ ...q, type: 'question', score: getEngagementScore(q) })),
    ...posts.filter((p: any) => p.status === 'published').map((p: any) => ({ ...p, type: 'blog', score: getEngagementScore(p) }))
  ];

  const typeFilteredFeed = activeTypeTab === 'all' 
     ? rawFeed 
     : rawFeed.filter(item => item.type === activeTypeTab);

  const finalFeed = [...typeFilteredFeed].sort((a, b) => {
      if (activeSortTab === 'trending') return b.score - a.score;
      return b.createdAt.localeCompare(a.createdAt);
  });

  // Desktop Sidebar Menu Item Helper
  const SidebarItem = ({ to, icon: Icon, label, desc }: any) => {
      const location = useLocation();
      const isActive = location.pathname === to;
      return (
        <Link to={to} className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${isActive ? 'bg-rose-50 border border-rose-100' : 'hover:bg-slate-50 border border-transparent'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-colors ${isActive ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-rose-500 group-hover:text-white'}`}>
                <Icon size={24} />
            </div>
            <div>
                <div className={`font-bold text-sm ${isActive ? 'text-rose-600' : 'text-slate-700 group-hover:text-rose-600'}`}>{label}</div>
                <div className="text-[11px] text-slate-400 font-medium">{desc}</div>
            </div>
        </Link>
      );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in font-sans">
      
      {/* LEFT SIDEBAR */}
      <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 h-fit">
         <Link to="/profile" className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group">
            <div className="relative">
                <img src={currentUser.avatar} className="w-14 h-14 rounded-full border-2 border-slate-100 shadow-sm" />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
               <div className="font-bold text-slate-800 text-lg group-hover:text-rose-500 transition-colors flex items-center gap-1">
                   {currentUser.name}
                   {currentUser.role === 'expert' && <BadgeCheck size={14} className="text-blue-500" fill="currentColor" />}
               </div>
               <div className="text-xs text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-full w-fit mt-1">
                   {currentUser.points} điểm uy tín
               </div>
            </div>
         </Link>

         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 space-y-1">
            <SidebarItem to="/" icon={Home} label="Trang chủ" desc="Bảng tin tổng hợp" />
            <SidebarItem to="/qa" icon={MessageCircle} label="Góc Hỏi Đáp" desc="Thảo luận chuyên gia" />
            <SidebarItem to="/blog" icon={PenTool} label="Blog Tâm Sự" desc="Chia sẻ câu chuyện" />
            <SidebarItem to="/docs" icon={BookOpen} label="Kho Tài Liệu" desc="Ebook, thực đơn" />
            <SidebarItem to="/games" icon={Gamepad2} label="Góc Bé Chơi" desc="Vừa học vừa chơi" />
         </div>
      </div>

      {/* CENTER FEED */}
      <div className="lg:col-span-6 col-span-1 space-y-6">
        
        {/* STORIES */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
           <div className="relative flex-shrink-0 w-28 h-44 sm:w-32 sm:h-48 rounded-2xl bg-white border-2 border-dashed border-rose-300 overflow-hidden cursor-pointer group flex flex-col items-center justify-center hover:bg-rose-50 transition-colors">
                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 mb-2 group-hover:scale-110 transition-transform">
                  <PlusCircle size={24}/>
                </div>
                <span className="text-xs font-bold text-rose-500">Tạo tin</span>
           </div>
           
           {stories.map((story: Story) => (
               <div key={story.id} className="relative flex-shrink-0 w-28 h-44 sm:w-32 sm:h-48 rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-lg transition-all border border-slate-100 hover:border-rose-200">
                    <img src={story.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-xs font-bold leading-tight shadow-sm drop-shadow-md truncate">{story.userName}</p>
                    </div>
                    <div className={`absolute top-3 left-3 w-9 h-9 rounded-full border-2 ${story.isViewed ? 'border-slate-300' : 'border-rose-500'} overflow-hidden bg-white shadow-md p-0.5`}>
                        <img src={story.userAvatar} className="w-full h-full object-cover rounded-full" />
                    </div>
               </div>
           ))}
        </div>

        {/* CREATE POST INPUT */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center gap-3">
             <Link to="/profile">
                 <img src={currentUser.avatar} className="w-10 h-10 rounded-full border border-slate-100" />
             </Link>
             <Link to="/qa/create" className="flex-1 bg-slate-100 hover:bg-slate-200 transition-colors rounded-full px-5 py-2.5 text-slate-500 text-sm font-medium cursor-pointer flex items-center justify-between group">
                 <span>Mẹ ơi, mẹ đang nghĩ gì thế?</span>
             </Link>
             <Link to="/qa/create" className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors shadow-sm">
                 <PenTool size={20} />
             </Link>
        </div>

        {/* FEED TABS */}
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveTypeTab('all')} className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeTypeTab === 'all' ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>Tất cả</button>
                <button onClick={() => setActiveTypeTab('qa')} className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeTypeTab === 'qa' ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>Hỏi đáp</button>
                <button onClick={() => setActiveTypeTab('blog')} className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeTypeTab === 'blog' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>Blog chia sẻ</button>
            </div>
            <div className="flex items-center justify-between px-2">
                 <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
                     <button onClick={() => setActiveSortTab('newest')} className={`flex items-center gap-1 hover:text-rose-500 transition-colors ${activeSortTab === 'newest' ? 'text-rose-500 border-b-2 border-rose-500 pb-0.5' : ''}`}>
                         <Filter size={16} /> Mới nhất
                     </button>
                     <button onClick={() => setActiveSortTab('trending')} className={`flex items-center gap-1 hover:text-orange-500 transition-colors ${activeSortTab === 'trending' ? 'text-orange-500 border-b-2 border-orange-500 pb-0.5' : ''}`}>
                         <Sparkles size={16} /> Sôi nổi
                     </button>
                 </div>
            </div>
        </div>

        {/* FEED CONTENT */}
        <div className="animate-fade-in">
           {finalFeed.length === 0 ? (
               <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed text-slate-400">
                   <p>Chưa có bài viết nào phù hợp.</p>
               </div>
           ) : (
               finalFeed.map(item => (
                <PostCard 
                    key={`${item.type}-${item.id}`} 
                    item={item} 
                    type={item.type}
                    onLike={item.type === 'question' ? onLikeQ : onLikeP}
                    isHot={activeSortTab === 'trending' && item.score > 20}
                />
               ))
           )}
           <div className="text-center py-8">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400">
                  <Check size={24} />
              </div>
              <p className="text-slate-500 text-sm font-bold">Bạn đã xem hết tin mới</p>
           </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 h-fit">
         {/* ... Widgets ... */}
         <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-5 shadow-lg text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 bg-white/10 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <Gamepad2 size={24} className="text-yellow-300" />
                    <h3 className="font-bold text-lg">Góc Bé Chơi</h3>
                </div>
                <p className="text-sm text-purple-100 mb-4 font-medium">Giúp bé phát triển tư duy qua các trò chơi thú vị.</p>
                <Link to="/games" className="inline-block w-full text-center bg-white text-purple-600 font-bold text-sm py-2.5 rounded-xl hover:bg-purple-50 transition-colors shadow-md">
                    Chơi ngay
                </Link>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- VIEW: Q&A DETAIL ---
const QADetailView = ({ 
    questions, 
    currentUser, 
    onAddAnswer, 
    onLike
  }: any) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const question = questions.find((q: Question) => q.id === id);
    const [newAnswer, setNewAnswer] = useState('');
  
    if (!question) return <div className="p-8 text-center text-slate-500">Đang tải hoặc không tìm thấy câu hỏi...</div>;
  
    const handleAnswerSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (newAnswer.trim()) {
        await onAddAnswer(question.id, newAnswer);
        setNewAnswer('');
      }
    };
  
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-10">
        <button onClick={() => navigate('/qa')} className="text-slate-500 hover:text-rose-500 flex items-center gap-1 text-sm font-bold transition-colors">
          <ChevronLeft size={16} /> Quay lại
        </button>
  
        {/* Question Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
           <div className="flex items-center gap-3 mb-4">
              <Link to="/profile">
                <img src={question.author.avatar} alt="avt" className="w-12 h-12 rounded-full border border-slate-100" />
              </Link>
              <div>
                 <div className="font-bold text-slate-800 flex items-center gap-2">
                     {question.author.name}
                     {question.author.role === 'expert' && <VerifiedBadge />}
                 </div>
                 <div className="text-xs text-slate-400">{timeAgo(question.createdAt)}</div>
              </div>
           </div>
  
           <h1 className="text-2xl font-bold text-slate-800 mb-4 leading-tight">{question.title}</h1>
           
           <div className="text-slate-700 leading-relaxed text-base mb-4 whitespace-pre-line">
             {question.content}
           </div>
           
           <MediaDisplay attachments={question.attachments} />
  
           <div className="flex gap-2 mb-6 mt-4">
              {question.tags?.map((t: string) => <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">{t}</span>)}
           </div>
  
           <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <LikeButton liked={!!question.isLiked} count={question.votes} onToggle={() => onLike(question.id, question.votes, !!question.isLiked)} />
              <button className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                 <Share2 size={18} /> Chia sẻ
              </button>
           </div>
        </div>
  
        {/* Answer Input */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex gap-4">
           <img src={currentUser.avatar} className="w-10 h-10 rounded-full" />
           <form className="flex-1" onSubmit={handleAnswerSubmit}>
              <textarea 
                value={newAnswer}
                onChange={e => setNewAnswer(e.target.value)}
                className="w-full bg-slate-50 rounded-xl p-3 outline-none focus:ring-2 focus:ring-rose-100 text-sm min-h-[80px]"
                placeholder="Chia sẻ kinh nghiệm của mẹ..."
              ></textarea>
              <div className="flex justify-end mt-2">
                 <button type="submit" disabled={!newAnswer.trim()} className="bg-rose-500 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-rose-600 transition-all disabled:opacity-50">
                   Gửi câu trả lời
                 </button>
              </div>
           </form>
        </div>
  
        {/* Answers List */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 text-lg px-2">{question.answersCount} Câu trả lời</h3>
          
          {question.answers?.map((ans: Answer) => {
              const isExpert = ans.author.role === 'expert';
              const containerClass = ans.isAccepted 
                  ? 'border-emerald-200 bg-emerald-50/20' 
                  : isExpert 
                      ? 'border-blue-200 bg-blue-50/30 ring-1 ring-blue-100' 
                      : 'border-slate-200';
              
              return (
                <div key={ans.id} className={`bg-white rounded-2xl p-5 shadow-sm border ${containerClass}`}>
                   <div className="flex justify-between items-start mb-3">
                     <div className="flex items-center gap-3">
                       <img src={ans.author.avatar} className="w-10 h-10 rounded-full" />
                       <div>
                         <div className="flex items-center gap-2">
                           <span className="font-bold text-slate-800 text-sm">{ans.author.name}</span>
                           {isExpert && <VerifiedBadge />}
                         </div>
                         <div className="text-xs text-slate-400">{timeAgo(ans.createdAt)}</div>
                       </div>
                     </div>
                   </div>
                   
                   <p className="text-slate-700 text-sm leading-relaxed mb-4">{ans.content}</p>
                </div>
              );
          })}
        </div>
      </div>
    );
  };

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [notifs, setNotifs] = useState<Notification[]>(initialNotifications);
  const [docs, setDocs] = useState<DocumentItem[]>(initialDocuments);
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [loading, setLoading] = useState(true);

  // --- FIREBASE SUBSCRIPTION ---
  useEffect(() => {
    // 1. Auth Listener
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
            // In a real app, fetch detailed profile from 'users' collection
            setUser({
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email || '',
                role: 'user',
                points: 100,
                avatar: firebaseUser.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
                bio: 'Thành viên Asking.vn'
            });
        } else {
            setUser(null);
        }
        setLoading(false);
    });

    // 2. Data Listeners
    const unsubscribeQuestions = subscribeToQuestions((data) => {
        setQuestions(data);
    });

    const unsubscribeBlogs = subscribeToBlogs((data) => {
        setPosts(data);
    });

    return () => {
        unsubscribeAuth();
        unsubscribeQuestions();
        unsubscribeBlogs();
    };
  }, []);

  const handleLogin = async () => {
      try {
          const user = await loginWithGoogle();
          setUser(user);
      } catch (error) {
          alert("Đăng nhập thất bại. Vui lòng kiểm tra cấu hình Firebase.");
      }
  };

  const handleCreateContent = async (data: any) => {
      if(!user) return;
      if(data.type === 'question') {
          await addQuestionToFirestore(data, user);
      } else {
          await addBlogToFirestore(data, user);
      }
  };

  const handleLikeQuestion = async (id: string, currentVotes: number, isLiked: boolean) => {
      // Optimistic update handled by real-time listener, but we can do it locally too for speed
      await toggleLikeQuestion(id, currentVotes, isLiked);
  };

  const handleAddAnswer = async (qid: string, content: string) => {
      if(!user) return;
      await addAnswerToFirestore(qid, content, user);
  };

  // Seed data button for demo
  const handleSeed = async () => {
      const confirm = window.confirm("Bạn có chắc chắn muốn nạp dữ liệu mẫu vào Firestore?");
      if(confirm) await seedDatabase();
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-rose-500" size={48}/></div>;

  return (
    <HashRouter>
      <Layout 
        user={user} 
        notifications={notifs} 
        unreadCount={notifs.filter(n => !n.isRead).length}
        onReadNotif={(id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))}
      >
        <Routes>
          {/* Public Route / Login Check */}
          <Route path="/" element={
            user ? (
                <HomeView 
                    questions={questions} 
                    posts={posts} 
                    currentUser={user} 
                    onLikeQ={handleLikeQuestion} 
                    onLikeP={() => {}} 
                    stories={stories}
                />
            ) : (
                <LoginView onLogin={handleLogin} />
            )
          } />
          
          <Route path="/qa" element={<QAView questions={questions} />} />
          <Route path="/qa/:id" element={<QADetailView questions={questions} currentUser={user} onAddAnswer={handleAddAnswer} onLike={handleLikeQuestion} />} />
          <Route path="/qa/create" element={user ? <CreateView type="question" currentUser={user} onSubmit={(data: any) => handleCreateContent({...data, type: 'question'})} /> : <LoginView onLogin={handleLogin}/>} />
          
          <Route path="/blog" element={<div className="animate-fade-in"><h1 className="text-2xl font-bold mb-4">Blog</h1>{posts.map(p => <Link key={p.id} to={`/blog/${p.id}`} className="block bg-white p-4 mb-4 rounded-xl border border-slate-200 hover:shadow-md">{p.title}</Link>)}</div>} />
          <Route path="/blog/create" element={user ? <CreateView type="blog" currentUser={user} onSubmit={(data: any) => handleCreateContent({...data, type: 'blog'})} /> : <LoginView onLogin={handleLogin}/>} />
          
          <Route path="/docs" element={<div className="animate-fade-in"><h1 className="text-2xl font-bold mb-4">Tài liệu</h1>{docs.map(d => <Link key={d.id} to={`/docs/${d.id}`} className="block bg-white p-4 mb-4 rounded-xl border border-slate-200 hover:shadow-md">{d.title}</Link>)}</div>} />
          
          <Route path="/games" element={<div className="max-w-4xl mx-auto space-y-6"><h1 className="text-2xl font-bold text-slate-800">Góc bé chơi</h1><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><CountingGame /><ColoringGame /></div></div>} />
        </Routes>

        {/* ADMIN TOOL: SEED DB */}
        {user && (
            <button 
                onClick={handleSeed}
                className="fixed bottom-4 right-4 bg-slate-800 text-white p-3 rounded-full shadow-lg opacity-50 hover:opacity-100 transition-opacity z-50"
                title="Khởi tạo dữ liệu mẫu"
            >
                <Database size={20}/>
            </button>
        )}
      </Layout>
    </HashRouter>
  );
};

export default App;