
import React from 'react';

interface ResultCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | null;
  isLoading: boolean;
  colorClass: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ icon, title, value, isLoading, colorClass }) => {
  return (
    <div className="bg-[#20183B]/60 p-5 rounded-2xl border border-purple-800/30 shadow-xl shadow-purple-900/10 flex flex-col justify-start">
      <div className={`flex items-center gap-3 text-sm font-semibold ${colorClass}`}>
        {icon}
        <span>{title}</span>
      </div>
      <div className="mt-3 text-2xl font-bold text-white h-16 flex items-center">
        {isLoading ? (
          <div className="w-4/5 h-6 bg-purple-800/40 rounded-md animate-pulse"></div>
        ) : (
          value || <span className="text-gray-500">N/A</span>
        )}
      </div>
    </div>
  );
};
