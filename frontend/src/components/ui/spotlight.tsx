import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SpotlightProps {
  className?: string;
  gradientFirst?: string;
  gradientSecond?: string;
  duration?: number;
}

export function Spotlight({
  className,
  gradientFirst = 'radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(189, 95%, 60%, .12) 0, hsla(189, 95%, 50%, .04) 50%, hsla(189, 95%, 45%, 0) 80%)',
  gradientSecond = 'radial-gradient(50% 50% at 50% 50%, hsla(270, 95%, 60%, .08) 0, hsla(270, 95%, 55%, .03) 80%, transparent 100%)',
  duration = 7,
}: SpotlightProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    >
      <motion.div
        animate={{ x: [0, 80, 0] }}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: gradientFirst,
          transform: 'translateY(-30%)',
        }}
        className="absolute left-0 top-0 h-full w-full"
      />
      <motion.div
        animate={{ x: [0, -60, 0] }}
        transition={{ duration: duration + 1, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: gradientSecond,
        }}
        className="absolute right-0 top-0 h-full w-full"
      />
    </motion.div>
  );
}
