'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export function StatsSection() {
  const stats = [
    {
      value: 10247,
      label: 'AI Models Listed',
      suffix: '',
      color: 'text-primary-500',
    },
    {
      value: 5432,
      label: 'Active Creators',
      suffix: '',
      color: 'text-secondary-500',
    },
    {
      value: 2.4,
      label: 'Trading Volume',
      suffix: 'M',
      prefix: '$',
      color: 'text-accent-500',
    },
    {
      value: 100,
      label: 'Verification Rate',
      suffix: '%',
      color: 'text-primary-500',
    },
  ];

  return (
    <section className="py-20 px-4 bg-dark-800/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Growing <span className="text-gradient">Ecosystem</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join thousands of AI creators and users building the future of trusted AI
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-8 text-center hover:glow-effect transition-all duration-300"
            >
              <div className={`text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}>
                {stat.prefix}
                <AnimatedCounter end={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
