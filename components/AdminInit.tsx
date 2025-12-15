import React, { useState } from 'react';
import { Button } from './ui/Button';

interface AdminInitProps {
  onClose: () => void;
}

export const AdminInit: React.FC<AdminInitProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleInit = async () => {
    setLoading(true);
    setError(null);
    setLogs([]);

    try {
      // Fix: Cast import.meta to any to resolve TS error 'Property env does not exist on type ImportMeta'
      const token = (import.meta as any).env?.VITE_BOOTSTRAP_TOKEN || process.env.NEXT_PUBLIC_BOOTSTRAP_TOKEN;
      
      const response = await fetch('/api/init-stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      setLogs(data.logs || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl relative">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors"
        >
            ✕
        </button>

        <h2 className="text-2xl font-black uppercase text-white mb-6 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            Admin System
        </h2>

        <p className="text-gray-400 text-sm mb-6">
            Initialisation de l'infrastructure Stripe. Cette action est idempotente (création uniquement si manquant).
        </p>

        <div className="space-y-4">
            <Button 
                onClick={handleInit} 
                variant="primary" 
                fullWidth 
                disabled={loading}
                className={loading ? 'opacity-50' : ''}
            >
                {loading ? 'Initialisation...' : 'Lancer Init Stripe'}
            </Button>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-xs font-mono">
                    ERROR: {error}
                </div>
            )}

            <div className="bg-black rounded-lg p-4 h-48 overflow-y-auto border border-white/5 font-mono text-xs">
                {logs.length === 0 && <span className="text-gray-600">// Ready for logs...</span>}
                {logs.map((log, i) => (
                    <div key={i} className="text-green-500 mb-1">{`> ${log}`}</div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};