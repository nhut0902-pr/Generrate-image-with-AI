
import React, { useState, useCallback } from 'react';
import { generateImageFromPrompt, editImage } from './services/geminiService';
import { GenerateTab } from './components/GenerateTab';
import { EditImageTab } from './components/EditImageTab';
import { BananaIcon, ImageIcon, MenuIcon, SparklesIcon } from './components/icons';

type Tab = 'generate' | 'edit';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [autoDownload, setAutoDownload] = useState<boolean>(false);

  const downloadImage = (imageDataUrl: string) => {
    const link = document.createElement('a');
    link.href = imageDataUrl;
    link.download = `nano-banana-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerate = useCallback(async (prompt: string) => {
    if (!prompt || isLoading) return;
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageData = await generateImageFromPrompt(prompt);
      const imageUrl = `data:image/png;base64,${imageData}`;
      setGeneratedImage(imageUrl);
      if (autoDownload) {
        downloadImage(imageUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, autoDownload]);

  const handleEdit = useCallback(async (file: File, prompt: string) => {
    if (!file || !prompt || isLoading) return;
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageData = await editImage(file, prompt);
      const imageUrl = `data:image/png;base64,${imageData}`;
      setGeneratedImage(imageUrl);
      if (autoDownload) {
        downloadImage(imageUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, autoDownload]);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col items-center p-4">
      <header className="w-full max-w-md flex justify-between items-center mb-4 px-2">
         <button className="p-2 rounded-full hover:bg-slate-700">
            <MenuIcon />
        </button>
         <div className="flex-1 text-center font-semibold">nexabot.pro</div>
         <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
            </button>
            <button className="p-2 rounded-full hover:bg-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
            </button>
         </div>
      </header>
      
      <main className="w-full max-w-md space-y-6">
        <div className="bg-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
            <BananaIcon />
            <h1 className="text-2xl font-bold">Nano Banana</h1>
          </div>
          <p className="text-slate-400 mb-6 text-sm">
            Gemini's native image generation with conversational AI
          </p>

          <div className="flex border border-slate-700 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('generate')}
              className={`w-1/2 py-2 px-4 text-sm font-semibold rounded-md flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'generate' ? 'bg-slate-700' : 'text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <SparklesIcon />
              Generate
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`w-1/2 py-2 px-4 text-sm font-semibold rounded-md flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'edit' ? 'bg-slate-700' : 'text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <ImageIcon />
              Edit Image
            </button>
          </div>

          {activeTab === 'generate' ? (
            <GenerateTab onGenerate={handleGenerate} isLoading={isLoading} autoDownload={autoDownload} setAutoDownload={setAutoDownload} />
          ) : (
            <EditImageTab onEdit={handleEdit} isLoading={isLoading} autoDownload={autoDownload} setAutoDownload={setAutoDownload} />
          )}
        </div>
        
        {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center">
                <p className="font-semibold">Generation Failed</p>
                <p className="text-sm">{error}</p>
            </div>
        )}

        {generatedImage && (
            <div className="bg-slate-800 rounded-2xl p-4 shadow-2xl">
                <h3 className="text-lg font-semibold mb-4 text-center">Result</h3>
                <img src={generatedImage} alt="Generated" className="rounded-lg w-full" />
                <button
                    onClick={() => downloadImage(generatedImage)}
                    className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Download Image
                </button>
            </div>
        )}

        <div className="bg-slate-800 rounded-2xl p-6 flex justify-center items-center h-48 opacity-50">
           <svg className="w-24 h-24 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity="0.1"></path>
              <path d="M12.5 7.5C12.5 7.5 11 4 8 4S4.5 7.5 4.5 7.5S6 11 9 11s3.5-3.5 3.5-3.5zm-5 7c0 0 1.5 3.5 4.5 3.5s3.5-3.5 3.5-3.5-1.5-3.5-4.5-3.5-3.5 3.5-3.5 3.5z" transform="rotate(-30 12 12)"></path>
              <path d="M12,12 A6,6 0 0,1 18,18" strokeDasharray="3,3" opacity="0.3"></path>
           </svg>
        </div>
      </main>
    </div>
  );
};

export default App;
