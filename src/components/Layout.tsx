import React, { useState } from 'react';
import { Home, MessageCircle, BookOpen, Gamepad2, User as UserIcon, Bell, Facebook, Instagram, Youtube, Menu, LogOut, Search, Heart, LogIn } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { User, Notification } from '../types';
import { logoutUser } from '../services/firebaseService';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  notifications: Notification[];
  unreadCount: number;
  onReadNotif: (id: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, notifications, unreadCount, onReadNotif }) => {
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  const handleLogout = async () => {
      try {
          await logoutUser();
          window.location.reload();
      } catch (error) {
          console.error("Logout failed", error);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 md:pb-0 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-b border-slate-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group mr-8">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-rose-200 group-hover:scale-105 transition-transform">
                A
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full border border-white animate-pulse"></div>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                Asking.vn
              </span>
              <span className="block text-[10px] font-bold text-rose-500 tracking-wider uppercase -mt-0.5">Mẹ hỏi - Bé chơi</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-xl relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400 group-focus-within:text-rose-500 transition-colors"/>
            </div>
            <input 
              type="text" 
              placeholder="Tìm kiếm câu hỏi, bài viết, tài liệu..." 
              className="w-full bg-slate-100/80 border-transparent border-2 rounded-full pl-10 pr-5 py-2.5 text-sm focus:bg-white focus:border-rose-100 focus:ring-4 focus:ring-rose-50 outline-none transition-all placeholder-slate-400 font-medium text-slate-700"
            />
          </div>

          {/* Desktop Actions */}
          <div className="flex items-center gap-3 ml-4">
            
            {user ? (
                <>
                {/* Notification Bell */}
                <div className="relative">
                <button 
                    onClick={() => setShowNotif(!showNotif)}
                    className={`p-2.5 rounded-full transition-all active:scale-95 ${showNotif ? 'bg-rose-100 text-rose-600' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                >
                    <Bell size={20} fill={showNotif ? "currentColor" : "none"} />
                    {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                        {unreadCount}
                    </span>
                    )}
                </button>

                {/* Notification Dropdown */}
                {showNotif && (
                    <div className="absolute top-full right-[-60px] sm:right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in z-50">
                    <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-white">
                        <h3 className="font-bold text-slate-800 text-lg">Thông báo</h3>
                        <button className="text-xs font-bold text-rose-500 hover:bg-rose-50 px-2 py-1 rounded">Đánh dấu đã đọc</button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                            <Bell size={32} />
                            </div>
                            <p className="text-slate-500 text-sm">Chưa có thông báo nào</p>
                        </div>
                        ) : (
                        notifications.map(notif => (
                            <div 
                            key={notif.id} 
                            onClick={() => { onReadNotif(notif.id); setShowNotif(false); }}
                            className={`p-4 flex gap-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors ${!notif.isRead ? 'bg-rose-50/30' : ''}`}
                            >
                            <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                {/* Placeholder for actor avatar */}
                                <div className="w-full h-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white font-bold text-xs">
                                    {notif.actorName.charAt(0)}
                                </div>
                                </div>
                                {notif.type === 'like' && <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white p-0.5 rounded-full border-2 border-white"><div className="w-3 h-3 flex items-center justify-center"><Heart size={8} fill="white" /></div></div>}
                                {notif.type === 'comment' && <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-full border-2 border-white"><div className="w-3 h-3 flex items-center justify-center"><MessageCircle size={8} fill="white" /></div></div>}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-700 leading-snug">
                                <span className="font-bold text-slate-900">{notif.actorName}</span> {notif.content}
                                </p>
                                <span className="text-xs text-rose-500 font-bold mt-1 block">{notif.createdAt}</span>
                            </div>
                            {!notif.isRead && <div className="w-2 h-2 rounded-full bg-rose-500 mt-2"></div>}
                            </div>
                        ))
                        )}
                    </div>
                    <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                        <Link to="/notifications" className="text-xs font-bold text-slate-500 hover:text-rose-500">Xem tất cả thông báo</Link>
                    </div>
                    </div>
                )}
                </div>
                
                {/* User Avatar & Menu */}
                <div className="relative">
                    <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 pl-2">
                        <div className="relative group cursor-pointer">
                            <img 
                            src={user.avatar} 
                            alt="User" 
                            className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                    </button>
                    {showUserMenu && (
                         <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
                             <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium">Trang cá nhân</Link>
                             <div className="border-t border-slate-100 my-1"></div>
                             <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 font-bold flex items-center gap-2">
                                 <LogOut size={16} /> Đăng xuất
                             </button>
                         </div>
                    )}
                </div>
                </>
            ) : (
                <div className="flex items-center gap-2">
                    <button className="hidden sm:block text-slate-600 font-bold text-sm px-4 py-2 hover:bg-slate-100 rounded-lg">Đăng ký</button>
                    <button className="bg-rose-500 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-rose-600 transition-all flex items-center gap-2">
                        <LogIn size={18} /> Đăng nhập
                    </button>
                </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-0 sm:px-4 py-6 flex-grow max-w-7xl">
        {children}
      </main>

      {/* Footer (Desktop) */}
      <footer className="hidden md:block bg-white border-t border-slate-200 pt-12 pb-8 mt-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white font-bold text-lg shadow-md">A</div>
                <span className="text-xl font-extrabold text-slate-800">Asking.vn</span>
              </Link>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Nền tảng cộng đồng Mẹ & Bé văn minh, hiện đại. Nơi chia sẻ kiến thức nuôi dạy con khoa học và yêu thương.
              </p>
              <div className="flex gap-3">
                <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-all"><Facebook size={18} /></button>
                <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-pink-600 hover:text-white transition-all"><Instagram size={18} /></button>
                <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-red-600 hover:text-white transition-all"><Youtube size={18} /></button>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-5">Khám phá</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li><Link to="/qa" className="hover:text-rose-500 flex items-center gap-2 transition-colors">Hỏi đáp chuyên gia</Link></li>
                <li><Link to="/blog" className="hover:text-rose-500 flex items-center gap-2 transition-colors">Blog chia sẻ</Link></li>
                <li><Link to="/docs" className="hover:text-rose-500 flex items-center gap-2 transition-colors">Thư viện tài liệu</Link></li>
                <li><Link to="/games" className="hover:text-rose-500 flex items-center gap-2 transition-colors">Góc bé chơi</Link></li>
              </ul>
            </div>
            
             <div>
              <h4 className="font-bold text-slate-900 mb-5">Hỗ trợ & Chính sách</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li><a href="#" className="hover:text-rose-500 transition-colors">Điều khoản sử dụng</a></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">Quy tắc cộng đồng</a></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">Liên hệ quảng cáo</a></li>
              </ul>
            </div>

             <div>
              <h4 className="font-bold text-slate-900 mb-5">Tải ứng dụng</h4>
              <p className="text-xs text-slate-500 mb-4">Trải nghiệm tốt hơn trên di động</p>
              <div className="flex flex-col gap-3">
                 <button className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                    <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">🍎</div>
                    <div className="flex flex-col items-start">
                        <span className="text-[9px] font-normal opacity-80">Download on the</span>
                        <span className="text-sm">App Store</span>
                    </div>
                 </button>
                 <button className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                     <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">▶️</div>
                    <div className="flex flex-col items-start">
                        <span className="text-[9px] font-normal opacity-80">Get it on</span>
                        <span className="text-sm">Google Play</span>
                    </div>
                 </button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-slate-400 font-medium">
                © 2024 Asking.vn - Nền tảng cộng đồng Mẹ & Bé. All rights reserved.
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Systems Operational
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 flex justify-around items-center h-16 z-50 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
        <Link to="/" className={`flex flex-col items-center gap-1 w-1/5 py-1 ${isActive('/') ? 'text-rose-500' : 'text-slate-400'}`}>
          <Home size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Trang chủ</span>
        </Link>
        <Link to="/qa" className={`flex flex-col items-center gap-1 w-1/5 py-1 ${isActive('/qa') ? 'text-rose-500' : 'text-slate-400'}`}>
          <MessageCircle size={24} strokeWidth={isActive('/qa') ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Hỏi đáp</span>
        </Link>
        <Link to="/docs" className={`flex flex-col items-center gap-1 w-1/5 py-1 ${isActive('/docs') ? 'text-rose-500' : 'text-slate-400'}`}>
          <BookOpen size={24} strokeWidth={isActive('/docs') ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Tài liệu</span>
        </Link>
         <Link to="/games" className={`flex flex-col items-center gap-1 w-1/5 py-1 ${isActive('/games') ? 'text-rose-500' : 'text-slate-400'}`}>
          <Gamepad2 size={24} strokeWidth={isActive('/games') ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Game</span>
        </Link>
         <Link to="/profile" className={`flex flex-col items-center gap-1 w-1/5 py-1 ${isActive('/profile') ? 'text-rose-500' : 'text-slate-400'}`}>
          <div className={`p-0.5 rounded-full border-2 ${isActive('/profile') ? 'border-rose-500' : 'border-transparent'}`}>
             {user ? <img src={user.avatar} className="w-6 h-6 rounded-full" /> : <UserIcon size={24} />}
          </div>
          <span className="text-[10px] font-bold">Tôi</span>
        </Link>
      </nav>
    </div>
  );
};

export default Layout;