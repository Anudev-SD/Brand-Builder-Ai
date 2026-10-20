/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductSpecifier } from './components/ProductSpecifier';
import { MasterShotStudio } from './components/MasterShotStudio';
import { MediumGrid } from './components/MediumGrid';
import { InspectModal, ComparisonModal } from './components/Modals';
import {
  ProductProfile,
  MediumId,
  GeneratedShot,
  SamplePreset,
} from './types';
import { SAMPLE_PRESETS, MEDIUMS } from './data/presets';
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Download,
  Info,
  ShieldCheck,
} from 'lucide-react';

export default function App() {
  // Model state: defaults to Nano-Banana (gemini-3.1-flash-lite-image)
  const [model, setModel] = useState<string>('gemini-3.1-flash-lite-image');
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  // Active product definition (initial preset: Matcha)
  const [product, setProduct] = useState<ProductProfile>({
    name: SAMPLE_PRESETS[0].name,
    category: SAMPLE_PRESETS[0].category,
    tagline: SAMPLE_PRESETS[0].tagline,
    description: SAMPLE_PRESETS[0].description,
    primaryColor: SAMPLE_PRESETS[0].primaryColor,
    secondaryColor: SAMPLE_PRESETS[0].secondaryColor,
    materials: SAMPLE_PRESETS[0].materials,
    brandAesthetic: SAMPLE_PRESETS[0].brandAesthetic,
  });

  // Master packshot anchor
  const [masterShot, setMasterShot] = useState<GeneratedShot | null>(null);
  const [isGeneratingMaster, setIsGeneratingMaster] = useState<boolean>(false);

  // Medium shots
  const [generatedShots, setGeneratedShots] = useState<
    Record<MediumId, GeneratedShot | undefined>
  >({} as Record<MediumId, GeneratedShot | undefined>);
  const [generatingMediums, setGeneratingMediums] = useState<
    Record<MediumId, boolean>
  >({} as Record<MediumId, boolean>);

  // Batch generation
  const [isBatchGenerating, setIsBatchGenerating] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<{
    current: number;
    total: number;
    currentMediumName?: string;
  }>({ current: 0, total: 0 });

  // AI polishing state
  const [isPolishing, setIsPolishing] = useState<boolean>(false);

  // Modals
  const [inspectShot, setInspectShot] = useState<GeneratedShot | null>(null);
  const [compareShot, setCompareShot] = useState<GeneratedShot | null>(null);

  // Notification Toast
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Check health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        if (data.hasApiKey !== undefined) {
          setHasApiKey(data.hasApiKey);
        }
      })
      .catch((err) => {
        console.warn('Health check error:', err);
      });
  }, []);

  // Handle Preset Selection
  const handleApplyPreset = (preset: SamplePreset) => {
    setProduct({
      name: preset.name,
      category: preset.category,
      tagline: preset.tagline,
      description: preset.description,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      materials: preset.materials,
      brandAesthetic: preset.brandAesthetic,
    });
    // Clear existing shots when changing to a whole new product preset
    setMasterShot(null);
    setGeneratedShots({} as Record<MediumId, GeneratedShot | undefined>);
    showToast('info', `Loaded preset "${preset.name}". Generate a Master Shot to begin.`);
  };

  // AI Brand Polish using Gemini 3.8 Flash
  const handlePolishWithAI = async () => {
    setIsPolishing(true);
    try {
      const res = await fetch('/api/refine-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: product.name,
          category: product.category,
          roughIdea: product.description,
          primaryColor: product.primaryColor,
          secondaryColor: product.secondaryColor,
          materials: product.materials,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'Failed to refine product');
      }

      const data = json.data;
      setProduct((prev) => ({
        ...prev,
        description: data.visualAnchor || prev.description,
        tagline: data.tagline || prev.tagline,
        materials: data.keyMaterials || prev.materials,
        category: data.recommendedCategory || prev.category,
        primaryColor: data.palette?.[0] || prev.primaryColor,
        secondaryColor: data.palette?.[1] || prev.secondaryColor,
      }));

      showToast('success', 'AI Brand Strategist polished your product specifications!');
    } catch (err: any) {
      console.error(err);
      showToast('error', err.message || 'Failed to polish product specifications');
    } finally {
      setIsPolishing(false);
    }
  };

  // Generate Master Packshot with Nano-Banana
  const handleGenerateMaster = async () => {
    if (!product.name) {
      showToast('error', 'Please provide a product name first.');
      return;
    }

    setIsGeneratingMaster(true);
    try {
      const res = await fetch('/api/generate-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: product.name,
          category: product.category,
          tagline: product.tagline,
          description: product.description,
          primaryColor: product.primaryColor,
          secondaryColor: product.secondaryColor,
          materials: product.materials,
          brandAesthetic: product.brandAesthetic,
          model,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to generate master packshot');
      }

      const newShot: GeneratedShot = {
        id: `master_${Date.now()}`,
        mediumId: 'master',
        mediumName: 'Master Packshot',
        imageUrl: data.imageUrl,
        aspectRatio: '1:1',
        timestamp: Date.now(),
        promptUsed: data.prompt,
        modelUsed: data.model || model,
      };

      setMasterShot(newShot);
      showToast('success', 'Master Packshot generated with Nano-Banana! Consistency anchor locked.');
    } catch (err: any) {
      console.error(err);
      showToast('error', err.message || 'Error generating master packshot');
    } finally {
      setIsGeneratingMaster(false);
    }
  };

  // Upload Custom Anchor Image
  const handleUploadCustomImage = (base64Image: string) => {
    const uploadedShot: GeneratedShot = {
      id: `upload_${Date.now()}`,
      mediumId: 'master',
      mediumName: 'Uploaded Master Reference',
      imageUrl: base64Image,
      aspectRatio: '1:1',
      timestamp: Date.now(),
      promptUsed: 'User provided reference photograph for consistency anchor',
      modelUsed: 'Custom Upload',
    };
    setMasterShot(uploadedShot);
    showToast('success', 'Custom product photo uploaded as consistency anchor!');
  };

  // Generate a single medium shot with Nano-Banana
  const handleGenerateMedium = async (mediumId: MediumId, notes?: string): Promise<GeneratedShot | null> => {
    setGeneratingMediums((prev) => ({ ...prev, [mediumId]: true }));
    try {
      const res = await fetch('/api/generate-medium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediumId,
          product,
          referenceImage: masterShot?.imageUrl,
          customNotes: notes,
          model,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || `Failed to generate ${mediumId}`);
      }

      const newShot: GeneratedShot = {
        id: `${mediumId}_${Date.now()}`,
        mediumId,
        mediumName: data.mediumName,
        imageUrl: data.imageUrl,
        aspectRatio: data.aspectRatio,
        timestamp: Date.now(),
        promptUsed: data.promptUsed,
        modelUsed: data.model || model,
        customNotes: notes,
      };

      setGeneratedShots((prev) => ({ ...prev, [mediumId]: newShot }));
      showToast('success', `Generated ${data.mediumName} with Nano-Banana!`);
      return newShot;
    } catch (err: any) {
      console.error(err);
      showToast('error', err.message || `Error rendering ${mediumId}`);
      return null;
    } finally {
      setGeneratingMediums((prev) => ({ ...prev, [mediumId]: false }));
    }
  };

  // Generate Batch across all selected mediums
  const handleGenerateBatch = async (selectedIds: MediumId[]) => {
    if (selectedIds.length === 0) return;

    // If no master shot yet, advise user or generate master first
    let currentMaster = masterShot;
    if (!currentMaster) {
      showToast('info', 'Generating Master Packshot anchor first for product consistency...');
      setIsGeneratingMaster(true);
      try {
        const res = await fetch('/api/generate-master', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: product.name,
            category: product.category,
            tagline: product.tagline,
            description: product.description,
            primaryColor: product.primaryColor,
            secondaryColor: product.secondaryColor,
            materials: product.materials,
            brandAesthetic: product.brandAesthetic,
            model,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          currentMaster = {
            id: `master_${Date.now()}`,
            mediumId: 'master',
            mediumName: 'Master Packshot',
            imageUrl: data.imageUrl,
            aspectRatio: '1:1',
            timestamp: Date.now(),
            promptUsed: data.prompt,
            modelUsed: data.model || model,
          };
          setMasterShot(currentMaster);
        }
      } catch (err) {
        console.warn('Master generation during batch warning:', err);
      } finally {
        setIsGeneratingMaster(false);
      }
    }

    setIsBatchGenerating(true);
    setBatchProgress({ current: 0, total: selectedIds.length });

    for (let i = 0; i < selectedIds.length; i++) {
      const mid = selectedIds[i];
      const mediumDef = MEDIUMS.find((m) => m.id === mid);
      setBatchProgress({
        current: i,
        total: selectedIds.length,
        currentMediumName: mediumDef?.name || mid,
      });

      await handleGenerateMedium(mid);

      setBatchProgress({
        current: i + 1,
        total: selectedIds.length,
        currentMediumName: mediumDef?.name || mid,
      });
    }

    setIsBatchGenerating(false);
    showToast('success', `Completed brand campaign across ${selectedIds.length} mediums!`);
  };

  // Export Complete Campaign Report (JSON + info)
  const handleExportCampaign = () => {
    const campaignData = {
      product,
      modelUsed: model,
      exportTimestamp: new Date().toISOString(),
      masterPackshot: masterShot ? { prompt: masterShot.promptUsed, url: masterShot.imageUrl } : null,
      mediums: Object.entries(generatedShots)
        .filter(([_, shot]) => Boolean(shot))
        .map(([id, shot]) => ({
          mediumId: id,
          mediumName: shot?.mediumName,
          aspectRatio: shot?.aspectRatio,
          promptUsed: shot?.promptUsed,
          imageUrl: shot?.imageUrl,
        })),
    };

    const blob = new Blob([JSON.stringify(campaignData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${product.name.replace(/\s+/g, '_')}_Brand_Campaign.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('success', 'Campaign package exported successfully!');
  };

  const totalGeneratedCount =
    (masterShot ? 1 : 0) +
    Object.values(generatedShots).filter((s) => Boolean(s)).length;

  return (
    <div className="min-h-screen bg-[#0c0f17] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-300">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300'
                : toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-300'
                : 'bg-slate-900/90 border-slate-700 text-slate-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            ) : (
              <Info className="w-4 h-4 text-amber-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        model={model}
        onModelChange={setModel}
        hasApiKey={hasApiKey}
        totalGenerated={totalGeneratedCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Multi-Medium Consistent Product Visualization</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Describe your product. Imagine it across{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                billboards, newspapers & social feeds.
              </span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Powered by the <span className="text-amber-400 font-semibold">Nano-Banana</span> model. Every shot maintains
              strict product geometry, material finishes, and colors — with a guaranteed{' '}
              <span className="text-emerald-400 font-semibold">zero-humans policy</span> in every environment.
            </p>
          </div>

          {/* Quick Stats / Guard badges */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Strictly No Humans in Any Image</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Nano-Banana Image Conditioning Engine</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <span>8 Real-World Advertising Formats</span>
              </div>
            </div>

            {totalGeneratedCount > 0 && (
              <button
                type="button"
                onClick={handleExportCampaign}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-all"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Export Campaign Kit</span>
              </button>
            )}
          </div>
        </div>

        {/* Step 1: Product Specifier */}
        <ProductSpecifier
          product={product}
          onChange={setProduct}
          onApplyPreset={handleApplyPreset}
          isPolishing={isPolishing}
          onPolishWithAI={handlePolishWithAI}
        />

        {/* Step 2: Master Packshot Anchor */}
        <MasterShotStudio
          product={product}
          masterShot={masterShot}
          isGenerating={isGeneratingMaster}
          onGenerateMaster={handleGenerateMaster}
          onUploadCustomImage={handleUploadCustomImage}
          onInspect={(shot) => setInspectShot(shot)}
        />

        {/* Step 3: Medium Grid */}
        <MediumGrid
          product={product}
          masterShot={masterShot}
          generatedShots={generatedShots}
          generatingMediums={generatingMediums}
          isBatchGenerating={isBatchGenerating}
          batchProgress={batchProgress}
          onGenerateMedium={handleGenerateMedium}
          onGenerateBatch={handleGenerateBatch}
          onInspect={(shot) => setInspectShot(shot)}
          onCompareWithMaster={(shot) => setCompareShot(shot)}
        />
      </main>

      {/* Modals */}
      <InspectModal shot={inspectShot} onClose={() => setInspectShot(null)} />
      <ComparisonModal
        shot={compareShot}
        masterShot={masterShot}
        onClose={() => setCompareShot(null)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        <p>
          Brand Builder App • Multi-Medium Advertising Visualization with Nano-Banana & Product Consistency Guard
        </p>
      </footer>
    </div>
  );
}
