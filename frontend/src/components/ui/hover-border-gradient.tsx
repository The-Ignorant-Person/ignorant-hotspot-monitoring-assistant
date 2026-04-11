import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

type Direction = 'TOP' | 'LEFT' | 'BOTTOM' | 'RIGHT';

interface Props {
  children: ReactNode;
  containerClassName?: string;
  className?: string;
  duration?: number;
  onClick?: () => void;
  disabled?: boolean;
  as?: 'button' | 'div';
}

const directionMap: Record<Direction, string> = {
  TOP: 'radial-gradient(20.7% 50% at 50% 0%, #22d3ee 0%, rgba(34, 211, 238, 0) 100%)',
  LEFT: 'radial-gradient(16.6% 43.1% at 0% 50%, #a855f7 0%, rgba(168, 85, 247, 0) 100%)',
  BOTTOM: 'radial-gradient(20.7% 50% at 50% 100%, #22d3ee 0%, rgba(34, 211, 238, 0) 100%)',
  RIGHT: 'radial-gradient(16.2% 41.2% at 100% 50%, #a855f7 0%, rgba(168, 85, 247, 0) 100%)',
};

const sequence: Direction[] = ['TOP', 'LEFT', 'BOTTOM', 'RIGHT'];

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  duration = 1,
  onClick,
  disabled,
  as = 'button',
}: Props) {
  const [hovered, setHovered] = useState(false);
  const [dir, setDir] = useState<Direction>('TOP');
  const idx = useRef(0);

  useEffect(() => {
    if (hovered) return;
    const id = setInterval(() => {
      idx.current = (idx.current + 1) % sequence.length;
      setDir(sequence[idx.current]);
    }, duration * 1000);
    return () => clearInterval(id);
  }, [hovered, duration]);

  const Tag: any = as;

  return (
    <Tag
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'relative flex items-center justify-center overflow-visible rounded-full border border-white/10 bg-slate-950/80 p-px transition-all hover:scale-[1.02] disabled:opacity-50',
        containerClassName,
      )}
    >
      <div
        className={cn(
          'relative z-10 rounded-full bg-slate-950 px-4 py-2 text-xs font-mono tracking-wider text-slate-100',
          className,
        )}
      >
        {children}
      </div>
      <motion.div
        className="absolute inset-0 z-0 overflow-hidden rounded-full"
        style={{
          filter: 'blur(2px)',
          background: hovered
            ? 'radial-gradient(75% 181% at 50% 50%, #22d3ee 0%, rgba(168, 85, 247, .6) 100%)'
            : directionMap[dir],
        }}
        transition={{ ease: 'linear', duration: duration }}
      />
      <div className="absolute inset-[2px] z-[5] rounded-full bg-slate-950" />
    </Tag>
  );
}
