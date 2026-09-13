'use client';

import Link from 'next/link';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Eye,
  Heading2,
  ImageIcon,
  List,
  LoaderCircle,
  Pilcrow,
  Quote,
  Share2,
  Trash2,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import { PostCover } from '@/components/blog/PostCover';
import { ShareDialog } from '@/components/blog/ShareDialog';
import { buttonClass } from '@/components/ui/button';
import { inputClass, labelClass } from '@/components/ui/field';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { BASE_PATH, editPostHref, postHref } from '@/lib/config';
import { categoryNames } from '@/lib/site';
import type { Block, BlockType, CategorySlug, Post, PostInput, PostStatus } from '@/lib/types';
import { videoEmbed } from '@/lib/video';
import { ImageUpload } from './ImageUpload';
import { Card, ErrorNotice, PageHeader, StatusBadge } from './ui';

type EditorBlock = Block & { key: string };

let keySeed = 0;
const withKey = (block: Block): EditorBlock => ({ ...block, key: `b${keySeed++}` });

const BLOCK_OPTIONS: { type: BlockType; label: string; icon: LucideIcon }[] = [
  { type: 'paragraph', label: 'Párrafo', icon: Pilcrow },
  { type: 'heading', label: 'Subtítulo', icon: Heading2 },
  { type: 'list', label: 'Lista', icon: List },
  { type: 'quote', label: 'Cita', icon: Quote },
  { type: 'video', label: 'Video', icon: Video },
  { type: 'image', label: 'Imagen', icon: ImageIcon },
];

function emptyBlock(type: BlockType): Block {
  if (type === 'list') return { type, items: [''] };
  if (type === 'video' || type === 'image') return { type, url: '' };
  return { type, text: '' };
}

