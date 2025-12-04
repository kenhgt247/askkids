
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { CountingGame, ColoringGame } from './components/Games';
import { LikeButton, CommentSection } from './components/Social.tsx';
import { currentUser, initialQuestions, initialBlogPosts, initialDocuments, games, categories, initialNotifications, trendingTags, topUsers, initialStories } from './services/mockData';
import { Question, DocumentItem, Answer, BlogPost, User, Notification, Comment, Attachment, Story } from './types';
import { Search, Heart, MessageSquare, Download, Lock, Check, Eye, ChevronLeft, Send, Share2, Award, Calendar, Image as ImageIcon, Star, PenTool, Edit3, Camera, Gamepad2, Zap, Trophy, Flame, Sun, MoreHorizontal, Flag, MessageCircle, ThumbsUp, Hash, Users, PlusCircle, Smile, Video, Youtube, PlayCircle, BookOpen, ExternalLink, ArrowRight, X, ChevronRight, Home, Filter, Sparkles, BadgeCheck } from 'lucide-react';

// --- HELPER: TIME AGO ---
const timeAgo = (dateStr: string) => dateStr; 

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

// --- VIEW: CREATE POST/QUESTION ---
const CreateView = ({ type, onSubmit, currentUser }: { type: 'question' | 'blog', onSubmit: any, currentUser: User }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlType, setUrlType] = useState<'image'|'youtube'>('image');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, attachments });
    navigate(type === 'question' ? '/qa' : '/blog');
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
            <button type="submit" className="bg-rose-500 text-white px-8 py-2 rounded-lg font-bold shadow-md hover:bg-rose-600 transition-all">
              Đăng
            </button>
         </div>
      </form>
    </div>
  );
};

