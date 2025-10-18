'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Eye, Download, TrendingUp } from 'lucide-react';

interface AssetCardProps {
  asset: {
    _id: string;
    name: string;
    description: string;
    type: string;
    price: number;
    verified: boolean;
    views: number;
    downloads: number;
    rating: number;
    creator: {
      username?: string;
      address: string;
      avatar?: string;
    };
    ipfsHash: string;
  };
  viewMode?: 'grid' | 'list';
}

export function AssetCard({ asset, viewMode = 'grid' }: AssetCardProps) {
  if (viewMode === 'list') {
    return (
      <Link href={`/assets/${asset._id}`}>
        <div className="glass-effect rounded-xl p-6 hover:bg-white/10 transition-all duration-300 flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-primary rounded-lg flex-shrink-0" />
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold">{asset.name}</h3>
                  {asset.verified && (
                    <CheckCircle className="w-5 h-5 text-secondary-500" />
                  )}
                </div>
                <p className="text-gray-400 line-clamp-1">{asset.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-500">{asset.price} ETH</div>
                <span className="text-sm text-gray-400">{asset.type}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {asset.views}
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {asset.downloads}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-primary" />
                <span className="text-sm text-gray-400">
                  {asset.creator.username || `${asset.creator.address.slice(0, 6)}...${asset.creator.address.slice(-4)}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/assets/${asset._id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="glass-effect rounded-2xl overflow-hidden hover:glow-effect transition-all duration-300 h-full"
      >
        {/* Image/Preview */}
        <div className="relative h-48 bg-gradient-primary">
          <div className="absolute top-4 right-4 flex gap-2">
            {asset.verified && (
              <div className="px-3 py-1 bg-secondary-500/20 backdrop-blur-sm rounded-full flex items-center gap-1 text-sm">
                <CheckCircle className="w-4 h-4 text-secondary-500" />
                <span className="text-secondary-500">Verified</span>
              </div>
            )}
            <div className="px-3 py-1 bg-primary-500/20 backdrop-blur-sm rounded-full text-sm text-primary-500">
              {asset.type}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 line-clamp-1">{asset.name}</h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{asset.description}</p>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {asset.views}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              {asset.downloads}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {asset.rating.toFixed(1)}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-primary" />
              <span className="text-sm text-gray-400">
                {asset.creator.username || `${asset.creator.address.slice(0, 6)}...`}
              </span>
            </div>
            <div className="text-xl font-bold text-primary-500">{asset.price} ETH</div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
