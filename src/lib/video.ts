export interface VideoEmbed {
  provider: 'youtube' | 'tiktok';
  src: string;
}

/** Convierte una liga de YouTube o TikTok en su URL para insertar. Devuelve null si no es reconocible. */
export function videoEmbed(url?: string): VideoEmbed | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^(www|m)\./, '');

  if (host === 'youtu.be' || host.endsWith('youtube.com')) {
    const id =
      host === 'youtu.be'
        ? parsed.pathname.slice(1)
        : (parsed.searchParams.get('v') ?? parsed.pathname.match(/\/(?:shorts|embed|live)\/([\w-]{11})/)?.[1]);
    if (id && /^[\w-]{11}$/.test(id)) {
      return { provider: 'youtube', src: `https://www.youtube-nocookie.com/embed/${id}` };
    }
  }

  if (host.endsWith('tiktok.com')) {
    const id = parsed.pathname.match(/\/video\/(\d+)/)?.[1];
    if (id) return { provider: 'tiktok', src: `https://www.tiktok.com/embed/v2/${id}` };
  }

  return null;
}
