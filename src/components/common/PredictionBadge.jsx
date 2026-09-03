import React from 'react';
import { Check } from 'lucide-react';

export default function PredictionBadge({ status = 'predicted_unverified', size = 'sm', className = '' }) {
  const isVerified = status === 'verified' || status === 'confirmed';

  if (isVerified) {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium rounded-md border border-[#C5D7DF] bg-[#F2F7F9] text-[#2C4A57] ${
          size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
        } ${className}`}
        title="Field ground-truth verified by SDRF / BRO / Local Authority"
      >
        <Check className={size === 'xs' ? 'w-2.5 h-2.5 text-[#5A7F8E]' : 'w-3 h-3 text-[#5A7F8E]'} />
        <span>Verified Ground Truth</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-normal rounded-md border border-dashed border-stone-300 bg-stone-100/70 text-stone-600 ${
        size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
      } ${className}`}
      title="AI Predictive Model estimate — requires physical verification"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-stone-400 shrink-0" />
      <span>Predicted (unverified)</span>
    </span>
  );
}
