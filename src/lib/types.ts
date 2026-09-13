// Tipos del contrato con la API (LHConsultoria-backend). Mantener en sincronía con el backend.

export type CategorySlug = 'impuestos' | 'sat' | 'nomina' | 'empresas' | 'finanzas-personales';

export type BlockType = 'paragraph' | 'heading' | 'list' | 'quote' | 'video' | 'image';

export interface Block {
  type: BlockType;
  text?: string;
  items?: string[];
  url?: string;
}

export type PostStatus = 'published' | 'draft';

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: CategorySlug;
  coverUrl: string | null;
  blocks: Block[];
  status: PostStatus;
  author: string;
  readingMinutes: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PostSummary = Omit<Post, 'blocks'>;

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  count: number;
}

export interface PostInput {
  title: string;
  excerpt: string;
  category: CategorySlug;
  coverUrl: string | null;
  blocks: Block[];
  status: PostStatus;
}

export interface ContactInput {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  website?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuthUser {
  email: string;
  name: string;
}

export interface Stats {
  published: number;
  drafts: number;
  unreadMessages: number;
}
