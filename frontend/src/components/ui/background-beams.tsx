import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const paths = [
  'M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875',
  'M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867',
  'M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859',
  'M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851',
  'M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843',
  'M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835',
  'M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827',
  'M-331 -245C-331 -245 -263 160 201 287C665 414 733 819 733 819',
  'M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811',
  'M-317 -261C-317 -261 -249 144 215 271C679 398 747 803 747 803',
];

function BeamsImpl({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 flex h-full w-full items-center justify-center [mask-image:radial-gradient(ellipse_at_center,white,transparent_85%)]',
        className,
      )}
    >
      <svg
        className="pointer-events-none absolute z-0 h-full w-full"
        width="100%"
        height="100%"
        viewBox="0 0 696 316"
        fill="none"
      >
        <defs>
          {paths.map((_, idx) => (
            <linearGradient
              id={`beam-grad-${idx}`}
              key={`beam-grad-${idx}`}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#22d3ee" stopOpacity="0" />
              <stop stopColor="#22d3ee" />
              <stop offset="32.5%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {paths.map((d, idx) => (
          <path key={`bg-${idx}`} d={d} stroke="#1e293b" strokeOpacity="0.35" strokeWidth="0.5" />
        ))}

        {paths.map((d, idx) => (
          <motion.path
            key={`beam-${idx}`}
            d={d}
            stroke={`url(#beam-grad-${idx})`}
            strokeWidth="1.6"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 0] }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: idx * 0.4,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export const BackgroundBeams = memo(BeamsImpl);
