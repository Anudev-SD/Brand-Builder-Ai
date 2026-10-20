import React, { useRef } from 'react';
import { Camera, Sparkles, Upload, RefreshCw, CheckCircle2, Lock, Eye, Download } from 'lucide-react';
import { ProductProfile, GeneratedShot } from '../types';

interface MasterShotStudioProps {
  product: ProductProfile;
  masterShot: GeneratedShot | null;
  isGenerating: boolean;
  onGenerateMaster: () => void;
  onUploadCustomImage: (base64Image: string) => void;
  onInspect: (shot: GeneratedShot) => void;
}

export const MasterShotStudio: React.FC<MasterShotStudioProps> = ({
  product,
  masterShot,
  isGenerating,
  onGenerateMaster,
  onUploadCustomImage,
  onInspect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUploadCustomImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold border border-amber-500/30">
              2
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">Canonical Master Packshot</h2>
            {masterShot && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                <Lock className="w-2.5 h-2.5" />
                Anchor Locked
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            The reference studio packshot passed to Nano-Banana to maintain strict visual consistency across billboards,
            newspapers, and social ads.
          </p>
        </div>

        {/* Generate / Re-generate buttons */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-all"
            title="Upload an existing product image to use as anchor"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Upload Photo</span>
          </button>

          <button
            type="button"
            onClick={onGenerateMaster}
            disabled={isGenerating || !product.name}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
            )}
            <span>{isGenerating ? 'Rendering Master...' : masterShot ? 'Re-roll Master' : 'Generate Master Packshot'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: Image Container */}
        <div className="md:col-span-5 lg:col-span-4 flex justify-center">
          <div className="relative w-full aspect-square max-w-[280px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center group shadow-inner">
            {masterShot ? (
              <>
                <img
                  src={masterShot.imageUrl}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => onInspect(masterShot)}
                    className="p-2 rounded-lg bg-slate-800/90 text-white hover:bg-slate-700 border border-slate-600 text-xs flex items-center gap-1 shadow-lg"
                    title="Inspect prompt & full view"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => downloadImage(masterShot.imageUrl, `${product.name.replace(/\s+/g, '_')}_master`)}
                    className="p-2 rounded-lg bg-slate-800/90 text-white hover:bg-slate-700 border border-slate-600 text-xs flex items-center gap-1 shadow-lg"
                    title="Download master packshot"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-300" />
                  </button>
                </div>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-[10px] font-semibold text-amber-400">
                  Master Packshot (1:1)
                </div>
              </>
            ) : (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                  <Camera className="w-6 h-6 stroke-[1.75]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-300">No Master Shot Yet</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] mx-auto">
                    Click "Generate Master Packshot" to create the canonical product visual anchor.
                  </p>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-7 h-7 text-amber-400 animate-spin" />
                <span className="text-xs font-semibold text-amber-300">Nano-Banana Generating Packshot...</span>
                <span className="text-[10px] text-slate-400">Enforcing zero humans & studio lighting</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Consistency Blueprint Details */}
        <div className="md:col-span-7 lg:col-span-8 space-y-3.5 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Consistency Blueprint Pipeline
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Nano-Banana Image-to-Image Ready
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              When you generate mediums below (billboards, newspapers, transit posters, etc.), Nano-Banana will use this
              master shot as an image conditioning reference. The exact container silhouette, embossed labels, and
              materials will be preserved while altering the environmental context.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-500 block text-[10px]">Product Subject</span>
              <span className="font-semibold text-slate-200 truncate block mt-0.5">
                {product.name || 'Untitled Product'}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-500 block text-[10px]">Brand Palette</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="w-3 h-3 rounded-full border border-black/50"
                  style={{ backgroundColor: product.primaryColor || '#2D4A3E' }}
                />
                <span
                  className="w-3 h-3 rounded-full border border-black/50"
                  style={{ backgroundColor: product.secondaryColor || '#D4AF37' }}
                />
                <span className="text-[10px] font-mono text-slate-400">{product.primaryColor || '#2D4A3E'}</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 col-span-2 sm:col-span-1">
              <span className="text-slate-500 block text-[10px]">Zero-Humans Constraint</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Strictly Enforced
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
