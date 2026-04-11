import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

interface Props {
  value: number;
  duration?: number;
  pad?: number;
}

export function AnimatedNumber({ value, duration = 0.8, pad = 3 }: Props) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const controls = animate(display, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return <>{String(display).padStart(pad, '0')}</>;
}
