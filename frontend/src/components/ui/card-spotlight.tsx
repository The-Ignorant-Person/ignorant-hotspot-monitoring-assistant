import { useMotionValue, motion, useMotionTemplate } from 'framer-motion';
import { useState, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface Props {
  children: ReactNode;
  radius?: number;
  color?: string;
  className?: string;
}

export function CardSpotlight({
  children,
  radius = 320,
  color = 'rgba(34, 211, 238, 0.18)',
  className,
}: Props) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHover, setIsHover] = useState(false);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-sm transition-colors hover:border-cyan-400/30',
        className,
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, ${color}, transparent 70%)`,
          opacity: isHover ? 1 : 0,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
