'use client';

import { ImageIcon, LoaderCircle, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const MAX_BYTES = 5 * 1024 * 1024;

interface ImageUploadProps {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, label = 'Subir imagen', className = 'aspect-video' }: ImageUploadProps) {
  const { session, errorMessage } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !session) return;
    if (file.size > MAX_BYTES) {
      setError('La imagen debe pesar menos de 5 MB.');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const { url } = await api.admin.upload(session.token, file);
      onChange(url);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFile}
        className="hidden"
      />

      {value ? (
        <div className={`group relative overflow-hidden rounded-xl border border-line bg-paper-2 ${className}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- vista previa de imagen subida */}
          <img src={value} alt="" className="size-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-gradient-to-t from-ink/60 to-transparent p-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink"
            >
              <Upload className="size-3.5" />
              Cambiar
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-red-700"
            >
              <Trash2 className="size-3.5" />
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-forest/30 bg-sage-soft/30 px-4 text-center transition hover:border-forest/60 hover:bg-sage-soft/60 ${className}`}
        >
          {uploading ? (
            <LoaderCircle className="size-6 animate-spin text-forest" />
          ) : (
            <span className="grid size-11 place-items-center rounded-full bg-white text-forest">
              <ImageIcon className="size-5" />
            </span>
          )}
          <span className="text-sm font-medium text-ink">{uploading ? 'Subiendo…' : label}</span>
          <span className="text-xs text-muted">JPG, PNG o WEBP · máx. 5 MB</span>
        </button>
      )}

      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
