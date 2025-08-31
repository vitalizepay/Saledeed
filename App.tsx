
import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { DocumentIcon } from './components/icons';
import type { UploadedFiles, FileKey } from './types';
import { generateSaleDeed } from './services/geminiService';

const App: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    sampleDeed: null,
    sellerAadhaar: null,
    buyerAadhaar: null,
    sellerDeed: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedDeed, setGeneratedDeed] = useState<string>('');

  const handleFileChange = useCallback((key: FileKey, file: File | null) => {
    setUploadedFiles((prevFiles) => ({
      ...prevFiles,
      [key]: file,
    }));
  }, []);

  const allFilesUploaded = Object.values(uploadedFiles).every((file) => file !== null);

  const handleSubmit = async () => {
    if (!allFilesUploaded) {
      setError('Please upload all four required documents.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedDeed('');

    try {
      // Fix: The 'as unknown' cast is necessary because the type `UploadedFiles` does not
      // sufficiently overlap with `{ [key: string]: File; }`. The `allFilesUploaded` check
      // before this call ensures this cast is safe at runtime.
      const deed = await generateSaleDeed(uploadedFiles as unknown as { [key: string]: File });
      setGeneratedDeed(deed);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`An error occurred: ${err.message}`);
      } else {
        setError('An unknown error occurred while generating the deed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <div className="flex justify-center items-center gap-4 mb-4">
            <DocumentIcon className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Tamil Sale Deed Drafting Assistant</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Automatically draft a Tamil sale deed by providing the necessary documents. The AI will extract information and format the new deed for you.
          </p>
        </header>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/80 max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">1. Upload Your Documents</h2>
            <p className="text-slate-500 mb-6">Please provide all four PDF documents to proceed.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload
                id="sampleDeed"
                label="Sample Sale Deed"
                onFileChange={(file) => handleFileChange('sampleDeed', file)}
              />
              <FileUpload
                id="sellerAadhaar"
                label="Seller's Aadhaar Card"
                onFileChange={(file) => handleFileChange('sellerAadhaar', file)}
              />
              <FileUpload
                id="buyerAadhaar"
                label="Buyer's Aadhaar Card"
                onFileChange={(file) => handleFileChange('buyerAadhaar', file)}
              />
              <FileUpload
                id="sellerDeed"
                label="Seller's Previous Sale Deed"
                onFileChange={(file) => handleFileChange('sellerDeed', file)}
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              disabled={!allFilesUploaded || isLoading}
              className="bg-blue-600 text-white font-bold py-3 px-10 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              {isLoading ? 'Generating...' : 'Draft Sale Deed'}
            </button>
          </div>

          {error && (
            <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">
              <p>{error}</p>
            </div>
          )}
        </div>

        {isLoading && <Loader />}

        {generatedDeed && !isLoading && (
          <div className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4 text-center">2. Your Generated Sale Deed Draft</h2>
            <ResultDisplay text={generatedDeed} />
          </div>
        )}
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Powered by Google Gemini. Please review the generated document carefully with a legal professional.</p>
      </footer>
    </div>
  );
};

export default App;