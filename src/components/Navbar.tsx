import React from 'react';
import { Sparkles, ShieldCheck, Cpu } from 'lucide-react';

interface NavbarProps {
  model: string;
  onModelChange: (model: string) => void;
  hasApiKey: boolean;
  totalGenerated: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  model,
  onModelChange,
  hasApiKey,
  totalGenerated,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">Brand Builder</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Multi-Medium Visualizer with Nano-Banana & Product Consistency
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Zero Humans Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium">Strict Zero-Humans Guard</span>
          </div>

          {/* Model Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <div className="flex items-center gap-1.5 px-2 py-1 text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-slate-300">Engine:</span>
            </div>
            <button
              onClick={() => onModelChange('gemini-3.1-flash-lite-image')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                model === 'gemini-3.1-flash-lite-image'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Nano-Banana default image generation model"
            >
              Nano-Banana
            </button>
            <button
              onClick={() => onModelChange('gemini-nano-banana-2.1')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                model === 'gemini-nano-banana-2.1'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Nano-Banana 2.1 with configurable resolution"
            >
              Nano-Banana 2.1
            </button>
          </div>

          {/* Status badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
              hasApiKey
                ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-950/50 border-amber-500/30 text-amber-400'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${hasApiKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}
            />
            <span className="hidden sm:inline">{hasApiKey ? 'Ready' : 'API Key Configured'}</span>
            {totalGenerated > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 text-[10px]">
                {totalGenerated} shots
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
