'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-primary opacity-10" />
      <div className="absolute inset-0 grid-background opacity-20" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-effect rounded-3xl p-12 md:p-16"
        >
          <Sparkles className="w-16 h-16 text-primary-500 mx-auto mb-6" />
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Join the
            <br />
            <span className="text-gradient">AI Revolution</span>?
          </h2>
          
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Start building, trading, and earning in the world's first truly decentralized AI marketplace
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/explore"
              className="group px-8 py-4 bg-gradient-primary rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-300 glow-effect"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/docs"
              className="px-8 py-4 border-2 border-primary-500 rounded-full font-semibold text-lg hover:bg-primary-500/10 transition-all duration-300"
            >
              Read Documentation
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse" />
              <span>100% Decentralized</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse" />
              <span>Audited Smart Contracts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse" />
              <span>DKG Verified</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
