
import React from 'react';
import { AnalyzeIcon } from './Icons';

interface AnalysisPromptProps {
  onAnalyze: () => void;
  isDisabled: boolean;
  isLoading: boolean;
}

export const AnalysisPrompt: React.FC<AnalysisPromptProps> = ({ onAnalyze, isDisabled, isLoading }) => {
  return (
    <div className="bg-[#20183B]/60 p-6 rounded-2xl border border-purple-800/30 shadow-2xl shadow-purple-900/10 flex flex-col justify-between h-full">
      <div>
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <AnalyzeIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Ready to Analyze?</h2>
        <p className="text-gray-400">
          Get comprehensive insights about your product including platform availability, pricing comparisons, delivery times, and quality ratings.
        </p>
      </div>
      <button
        onClick={onAnalyze}
        disabled={isDisabled || isLoading}
        className="w-full mt-6 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-fuchsia-500/30 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          'Generate Analysis'
        )}
      </button>
    </div>
  );
};
