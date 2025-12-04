
import { User, UserRole, Category, Question, BlogPost, DocumentItem, Game, Notification, Story } from '../types';

// Mock Users
export const currentUser: User = {
  id: 'u1',
  name: 'Mẹ Bắp',
  email: 'mebap@asking.vn',
  role: UserRole.USER,
  points: 150,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  coverImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  bio: 'Mẹ bỉm sữa 9x, yêu con, yêu bếp, nghiện shopping.'
};

export const expertUser: User = {
  id: 'u2',
  name: 'BS. Hương',
  email: 'bshuong@asking.vn',
  role: UserRole.EXPERT,
  points: 1000,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  title: 'Chuyên khoa Nhi',
  coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  bio: 'Bác sĩ Nhi khoa với 10 năm kinh nghiệm. Luôn lắng nghe và chia sẻ.'
};

export const regularUser: User = {
  id: 'u3',
  name: 'Mẹ Sóc',
  email: 'mesoc@asking.vn',
  role: UserRole.USER,
  points: 45,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liliana',
  coverImage: 'https://images.unsplash.com/photo-1505377059067-e285a7bac49b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
};

// Top Users for Sidebar
export const topUsers: User[] = [
  expertUser,
  {
    id: 'u4',
    name: 'Mẹ Cherry',
    email: 'cherry@asking.vn',
    role: UserRole.USER,
    points: 850,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha',
    title: 'Hot Mom'
  },
  {
    id: 'u5',
    name: 'Bố Gấu',
    email: 'bogau@asking.vn',
    role: UserRole.USER,
    points: 720,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bear',
    title: 'Bố đảm đang'
  }
];

// Trending Tags
export const trendingTags = [
  { id: 't1', name: '#AnDamKieuNhat', count: 1205 },
  { id: 't2', name: '#KhungHoangTuoiLen3', count: 850 },
  { id: 't3', name: '#ReviewBimSua', count: 640 },
  { id: 't4', name: '#ThaiGiao', count: 520 },
  { id: 't5', name: '#BenhVatMuaDong', count: 480 },
];

// Mock Categories
export const categories: Category[] = [
  { id: 'c1', name: 'Mang thai', slug: 'mang-thai', type: 'question', color: 'bg-rose-100 text-rose-600' },
  { id: 'c2', name: 'Dinh dưỡng', slug: 'dinh-duong', type: 'question', color: 'bg-emerald-100 text-emerald-600' },
  { id: 'c3', name: 'Giáo dục sớm', slug: 'giao-duc-som', type: 'blog', color: 'bg-blue-100 text-blue-600' },
  { id: 'c4', name: 'Tài liệu VIP', slug: 'tai-lieu-vip', type: 'document', color: 'bg-amber-100 text-amber-600' },
  { id: 'c5', name: 'Tâm sự', slug: 'tam-su', type: 'question', color: 'bg-purple-100 text-purple-600' },
];

// Mock Stories
export const initialStories: Story[] = [
  {
    id: 's1',
    userId: 'u2',
    userName: 'BS. Hương',
    userAvatar: expertUser.avatar,
    imageUrl: 'https://images.unsplash.com/photo-1543353071-873f17a7a088',
    createdAt: '2 giờ trước',
    isViewed: false
  },
  {
    id: 's2',
    userId: 'u4',
    userName: 'Mẹ Cherry',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794',
    createdAt: '5 giờ trước',
    isViewed: false
  },
  {
    id: 's3',
    userId: 'u3',
    userName: 'Mẹ Sóc',
    userAvatar: regularUser.avatar,
    imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9',
    createdAt: '1 giờ trước',
    isViewed: true
  }
];

