
import React from 'react';
import { ProductIcon } from './Icons';

interface ProductNameInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export const ProductNameInput: React.FC<ProductNameInputProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="bg-[#20183B]/60 p-6 rounded-2xl border border-purple-800/30 shadow-2xl shadow-purple-900/10">
      <div className="flex items-center gap-3 text-lg font-semibold text-gray-200 mb-4">
        <ProductIcon className="w-6 h-6 text-purple-400" />
        <span>Product Name</span>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter product name..."
        disabled={disabled}
        className="w-full bg-[#110D20]/70 border-2 border-purple-800/50 rounded-lg py-3 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
      />
    </div>
  );
};
