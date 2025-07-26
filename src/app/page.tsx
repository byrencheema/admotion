"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import React, { useState } from "react";
import {
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";
import { GeneratedComp } from "../remotion/Generated/GeneratedComp";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

const Home: NextPage = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const samplePrompts = [
    "Create a luxury dating app promo with premium features",
    "Tech startup product launch with futuristic design", 
    "Gaming app announcement with epic visuals",
    "Professional business app with clean modern style"
  ];

  const generateVideo = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Video generated! Refreshing page...');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        alert('Generation failed: ' + data.message);
      }
    } catch (error) {
      alert('Failed to generate video. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <img 
            src="/images/admotionlogo.png" 
            alt="Admotion" 
            className="h-24 mx-auto mb-8"
          />
        </div>

        {/* Two Column Layout - 50/50 Split */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Input & Prompts */}
          <div className="space-y-8">
            {/* Main Input */}
            <div className="bg-white p-8 shadow-xl border border-gray-100">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    What video do you want to create?
                  </h2>
                  <p className="text-gray-600">
                    Describe your product, service, or idea
                  </p>
                </div>
                
                <Input
                  value={prompt}
                  onChange={setPrompt}
                  placeholder="e.g., Create a luxury dating app promo with premium features..."
                  multiline
                  rows={4}
                  disabled={isGenerating}
                />

                <Button
                  onClick={generateVideo}
                  disabled={isGenerating || !prompt.trim()}
                  loading={isGenerating}
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  {isGenerating ? 'Generating...' : '✨ Generate Video'}
                </Button>
              </div>
            </div>

            {/* Sample Prompts */}
            <div className="grid grid-cols-1 gap-4">
              {samplePrompts.map((samplePrompt, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(samplePrompt)}
                  disabled={isGenerating}
                  className="p-4 text-left bg-white hover:bg-gray-50 border border-gray-200 text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-md"
                >
                  {samplePrompt}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Video Player (Half Screen) */}
          <div className="bg-gray-900">
            <Player
              component={GeneratedComp}
              inputProps={{}}
              durationInFrames={DURATION_IN_FRAMES}
              fps={VIDEO_FPS}
              compositionHeight={VIDEO_HEIGHT}
              compositionWidth={VIDEO_WIDTH}
              style={{ 
                width: "100%",
                backgroundColor: "transparent"
              }}
              controls
              loop
              acknowledgeRemotionLicense
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