// Mock Questions
export const initialQuestions: Question[] = [
  {
    id: 'q1',
    userId: 'u1',
    title: 'Bé 6 tháng tuổi ăn dặm kiểu Nhật hay BLW?',
    content: 'Các mẹ ơi, bé nhà mình được 6 tháng, mình đang phân vân không biết nên theo phương pháp nào. Bé trộm vía cứng cáp, đã biết ngồi vững. Mình sợ BLW bé hóc, mà kiểu Nhật thì lích kích nấu nướng. Mẹ nào có kinh nghiệm chia sẻ với ạ!',
    categoryId: 'c2',
    tags: ['#andam', '#blw', '#thucdon'],
    votes: 24,
    views: 156,
    answersCount: 2,
    createdAt: '2 giờ trước',
    author: currentUser,
    isLiked: false,
    attachments: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1595356066299-44754a17937e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }
    ],
    answers: [
      {
        id: 'a1',
        userId: 'u2',
        content: 'Chào mẹ. Với bé đã ngồi vững, mẹ hoàn toàn có thể thử BLW. Tuy nhiên, nếu mẹ lo lắng, có thể áp dụng phương pháp ăn dặm kết hợp (3 trong 1). Bữa chính ăn đút thìa để đảm bảo dinh dưỡng, bữa phụ cho bé cầm nắm thức ăn để rèn kỹ năng. Quan trọng nhất là không ép bé ăn nhé.',
        votes: 15,
        isAccepted: true,
        createdAt: '1 giờ trước',
        author: expertUser,
        comments: []
      },
      {
        id: 'a2',
        userId: 'u3',
        content: 'Mình vote kiểu Nhật nha mom. Rèn nề nếp ăn uống tốt lắm. Mới đầu hơi cực khoản rây thức ăn thôi, sau quen thì nhanh lắm.',
        votes: 5,
        isAccepted: false,
        createdAt: '30 phút trước',
        author: regularUser,
        comments: []
      }
    ]
  },
  {
    id: 'q2',
    userId: 'u3',
    title: 'Làm sao để giảm ốm nghén 3 tháng đầu?',
    content: 'Em nghén quá ăn gì cũng nôn, người mệt mỏi không làm được gì cả. Các mom có bí quyết gì dân gian hay thuốc gì uống đỡ không ạ? Em lo bé không đủ chất.',
    categoryId: 'c1',
    tags: ['#mangthai', '#omnghen', '#suckhoe'],
    votes: 45,
    views: 342,
    answersCount: 12,
    createdAt: '1 ngày trước',
    author: regularUser,
    isLiked: true,
    answers: []
  },
  {
    id: 'q3',
    userId: 'u4',
    title: 'Cách massage cho bé ngủ ngon (Có video)',
    content: 'Mình mới học được bài massage này hay lắm, bé nhà mình trộm vía ngủ sâu giấc hơn hẳn. Các mẹ xem video làm theo nhé!',
    categoryId: 'c2',
    tags: ['#massage', '#ngungon', '#mevabe'],
    votes: 89,
    views: 1205,
    answersCount: 5,
    createdAt: '3 giờ trước',
    author: { ...regularUser, name: 'Mẹ Cherry', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha' },
    isLiked: false,
    attachments: [
        { type: 'youtube', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' } // Example link
    ]
  }
];

// Mock Blog
export const initialBlogPosts: BlogPost[] = [
  {
    id: 'b1',
    title: 'Khủng hoảng tuổi lên 3: Mẹ cần làm gì?',
    excerpt: 'Giai đoạn bé 3 tuổi thường bướng bỉnh, hay ăn vạ. Đây là tâm lý bình thường đánh dấu sự phát triển độc lập của trẻ.',
    content: `
      <p class="mb-4">Khủng hoảng tuổi lên 3 là một cột mốc phát triển tâm lý quan trọng mà hầu hết các bé đều trải qua. Lúc này, trẻ bắt đầu nhận thức được "cái tôi" của mình và muốn khẳng định sự độc lập.</p>
      
      <h3 class="text-xl font-bold text-slate-800 mt-6 mb-3">1. Biểu hiện thường gặp</h3>
      <ul class="list-disc pl-5 mb-4 space-y-2">
        <li>Hay nói "Không" với mọi yêu cầu của người lớn.</li>
        <li>Dễ cáu gắt, ăn vạ, khóc lóc vô cớ.</li>
        <li>Muốn tự làm mọi thứ dù chưa đủ khả năng.</li>
      </ul>

      <h3 class="text-xl font-bold text-slate-800 mt-6 mb-3">2. Ba mẹ nên làm gì?</h3>
      <p class="mb-4">Thay vì quát mắng, hãy thử <strong>đồng cảm</strong> với cảm xúc của con. Khi con ăn vạ, hãy đảm bảo con an toàn và phớt lờ hành vi tiêu cực đó. Sau khi con bình tĩnh, hãy ôm con và giải thích nhẹ nhàng.</p>
    `,
    thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    categoryId: 'c3',
    author: expertUser,
    createdAt: '2023-10-25',
    views: 1250,
    status: 'published',
    likes: 150,
    isLiked: false,
    comments: [
      {
        id: 'c1',
        userId: 'u3',
        userName: 'Mẹ Sóc',
        userAvatar: regularUser.avatar,
        content: 'Bài viết hay quá bác sĩ ơi, bé nhà em đang giai đoạn này, stress kinh khủng!',
        createdAt: '2 giờ trước',
        replies: [
           {
              id: 'c1-r1',
              userId: 'u2',
              userName: 'BS. Hương',
              userAvatar: expertUser.avatar,
              content: 'Cố gắng lên mẹ Sóc nhé, giai đoạn này sẽ qua nhanh thôi!',
              createdAt: '1 giờ trước'
           }
        ]
      }
    ],
    attachments: [
        { type: 'video', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' }
    ]
  },
  {
    id: 'b2',
    title: 'Review 5 loại bỉm mỏng nhẹ mùa hè cho bé',
    excerpt: 'Tổng hợp 5 loại bỉm Nhật, Hàn mỏng nhẹ, thấm hút tốt, giúp bé thoải mái vận động mà không lo bị hăm.',
    content: '<p>Nội dung chi tiết review các loại bỉm...</p>',
    thumbnail: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    categoryId: 'c2',
    author: currentUser,
    createdAt: '2023-10-20',
    views: 890,
    status: 'published',
    likes: 85,
    isLiked: true,
    comments: []
  }
];

// Mock Documents
export const initialDocuments: DocumentItem[] = [
  {
    id: 'd1',
    title: 'Thực đơn ăn dặm 30 ngày (6-7 tháng)',
    description: 'File PDF chi tiết thực đơn ăn dặm kiểu Nhật kết hợp truyền thống, đầy đủ dinh dưỡng.',
    fileType: 'pdf',
    downloads: 1205,
    pointsRequired: 0,
    thumbnail: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    isVip: false,
    rating: 4.5,
    reviews: []
  },
  {
    id: 'd2',
    title: 'Tuyển tập 50 truyện cổ tích thai giáo',
    description: 'Ebook tuyển chọn truyện đọc cho bé nghe từ trong bụng mẹ giúp phát triển EQ.',
    fileType: 'pdf',
    downloads: 850,
    pointsRequired: 50,
    thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    isVip: true,
    rating: 5,
    reviews: []
  },
  {
    id: 'd3',
    title: 'Bộ tranh tô màu con vật ngộ nghĩnh',
    description: 'File ảnh chất lượng cao 100 con vật để in ra giấy A4 cho bé tập tô màu.',
    fileType: 'doc',
    downloads: 3400,
    pointsRequired: 20,
    thumbnail: 'https://images.unsplash.com/photo-1615147342761-9238e15d8b96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    isVip: true,
    rating: 4,
    reviews: []
  }
];

// Mock Games
export const games: Game[] = [
  {
    id: 'g1',
    name: 'Học đếm số',
    type: 'edu',
    thumbnail: 'https://img.freepik.com/free-vector/numbers-cartoons-set_1284-17551.jpg',
    description: 'Bé tập đếm táo trên cây',
    rating: 4.8
  },
  {
    id: 'g2',
    name: 'Tô màu online',
    type: 'fun',
    thumbnail: 'https://img.freepik.com/free-vector/painting-tools-elements-cartoon-colorful-set_1284-33230.jpg',
    description: 'Thỏa sức sáng tạo với màu sắc',
    rating: 4.5
  }
];

// Initial Notifications
export const initialNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'u1',
    actorName: 'BS. Hương',
    type: 'reply',
    content: 'đã trả lời câu hỏi của bạn',
    link: '/qa/q1',
    isRead: false,
    createdAt: '10 phút trước'
  },
  {
    id: 'n2',
    userId: 'u1',
    actorName: 'Hệ thống',
    type: 'system',
    content: 'Chào mừng bạn đến với Asking.vn!',
    link: '/',
    isRead: true,
    createdAt: '1 ngày trước'
  }
];
