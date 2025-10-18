'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Lock, TrendingUp, Users, Database } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Verifiable Provenance',
    description: 'Every AI model is cryptographically verified using OriginTrail DKG, ensuring complete transparency and trust.',
    color: 'text-primary-500',
    bgColor: 'bg-primary-500/10',
  },
  {
    icon: Lock,
    title: 'Zero-Knowledge Testing',
    description: 'Test AI models in a secure sandbox environment without exposing your sensitive data using zkML technology.',
    color: 'text-secondary-500',
    bgColor: 'bg-secondary-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Automated Royalties',
    description: 'Smart contracts automatically distribute royalties to creators on every transaction, ensuring fair compensation.',
    color: 'text-accent-500',
    bgColor: 'bg-accent-500/10',
  },
  {
    icon: Database,
    title: 'Decentralized Storage',
    description: 'Models and datasets are stored on IPFS/Filecoin, ensuring permanence and censorship resistance.',
    color: 'text-primary-500',
    bgColor: 'bg-primary-500/10',
  },
  {
    icon: Users,
    title: 'DAO Governance',
    description: 'Community-driven curation and dispute resolution through decentralized autonomous organization.',
    color: 'text-secondary-500',
    bgColor: 'bg-secondary-500/10',
  },
  {
    icon: Zap,
    title: 'Fractional Ownership',
    description: 'Enable multiple stakeholders to own and benefit from AI assets through tokenization.',
    color: 'text-accent-500',
    bgColor: 'bg-accent-500/10',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="text-gradient">ecuAi</span>?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Built with cutting-edge technology to ensure security, transparency, and fairness
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-8 hover:scale-105 transition-all duration-300 group"
            >
              <div className={`${feature.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
