'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Eye, Download, DollarSign, Package, Activity } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }
    fetchDashboard();
  }, [isConnected]);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="spinner" />
      </main>
    );
  }

  const stats = dashboardData?.stats || {};

  return (
    <main className="min-h-screen bg-dark-900">
      <Navbar />

      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2">
              Creator <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-gray-400">Manage your AI assets and track performance</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: Package,
                label: 'Total Assets',
                value: stats.totalAssets || 0,
                color: 'text-primary-500',
                bgColor: 'bg-primary-500/10',
              },
              {
                icon: Eye,
                label: 'Total Views',
                value: stats.totalViews || 0,
                color: 'text-secondary-500',
                bgColor: 'bg-secondary-500/10',
              },
              {
                icon: Download,
                label: 'Total Downloads',
                value: stats.totalDownloads || 0,
                color: 'text-accent-500',
                bgColor: 'bg-accent-500/10',
              },
              {
                icon: DollarSign,
                label: 'Total Earnings',
                value: `${stats.totalEarnings || 0} ETH`,
                color: 'text-primary-500',
                bgColor: 'bg-primary-500/10',
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect rounded-2xl p-6"
              >
                <div className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold mb-6">Performance Overview</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { name: 'Mon', views: 120, downloads: 45 },
                  { name: 'Tue', views: 150, downloads: 60 },
                  { name: 'Wed', views: 180, downloads: 75 },
                  { name: 'Thu', views: 140, downloads: 55 },
                  { name: 'Fri', views: 200, downloads: 90 },
                  { name: 'Sat', views: 170, downloads: 70 },
                  { name: 'Sun', views: 160, downloads: 65 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="views" fill="#0EA5E9" />
                  <Bar dataKey="downloads" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold mb-6">Recent Transactions</h2>
              <div className="space-y-4">
                {dashboardData?.transactions?.slice(0, 5).map((tx: any, index: number) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-lg" />
                      <div>
                        <p className="font-medium">{tx.asset?.name}</p>
                        <p className="text-sm text-gray-400">{tx.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-500">{tx.amount} ETH</p>
                      <p className="text-sm text-gray-400">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {(!dashboardData?.transactions || dashboardData.transactions.length === 0) && (
                  <p className="text-gray-400 text-center py-8">No transactions yet</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Your Assets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-effect rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Your Assets</h2>
              <button
                onClick={() => router.push('/upload')}
                className="px-4 py-2 bg-gradient-primary rounded-lg font-medium hover:scale-105 transition-transform"
              >
                Upload New
              </button>
            </div>

            <div className="space-y-4">
              {dashboardData?.assets?.map((asset: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl hover:bg-dark-800 transition-colors cursor-pointer"
                  onClick={() => router.push(`/assets/${asset._id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-primary rounded-lg" />
                    <div>
                      <h3 className="font-bold mb-1">{asset.name}</h3>
                      <p className="text-sm text-gray-400 line-clamp-1">{asset.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 text-sm">
                    <div className="text-center">
                      <div className="font-bold">{asset.views}</div>
                      <div className="text-gray-400">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{asset.downloads}</div>
                      <div className="text-gray-400">Downloads</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-primary-500">{asset.price} ETH</div>
                      <div className="text-gray-400">Price</div>
                    </div>
                  </div>
                </div>
              ))}
              {(!dashboardData?.assets || dashboardData.assets.length === 0) && (
                <p className="text-gray-400 text-center py-8">No assets yet. Upload your first AI asset!</p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
