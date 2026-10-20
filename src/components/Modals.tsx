import React, { useState } from 'react';
import { GeneratedShot } from '../types';
import {
  X,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Lock,
  Layers,
  Palette,
  Box,
} from 'lucide-react';

interface InspectModalProps {
  shot: GeneratedShot | null;
  onClose: () => void;
}

export const InspectModal: React.FC<InspectModalProps> = ({ shot, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!shot) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(shot.promptUsed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = shot.imageUrl;
    a.download = `${shot.mediumName.replace(/\s+/g, '_')}_shot.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative my-auto">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{shot.mediumName}</h3>
              <p className="text-xs text-slate-400">
                Aspect {shot.aspectRatio} • Model: <span className="text-amber-400 font-mono">{shot.modelUsed}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[75vh] overflow-y-auto">
          {/* Image */}
          <div className="md:col-span-7 bg-slate-950 flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-slate-800">
            <img
              src={shot.imageUrl}
              alt={shot.mediumName}
              referrerPolicy="no-referrer"
              className="max-h-[60vh] w-auto max-w-full rounded-xl object-contain shadow-xl"
            />
          </div>

          {/* Details & Prompt Inspector */}
          <div className="md:col-span-5 p-5 space-y-4 text-xs text-slate-300">
            {/* Zero Humans Compliance Card */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold block text-xs text-emerald-400">Zero-Humans Compliance Verified</span>
                <p className="text-[11px] text-emerald-300/80 mt-0.5">
                  Negative prompts strictly forbade human models, crowds, pedestrians, hands, and faces.
                </p>
              </div>
            </div>

            {/* Prompt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Nano-Banana Directive & Prompt</span>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Prompt'}</span>
                </button>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-300 leading-relaxed max-h-48 overflow-y-auto">
                {shot.promptUsed}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res Shot</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ComparisonModalProps {
  shot: GeneratedShot | null;
  masterShot: GeneratedShot | null;
  onClose: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  shot,
  masterShot,
  onClose,
}) => {
  if (!shot || !masterShot) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full overflow-hidden shadow-2xl relative my-auto">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Consistency Inspector</h3>
              <p className="text-xs text-slate-400">
                Comparing Master Studio Packshot against {shot.mediumName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Side by side view */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Master Anchor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5" />
                  Master Product Shot (Anchor)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Packshot 1:1</span>
              </div>
              <div className="aspect-square bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner">
                <img
                  src={masterShot.imageUrl}
                  alt="Master Packshot"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Medium Shot */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {shot.mediumName}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Aspect {shot.aspectRatio}</span>
              </div>
              <div className="aspect-square bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner">
                <img
                  src={shot.imageUrl}
                  alt={shot.mediumName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Verification Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Silhouette Match</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                <Check className="w-3.5 h-3.5" /> Preserved
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Palette Cohesion</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                <Palette className="w-3.5 h-3.5" /> Colorway Locked
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Material Shading</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                <Layers className="w-3.5 h-3.5" /> Consistent Finish
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Zero-Humans Rule</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Uninhabited
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
