import { ApiError } from './api-error';
import type { Api } from './api';
import { createDemoMessages, createDemoPosts, DEMO_USER } from './demo-seed';
import { normalize, readingMinutes, slugify } from './post-utils';
import { categoryNames } from './site';
import type { Block, CategorySlug, ContactMessage, Post, PostSummary } from './types';

// Modo demo (GitHub Pages): no hay backend. Implementa el mismo contrato que `api`, con los datos
// guardados en el navegador (localStorage) y arrancando con las entradas de ejemplo.

const STORAGE_KEY = 'lhc_demo_db_v1';
const DEMO_PASSWORD = 'Demo2026!';
const DEMO_TOKEN = 'demo-session';
const MAX_UPLOAD_BYTES = 1.5 * 1024 * 1024;

interface DemoDb {
  posts: Post[];
  messages: ContactMessage[];
}

let db: DemoDb | null = null;

function load(): DemoDb {
  if (db) return db;
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        db = JSON.parse(raw) as DemoDb;
        return db;
      }
    } catch {
      // datos dañados: la demo vuelve a empezar
    }
  }
  db = { posts: createDemoPosts(), messages: createDemoMessages() };
  return db;
}

function persist(): void {
  if (typeof window === 'undefined' || !db) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    throw new ApiError(413, 'El navegador ya no tiene espacio para guardar la demo. Usa imágenes más ligeras.');
  }
}

const respond = <T>(value: T): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), 120));

const byDateDesc = (a: string | null, b: string | null) => (b ?? '').localeCompare(a ?? '');

function toSummary(post: Post): PostSummary {
  const { blocks, ...summary } = post;
  void blocks;
  return summary;
}

function requireSession(token: string): void {
  if (token !== DEMO_TOKEN) throw new ApiError(401, 'Tu sesión expiró. Inicia sesión de nuevo.');
}

function findPost(id: string): Post {
  const post = load().posts.find((p) => p.id === id);
  if (!post) throw new ApiError(404, 'La entrada no existe.');
  return post;
}

function uniqueSlug(title: string, ownId?: string): string {
  const base = slugify(title);
  let slug = base;
  for (let n = 2; load().posts.some((p) => p.slug === slug && p.id !== ownId); n++) slug = `${base}-${n}`;
  return slug;
}

function cleanBlocks(blocks: Block[]): Block[] {
  return blocks.map(({ type, text, items, url }) => ({
    type,
    ...(text !== undefined && { text }),
    ...(items !== undefined && { items: items.filter((i) => i.trim() !== '') }),
    ...(url !== undefined && { url: url.trim() }),
  }));
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new ApiError(400, 'No se pudo leer la imagen.'));
    reader.readAsDataURL(file);
  });
}

