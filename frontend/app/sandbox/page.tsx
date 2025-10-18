'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Lock, CheckCircle, AlertCircle, Code } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAccount } from 'wagmi';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function SandboxPage() {
  const { isConnected } = useAccount();
  const [modelHash, setModelHash] = useState('');
  const [inputData, setInputData] = useState('{\n  "input": "sample data"\n}');
  const [privacyMode, setPrivacyMode] = useState(true);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTest = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!modelHash) {
      toast.error('Please enter a model hash');
      return;
    }

    setTesting(true);
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      let parsedInput;
      
      try {
        parsedInput = JSON.parse(inputData);
      } catch (e) {
        toast.error('Invalid JSON input');
        setTesting(false);
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sandbox/test`,
        {
          modelHash,
          inputData: parsedInput,
          privacyMode,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResult(response.data.data);
      toast.success('Test completed successfully!');
    } catch (error: any) {
      console.error('Test error:', error);
      toast.error(error.response?.data?.message || 'Failed to test model');
    } finally {
      setTesting(false);
    }
  };

  return (
    <main className="min-h-screen bg-dark-900">
      <Navbar />

      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI Model <span className="text-gradient">Sandbox</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Test AI models in a secure, privacy-preserving environment with zero-knowledge proofs
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Test Configuration</h2>

              {/* Model Hash */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Model Hash / IPFS CID</label>
                <input
                  type="text"
                  value={modelHash}
                  onChange={(e) => setModelHash(e.target.value)}
                  placeholder="QmXxx... or asset ID"
                  className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none"
                />
              </div>

              {/* Input Data */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Input Data (JSON)</label>
                <textarea
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none font-mono text-sm resize-none"
                />
              </div>

              {/* Privacy Mode Toggle */}
              <div className="mb-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyMode}
                    onChange={(e) => setPrivacyMode(e.target.checked)}
                    className="w-5 h-5 rounded border-white/10 bg-dark-800 text-primary-500 focus:ring-primary-500"
                  />
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary-500" />
                    <span className="font-medium">Enable Privacy Mode (zkML)</span>
                  </div>
                </label>
                <p className="text-sm text-gray-400 mt-2 ml-8">
                  Generate zero-knowledge proofs to protect your input data
                </p>
              </div>

              {/* Test Button */}
              <button
                onClick={handleTest}
                disabled={testing || !isConnected}
                className="w-full py-4 bg-gradient-primary rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {testing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Run Test
                  </>
                )}
              </button>

              {/* Info Box */}
              <div className="mt-6 glass-effect rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-400">
                  <p className="mb-2">
                    Tests run in an isolated sandbox environment. Your data never leaves the secure enclave.
                  </p>
                  <p>Privacy mode uses zkSNARK proofs for maximum security.</p>
                </div>
              </div>
            </motion.div>

            {/* Results Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-effect rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Test Results</h2>

              {!result ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                  <Code className="w-16 h-16 mb-4 opacity-50" />
                  <p>Run a test to see results</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Status */}
                  <div className="flex items-center gap-3 p-4 bg-secondary-500/10 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-secondary-500" />
                    <div>
                      <p className="font-bold">Test Successful</p>
                      <p className="text-sm text-gray-400">
                        Execution time: {result.execution_time?.toFixed(3)}s
                      </p>
                    </div>
                  </div>

                  {/* Trust Score */}
                  <div className="glass-effect rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Trust Score</span>
                      <span className="text-2xl font-bold text-primary-500">
                        {(result.trust_score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary transition-all duration-500"
                        style={{ width: `${result.trust_score * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Output */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Output</label>
                    <pre className="p-4 bg-dark-800 rounded-xl text-sm overflow-x-auto">
                      {JSON.stringify(result.output, null, 2)}
                    </pre>
                  </div>

                  {/* ZK Proof */}
                  {result.zk_proof && (
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-primary-500" />
                        Zero-Knowledge Proof
                      </label>
                      <div className="p-4 bg-dark-800 rounded-xl text-sm font-mono break-all">
                        {result.zk_proof}
                      </div>
                    </div>
                  )}

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-effect rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-primary-500">
                        {result.success ? '✓' : '✗'}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Status</div>
                    </div>
                    <div className="glass-effect rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-secondary-500">
                        {result.execution_time?.toFixed(2)}s
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Execution Time</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Lock,
                title: 'Privacy-Preserving',
                description: 'Test models without exposing sensitive data using zkML technology',
              },
              {
                icon: CheckCircle,
                title: 'Verified Execution',
                description: 'All tests are cryptographically verified and logged on-chain',
              },
              {
                icon: Play,
                title: 'Instant Results',
                description: 'Get immediate feedback on model performance and accuracy',
              },
            ].map((feature, index) => (
              <div key={index} className="glass-effect rounded-xl p-6 text-center">
                <feature.icon className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
