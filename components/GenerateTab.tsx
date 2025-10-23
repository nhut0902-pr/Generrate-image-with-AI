
import React, { useState } from 'react';
import { ToggleSwitch } from './ToggleSwitch';
import { FolderIcon, WandIcon } from './icons';

interface GenerateTabProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  autoDownload: boolean;
  setAutoDownload: (value: boolean) => void;
}

export const GenerateTab: React.FC<GenerateTabProps> = ({ onGenerate, isLoading, autoDownload, setAutoDownload }) => {
  const [prompt, setPrompt] = useState('Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme...');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prompt);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">
          What would you like to create?
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-colors"
          placeholder="e.g., A futuristic city skyline at sunset"
        />
      </div>

      <div className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
        <div className="flex items-center gap-3">
          <FolderIcon />
          <div>
            <p className="font-semibold text-sm">Auto-download to</p>
            <p className="text-xs text-slate-400">Downloads folder</p>
          </div>
        </div>
        <ToggleSwitch checked={autoDownload} onChange={setAutoDownload} />
      </div>

      <button
        type="submit"
        disabled={isLoading || !prompt}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out hover:from-yellow-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <WandIcon />
            Generate Image
          </>
        )}
      </button>
    </form>
  );
};
