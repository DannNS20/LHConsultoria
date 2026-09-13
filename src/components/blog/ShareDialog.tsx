'use client';

import { Check, Copy, Download, LoaderCircle, Smartphone, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { buttonClass } from '@/components/ui/button';
import { inputClass, labelClass } from '@/components/ui/field';
import { FacebookIcon, LinkedInIcon, WhatsAppIcon, XBrandIcon } from '@/components/ui/icons';
import { DEMO_MODE, postHref } from '@/lib/config';
import { renderShareBlob, type ShareFormat } from '@/lib/share-canvas';
import { SITE_URL } from '@/lib/site';
import type { PostSummary } from '@/lib/types';

// Debe coincidir con SHARE_FORMATS de lib/share-image.tsx (que solo corre en el servidor).
const FORMATS: { id: ShareFormat; label: string; hint: string; frame: string }[] = [
  { id: 'horizontal', label: 'Horizontal', hint: 'Facebook · LinkedIn · X', frame: 'aspect-[1200/630] w-full' },
  { id: 'cuadrado', label: 'Cuadrada', hint: 'Instagram · WhatsApp', frame: 'aspect-square w-full max-w-[340px]' },
  { id: 'historia', label: 'Historia', hint: 'Historias · TikTok', frame: 'aspect-[9/16] w-full max-w-[220px]' },
];

export type SharePost = Pick<PostSummary, 'slug' | 'title' | 'excerpt' | 'category'>;

export function suggestedText(post: SharePost, url: string): string {
  return `📌 ${post.title}\n\n${post.excerpt}\n\nLéelo completo aquí 👉 ${url}\n\n#LHConsultores #Contabilidad #SAT`;
}

interface ShareDialogProps {
  post: SharePost;
  onClose: () => void;
  heading?: string;
}

/** Plantilla promocional para redes: imagen generada + texto sugerido con la liga de la entrada. */
export function ShareDialog({ post, onClose, heading = 'Compartir en redes sociales' }: ShareDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const url = `${SITE_URL}${postHref(post.slug)}`;
  const [format, setFormat] = useState<ShareFormat>('cuadrado');
  const [text, setText] = useState(() => suggestedText(post, url));
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<'download' | 'native' | null>(null);
  const [demoPreview, setDemoPreview] = useState<{ format: ShareFormat; url: string } | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => dialog?.close();
  }, []);

  // En la demo la imagen se dibuja en el navegador; en producción la genera el servidor.
  useEffect(() => {
    if (!DEMO_MODE) return;
    let objectUrl: string | null = null;
    let cancelled = false;
    renderShareBlob(post, format).then((blob) => {
      if (cancelled) return;
      objectUrl = URL.createObjectURL(blob);
      setDemoPreview({ format, url: objectUrl });
    });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [post, format]);

  const current = FORMATS.find((f) => f.id === format)!;
  const serverImage = `/blog/${post.slug}/imagen?formato=${format}`;
  const previewSrc = DEMO_MODE ? (demoPreview?.format === format ? demoPreview.url : null) : serverImage;
  const encodedUrl = encodeURIComponent(url);
  const networks = [
    { name: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(text)}`, Icon: WhatsAppIcon, className: 'bg-[#25D366]' },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, Icon: FacebookIcon, className: 'bg-[#1877F2]' },
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, Icon: LinkedInIcon, className: 'bg-[#0A66C2]' },
    { name: 'X', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, Icon: XBrandIcon, className: 'bg-ink' },
  ];

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // el navegador bloqueó el portapapeles; el texto sigue visible para copiarlo a mano
    }
  }

  async function imageFile(): Promise<File> {
    let blob: Blob;
    if (DEMO_MODE) {
      blob = await renderShareBlob(post, format);
    } else {
      const res = await fetch(serverImage);
      if (!res.ok) throw new Error('No se pudo generar la imagen.');
      blob = await res.blob();
    }
    return new File([blob], `lh-consultores-${post.slug}-${format}.png`, { type: 'image/png' });
  }

  function saveFile(file: File) {
    const objectUrl = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = file.name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }

  async function download() {
    setBusy('download');
    try {
      saveFile(await imageFile());
    } finally {
      setBusy(null);
    }
  }

  async function shareFromDevice() {
    setBusy('native');
    try {
      const file = await imageFile();
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: post.title, text });
      } else if (navigator.share) {
        await navigator.share({ title: post.title, text, url });
      } else {
        saveFile(file);
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) throw error;
    } finally {
      setBusy(null);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && onClose()}
      aria-labelledby="share-title"
      className="m-auto max-h-[calc(100dvh-1.5rem)] w-[min(66rem,calc(100vw-1.5rem))] overflow-y-auto rounded-[1.75rem] bg-paper p-0 text-ink shadow-2xl"
    >
      <div className="flex items-start justify-between gap-4 border-b border-line bg-white px-6 py-5 sm:px-8">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.18em] text-forest uppercase">{heading}</p>
          <h2 id="share-title" className="mt-1 font-serif text-2xl leading-tight">
            {post.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="grid size-10 shrink-0 place-items-center rounded-full text-ink-2 hover:bg-ink/5"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <div role="radiogroup" aria-label="Formato de imagen" className="grid grid-cols-3 gap-2 rounded-2xl bg-paper-2 p-1.5">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={format === f.id}
                onClick={() => setFormat(f.id)}
                className={`rounded-xl px-2 py-2.5 text-center transition ${
                  format === f.id ? 'bg-white shadow-sm' : 'text-muted hover:text-ink'
                }`}
              >
                <span className="block text-sm font-semibold">{f.label}</span>
                <span className="block text-[0.7rem] text-muted">{f.hint}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 flex min-h-[22rem] items-center justify-center rounded-2xl border border-line bg-white p-5">
            <div className={`grid place-items-center overflow-hidden rounded-xl bg-forest shadow-lg ${current.frame}`}>
              {previewSrc ? (
                // eslint-disable-next-line @next/next/no-img-element -- imagen generada al momento
                <img key={previewSrc} src={previewSrc} alt={`Imagen promocional en formato ${current.label.toLowerCase()}`} className="size-full object-cover" />
              ) : (
                <LoaderCircle className="size-6 animate-spin text-mint" aria-label="Generando imagen" />
              )}
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted">
            Se genera sola con el título de la entrada, la categoría y la liga del blog.
          </p>
        </div>

        <div className="flex flex-col">
          <label htmlFor="share-text" className={labelClass}>
            Texto sugerido
          </label>
          <textarea
            id="share-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className={`${inputClass} resize-y leading-relaxed`}
          />
          <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted">
            <span>Puedes editarlo antes de compartir.</span>
            <button type="button" onClick={copyText} className="inline-flex items-center gap-1.5 font-medium text-forest">
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? 'Copiado' : 'Copiar texto'}
            </button>
          </div>

          <p className="mt-7 text-sm font-semibold">Publicar en</p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {networks.map(({ name, href, Icon, className }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-medium text-white transition hover:opacity-90 ${className}`}
              >
                <Icon className="size-4" />
                {name}
              </a>
            ))}
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={download} disabled={busy !== null} className={buttonClass('secondary', 'md', 'rounded-xl')}>
              {busy === 'download' ? <LoaderCircle className="size-4 animate-spin" /> : <Download className="size-4" />}
              Descargar imagen
            </button>
            <button type="button" onClick={shareFromDevice} disabled={busy !== null} className={buttonClass('secondary', 'md', 'rounded-xl')}>
              {busy === 'native' ? <LoaderCircle className="size-4 animate-spin" /> : <Smartphone className="size-4" />}
              Compartir desde el celular
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-white p-4 text-xs leading-relaxed text-muted">
            <p>
              <span className="font-semibold text-ink-2">Liga de la entrada: </span>
              <span className="break-all">{url}</span>
            </p>
            <p className="mt-2">
              Facebook, LinkedIn y WhatsApp muestran la imagen horizontal automáticamente al compartir la liga. Instagram
              y TikTok no permiten publicar desde una página: descarga la imagen y súbela desde la app.
            </p>
          </div>
        </div>
      </div>
    </dialog>
  );
}
