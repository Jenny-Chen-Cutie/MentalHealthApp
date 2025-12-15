import React from 'react';

export const Card = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-stone-100 p-5 ${className}`}>
    {children}
  </div>
);

export const CheckboxRow = ({
  checked,
  onChange,
  label,
  subLabel,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  subLabel?: string;
}) => (
  <div
    onClick={onChange}
    className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 select-none ${
      checked ? 'bg-stone-100' : 'bg-transparent hover:bg-stone-50'
    }`}
  >
    <div
      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
        checked ? 'bg-stone-600 border-stone-600' : 'border-stone-300'
      }`}
    >
      {checked && (
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    <div className="flex-1">
      <h3 className={`font-medium text-lg leading-tight ${checked ? 'text-stone-800' : 'text-stone-600'}`}>
        {label}
      </h3>
      {subLabel && <p className="text-stone-400 text-sm mt-1">{subLabel}</p>}
    </div>
  </div>
);

export const SectionTitle = ({ children }: { children?: React.ReactNode }) => (
  <h2 className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-3 px-1">{children}</h2>
);