export const demoApi: Api = {
  posts: async (params = {}) => {
    const q = params.q ? normalize(params.q.trim()) : '';
    const page = params.page ?? 1;
    const limit = params.limit ?? 9;
    const filtered = load()
      .posts.filter((p) => p.status === 'published')
      .filter((p) => !params.category || p.category === params.category)
      .filter((p) => !params.exclude || p.slug !== params.exclude)
      .filter((p) => !q || normalize(`${p.title} ${p.excerpt}`).includes(q))
      .sort((a, b) => byDateDesc(a.publishedAt, b.publishedAt));
    const start = (page - 1) * limit;
    return respond({ items: filtered.slice(start, start + limit).map(toSummary), total: filtered.length, page, limit });
  },

  post: async (slug) => {
    const post = load().posts.find((p) => p.slug === slug && p.status === 'published');
    if (!post) throw new ApiError(404, 'La entrada no existe o no está publicada.');
    return respond(post);
  },

  categories: async () =>
    respond(
      (Object.keys(categoryNames) as CategorySlug[]).map((slug) => ({
        slug,
        name: categoryNames[slug],
        count: load().posts.filter((p) => p.status === 'published' && p.category === slug).length,
      })),
    ),

  contact: async (input) => {
    if (!input.website) {
      load().messages.unshift({
        id: crypto.randomUUID(),
        name: input.name.trim(),
        email: input.email.trim(),
        phone: input.phone?.trim() || null,
        service: input.service?.trim() || null,
        message: input.message.trim(),
        read: false,
        createdAt: new Date().toISOString(),
      });
      persist();
    }
    return respond({ ok: true as const });
  },

  login: async (email, password) => {
    if (email.trim().toLowerCase() !== DEMO_USER.email || password !== DEMO_PASSWORD) {
      throw new ApiError(401, 'Correo o contraseña incorrectos.');
    }
    return respond({ accessToken: DEMO_TOKEN, user: DEMO_USER });
  },

  me: async (token) => {
    requireSession(token);
    return respond(DEMO_USER);
  },

  admin: {
    stats: async (token) => {
      requireSession(token);
      const { posts, messages } = load();
      const published = posts.filter((p) => p.status === 'published').length;
      return respond({ published, drafts: posts.length - published, unreadMessages: messages.filter((m) => !m.read).length });
    },

    posts: async (token) => {
      requireSession(token);
      return respond([...load().posts].sort((a, b) => byDateDesc(a.updatedAt, b.updatedAt)).map(toSummary));
    },

    post: async (token, id) => {
      requireSession(token);
      return respond(findPost(id));
    },

    createPost: async (token, input) => {
      requireSession(token);
      if (!input.title.trim()) throw new ApiError(400, 'Escribe un título para la entrada.');
      const now = new Date().toISOString();
      const blocks = cleanBlocks(input.blocks);
      const post: Post = {
        id: crypto.randomUUID(),
        slug: uniqueSlug(input.title),
        title: input.title.trim(),
        excerpt: input.excerpt.trim(),
        category: input.category,
        coverUrl: input.coverUrl || null,
        blocks,
        status: input.status,
        author: DEMO_USER.name,
        readingMinutes: readingMinutes(blocks),
        publishedAt: input.status === 'published' ? now : null,
        createdAt: now,
        updatedAt: now,
      };
      load().posts.push(post);
      persist();
      return respond(post);
    },

    updatePost: async (token, id, input) => {
      requireSession(token);
      const post = findPost(id);
      const now = new Date().toISOString();
      if (input.title !== undefined) {
        post.title = input.title.trim();
        if (!post.publishedAt) post.slug = uniqueSlug(input.title, post.id);
      }
      if (input.excerpt !== undefined) post.excerpt = input.excerpt.trim();
      if (input.category !== undefined) post.category = input.category;
      if (input.coverUrl !== undefined) post.coverUrl = input.coverUrl || null;
      if (input.blocks !== undefined) {
        post.blocks = cleanBlocks(input.blocks);
        post.readingMinutes = readingMinutes(post.blocks);
      }
      if (input.status !== undefined) {
        post.status = input.status;
        if (input.status === 'published' && !post.publishedAt) post.publishedAt = now;
      }
      post.updatedAt = now;
      persist();
      return respond({ ...post });
    },

    deletePost: async (token, id) => {
      requireSession(token);
      findPost(id);
      const data = load();
      data.posts = data.posts.filter((p) => p.id !== id);
      persist();
      return respond(undefined);
    },

    messages: async (token) => {
      requireSession(token);
      return respond([...load().messages]);
    },

    markRead: async (token, id) => {
      requireSession(token);
      const message = load().messages.find((m) => m.id === id);
      if (!message) throw new ApiError(404, 'El mensaje no existe.');
      message.read = true;
      persist();
      return respond({ ...message });
    },

    upload: async (token, file) => {
      requireSession(token);
      if (file.size > MAX_UPLOAD_BYTES) throw new ApiError(413, 'En la demo las imágenes deben pesar menos de 1.5 MB.');
      return respond({ url: await readAsDataUrl(file) });
    },
  },
};
