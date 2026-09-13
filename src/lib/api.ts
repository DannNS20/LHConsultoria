import { ApiError } from './api-error';
import { DEMO_MODE } from './config';
import { demoApi } from './demo-api';
import type {
  AuthUser,
  Category,
  CategorySlug,
  ContactInput,
  ContactMessage,
  Paginated,
  Post,
  PostInput,
  PostSummary,
  Stats,
} from './types';

export { ApiError };

const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
// En el servidor se puede usar una URL interna (por ejemplo la red de Docker en Dokploy).
const SERVER_API_URL = process.env.API_INTERNAL_URL ?? PUBLIC_API_URL;

interface RequestOptions extends Omit<RequestInit, 'body'> {
  token?: string | null;
  body?: unknown;
}

async function request<T>(path: string, { token, body, headers, ...init }: RequestOptions = {}): Promise<T> {
  const base = typeof window === 'undefined' ? SERVER_API_URL : PUBLIC_API_URL;
  const isForm = body instanceof FormData;

  let res: Response;
  try {
    res = await fetch(`${base}${path}`, {
      ...init,
      cache: 'no-store',
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
      headers: {
        ...(body !== undefined && !isForm && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.');
  }

  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = Array.isArray(data?.message) ? data.message[0] : data?.message;
    throw new ApiError(res.status, message ?? 'Ocurrió un error inesperado.');
  }
  return data as T;
}

export interface ListPostsParams {
  category?: CategorySlug;
  q?: string;
  exclude?: string;
  page?: number;
  limit?: number;
}

function query(params: object): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value));
  }
  const s = search.toString();
  return s ? `?${s}` : '';
}

const httpApi = {
  posts: (params: ListPostsParams = {}) => request<Paginated<PostSummary>>(`/posts${query(params)}`),
  post: (slug: string) => request<Post>(`/posts/${encodeURIComponent(slug)}`),
  categories: () => request<Category[]>('/categories'),
  contact: (input: ContactInput) => request<{ ok: true }>('/contact', { method: 'POST', body: input }),

  login: (email: string, password: string) =>
    request<{ accessToken: string; user: AuthUser }>('/auth/login', { method: 'POST', body: { email, password } }),
  me: (token: string) => request<AuthUser>('/auth/me', { token }),

  admin: {
    stats: (token: string) => request<Stats>('/admin/stats', { token }),
    posts: (token: string) => request<PostSummary[]>('/admin/posts', { token }),
    post: (token: string, id: string) => request<Post>(`/admin/posts/${id}`, { token }),
    createPost: (token: string, input: PostInput) =>
      request<Post>('/admin/posts', { method: 'POST', token, body: input }),
    updatePost: (token: string, id: string, input: Partial<PostInput>) =>
      request<Post>(`/admin/posts/${id}`, { method: 'PATCH', token, body: input }),
    deletePost: (token: string, id: string) => request<void>(`/admin/posts/${id}`, { method: 'DELETE', token }),
    messages: (token: string) => request<ContactMessage[]>('/admin/messages', { token }),
    markRead: (token: string, id: string) =>
      request<ContactMessage>(`/admin/messages/${id}/read`, { method: 'PATCH', token }),
    upload: (token: string, file: File) => {
      const form = new FormData();
      form.append('file', file);
      return request<{ url: string }>('/admin/uploads', { method: 'POST', token, body: form });
    },
  },
};

export type Api = typeof httpApi;

/** Cliente de la API. En el modo demo (GitHub Pages) usa datos locales con el mismo contrato. */
export const api: Api = DEMO_MODE ? demoApi : httpApi;

/** Para páginas del servidor: devuelve null si la entrada no existe, en lugar de lanzar error. */
export async function getPostOrNull(slug: string): Promise<Post | null> {
  try {
    return await api.post(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
