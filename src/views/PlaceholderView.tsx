import React from 'react';

interface PlaceholderViewProps {
  viewId: string;
}

export default function PlaceholderView({ viewId }: PlaceholderViewProps) {
  // Format the ID into a nice title (e.g., 'live-monitoring' -> 'Live Monitoring')
  const title = viewId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="p-4 md:p-8 flex flex-col items-center justify-center w-full h-[calc(100vh-120px)] bg-transparent text-center animate-fade-in">
      <div className="bg-white dark:bg-[#121212] p-8 md:p-12 rounded-3xl border border-[#e2e8f0] dark:border-[#272727] shadow-sm flex flex-col items-center max-w-lg w-full transition-colors">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#0f172a] dark:text-white mb-3">{title} Module</h2>
        <p className="text-[#64748b] dark:text-[#a0a0a0] leading-relaxed mb-6">
          The {title} dashboard is currently under active development. Our engineering team is integrating the necessary backend data streams.
        </p>
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('toast', { detail: { message: `Requested access to ${title} previews.`, type: 'info' } }))}
          className="bg-[#0f0f0f] dark:bg-white text-white dark:text-[#0f0f0f] hover:bg-gray-800 dark:hover:bg-gray-200 px-6 py-2.5 rounded-full font-semibold transition-colors shadow-sm"
        >
          Request Early Access
        </button>
      </div>
    </div>
  );
}
