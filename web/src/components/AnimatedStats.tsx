"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  label: string;
  value: string;
  rawValue: number;
  color: string;
}

function useCountUp(target: number, duration: number = 2000, start: boolean = false) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let animId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * target));
      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [target, duration, start]);

  return current;
}

function formatAnimatedNumber(num: number, finalFormatted: string): string {
  // Use the same format as the final value
  if (finalFormatted.endsWith("B")) {
    return num >= 1_000_000_000 ? `${(num / 1_000_000_000).toFixed(1)}B` :
           num >= 1_000_000 ? `${(num / 1_000_000).toFixed(1)}M` :
           num >= 1_000 ? `${(num / 1_000).toFixed(1)}K` : num.toString();
  }
  if (finalFormatted.endsWith("M")) {
    return num >= 1_000_000 ? `${(num / 1_000_000).toFixed(1)}M` :
           num >= 1_000 ? `${(num / 1_000).toFixed(1)}K` : num.toString();
  }
  if (finalFormatted.endsWith("K")) {
    return num >= 1_000 ? `${(num / 1_000).toFixed(1)}K` : num.toString();
  }
  return num.toString();
}

function StatBlock({ stat, index }: { stat: StatItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const count = useCountUp(stat.rawValue, 2000 + index * 200, visible);
  const display = visible && count >= stat.rawValue
    ? stat.value
    : formatAnimatedNumber(count, stat.value);

  return (
    <div
      ref={ref}
      className="stat-block rounded-2xl p-4 sm:p-6 lg:p-8 text-center"
    >
      <p className={`text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight tabular-nums ${stat.color}`}>
        {display}
      </p>
      <p className="text-[10px] sm:text-xs lg:text-sm text-muted mt-1.5 sm:mt-2.5 uppercase tracking-widest">
        {stat.label}
      </p>
    </div>
  );
}

export default function AnimatedStats({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5 mt-10 animate-fade-up anim-delay-2">
      {stats.map((s, i) => (
        <StatBlock key={s.label} stat={s} index={i} />
      ))}
    </div>
  );
}
