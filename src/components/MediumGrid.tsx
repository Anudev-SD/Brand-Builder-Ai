import React, { useState } from 'react';
import {
  MediumDefinition,
  MediumId,
  GeneratedShot,
  ProductProfile,
} from '../types';
import { MEDIUMS } from '../data/presets';
import {
  Sparkles,
  RefreshCw,
  Eye,
  Download,
  Sliders,
  CheckCircle2,
  Tv,
  Newspaper,
  Smartphone,
  Layers,
  Maximize2,
  Box,
  BookOpen,
  Store,
  SplitSquareVertical,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface MediumGridProps {
  product: ProductProfile;
  masterShot: GeneratedShot | null;
  generatedShots: Record<MediumId, GeneratedShot | undefined>;
  generatingMediums: Record<MediumId, boolean>;
  isBatchGenerating: boolean;
  batchProgress: { current: number; total: number; currentMediumName?: string };
  onGenerateMedium: (mediumId: MediumId, customNotes?: string) => void;
  onGenerateBatch: (selectedIds: MediumId[]) => void;
  onInspect: (shot: GeneratedShot) => void;
  onCompareWithMaster: (shot: GeneratedShot) => void;
}

export const MediumGrid: React.FC<MediumGridProps> = ({
  product,
  masterShot,
  generatedShots,
  generatingMediums,
  isBatchGenerating,
  batchProgress,
  onGenerateMedium,
  onGenerateBatch,
  onInspect,
  onCompareWithMaster,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedMediums, setSelectedMediums] = useState<Set<MediumId>>(
    new Set(['billboard', 'newspaper', 'social_post', 'bus_shelter'])
  );
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [customNotes, setCustomNotes] = useState<Record<string, string>>({});

  const categories = ['All', 'Outdoor', 'Print', 'Digital', 'Retail'];

  const filteredMediums =
    activeCategory === 'All'
      ? MEDIUMS
      : MEDIUMS.filter((m) => m.category === activeCategory);

  const toggleSelect = (id: MediumId) => {
    const next = new Set(selectedMediums);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedMediums(next);
  };

  const selectAll = () => {
    setSelectedMediums(new Set(MEDIUMS.map((m) => m.id)));
  };

  const deselectAll = () => {
    setSelectedMediums(new Set());
  };

  const toggleNotes = (id: string) => {
    setExpandedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNotesChange = (id: string, text: string) => {
    setCustomNotes((prev) => ({ ...prev, [id]: text }));
  };

  const downloadImage = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Tv':
        return <Tv className="w-4 h-4 text-amber-400" />;
      case 'Newspaper':
        return <Newspaper className="w-4 h-4 text-orange-400" />;
      case 'Smartphone':
        return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case 'Layers':
        return <Layers className="w-4 h-4 text-blue-400" />;
      case 'Maximize2':
        return <Maximize2 className="w-4 h-4 text-purple-400" />;
      case 'Box':
        return <Box className="w-4 h-4 text-pink-400" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-indigo-400" />;
      case 'Store':
        return <Store className="w-4 h-4 text-teal-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  const getAspectRatioClass = (ratio: string) => {
    switch (ratio) {
      case '16:9':
        return 'aspect-video';
      case '3:4':
        return 'aspect-[3/4]';
      case '4:3':
        return 'aspect-[4/3]';
      case '9:16':
        return 'aspect-[9/16]';
      case '1:1':
      default:
        return 'aspect-square';
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold border border-amber-500/30">
                3
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">
                Imagine Across Advertising Mediums
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Produce consistent brand campaigns across billboards, vintage newspapers, social feeds, and transit displays.
            </p>
          </div>

          {/* Action Batch Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2">
              <button
                type="button"
                onClick={selectAll}
                className="hover:text-amber-400 underline underline-offset-2 transition-colors"
              >
                Select All ({MEDIUMS.length})
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={deselectAll}
                className="hover:text-slate-300 transition-colors"
              >
                Deselect
              </button>
            </div>

            <button
              type="button"
              disabled={isBatchGenerating || selectedMediums.size === 0 || !product.name}
              onClick={() => onGenerateBatch(Array.from(selectedMediums))}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isBatchGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
              )}
              <span>
                {isBatchGenerating
                  ? `Rendering (${batchProgress.current}/${batchProgress.total})...`
                  : `Generate Full Campaign (${selectedMediums.size} Mediums)`}
              </span>
            </button>
          </div>
        </div>

        {/* Batch Progress Bar if active */}
        {isBatchGenerating && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>
                  Rendering queue with Nano-Banana:{' '}
                  <span className="text-white">{batchProgress.currentMediumName || 'Preparing...'}</span>
                </span>
              </span>
              <span>
                {batchProgress.current} of {batchProgress.total} completed
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-amber-500/20">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(batchProgress.current / Math.max(batchProgress.total, 1)) * 100}%`,
                }}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Maintaining exact product geometry, materials, and colors from master anchor. Strictly zero people.
            </p>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="text-slate-600 text-xs ml-auto hidden sm:inline">
            Showing {filteredMediums.length} mediums
          </span>
        </div>
      </div>

      {/* Medium Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredMediums.map((medium) => {
          const shot = generatedShots[medium.id];
          const isGeneratingThis = Boolean(generatingMediums[medium.id]);
          const isSelected = selectedMediums.has(medium.id);
          const notesExpanded = Boolean(expandedNotes[medium.id]);
          const notesValue = customNotes[medium.id] ?? medium.defaultNotes;

          return (
            <div
              key={medium.id}
              className={`flex flex-col bg-slate-900/90 border rounded-2xl overflow-hidden transition-all shadow-lg ${
                isGeneratingThis
                  ? 'border-amber-500/60 shadow-amber-500/10 ring-1 ring-amber-500/30'
                  : shot
                  ? 'border-slate-800 hover:border-slate-700'
                  : 'border-slate-800/70 opacity-95'
              }`}
            >
              {/* Card Header */}
              <div className="p-3.5 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(medium.id)}
                    className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-500/30 bg-slate-950 cursor-pointer"
                    title="Include in full campaign generation"
                  />
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 flex-shrink-0">
                    {getIcon(medium.iconName)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-white truncate" title={medium.name}>
                      {medium.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">{medium.tag}</span>
                  </div>
                </div>

                {/* Individual Generate Button */}
                <button
                  type="button"
                  onClick={() => onGenerateMedium(medium.id, notesValue)}
                  disabled={isGeneratingThis || isBatchGenerating || !product.name}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  title={`Generate ${medium.name} with Nano-Banana`}
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isGeneratingThis ? 'animate-spin text-amber-400' : ''}`}
                  />
                </button>
              </div>

              {/* Viewport Image Area */}
              <div className="relative bg-slate-950 flex items-center justify-center overflow-hidden group">
                <div className={`w-full ${getAspectRatioClass(medium.aspectRatio)} flex items-center justify-center relative`}>
                  {shot ? (
                    <>
                      <img
                        src={shot.imageUrl}
                        alt={`${product.name} on ${medium.name}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Hover Overlay Controls */}
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 backdrop-blur-[2px]">
                        <button
                          type="button"
                          onClick={() => onInspect(shot)}
                          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 text-xs flex items-center gap-1 shadow-lg"
                          title="Full inspect & prompt details"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-[11px]">Inspect</span>
                        </button>

                        {masterShot && (
                          <button
                            type="button"
                            onClick={() => onCompareWithMaster(shot)}
                            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 text-xs flex items-center gap-1 shadow-lg"
                            title="Side-by-side consistency check against Master Packshot"
                          >
                            <SplitSquareVertical className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[11px]">Compare</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            downloadImage(
                              shot.imageUrl,
                              `${product.name.replace(/\s+/g, '_')}_${medium.id}`
                            )
                          }
                          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 text-xs shadow-lg"
                          title="Download PNG"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-300" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 text-center space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-500 mx-auto flex items-center justify-center">
                        {getIcon(medium.iconName)}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 max-w-[180px] mx-auto">
                        {medium.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => onGenerateMedium(medium.id, notesValue)}
                        disabled={isGeneratingThis || isBatchGenerating || !product.name}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-medium transition-all"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Visualize</span>
                      </button>
                    </div>
                  )}

                  {/* Loading spinner over viewport */}
                  {isGeneratingThis && (
                    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center gap-2 p-3 text-center">
                      <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
                      <span className="text-xs font-semibold text-amber-300">Nano-Banana Generating...</span>
                      <span className="text-[10px] text-slate-400 leading-tight">
                        Preserving product consistency & 0 people
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer / Art Direction Drawer */}
              <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 mt-auto space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => toggleNotes(medium.id)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-400 font-medium transition-colors"
                  >
                    <Sliders className="w-3 h-3 text-slate-400" />
                    <span>Art Direction Notes</span>
                    {notesExpanded ? (
                      <ChevronUp className="w-3 h-3 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-slate-500" />
                    )}
                  </button>

                  {shot && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Consistent
                    </span>
                  )}
                </div>

                {notesExpanded && (
                  <div className="pt-1 animate-in fade-in duration-150">
                    <textarea
                      rows={2}
                      value={notesValue}
                      onChange={(e) => handleNotesChange(medium.id, e.target.value)}
                      placeholder="e.g. Sunset golden hour, rainy reflections, clean minimalist studio plinth..."
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/70"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
