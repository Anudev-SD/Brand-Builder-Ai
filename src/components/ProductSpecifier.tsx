import React, { useState } from 'react';
import { ProductProfile, SamplePreset } from '../types';
import { SAMPLE_PRESETS } from '../data/presets';
import { Sparkles, Palette, Layers, Box, Wand2, Check, RefreshCw } from 'lucide-react';

interface ProductSpecifierProps {
  product: ProductProfile;
  onChange: (updated: ProductProfile) => void;
  onApplyPreset: (preset: SamplePreset) => void;
  isPolishing: boolean;
  onPolishWithAI: () => void;
}

export const ProductSpecifier: React.FC<ProductSpecifierProps> = ({
  product,
  onChange,
  onApplyPreset,
  isPolishing,
  onPolishWithAI,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('matcha');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const handlePresetClick = (preset: SamplePreset) => {
    setSelectedPresetId(preset.id);
    onApplyPreset(preset);
  };

  const updateField = (field: keyof ProductProfile, value: string) => {
    onChange({ ...product, [field]: value });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold border border-amber-500/30">
              1
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">Product Blueprint</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Define your product's signature physical identity to lock in consistency across all advertising mediums.
          </p>
        </div>

        {/* AI Polish Button */}
        <button
          onClick={onPolishWithAI}
          disabled={isPolishing || (!product.name && !product.description)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-yellow-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          title="Refine materials, silhouette, and colors with AI"
        >
          {isPolishing ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
          ) : (
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span>{isPolishing ? 'Polishing Brand...' : 'AI Brand Polish'}</span>
        </button>
      </div>

      {/* Preset Inspirations */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Instant Inspirations
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {SAMPLE_PRESETS.map((p) => {
            const isSelected = selectedPresetId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePresetClick(p)}
                className={`p-2.5 rounded-xl text-left border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/5 text-white'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold truncate text-slate-100">{p.name}</span>
                    {isSelected && <Check className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{p.summary}</p>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/40"
                    style={{ backgroundColor: p.primaryColor }}
                    title={`Primary: ${p.primaryColor}`}
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/40"
                    style={{ backgroundColor: p.secondaryColor }}
                    title={`Accent: ${p.secondaryColor}`}
                  />
                  <span className="text-[9px] text-slate-500 ml-auto font-mono truncate max-w-[60px]">
                    {p.category.split('&')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Core Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Product Name */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Product Name</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="e.g. Komorebi Matcha, Aura Serum"
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 transition-all"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
          <input
            type="text"
            value={product.category}
            onChange={(e) => updateField('category', e.target.value)}
            placeholder="e.g. Artisanal Beverage, Skincare, Audio"
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 transition-all"
          />
        </div>

        {/* Tagline / Ad Slogan */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Advertising Slogan</label>
          <input
            type="text"
            value={product.tagline}
            onChange={(e) => updateField('tagline', e.target.value)}
            placeholder="e.g. Pure Radiance Unveiled"
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 transition-all"
          />
        </div>
      </div>

      {/* Physical Signature Description */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-amber-400" />
            Physical Identity & Packaging Description (Consistency Anchor)
          </label>
          <span className="text-[11px] text-slate-400">Specify shape, bottle/box, cap, textures, and label placement</span>
        </div>
        <textarea
          rows={3}
          value={product.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Describe exact geometry, container shape, cap details, colors, textures, and logos..."
          className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 transition-all leading-relaxed"
        />
      </div>

      {/* Colors & Materials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1">
        {/* Primary Color */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            Primary Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={product.primaryColor || '#2D4A3E'}
              onChange={(e) => updateField('primaryColor', e.target.value)}
              className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer bg-slate-950 p-0.5"
            />
            <input
              type="text"
              value={product.primaryColor}
              onChange={(e) => updateField('primaryColor', e.target.value)}
              placeholder="#2D4A3E"
              className="w-full px-2.5 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500/70"
            />
          </div>
        </div>

        {/* Secondary Color */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-orange-400" />
            Accent Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={product.secondaryColor || '#D4AF37'}
              onChange={(e) => updateField('secondaryColor', e.target.value)}
              className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer bg-slate-950 p-0.5"
            />
            <input
              type="text"
              value={product.secondaryColor}
              onChange={(e) => updateField('secondaryColor', e.target.value)}
              placeholder="#D4AF37"
              className="w-full px-2.5 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500/70"
            />
          </div>
        </div>

        {/* Key Materials */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Tactile Materials & Finishes
          </label>
          <input
            type="text"
            value={product.materials}
            onChange={(e) => updateField('materials', e.target.value)}
            placeholder="e.g. Frosted glass, brushed brass, matte debossed paper"
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 transition-all"
          />
        </div>
      </div>

      {/* Advanced Brand Aesthetic Toggle */}
      <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-slate-400 hover:text-amber-400 font-medium transition-colors"
        >
          {showAdvanced ? 'Hide Brand Aesthetic Tuning' : '+ Customize Brand Aesthetic & Lighting Atmosphere'}
        </button>

        <span className="text-[11px] text-slate-500">
          Strict Zero-Humans Guard automatically embedded in all generation prompts
        </span>
      </div>

      {showAdvanced && (
        <div className="pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Overall Brand Aesthetic & Commercial Style
          </label>
          <input
            type="text"
            value={product.brandAesthetic}
            onChange={(e) => updateField('brandAesthetic', e.target.value)}
            placeholder="e.g. Ultra-clean Scandinavian minimalism, dramatic architectural shadows, high-fashion luxury studio"
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/70 transition-all"
          />
        </div>
      )}
    </div>
  );
};
