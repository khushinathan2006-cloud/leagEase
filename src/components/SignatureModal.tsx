import React from 'react';
import { X, FileSignature, Check, Building2, UserCheck, Shield } from 'lucide-react';
import { SignatoryDetails } from '../types';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  signatories: SignatoryDetails;
  setSignatories: React.Dispatch<React.SetStateAction<SignatoryDetails>>;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  signatories,
  setSignatories,
}) => {
  if (!isOpen) return null;

  const handleChange = (field: keyof SignatoryDetails, value: any) => {
    setSignatories(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <FileSignature className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Signatories & Branding</h3>
              <p className="text-xs text-slate-400">Customize execution block, corporate entity & headers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Custom Organization / Entity */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              Organization / Firm Name (Header Branding)
            </label>
            <input
              type="text"
              value={signatories.customOrgName}
              onChange={e => handleChange('customOrgName', e.target.value)}
              placeholder="e.g. Acme Corporation or Apex Law Group"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            {/* Signatory 1 */}
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-semibold text-amber-300 block flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> First Signatory
              </span>
              <div>
                <label className="block text-slate-400 mb-1">Printed Name</label>
                <input
                  type="text"
                  value={signatories.firstPartyName}
                  onChange={e => handleChange('firstPartyName', e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Title / Designation</label>
                <input
                  type="text"
                  value={signatories.firstPartyTitle}
                  onChange={e => handleChange('firstPartyTitle', e.target.value)}
                  placeholder="e.g. Lead Consultant / Founder"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                />
              </div>
            </div>

            {/* Signatory 2 */}
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-semibold text-blue-300 block flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> Second Signatory
              </span>
              <div>
                <label className="block text-slate-400 mb-1">Printed Name</label>
                <input
                  type="text"
                  value={signatories.secondPartyName}
                  onChange={e => handleChange('secondPartyName', e.target.value)}
                  placeholder="e.g. Alex Henderson"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Title / Designation</label>
                <input
                  type="text"
                  value={signatories.secondPartyTitle}
                  onChange={e => handleChange('secondPartyTitle', e.target.value)}
                  placeholder="e.g. Chief Executive Officer"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs transition"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
