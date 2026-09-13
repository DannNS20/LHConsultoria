import { ImageIcon, Video, type LucideIcon } from 'lucide-react';
import { videoEmbed } from '@/lib/video';
import type { Block } from '@/lib/types';

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="post-body">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'paragraph':
      return block.text ? <p>{block.text}</p> : null;
    case 'heading':
      return block.text ? <h2>{block.text}</h2> : null;
    case 'quote':
      return block.text ? <blockquote>{block.text}</blockquote> : null;
    case 'list':
      return block.items?.length ? (
        <ul>
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : null;
    case 'video': {
      const embed = videoEmbed(block.url);
      if (!embed) {
        return (
          <MediaPlaceholder
            icon={Video}
            title="Espacio para video"
            text="Al pegar una liga de YouTube o TikTok desde el panel, el video se muestra aquí."
          />
        );
      }
      return (
        <div
          className={
            embed.provider === 'youtube'
              ? 'aspect-video overflow-hidden rounded-2xl bg-ink'
              : 'mx-auto aspect-[9/16] w-full max-w-[340px] overflow-hidden rounded-2xl bg-ink'
          }
        >
          <iframe
            src={embed.src}
            title={embed.provider === 'youtube' ? 'Video de YouTube' : 'Video de TikTok'}
            className="size-full"
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    case 'image':
      return block.url ? (
        <figure className="overflow-hidden rounded-2xl border border-line bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element -- dimensiones desconocidas de imágenes subidas */}
          <img src={block.url} alt={block.text ?? ''} loading="lazy" className="w-full" />
          {block.text && <figcaption className="px-5 py-3 text-sm text-muted">{block.text}</figcaption>}
        </figure>
      ) : (
        <MediaPlaceholder
          icon={ImageIcon}
          title="Espacio para infografía"
          text="Las imágenes e infografías que subas desde el panel aparecen aquí."
        />
      );
    default:
      return null;
  }
}

function MediaPlaceholder({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-forest/30 bg-sage-soft/40 px-6 py-12 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-white text-forest">
        <Icon className="size-5" />
      </span>
      <p className="mt-4 font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted">{text}</p>
    </div>
  );
}
