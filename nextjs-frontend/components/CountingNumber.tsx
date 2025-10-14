'use client';

import * as React from 'react';
import { useMotionValue, useSpring, motion } from 'framer-motion';

interface CountingNumberProps {
  number: number;
  fromNumber?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function CountingNumber({
  number,
  fromNumber = 0,
  className,
  style,
}: CountingNumberProps) {
  const motionValue = useMotionValue(fromNumber);
  const springValue = useSpring(motionValue, {
    stiffness: 90,
    damping: 50,
  });
  const [displayValue, setDisplayValue] = React.useState(fromNumber);

  React.useEffect(() => {
    motionValue.set(number);
  }, [motionValue, number]);

  React.useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [springValue]);

  return (
    <motion.span className={className} style={style}>
      {displayValue.toLocaleString()}
    </motion.span>
  );
}
