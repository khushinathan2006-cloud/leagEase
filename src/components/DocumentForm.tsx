import React from 'react';
import {
  Sparkles,
  FileSignature,
  Calendar,
  Users,
  Shield,
  HelpCircle,
  PlusCircle,
  Layers,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { DocumentRequest, DocumentTemplatePreset } from '../types';
import { DOCUMENT_PRESETS, QUICK_CLAUSE_TEMPLATES } from '../presets';

interface DocumentFormProps {
  formData: DocumentRequest;
  setFormData: React.Dispatch<React.SetStateAction<DocumentRequest>>;
  onGenerate: () => void;
  isLoading: boolean;
  onApplyPreset: (preset: DocumentTemplatePreset) => void;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
  formData,
  setFormData,
  onGenerate,
  isLoading,
  onApplyPreset,
}) => {
  const handleInputChange = (field: keyof DocumentRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddQuickClause = (clause: string) => {
    setFormData(prev => {
      const current = prev.terms.trim();
      if (!current) return { ...prev, terms: clause };
      const endsWithSemicolon = current.endsWith(';');
      return {
        ...prev,
        terms: `${current}${endsWithSemicolon ? ' ' : '; '}${clause}`,
      };
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
      {/* Header & Quick Presets */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-semibold text-white">Document Parameters</h2>
          </div>
          <span className="text-xs text-slate-400">Step 1 of 2</span>
        </div>

        {/* Preset Selector Bar */}
        <div>
          <label className="text-xs font-medium text-slate-400 block mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            Load Sample Scenario / Preset Template:
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {DOCUMENT_PRESETS.map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium shrink-0 transition border ${
                  formData.document_type.toLowerCase() === preset.docType.toLowerCase()
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form
        onSubmit={e => {
          e.preventDefault();
          onGenerate();
        }}
        className="space-y-4"
      >
        {/* Document Type */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            1. Document Type <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.document_type}
            onChange={e => handleInputChange('document_type', e.target.value)}
            placeholder="e.g. Freelance Work Contract, Agreement, NDA, Lease Agreement"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[
              'Freelance Work Contract',
              'Non-Disclosure Agreement',
              'Employment Contract',
              'Residential Lease Agreement',
              'Software Development Agreement',
            ].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => handleInputChange('document_type', type)}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition"
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Parties Involved */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              2. Parties Involved <span className="text-amber-400">*</span>
            </span>
            <span className="text-[11px] font-normal text-slate-400 lowercase">
              Names & roles of individuals/entities
            </span>
          </label>
          <textarea
            required
            rows={2}
            value={formData.parties}
            onChange={e => handleInputChange('parties', e.target.value)}
            placeholder="e.g. Jane Doe (Service Provider), TechNova Inc. (Client)"
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
          />
        </div>

        {/* Terms & Conditions (Semicolon separated as in specification) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              3. Terms & Conditions <span className="text-amber-400">*</span>
            </label>
            <span className="text-[11px] text-amber-400 font-medium">
              (Use semicolons ; for bullet points)
            </span>
          </div>

          <textarea
            required
            rows={4}
            value={formData.terms}
            onChange={e => handleInputChange('terms', e.target.value)}
            placeholder="Work must be delivered by May 15, 2025; Payment will be made within 7 days of invoice; The client retains intellectual property rights; Either party may terminate with 14 days notice"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition leading-relaxed"
          />

          {/* Quick Clause inserters */}
          <div className="mt-2.5 space-y-1.5">
            <span className="text-[11px] text-slate-400 block font-medium">
              + Quick Add Standard Clauses:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_CLAUSE_TEMPLATES.map(qc => (
                <button
                  key={qc.name}
                  type="button"
                  onClick={() => handleAddQuickClause(qc.clause)}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                  title={qc.clause}
                >
                  <PlusCircle className="w-3 h-3 text-amber-400" />
                  {qc.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Two Column Row: Effective Date & Jurisdiction */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Effective Date */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              4. Effective Date <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.dates}
              onChange={e => handleInputChange('dates', e.target.value)}
              placeholder="e.g. April 15, 2025"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
            />
          </div>

          {/* Governing Law / Jurisdiction */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Governing Law
            </label>
            <select
              value={formData.jurisdiction}
              onChange={e => handleInputChange('jurisdiction', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
            >
              <option value="State of Delaware, United States">Delaware, United States</option>
              <option value="State of California, United States">California, United States</option>
              <option value="State of New York, United States">New York, United States</option>
              <option value="State of Texas, United States">Texas, United States</option>
              <option value="Laws of England and Wales">England and Wales (UK)</option>
              <option value="Republic of India">Republic of India</option>
              <option value="Province of Ontario, Canada">Ontario, Canada</option>
              <option value="European Union / GDPR Jurisdiction">European Union</option>
            </select>
          </div>
        </div>

        {/* Generate Button (matching Page 14 & 18 screenshots) */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !formData.document_type || !formData.parties}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 shadow-lg transition transform active:scale-[0.99] ${
              isLoading || !formData.document_type || !formData.parties
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 shadow-amber-500/20'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Generating Legal Document with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
                <span>Generate Document</span>
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-2">
            Click "Generate Document" to start AI legal drafting with Gemini 1.5/flash model
          </p>
        </div>
      </form>
    </div>
  );
};
