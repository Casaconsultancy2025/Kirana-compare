
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ProductNameInput } from './components/ProductNameInput';
import { AnalysisPrompt } from './components/AnalysisPrompt';
import { ResultCard } from './components/ResultCard';
import { PriceIcon, TimeIcon, StarIcon, PlatformIcon } from './components/Icons';
import { analyzeProduct } from './services/geminiService';
import { AnalysisResult } from './types';

const App: React.FC = () => {
    const [productName, setProductName] = useState('');
    const [productImage, setProductImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageSelect = useCallback((file: File) => {
        setProductImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleAnalyze = useCallback(async () => {
        if (!productImage || !productName || !imagePreview) {
            setError("Please provide both a product image and a name.");
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const base64Data = imagePreview.split(',')[1];
            if (!base64Data) {
                throw new Error("Invalid image data.");
            }
            const result = await analyzeProduct(base64Data, productImage.type, productName);
            setAnalysisResult(result);
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Failed to analyze the product. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [productImage, productName, imagePreview]);

    const isAnalyzeDisabled = !productImage || !productName || isLoading;

    return (
        <div className="min-h-screen text-gray-200 font-sans p-4 sm:p-8">
            <main className="max-w-7xl mx-auto">
                <header className="text-center my-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">
                        Kirana Compare
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">
                        Upload an image and name to compare prices and details instantly.
                    </p>
                </header>

                {error && (
                    <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative my-4 text-center" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="grid grid-cols-1 gap-8">
                        <ImageUploader onImageSelect={handleImageSelect} imagePreview={imagePreview} />
                        <ProductNameInput value={productName} onChange={setProductName} disabled={isLoading} />
                    </div>
                    <div className="flex flex-col gap-8">
                         <AnalysisPrompt onAnalyze={handleAnalyze} isDisabled={isAnalyzeDisabled} isLoading={isLoading} />
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <ResultCard
                                icon={<PriceIcon className="w-6 h-6" />}
                                title="Price Comparison"
                                value={analysisResult?.priceComparison ?? null}
                                isLoading={isLoading}
                                colorClass="text-green-400"
                            />
                            <ResultCard
                                icon={<TimeIcon className="w-6 h-6" />}
                                title="Delivery Times"
                                value={analysisResult?.deliveryTimes ?? null}
                                isLoading={isLoading}
                                colorClass="text-blue-400"
                            />
                            <ResultCard
                                icon={<StarIcon className="w-6 h-6" />}
                                title="Quality Ratings"
                                value={analysisResult?.qualityRatings ?? null}
                                isLoading={isLoading}
                                colorClass="text-yellow-400"
                            />
                             <ResultCard
                                icon={<PlatformIcon className="w-6 h-6" />}
                                title="Platform Availability"
                                value={analysisResult?.platformAvailability ?? null}
                                isLoading={isLoading}
                                colorClass="text-indigo-400"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
