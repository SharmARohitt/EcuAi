'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAccount } from 'wagmi';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function UploadPage() {
  const { address, isConnected } = useAccount();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'model',
    category: '',
    price: '',
    royaltyPercentage: '10',
    license: 'MIT',
    tags: '',
    framework: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);

    try {
      const data = new FormData();
      data.append('file', file);
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/assets/upload`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success('Asset uploaded successfully!');
      // Reset form
      setFile(null);
      setFormData({
        name: '',
        description: '',
        type: 'model',
        category: '',
        price: '',
        royaltyPercentage: '10',
        license: 'MIT',
        tags: '',
        framework: '',
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload asset');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-dark-900">
      <Navbar />

      <section className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Upload Your <span className="text-gradient">AI Asset</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Share your AI models and datasets with the world
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="glass-effect rounded-2xl p-8"
          >
            {/* File Upload */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-2">Upload File *</label>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  file ? 'border-primary-500 bg-primary-500/10' : 'border-white/10 hover:border-primary-500/50'
                }`}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <File className="w-8 h-8 text-primary-500" />
                      <div className="text-left">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-400">Max file size: 100MB</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Asset Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="My AI Model"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none"
                >
                  <option value="model">Model</option>
                  <option value="dataset">Dataset</option>
                  <option value="compute">Compute</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none resize-none"
                placeholder="Describe your AI asset..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="e.g., NLP, Computer Vision"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Framework</label>
                <input
                  type="text"
                  name="framework"
                  value={formData.framework}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="e.g., PyTorch, TensorFlow"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Price (ETH) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.001"
                  min="0"
                  className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Royalty % *</label>
                <input
                  type="number"
                  name="royaltyPercentage"
                  value={formData.royaltyPercentage}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="10"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium mb-2">License *</label>
                <select
                  name="license"
                  value={formData.license}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none"
                >
                  <option value="MIT">MIT</option>
                  <option value="Apache-2.0">Apache 2.0</option>
                  <option value="GPL-3.0">GPL 3.0</option>
                  <option value="BSD-3-Clause">BSD 3-Clause</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="nlp, transformer, gpt"
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="glass-effect rounded-xl p-4 mb-8 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-400">
                <p className="mb-2">
                  Your asset will be uploaded to IPFS and registered on OriginTrail DKG for provenance verification.
                </p>
                <p>This process may take a few minutes.</p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || !isConnected}
              className="w-full py-4 bg-gradient-primary rounded-xl font-semibold text-lg hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </span>
              ) : (
                'Upload Asset'
              )}
            </button>
          </motion.form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
