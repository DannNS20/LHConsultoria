'use client';

import { Share2 } from 'lucide-react';
import { useState } from 'react';
import { buttonClass } from '@/components/ui/button';
import { ShareDialog, type SharePost } from './ShareDialog';

interface ShareButtonProps {
  post: SharePost;
  label?: string;
  variant?: 'primary' | 'secondary' | 'light';
  className?: string;
}

export function ShareButton({ post, label = 'Compartir', variant = 'secondary', className = '' }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClass(variant, 'md', className)}>
        <Share2 className="size-4" />
        {label}
      </button>
      {open && <ShareDialog post={post} onClose={() => setOpen(false)} />}
    </>
  );
}
