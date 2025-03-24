'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('translation');

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">LLM Translation App</h1>
        <p className="text-gray-600">
          AI-powered translations with Claude, OpenAI, and Gemini
        </p>
      </header>

      <Tabs
        defaultValue="translation"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="translation">Translation</TabsTrigger>
          <TabsTrigger value="glossary">Glossary</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="translation" className="mt-6">
          <div className="rounded-lg border p-8">
            <h2 className="text-xl font-semibold mb-4">Translation Tool</h2>
            <p className="mb-6">
              Enhanced translation form will be implemented here. Currently in development.
            </p>
            <div className="p-4 bg-gray-100 rounded text-sm">
              <p>This application features:</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Support for multiple AI models (Claude, GPT, Gemini)</li>
                <li>Document upload capabilities (DOCX, PDF, TXT)</li>
                <li>Domain-specific translation expertise</li>
                <li>Post-editing capabilities for enhanced quality</li>
                <li>Glossary management for terminology consistency</li>
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="glossary" className="mt-6">
          <div className="rounded-lg border p-8">
            <h2 className="text-xl font-semibold mb-4">Glossary Management</h2>
            <p>
              Create and manage domain-specific glossaries to ensure terminology consistency. 
              Glossary component will be implemented here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="rounded-lg border p-8">
            <h2 className="text-xl font-semibold mb-4">Translation History</h2>
            <p>
              View and manage your previous translations. 
              Translation history component will be implemented here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}