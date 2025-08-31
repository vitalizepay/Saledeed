
import React, { useState } from 'react';
import { CopyIcon, CheckIcon, DownloadIcon } from './icons';

interface ResultDisplayProps {
  text: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sale-deed-draft.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80">
      <div className="flex justify-end items-center p-3 bg-slate-50/70 rounded-t-2xl border-b border-slate-200/80">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {copied ? (
            <>
              <CheckIcon className="h-4 w-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <CopyIcon className="h-4 w-4" />
              Copy
            </>
          )}
        </button>
         <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-3 py-1.5 ml-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <DownloadIcon className="h-4 w-4" />
          Download
        </button>
      </div>
      <div className="p-6">
        <pre className="whitespace-pre-wrap break-words font-sans text-base text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200/80 max-h-[60vh] overflow-y-auto">
          {text}
        </pre>
      </div>
    </div>
  );
};
