'use client';

import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface StatsSummaryProps {
  stats: {
    completed: number;
    incomplete: number;
    cancelled: number;
    total: number;
    completionRate: number;
  };
}

const StatsSummary = ({ stats }: StatsSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-500/20 rounded-full">
            <CheckCircle className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-sm text-zinc-400">Completados</p>
            <p className="text-2xl font-bold text-zinc-50">{stats.completed}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-amber-500/20 rounded-full">
            <AlertCircle className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-zinc-400">Incompletos</p>
            <p className="text-2xl font-bold text-zinc-50">{stats.incomplete}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-rose-500/20 rounded-full">
            <XCircle className="h-6 w-6 text-rose-400" />
          </div>
          <div>
            <p className="text-sm text-zinc-400">Cancelados</p>
            <p className="text-2xl font-bold text-zinc-50">{stats.cancelled}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 rounded-lg p-4">
        <div className="flex flex-col h-full justify-center">
          <p className="text-sm text-zinc-400">Tasa de completitud</p>
          <div className="flex items-center mt-1">
            <div className="w-full bg-zinc-800 rounded-full h-2 mr-2">
              <div 
                className="bg-indigo-500 h-2 rounded-full" 
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
            <span className="text-lg font-bold text-zinc-50">{stats.completionRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;