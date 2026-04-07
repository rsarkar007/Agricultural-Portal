import React from 'react';

export default function CyanSpinner({ label = 'Loading data...', size = 'md' }) {
  const sizeClass = size === 'sm' ? 'h-5 w-5 border-2' : 'h-8 w-8 border-[3px]';

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      <div
        className={`${sizeClass} animate-spin rounded-full border-cyan-200 border-t-[#06b6d4]`}
        aria-hidden="true"
      />
      {label && <p className="text-sm font-medium text-cyan-700">{label}</p>}
    </div>
  );
}
