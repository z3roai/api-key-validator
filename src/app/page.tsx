"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const ApiKeyValidator = dynamic(() => import("@/components/ApiKeyValidator").then(mod => ({ default: mod.ApiKeyValidator })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  )
});

export default function Home() {


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              API Key Validation Platform
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Test and validate your OpenAI API keys across all available models
            </p>
          </div>

          <ApiKeyValidator />
        </div>
      </div>
    </div>
  );
}