// --- VIEW: QA HUB (REDESIGNED) ---
const QAView = ({ questions }: { questions: Question[] }) => {
    const [filter, setFilter] = useState<'newest' | 'hot' | 'unanswered'>('newest');
    
    const sortedQuestions = [...questions].sort((a, b) => {
        if (filter === 'hot') return b.votes - a.votes;
        if (filter === 'unanswered') return a.answersCount - b.answersCount; // Ascending answers (0 first)
        return b.createdAt.localeCompare(a.createdAt); // Default newest
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
                                            <div className="text-lg font-bold text-slate-700">{q.votes}</div>
                                            <div className="text-[10px] font-medium">Vote</div>
                                        </div>
                                        <div className={`text-center px-2 py-1 rounded-lg ${q.answersCount > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'text-slate-400'}`}>
                                            <div className="text-lg font-bold">{q.answersCount}</div>
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
                                                {q.tags.map(t => (
                                                    <span key={t} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium hover:bg-rose-50 hover:text-rose-500">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <span>{q.createdAt}</span>
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

                {/* Right Sidebar (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Categories */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Hash size={20} className="text-rose-500"/> Chuyên mục
                        </h3>
                        <div className="space-y-2">
                            {categories.filter(c => c.type === 'question').map(c => (
                                <Link to={`/cat/${c.slug}`} key={c.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg group cursor-pointer">
                                    <span className="text-slate-600 font-medium group-hover:text-rose-500">{c.name}</span>
                                    <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-500">120+</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Top Experts */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Award size={20} className="text-blue-500"/> Chuyên gia hàng đầu
                        </h3>
                         <div className="space-y-4">
                            {topUsers.filter(u => u.role === 'expert').map(u => (
                                <div key={u.id} className="flex items-center gap-3">
                                    <img src={u.avatar} className="w-10 h-10 rounded-full border border-slate-100" />
                                    <div>
                                        <div className="font-bold text-sm text-slate-800 flex items-center gap-1">
                                            {u.name} <VerifiedBadge size={10} />
                                        </div>
                                        <div className="text-xs text-slate-500">{u.title}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- VIEW: PROFILE ---
const ProfileView = ({ user }: { user: User }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in pb-10">
       {/* Cover & Info */}
       <div className="bg-white rounded-b-3xl shadow-sm border border-slate-200 overflow-hidden -mt-4">
          <div className="h-48 sm:h-80 bg-slate-300 relative group">
             <img src={user.coverImage} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
             <button className="absolute bottom-4 right-4 bg-white/80 hover:bg-white p-2 rounded-lg text-slate-700 shadow-sm backdrop-blur-sm flex items-center gap-2 text-sm font-bold">
                <Camera size={18} /> <span>Chỉnh sửa ảnh bìa</span>
             </button>
          </div>
          <div className="px-6 pb-6 relative">
             <div className="flex flex-col sm:flex-row items-end sm:items-end gap-6 -mt-12 sm:-mt-16 mb-4 relative z-10">
                <div className="relative group">
                  <img src={user.avatar} className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-[6px] border-white shadow-md object-cover bg-white" />
                  <button className="absolute bottom-2 right-2 bg-slate-100 p-2 rounded-full border-2 border-white text-slate-600 hover:text-rose-500">
                    <Camera size={16} />
                  </button>
                </div>
                <div className="flex-1 text-center sm:text-left mb-2">
                   <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-2">
                     {user.name}
                     {user.role === 'expert' && <VerifiedBadge />}
                   </h1>
                   <p className="text-slate-500 text-lg font-medium">{user.bio || 'Thành viên tích cực'}</p>
                   <div className="flex items-center justify-center sm:justify-start gap-4 mt-2 text-sm text-slate-500 font-bold">
                      <span>1.2k Người theo dõi</span>
                      <span>•</span>
                      <span>15 Đang theo dõi</span>
                   </div>
                </div>
                <div className="flex gap-3 mb-4 w-full sm:w-auto">
                   <button className="flex-1 sm:flex-none bg-rose-500 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm hover:bg-rose-600 transition-colors flex items-center justify-center gap-2">
                      <Edit3 size={16} /> Chỉnh sửa trang cá nhân
                   </button>
                </div>
             </div>
             
             <div className="border-t border-slate-100 pt-4 mt-4">
                 <div className="flex gap-1 overflow-x-auto pb-2">
                    <button className="px-6 py-3 text-rose-500 font-bold border-b-2 border-rose-500 whitespace-nowrap">Bài viết</button>
                    <button className="px-6 py-3 text-slate-500 font-medium hover:bg-slate-50 rounded-lg whitespace-nowrap">Giới thiệu</button>
                    <button className="px-6 py-3 text-slate-500 font-medium hover:bg-slate-50 rounded-lg whitespace-nowrap">Bạn bè</button>
                    <button className="px-6 py-3 text-slate-500 font-medium hover:bg-slate-50 rounded-lg whitespace-nowrap">Ảnh</button>
                 </div>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Intro */}
          <div className="col-span-1 space-y-4">
             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-lg text-slate-800 mb-4">Giới thiệu</h3>
                <div className="space-y-3 text-sm text-slate-600">
                   <div className="flex items-center gap-2"><Trophy className="text-amber-500" size={20}/> <span>{user.points} Điểm uy tín</span></div>
                   <div className="flex items-center gap-2"><Flag className="text-slate-400" size={20}/> <span>Tham gia tháng 10/2023</span></div>
                   <div className="flex items-center gap-2"><Users className="text-slate-400" size={20}/> <span>Thành viên nhóm <strong>Ăn dặm</strong></span></div>
                </div>
             </div>
             
             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-lg text-slate-800">Ảnh</h3>
                   <span className="text-rose-500 text-sm cursor-pointer hover:underline">Xem tất cả</span>
                </div>
                <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden">
                   {[1,2,3,4,5,6].map(i => (
                     <div key={i} className="aspect-square bg-slate-100">
                        <img src={`https://picsum.photos/200?random=${i}`} className="w-full h-full object-cover" />
                     </div>
                   ))}
                </div>
             </div>
          </div>
          
          {/* Right Feed */}
          <div className="col-span-1 lg:col-span-2">
             {/* Feed posts placeholder */}
             <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                   <PenTool size={24} className="text-slate-300"/>
                </div>
                <p>Chưa có bài viết nào.</p>
             </div>
          </div>
       </div>
    </div>
  );
};


// --- COMPONENT: STORY CARD (DAILY TIPS) ---
const StoryCard = ({ story, onClick }: { story: Story, onClick: () => void }) => (
  <div onClick={onClick} className="relative flex-shrink-0 w-28 h-44 sm:w-32 sm:h-48 rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-lg transition-all border border-slate-100 hover:border-rose-200">
    <img src={story.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60"></div>
    <div className="absolute bottom-3 left-3 right-3">
       <p className="text-white text-xs font-bold leading-tight shadow-sm drop-shadow-md truncate">{story.userName}</p>
    </div>
    <div className={`absolute top-3 left-3 w-9 h-9 rounded-full border-2 ${story.isViewed ? 'border-slate-300' : 'border-rose-500'} overflow-hidden bg-white shadow-md p-0.5`}>
      <img src={story.userAvatar} className="w-full h-full object-cover rounded-full" />
    </div>
  </div>
);

// --- COMPONENT: FEED POST CARD ---
const PostCard = ({ 
  item, 
  type, 
  onLike,
  isHot 
}: { 
  item: Question | BlogPost, 
  type: 'question' | 'blog', 
  onLike: (id: string) => void,
  isHot?: boolean
}) => {
  const isQuestion = type === 'question';
  const q = item as Question;
  const p = item as BlogPost;
  
  const stats = {
    likes: isQuestion ? q.votes : p.likes,
    isLiked: !!(isQuestion ? q.isLiked : p.isLiked),
    comments: isQuestion ? q.answersCount : p.comments.length,
    views: item.views || 0,
    tags: isQuestion ? q.tags : [],
    category: isQuestion ? categories.find(c => c.id === q.categoryId) : categories.find(c => c.id === p.categoryId)
  };

  // Safe access to attachments
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
                   {stats.category && (
                      <>
                         <span className="text-slate-300">•</span>
                         <span className={`text-xs font-bold ${stats.category.color.split(' ')[1]} hover:underline cursor-pointer`}>
                            {stats.category.name}
                         </span>
                      </>
                   )}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                   <span>{item.createdAt}</span>
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
          
          {/* Media Display */}
          <Link to={isQuestion ? `/qa/${item.id}` : `/blog/${item.id}`} className="block">
             <MediaDisplay attachments={attachments} />
             {!attachments && !isQuestion && p.thumbnail && (
                  <img src={p.thumbnail} className="w-full h-64 object-cover rounded-xl mt-2 border border-slate-100" />
             )}
          </Link>
       </div>

       {/* Tags */}
       {isQuestion && q.tags.length > 0 && (
         <div className="px-4 mt-3 flex gap-2">
           {q.tags.map(t => (
             <span key={t} className="text-xs text-blue-500 hover:underline cursor-pointer bg-blue-50 px-2 py-1 rounded-full border border-blue-50">#{t.replace('#','')}</span>
           ))}
         </div>
       )}

       {/* Stats Bar */}
       <div className="px-4 py-3 flex items-center justify-between text-xs text-slate-500 border-b border-slate-50 mt-2">
          <div className="flex items-center gap-1">
             <div className="flex -space-x-1">
                <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center border border-white"><Heart size={8} fill="white" stroke="none" /></div>
                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center border border-white"><ThumbsUp size={8} fill="white" stroke="none" /></div>
             </div>
             <span className="ml-1 hover:underline cursor-pointer font-bold">{stats.likes}</span>
          </div>
          <div className="flex gap-3 font-bold">
             <span className="hover:underline cursor-pointer">{stats.comments} bình luận</span>
             <span className="hover:underline cursor-pointer">5 chia sẻ</span>
          </div>
       </div>

       {/* Action Buttons */}
       <div className="grid grid-cols-3 px-2 py-1 gap-1">
          <button 
             onClick={() => onLike(item.id)}
             className={`flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-colors ${stats.isLiked ? 'text-rose-500 bg-rose-50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
             <Heart size={18} fill={stats.isLiked ? "currentColor" : "none"} />
             <span>Thích</span>
          </button>
          <Link 
             to={isQuestion ? `/qa/${item.id}` : `/blog/${item.id}`}
             className="flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm text-slate-500 hover:bg-slate-50 transition-colors"
          >
             <MessageCircle size={18} />
             <span>Bình luận</span>
          </Link>
          <button className="flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm text-slate-500 hover:bg-slate-50 transition-colors">
             <Share2 size={18} />
             <span>Chia sẻ</span>
          </button>
       </div>
    </div>
  );
};


// --- VIEW: HOME (REMASTERED V2) ---
const HomeView = ({ questions, posts, currentUser, onLikeQ, onLikeP, stories, onCreateStory, onViewStory }: { 
  questions: Question[], 
  posts: BlogPost[], 
  currentUser: User,
  onLikeQ: (id: string) => void,
  onLikeP: (id: string) => void,
  stories: Story[],
  onCreateStory: (img: string) => void,
  onViewStory: (story: Story) => void
}) => {
  const [activeTypeTab, setActiveTypeTab] = useState<'all' | 'qa' | 'blog'>('all');
  const [activeSortTab, setActiveSortTab] = useState<'newest' | 'trending'>('newest');

  const handleCreateStoryClick = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const url = URL.createObjectURL(e.target.files[0]);
          onCreateStory(url);
      }
  }

  // --- SMART FEED LOGIC ---
  const getEngagementScore = (item: any) => {
     // Score = Likes + Comments*2 + Views/100
     const likes = item.votes || item.likes || 0;
     const comments = item.answersCount || item.comments?.length || 0;
     const views = item.views || 0;
     return likes + (comments * 2) + (views / 100);
  }

  const rawFeed = [
    ...questions.map(q => ({ ...q, type: 'question' as const, score: getEngagementScore(q) })),
    ...posts.filter(p => p.status === 'published').map(p => ({ ...p, type: 'blog' as const, score: getEngagementScore(p) }))
  ];

  // 1. Filter by Type
  const typeFilteredFeed = activeTypeTab === 'all' 
     ? rawFeed 
     : rawFeed.filter(item => item.type === activeTypeTab);

  // 2. Sort by Logic
  const finalFeed = [...typeFilteredFeed].sort((a, b) => {
      if (activeSortTab === 'trending') {
          return b.score - a.score;
      }
      return b.createdAt.localeCompare(a.createdAt); // Newest
  });

  const topViewed = [...rawFeed].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  // Desktop Sidebar Menu Item
  const SidebarItem = ({ to, icon: Icon, label, desc }: { to: string, icon: any, label: string, desc: string }) => {
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
      
      {/* LEFT SIDEBAR (MAIN NAVIGATION) - 3 Columns width */}
      <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 h-fit">
         {/* User Mini Card */}
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

         {/* MAIN NAVIGATION MENU */}
         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 space-y-1">
            <SidebarItem to="/" icon={Home} label="Trang chủ" desc="Bảng tin tổng hợp" />
            <SidebarItem to="/qa" icon={MessageCircle} label="Góc Hỏi Đáp" desc="Thảo luận chuyên gia" />
            <SidebarItem to="/blog" icon={PenTool} label="Blog Tâm Sự" desc="Chia sẻ câu chuyện" />
            <SidebarItem to="/docs" icon={BookOpen} label="Kho Tài Liệu" desc="Ebook, thực đơn" />
            <SidebarItem to="/games" icon={Gamepad2} label="Góc Bé Chơi" desc="Vừa học vừa chơi" />
         </div>
      </div>

      {/* CENTER FEED - 6 Columns width */}
      <div className="lg:col-span-6 col-span-1 space-y-6">
        
        {/* STORIES STRIP */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
           {/* Create Story */}
           <div className="relative flex-shrink-0 w-28 h-44 sm:w-32 sm:h-48 rounded-2xl bg-white border-2 border-dashed border-rose-300 overflow-hidden cursor-pointer group flex flex-col items-center justify-center hover:bg-rose-50 transition-colors">
                <input type="file" accept="image/*" onChange={handleCreateStoryClick} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 mb-2 group-hover:scale-110 transition-transform">
                  <PlusCircle size={24}/>
                </div>
                <span className="text-xs font-bold text-rose-500">Tạo tin</span>
           </div>
           
           {stories.map(story => (
               <StoryCard key={story.id} story={story} onClick={() => onViewStory(story)} />
           ))}
        </div>

        {/* MINIMALIST CREATE POST INPUT */}
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

        {/* DYNAMIC SMART FEED TABS */}
        <div className="flex flex-col gap-3">
             {/* Main Type Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveTypeTab('all')} className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeTypeTab === 'all' ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>Tất cả</button>
                <button onClick={() => setActiveTypeTab('qa')} className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeTypeTab === 'qa' ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>Hỏi đáp</button>
                <button onClick={() => setActiveTypeTab('blog')} className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeTypeTab === 'blog' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>Blog chia sẻ</button>
            </div>

            {/* Sort/Filter Sub-Tabs */}
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
                    item={item as any} 
                    type={item.type}
                    onLike={item.type === 'question' ? onLikeQ : onLikeP}
                    isHot={activeSortTab === 'trending' && item.score > 20} // Logic for hot badge
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

      {/* RIGHT SIDEBAR (Widgets) - 3 Columns width */}
      <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 h-fit">
         
         {/* GAMES WIDGET (NEW) */}
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

         {/* TOP VIEWED WIDGET */}
         <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
             <div className="flex items-center gap-2 mb-4">
                 <div className="p-1.5 bg-yellow-100 text-yellow-600 rounded-lg">
                    <Trophy size={18} fill="currentColor" />
                 </div>
                 <h3 className="font-bold text-slate-800 text-sm">Top xem nhiều nhất</h3>
             </div>
             <div className="space-y-4">
                 {topViewed.map((item, index) => (
                     <Link to={item.type === 'question' ? `/qa/${item.id}` : `/blog/${item.id}`} key={item.id} className="flex gap-3 group">
                         <div className="text-2xl font-bold text-slate-200 group-hover:text-yellow-400 transition-colors font-mono">0{index + 1}</div>
                         <div>
                             <h4 className="font-bold text-sm text-slate-700 leading-snug line-clamp-2 group-hover:text-rose-500 transition-colors">{item.title}</h4>
                             <div className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Eye size={10}/> {item.views} lượt xem</div>
                         </div>
                     </Link>
                 ))}
             </div>
         </div>

         {/* FEATURED GROUPS WIDGET */}
         <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-slate-800 text-sm">Cộng đồng nổi bật</h3>
               <Link to="#" className="text-xs text-rose-500 hover:underline">Xem thêm</Link>
            </div>
            <div className="space-y-3">
               {categories.slice(0, 3).map(cat => (
                  <Link to={`/cat/${cat.slug}`} key={cat.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                     <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center text-sm font-bold shadow-sm`}>
                           {cat.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-slate-700 text-sm group-hover:text-rose-500">{cat.name}</div>
                            <div className="text-[10px] text-slate-400">1.2k bài viết</div>
                        </div>
                     </div>
                  </Link>
               ))}
            </div>
         </div>

         {/* PROMO BANNER (AD) */}
         <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
             <img src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent p-5 flex flex-col justify-end text-white">
                 <span className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded w-fit mb-2">QUẢNG CÁO</span>
                 <h3 className="font-bold text-lg leading-tight mb-2">Sữa Organic cho bé - Tăng đề kháng vượt trội</h3>
                 <button className="bg-white text-slate-900 font-bold text-xs py-2 rounded-lg mt-2 flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white transition-colors">
                    Tìm hiểu ngay <ArrowRight size={14}/>
                 </button>
             </div>
         </div>

          {/* FOOTER MINI */}
         <div className="text-[11px] text-slate-400 px-2 leading-relaxed text-center">
            <div className="flex flex-wrap justify-center gap-2 mb-2">
                <a href="#" className="hover:text-rose-500">Quyền riêng tư</a>
                <span>•</span>
                <a href="#" className="hover:text-rose-500">Điều khoản</a>
                <span>•</span>
                <a href="#" className="hover:text-rose-500">Quảng cáo</a>
            </div>
            <span>Asking.vn © 2024 - Made with ❤️</span>
         </div>
      </div>
    </div>
  );
};

// --- VIEW: Q&A DETAIL ---
const QADetailView = ({ 
  questions, 
  currentUser, 
  onLike, 
  onAddAnswer, 
  onCommentAnswer 
}: { 
  questions: Question[], 
  currentUser: User, 
  onLike: (id: string) => void,
  onAddAnswer: (qid: string, content: string) => void,
  onCommentAnswer: (qid: string, aid: string, content: string) => void
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const question = questions.find(q => q.id === id);
  const [newAnswer, setNewAnswer] = useState('');

  if (!question) return <div>Not found</div>;

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAnswer.trim()) {
      onAddAnswer(question.id, newAnswer);
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
               <div className="text-xs text-slate-400">{question.createdAt}</div>
            </div>
            {question.author.id !== currentUser.id && (
               <button className="ml-auto text-rose-500 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold hover:bg-rose-50">+ Theo dõi</button>
            )}
         </div>

         <h1 className="text-2xl font-bold text-slate-800 mb-4 leading-tight">{question.title}</h1>
         
         <div className="text-slate-700 leading-relaxed text-base mb-4 whitespace-pre-line">
           {question.content}
         </div>
         
         <MediaDisplay attachments={question.attachments} />

         <div className="flex gap-2 mb-6 mt-4">
            {question.tags.map(t => <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">{t}</span>)}
         </div>

         <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <LikeButton liked={!!question.isLiked} count={question.votes} onToggle={() => onLike(question.id)} />
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
        
        {question.answers?.map((ans) => {
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
                       <div className="text-xs text-slate-400">{ans.createdAt}</div>
                     </div>
                   </div>
                   {ans.isAccepted && (
                     <div className="text-emerald-600 flex items-center gap-1 text-xs font-bold bg-emerald-100 px-2 py-1 rounded-full border border-emerald-200">
                       <Check size={14} /> Đã chấp nhận
                     </div>
                   )}
                 </div>
                 
                 <p className="text-slate-700 text-sm leading-relaxed mb-4">{ans.content}</p>
                 
                 {/* Simple footer for answer */}
                 <div className="flex items-center gap-4 text-xs text-slate-500 font-bold border-t border-slate-50 pt-2 mb-2">
                    <button className="hover:text-rose-500 flex items-center gap-1"><Heart size={14}/> {ans.votes}</button>
                    <button className="hover:text-rose-500">Trả lời</button>
                 </div>
    
                 {/* Nested Comments for Answers */}
                 <CommentSection 
                    comments={ans.comments || []} 
                    currentUser={currentUser}
                    onAddComment={(content) => onCommentAnswer(question.id, ans.id, content)}
                 />
              </div>
            );
        })}
      </div>
    </div>
  );
};

// --- VIEW: BLOG DETAIL ---
const BlogDetailView = ({ 
  posts, 
  currentUser, 
  onLike, 
  onComment,
  onReplyComment
}: { 
  posts: BlogPost[], 
  currentUser: User, 
  onLike: (id: string) => void,
  onComment: (postId: string, content: string) => void,
  onReplyComment: (postId: string, commentId: string, content: string) => void
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find(p => p.id === id);

  if (!post) return <div>Not found</div>;

  return (
    <div className="max-w-3xl mx-auto pb-10 animate-fade-in">
       <button onClick={() => navigate('/')} className="text-slate-500 hover:text-rose-500 flex items-center gap-1 text-sm font-bold mb-6">
         <ChevronLeft size={16} /> Quay lại
       </button>

       <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 mb-6">
          <div className="aspect-video w-full relative">
            <img src={post.thumbnail} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
              <div className="w-full">
                <span className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded mb-3 inline-block shadow-sm">
                  {categories.find(c => c.id === post.categoryId)?.name}
                </span>
                <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight mb-4 text-shadow-sm">{post.title}</h1>
                <div className="flex items-center gap-3 text-white/90 text-sm">
                   <img src={post.author.avatar} className="w-10 h-10 rounded-full border-2 border-white" />
                   <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                         <span className="font-bold text-white">{post.author.name}</span>
                         {post.author.role === 'expert' && <VerifiedBadge />}
                      </div>
                      <span className="text-xs text-white/80">{post.createdAt} • {post.views} lượt xem</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div 
              className="prose prose-slate prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600 max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />

            <MediaDisplay attachments={post.attachments} />
            
            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <LikeButton liked={!!post.isLiked} count={post.likes} onToggle={() => onLike(post.id)} size={24} />
                  <div className="text-slate-500 font-bold flex items-center gap-2">
                     <MessageSquare size={24} /> {post.comments.length}
                  </div>
               </div>
               <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-blue-100">
                  <Share2 size={18} /> Chia sẻ
               </button>
            </div>
          </div>
       </div>

       {/* Comments Area */}
       <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 text-lg mb-4">Bình luận bài viết</h3>
          <CommentSection 
             comments={post.comments} 
             currentUser={currentUser}
             onAddComment={(content, parentId) => {
                if(parentId) onReplyComment(post.id, parentId, content);
                else onComment(post.id, content);
             }}
          />
       </div>
    </div>
  );
};

// --- VIEW: DOCUMENT DETAIL (New) ---
const DocDetailView = ({ documents, userPoints, deductPoints }: { documents: DocumentItem[], userPoints: number, deductPoints: any }) => {
  const { id } = useParams();
  const doc = documents.find(d => d.id === id);
  const [rating, setRating] = useState(0);

  if(!doc) return <div>Not Found</div>;

  return (
     <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
        <div className="md:col-span-1">
           <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-4">
              <img src={doc.thumbnail} className="w-full rounded-xl" />
           </div>
           <button className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-md hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
             <Download /> Tải xuống {doc.isVip ? `(${doc.pointsRequired} điểm)` : '(Miễn phí)'}
           </button>
        </div>
        <div className="md:col-span-2 space-y-6">
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex gap-2 mb-2">
                 <span className={`px-2 py-1 rounded text-xs font-bold text-white ${doc.fileType === 'pdf' ? 'bg-red-500' : 'bg-blue-500'}`}>{doc.fileType.toUpperCase()}</span>
                 {doc.isVip && <span className="bg-amber-100 text-amber-600 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Lock size={12}/> VIP</span>}
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-4">{doc.title}</h1>
              <p className="text-slate-600 mb-6">{doc.description}</p>
              
              <div className="flex items-center gap-6 border-t border-slate-100 pt-4">
                 <div className="text-center">
                    <div className="font-bold text-xl text-slate-800">{doc.rating}</div>
                    <div className="flex text-amber-400"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/></div>
                    <div className="text-xs text-slate-400">Đánh giá</div>
                 </div>
                 <div className="h-8 w-px bg-slate-200"></div>
                 <div className="text-center">
                    <div className="font-bold text-xl text-slate-800">{doc.downloads}</div>
                    <div className="text-xs text-slate-400">Lượt tải</div>
                 </div>
              </div>
           </div>

           {/* Review Section */}
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">Đánh giá tài liệu</h3>
              <div className="flex gap-2 mb-4">
                 {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={() => setRating(s)} className={`${rating >= s ? 'text-amber-400' : 'text-slate-300'}`}>
                       <Star fill={rating >= s ? "currentColor" : "none"} size={28} />
                    </button>
                 ))}
              </div>
              <textarea className="w-full bg-slate-50 rounded-xl p-3 text-sm outline-none border border-slate-200 focus:border-emerald-300" placeholder="Viết đánh giá của bạn..."></textarea>
              <button className="mt-3 bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold text-sm">Gửi đánh giá</button>
           </div>
        </div>
     </div>
  )
}

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  // --- STATE MANAGEMENT (LIFTED) ---
  const [user, setUser] = useState(currentUser);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [posts, setPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [notifs, setNotifs] = useState<Notification[]>(initialNotifications);
  const [docs, setDocs] = useState<DocumentItem[]>(initialDocuments);
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [viewingStory, setViewingStory] = useState<Story | null>(null);

  // --- REAL-TIME SIMULATION ---
  useEffect(() => {
    // Simulate incoming notifications randomly
    const interval = setInterval(() => {
      const chance = Math.random();
      if (chance > 0.7) { // 30% chance every check
         const events = [
            { type: 'like' as const, content: 'đã thích bài viết của bạn', link: '#' },
            { type: 'comment' as const, content: 'đã bình luận vào bài viết', link: '#' },
            { type: 'system' as const, content: 'Có tài liệu mới: Thực đơn ăn dặm tuần 2', link: '/docs' }
         ];
         const randomEvent = events[Math.floor(Math.random() * events.length)];
         const randomUser = topUsers[Math.floor(Math.random() * topUsers.length)];
         
         const newNotif: Notification = {
            id: `sys_n_${Date.now()}`,
            userId: user.id,
            actorName: randomEvent.type === 'system' ? 'Hệ thống' : randomUser.name,
            type: randomEvent.type,
            content: randomEvent.content,
            link: randomEvent.link,
            isRead: false,
            createdAt: 'Vừa xong'
         };
         setNotifs(prev => [newNotif, ...prev]);
      }
    }, 15000); // Check every 15s
    
    return () => clearInterval(interval);
  }, []);

  // --- ACTIONS ---
  const handleLikeQuestion = (id: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, votes: q.isLiked ? q.votes - 1 : q.votes + 1, isLiked: !q.isLiked } : q));
  };

  const handleLikePost = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked } : p));
  };

  const addNotification = (type: Notification['type'], content: string, link: string) => {
    const newNotif: Notification = {
      id: `n${Date.now()}`,
      userId: user.id,
      actorName: 'Bạn', // Simplified
      type,
      content,
      link,
      isRead: false,
      createdAt: 'Vừa xong'
    };
    setNotifs(prev => [newNotif, ...prev]);
  };

  const handleAddAnswer = (qid: string, content: string) => {
    const newAnswer: Answer = {
      id: `a${Date.now()}`,
      userId: user.id,
      content,
      votes: 0,
      isAccepted: false,
      createdAt: 'Vừa xong',
      author: user,
      comments: []
    };
    setQuestions(prev => prev.map(q => q.id === qid ? { ...q, answers: [...(q.answers || []), newAnswer], answersCount: q.answersCount + 1 } : q));
    addNotification('reply', 'đã trả lời một câu hỏi', `/qa/${qid}`);
  };

  const handleCommentAnswer = (qid: string, aid: string, content: string) => {
     const newComment: Comment = {
        id: `c${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content,
        createdAt: 'Vừa xong'
     };
     setQuestions(prev => prev.map(q => {
        if (q.id === qid && q.answers) {
           const updatedAnswers = q.answers.map(a => a.id === aid ? { ...a, comments: [...(a.comments || []), newComment] } : a);
           return { ...q, answers: updatedAnswers };
        }
        return q;
     }));
  }

  const handleCommentPost = (postId: string, content: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content,
      createdAt: 'Vừa xong',
      replies: []
    };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
    addNotification('comment', 'đã bình luận bài viết', `/blog/${postId}`);
  };

  const handleReplyPostComment = (postId: string, commentId: string, content: string) => {
    const newReply: Comment = {
      id: `r${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content,
      createdAt: 'Vừa xong'
    };
    setPosts(prev => prev.map(p => {
       if (p.id === postId) {
          const updatedComments = p.comments.map(c => c.id === commentId ? { ...c, replies: [...(c.replies || []), newReply] } : c);
          return { ...p, comments: updatedComments };
       }
       return p;
    }));
  }

  const handleCreateContent = (data: any) => {
    if (data.type === 'question') {
       // Add question logic
       const newQ: Question = {
         id: `q${Date.now()}`,
         userId: user.id,
         title: data.title,
         content: data.content,
         attachments: data.attachments || [],
         categoryId: 'c1',
         tags: ['#new'],
         votes: 0,
         views: 0,
         answersCount: 0,
         createdAt: 'Vừa xong',
         author: user,
         answers: []
       };
       setQuestions(prev => [newQ, ...prev]);
    } else {
       // Add blog logic (Pending)
       const newP: BlogPost = {
          id: `b${Date.now()}`,
          title: data.title,
          excerpt: data.content.substring(0, 100) + '...',
          content: `<p>${data.content}</p>`,
          thumbnail: data.attachments && data.attachments[0]?.url ? data.attachments[0].url : 'https://via.placeholder.com/800x400',
          attachments: data.attachments || [],
          categoryId: 'c3',
          author: user,
          createdAt: 'Vừa xong',
          views: 0,
          status: 'pending',
          comments: [],
          likes: 0
       };
       setPosts(prev => [newP, ...prev]);
       alert("Bài viết của bạn đã được gửi và đang chờ kiểm duyệt!");
    }
  };

  const handleCreateStory = (imgUrl: string) => {
      const newStory: Story = {
          id: `s${Date.now()}`,
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          imageUrl: imgUrl,
          createdAt: 'Vừa xong',
          isViewed: false
      };
      setStories(prev => [newStory, ...prev]);
  }

  return (
    <HashRouter>
      <Layout 
        user={user} 
        notifications={notifs} 
        unreadCount={notifs.filter(n => !n.isRead).length}
        onReadNotif={(id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))}
      >
        <Routes>
          <Route path="/" element={
            <HomeView 
                questions={questions} 
                posts={posts.filter(p => p.status === 'published')} 
                currentUser={user} 
                onLikeQ={handleLikeQuestion} 
                onLikeP={handleLikePost} 
                stories={stories}
                onCreateStory={handleCreateStory}
                onViewStory={setViewingStory}
            />
          } />
          
          <Route path="/qa" element={<QAView questions={questions} />} />
          <Route path="/qa/:id" element={<QADetailView questions={questions} currentUser={user} onLike={handleLikeQuestion} onAddAnswer={handleAddAnswer} onCommentAnswer={handleCommentAnswer} />} />
          <Route path="/qa/create" element={<CreateView type="question" currentUser={user} onSubmit={(data: any) => handleCreateContent({...data, type: 'question'})} />} />
          
          <Route path="/blog" element={<div className="animate-fade-in"><h1 className="text-2xl font-bold mb-4">Blog</h1>{posts.filter(p => p.status === 'published').map(p => <Link key={p.id} to={`/blog/${p.id}`} className="block bg-white p-4 mb-4 rounded-xl border border-slate-200 hover:shadow-md">{p.title}</Link>)}</div>} />
          <Route path="/blog/:id" element={<BlogDetailView posts={posts} currentUser={user} onLike={handleLikePost} onComment={handleCommentPost} onReplyComment={handleReplyPostComment} />} />
          <Route path="/blog/create" element={<CreateView type="blog" currentUser={user} onSubmit={(data: any) => handleCreateContent({...data, type: 'blog'})} />} />
          
          <Route path="/docs" element={<div className="animate-fade-in"><h1 className="text-2xl font-bold mb-4">Tài liệu</h1>{docs.map(d => <Link key={d.id} to={`/docs/${d.id}`} className="block bg-white p-4 mb-4 rounded-xl border border-slate-200 hover:shadow-md">{d.title}</Link>)}</div>} />
          <Route path="/docs/:id" element={<DocDetailView documents={docs} userPoints={user.points} deductPoints={() => true} />} />
          
          <Route path="/games" element={<div className="max-w-4xl mx-auto space-y-6"><h1 className="text-2xl font-bold text-slate-800">Góc bé chơi</h1><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><CountingGame /><ColoringGame /></div></div>} />
          <Route path="/profile" element={<ProfileView user={user} />} />
        </Routes>

        {viewingStory && (
            <StoryViewer story={viewingStory} onClose={() => setViewingStory(null)} />
        )}

      </Layout>
    </HashRouter>
  );
};

export default App;
