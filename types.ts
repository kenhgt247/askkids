
export enum UserRole {
  USER = 'user',
  EXPERT = 'expert',
  ADMIN = 'admin',
  GUEST = 'guest'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  points: number;
  avatar: string;
  title?: string;
  coverImage?: string; // Facebook style cover
  bio?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: 'question' | 'blog' | 'document';
  color: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string; // Allow guest names
  userAvatar: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export interface Answer {
  id: string;
  userId: string;
  content: string;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
  author: User;
  comments?: Comment[]; // Comments on answers
}

export interface Attachment {
  type: 'image' | 'video' | 'youtube';
  url: string;
  thumbnail?: string; // Optional for videos/youtube
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  imageUrl: string;
  createdAt: string;
  isViewed: boolean;
}

export interface Question {
  id: string;
  userId: string;
  title: string;
  content: string;
  attachments?: Attachment[]; // Rich media support
  categoryId: string;
  tags: string[];
  votes: number;
  views: number;
  answersCount: number;
  createdAt: string;
  author: User;
  answers?: Answer[];
  isLiked?: boolean; // Client-side state
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string; // Main cover image
  attachments?: Attachment[]; // Additional media in content
  categoryId: string;
  author: User;
  createdAt: string;
  views: number;
  status: 'published' | 'pending'; // Moderation status
  comments: Comment[];
  likes: number;
  isLiked?: boolean;
}

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  fileType: 'pdf' | 'doc' | 'xlsx';
  downloads: number;
  pointsRequired: number;
  thumbnail: string;
  isVip: boolean;
  rating: number; // 0-5
  reviews: Comment[];
}

export interface Game {
  id: string;
  name: string;
  type: 'edu' | 'fun';
  thumbnail: string;
  description: string;
  rating: number;
}

export interface Notification {
  id: string;
  userId: string; // Receiver
  actorName: string; // Who triggered it
  type: 'reply' | 'comment' | 'like' | 'system';
  content: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}
