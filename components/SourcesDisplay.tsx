
import React from 'react';
import { GroundingSource } from '../types';

const LinkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.72" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.72-1.72" />
    </svg>
);


export const SourcesDisplay: React.FC<{ sources: GroundingSource[] }> = ({ sources }) => {
  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 bg-[#20183B]/60 p-6 rounded-2xl border border-purple-800/30 shadow-2xl shadow-purple-900/10">
      <h3 className="flex items-center gap-3 text-lg font-semibold text-gray-200 mb-4">
        <LinkIcon className="w-6 h-6 text-purple-400" />
        <span>Sources</span>
      </h3>
      <ul className="space-y-3">
        {sources.map((source, index) => (
          <li key={index} className="truncate">
            <a
              href={source.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fuchsia-400 hover:text-fuchsia-300 hover:underline transition-colors duration-200 flex items-start gap-2 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5 text-purple-500 group-hover:text-fuchsia-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
              <span className="truncate" title={source.title}>{source.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