export function PostEditor({ initial }: { initial?: Post }) {
  const { session, errorMessage } = useAuth();

  const [postId, setPostId] = useState(initial?.id ?? null);
  const [slug, setSlug] = useState(initial?.slug ?? null);
  const [status, setStatus] = useState<PostStatus>(initial?.status ?? 'draft');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? '');
  const [category, setCategory] = useState<CategorySlug>(initial?.category ?? 'impuestos');
  const [coverUrl, setCoverUrl] = useState<string | null>(initial?.coverUrl ?? null);
  const [blocks, setBlocks] = useState<EditorBlock[]>(() =>
    (initial?.blocks.length ? initial.blocks : [emptyBlock('paragraph')]).map(withKey),
  );

  const [saving, setSaving] = useState<PostStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const updateBlock = (key: string, patch: Partial<Block>) =>
    setBlocks((current) => current.map((b) => (b.key === key ? { ...b, ...patch } : b)));
  const removeBlock = (key: string) => setBlocks((current) => current.filter((b) => b.key !== key));
  const moveBlock = (key: string, direction: -1 | 1) =>
    setBlocks((current) => {
      const i = current.findIndex((b) => b.key === key);
      const j = i + direction;
      if (i < 0 || j < 0 || j >= current.length) return current;
      const next = [...current];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const addBlock = (type: BlockType) => setBlocks((current) => [...current, withKey(emptyBlock(type))]);

  async function save(nextStatus: PostStatus) {
    if (!session) return;
    if (!title.trim()) {
      setError('Escribe un título para la entrada.');
      return;
    }
    setSaving(nextStatus);
    setError(null);
    setNotice(null);

    const input: PostInput = {
      title,
      excerpt,
      category,
      coverUrl,
      status: nextStatus,
      blocks: blocks.map(({ type, text, items, url }) => ({ type, text, items, url })),
    };

    try {
      const post = postId
        ? await api.admin.updatePost(session.token, postId, input)
        : await api.admin.createPost(session.token, input);

      if (!postId) window.history.replaceState(null, '', `${BASE_PATH}${editPostHref(post.id)}`);
      setPostId(post.id);
      setSlug(post.slug);
      setStatus(post.status);

      if (nextStatus === 'published') {
        setShareOpen(true);
      } else {
        setNotice('Borrador guardado. Solo tú puedes verlo.');
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(null);
    }
  }

  const published = status === 'published';

  return (
    <div>
      <Link href="/admin/entradas" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" />
        Entradas
      </Link>

      <div className="mt-4">
        <PageHeader
          title={postId ? 'Editar entrada' : 'Nueva entrada'}
          description="Escribe tu contenido por bloques: párrafos, subtítulos, listas, videos o imágenes."
          actions={<StatusBadge status={status} />}
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_21rem]">
        <div className="min-w-0 space-y-6">
          <Card>
            <label htmlFor="post-title" className={labelClass}>
              Título
            </label>
            <input
              id="post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={160}
              placeholder="Ej. 5 errores que pueden costarte una multa del SAT"
              className={`${inputClass} font-serif text-2xl`}
            />

            <div className="mt-5 grid gap-5 md:grid-cols-[1fr_14rem]">
              <div>
                <label htmlFor="post-excerpt" className={labelClass}>
                  Resumen
                </label>
                <textarea
                  id="post-excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  maxLength={320}
                  rows={3}
                  placeholder="Dos o tres líneas que inviten a leer. También se usa al compartir en redes."
                  className={`${inputClass} resize-y`}
                />
                <p className="mt-1 text-right text-xs text-muted">{excerpt.length}/320</p>
              </div>
              <div>
                <label htmlFor="post-category" className={labelClass}>
                  Categoría
                </label>
                <select
                  id="post-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategorySlug)}
                  className={inputClass}
                >
                  {Object.entries(categoryNames).map(([value, name]) => (
                    <option key={value} value={value}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">Contenido</h2>
            <div className="mt-5 space-y-4">
              {blocks.map((block, index) => (
                <BlockField
                  key={block.key}
                  block={block}
                  first={index === 0}
                  last={index === blocks.length - 1}
                  onChange={(patch) => updateBlock(block.key, patch)}
                  onMove={(direction) => moveBlock(block.key, direction)}
                  onRemove={() => removeBlock(block.key)}
                />
              ))}
              {blocks.length === 0 && (
                <p className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-muted">
                  Agrega tu primer bloque con los botones de abajo.
                </p>
              )}
            </div>

            <div className="mt-6 border-t border-line pt-5">
              <p className="text-xs font-semibold tracking-wider text-muted uppercase">Agregar bloque</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {BLOCK_OPTIONS.map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addBlock(type)}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink-2 transition hover:border-forest/40 hover:bg-white hover:text-forest"
                  >
                    <Icon className="size-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">
          <Card>
            <h2 className="text-lg font-semibold">Publicación</h2>
            <p className="mt-1 text-sm text-muted">
              {published
                ? 'Esta entrada está visible en el blog.'
                : 'Guárdala como borrador o publícala cuando esté lista.'}
            </p>

            <div className="mt-5 space-y-3">
              <ErrorNotice message={error} />
              {notice && (
                <p role="status" className="rounded-xl bg-sage-soft px-4 py-3 text-sm text-forest">
                  {notice}
                </p>
              )}

              <button
                type="button"
                onClick={() => save('published')}
                disabled={saving !== null}
                className={buttonClass('primary', 'md', 'w-full')}
              >
                {saving === 'published' && <LoaderCircle className="size-4 animate-spin" />}
                {published ? 'Guardar cambios' : 'Publicar'}
              </button>
              <button
                type="button"
                onClick={() => save('draft')}
                disabled={saving !== null}
                className={buttonClass('secondary', 'md', 'w-full')}
              >
                {saving === 'draft' && <LoaderCircle className="size-4 animate-spin" />}
                {published ? 'Pasar a borrador' : 'Guardar borrador'}
              </button>

              {published && slug && (
                <div className="grid grid-cols-2 gap-3 border-t border-line pt-4">
                  <Link
                    href={postHref(slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass('ghost', 'sm', 'w-full')}
                  >
                    <Eye className="size-4" />
                    Ver
                  </Link>
                  <button type="button" onClick={() => setShareOpen(true)} className={buttonClass('ghost', 'sm', 'w-full')}>
                    <Share2 className="size-4" />
                    Compartir
                  </button>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">Portada</h2>
            <p className="mt-1 text-sm text-muted">Opcional. Si no subes una, se usa una portada con la identidad del despacho.</p>
            <div className="mt-4">
              {coverUrl ? (
                <ImageUpload value={coverUrl} onChange={setCoverUrl} className="aspect-[16/10]" />
              ) : (
                <div className="space-y-3">
                  <PostCover title={title} category={category} coverUrl={null} className="aspect-[16/10] rounded-xl" />
                  <ImageUpload value={null} onChange={setCoverUrl} label="Subir portada" className="py-5" />
                </div>
              )}
            </div>
          </Card>
        </aside>
      </div>

      {shareOpen && slug && (
        <ShareDialog
          post={{ slug, title, excerpt, category }}
          heading={published ? '¡Entrada publicada! Compártela en redes' : 'Compartir en redes sociales'}
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  );
}

interface BlockFieldProps {
  block: EditorBlock;
  first: boolean;
  last: boolean;
  onChange: (patch: Partial<Block>) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}

function BlockField({ block, first, last, onChange, onMove, onRemove }: BlockFieldProps) {
  const option = BLOCK_OPTIONS.find((o) => o.type === block.type)!;
  const Icon = option.icon;
  const embed = block.type === 'video' ? videoEmbed(block.url) : null;

  return (
    <div className="rounded-xl border border-line bg-paper/50 p-4 transition focus-within:border-forest/40 focus-within:bg-white">
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-muted uppercase">
          <Icon className="size-4" />
          {option.label}
        </span>
        <div className="flex gap-1">
          <IconButton label="Subir bloque" disabled={first} onClick={() => onMove(-1)} icon={ArrowUp} />
          <IconButton label="Bajar bloque" disabled={last} onClick={() => onMove(1)} icon={ArrowDown} />
          <IconButton label="Eliminar bloque" onClick={onRemove} icon={Trash2} danger />
        </div>
      </div>

      {block.type === 'paragraph' && (
        <textarea
          aria-label="Párrafo"
          value={block.text ?? ''}
          onChange={(e) => onChange({ text: e.target.value })}
          rows={4}
          placeholder="Escribe un párrafo…"
          className={`${inputClass} resize-y leading-relaxed`}
        />
      )}

      {block.type === 'heading' && (
        <input
          aria-label="Subtítulo"
          value={block.text ?? ''}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Subtítulo de la sección"
          className={`${inputClass} text-lg font-semibold`}
        />
      )}

      {block.type === 'quote' && (
        <textarea
          aria-label="Cita"
          value={block.text ?? ''}
          onChange={(e) => onChange({ text: e.target.value })}
          rows={2}
          placeholder="Una frase para destacar"
          className={`${inputClass} resize-y font-serif text-lg italic`}
        />
      )}

      {block.type === 'list' && (
        <>
          <textarea
            aria-label="Elementos de la lista"
            value={(block.items ?? []).join('\n')}
            onChange={(e) => onChange({ items: e.target.value.split('\n') })}
            rows={4}
            placeholder={'Un elemento por renglón\nOtro elemento'}
            className={`${inputClass} resize-y`}
          />
          <p className="mt-1.5 text-xs text-muted">Escribe un elemento por renglón.</p>
        </>
      )}

      {block.type === 'video' && (
        <>
          <input
            aria-label="Liga del video"
            type="url"
            value={block.url ?? ''}
            onChange={(e) => onChange({ url: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=… o liga de TikTok"
            className={inputClass}
          />
          <p className={`mt-1.5 text-xs ${block.url && !embed ? 'text-red-700' : 'text-muted'}`}>
            {embed
              ? `Video de ${embed.provider === 'youtube' ? 'YouTube' : 'TikTok'} detectado.`
              : block.url
                ? 'No reconocemos esta liga. Pega la dirección completa del video de YouTube o TikTok.'
                : 'Pega la liga de un video de YouTube o TikTok.'}
          </p>
        </>
      )}

      {block.type === 'image' && (
        <div className="space-y-3">
          <ImageUpload value={block.url || null} onChange={(url) => onChange({ url: url ?? '' })} label="Subir imagen o infografía" />
          <input
            aria-label="Pie de imagen"
            value={block.text ?? ''}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="Pie de imagen (opcional)"
            className={inputClass}
          />
        </div>
      )}
    </div>
  );
}

function IconButton({
  label,
  icon: Icon,
  onClick,
  disabled,
  danger,
}: {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`grid size-8 place-items-center rounded-lg transition disabled:opacity-30 ${
        danger ? 'text-muted hover:bg-red-50 hover:text-red-700' : 'text-muted hover:bg-paper-2 hover:text-ink'
      }`}
    >
      <Icon className="size-4" />
    </button>
  );
}
