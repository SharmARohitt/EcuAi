'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Shield, 
  Zap, 
  Lock, 
  TrendingUp, 
  Users, 
  Database,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { CTASection } from '@/components/landing/CTASection';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-dark-900">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Stats Section */}
      <StatsSection />

      {/* How It Works */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 grid-background opacity-20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How <span className="text-gradient">ecuAi</span> Works
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Four simple steps to participate in the decentralized AI economy
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Upload & Verify',
                description: 'Upload your AI model and get instant DKG verification',
                icon: Database,
              },
              {
                step: '02',
                title: 'Set Terms',
                description: 'Define pricing, licensing, and royalty structure',
                icon: Shield,
              },
              {
                step: '03',
                title: 'List & Discover',
                description: 'Your model goes live on the marketplace',
                icon: Sparkles,
              },
              {
                step: '04',
                title: 'Earn Royalties',
                description: 'Automatic payments for every transaction',
                icon: TrendingUp,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="glass-effect rounded-2xl p-6 h-full hover:glow-effect transition-all duration-300">
                  <div className="text-primary-500 text-5xl font-bold mb-4 opacity-20">
                    {item.step}
                  </div>
                  <item.icon className="w-12 h-12 text-primary-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
                {index < 3 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-primary-500 w-8 h-8" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-20 px-4 bg-dark-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built on <span className="text-gradient">Trust</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Enterprise-grade security meets blockchain transparency
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Smart Contract Audited',
                description: 'Independently audited by leading security firms',
              },
              {
                icon: Lock,
                title: 'Zero-Knowledge Proofs',
                description: 'Test models without exposing sensitive data',
              },
              {
                icon: CheckCircle,
                title: 'OriginTrail DKG',
                description: 'Immutable provenance tracking for every asset',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect rounded-2xl p-8 text-center hover:glow-effect-green transition-all duration-300"
              >
                <item.icon className="w-16 h-16 text-secondary-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </main>
  );
}
