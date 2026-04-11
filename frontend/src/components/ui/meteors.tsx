import { cn } from '../../lib/utils';

interface Props {
  number?: number;
  className?: string;
}

export function Meteors({ number = 14, className }: Props) {
  const items = Array.from({ length: number });
  return (
    <>
      {items.map((_, idx) => (
        <span
          key={`meteor-${idx}`}
          className={cn(
            'pointer-events-none absolute left-1/2 top-1/2 h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-full bg-cyan-300 shadow-[0_0_0_1px_#22d3ee44]',
            "before:absolute before:top-1/2 before:h-px before:w-[60px] before:-translate-y-1/2 before:transform before:bg-gradient-to-r before:from-cyan-300 before:to-transparent before:content-['']",
            className,
          )}
          style={{
            top: `${Math.floor(Math.random() * 100)}%`,
            left: `${Math.floor(Math.random() * 100)}%`,
            animationDelay: `${(Math.random() * 4).toFixed(2)}s`,
            animationDuration: `${(4 + Math.random() * 4).toFixed(2)}s`,
          }}
        />
      ))}
    </>
  );
}
