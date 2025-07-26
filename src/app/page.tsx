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

const Home: NextPage = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const generateVideo = async () => {
    if (!prompt.trim()) return;
    
    console.log('🚀 Starting generation with prompt:', prompt);
    setIsGenerating(true);
    
    try {
      console.log('📡 Sending request to AI...');
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      console.log('📥 Received response, status:', response.status);
      const data = await response.json();
      console.log('📄 Response data:', data);
      
      if (data.success) {
        console.log('✅ Success! Generated component');
        alert(data.message + ' The page will refresh to show your new video.');
        // Refresh the page to load the new component
        setTimeout(() => window.location.reload(), 1000);
      } else {
        console.error('❌ Generation failed:', data.message);
        alert('Generation failed: ' + data.message);
      }
    } catch (error) {
      console.error('💥 Generation failed:', error);
      alert('Failed to generate video. Check console for details.');
    } finally {
      setIsGenerating(false);
      console.log('🏁 Generation complete');
    }
  };

  const resetVideo = async () => {
    console.log('🔄 Starting reset...');
    setIsResetting(true);
    
    try {
      const response = await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Reset successful');
        setPrompt("");
        alert(data.message + ' The page will refresh.');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        console.error('❌ Reset failed:', data);
        alert('Reset failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('💥 Reset failed:', error);
      alert('Failed to reset. Check console for details.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div>
      <div className="max-w-screen-md m-auto mb-5">
        <div className="mb-8 mt-16">
          <h1 className="text-4xl font-bold mb-6 text-center">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Video Generator
            </span>
            <div className="text-lg text-gray-600 mt-2">Create stunning marketing videos with AI</div>
          </h1>
          {/* Sample Prompts */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-center">Try these sample prompts:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Create a luxury dating app promo with premium features",
                "Tech startup product launch with futuristic design", 
                "Gaming app announcement with epic visuals",
                "Professional business app with clean modern style",
                "Health and fitness app with organic natural theme",
                "AI-powered productivity tool with neon tech aesthetics"
              ].map((samplePrompt, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(samplePrompt)}
                  className="p-3 text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm transition-colors"
                  disabled={isGenerating || isResetting}
                >
                  {samplePrompt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Or write your own prompt..."
              className="flex-1 p-4 border border-gray-300 bg-white rounded-lg resize-none h-24 text-gray-900"
              disabled={isGenerating || isResetting}
            />
            <div className="flex flex-col gap-2">
              <button
                onClick={generateVideo}
                disabled={isGenerating || isResetting || !prompt.trim()}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isGenerating ? '🤖 Generating...' : '✨ Generate Video'}
              </button>
              <button
                onClick={resetVideo}
                disabled={isGenerating || isResetting}
                className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResetting ? '🔄 Resetting...' : '🗑️ Reset'}
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10">
          <Player
            component={GeneratedComp}
            inputProps={{}}
            durationInFrames={DURATION_IN_FRAMES}
            fps={VIDEO_FPS}
            compositionHeight={VIDEO_HEIGHT}
            compositionWidth={VIDEO_WIDTH}
            style={{
              width: "100%",
            }}
            controls
            autoPlay
            loop
            acknowledgeRemotionLicense
          />
        </div>
        
        
        <div className="text-center text-gray-600 mt-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-lg mb-3 text-gray-800">✨ AI-Powered Video Templates</h3>
            <p className="text-sm text-gray-600">
              Our AI automatically selects from <strong>17+ advanced templates</strong> including:
              Kinetic Typography • 3D Product Showcases • Holographic Cards • Neon Effects • Animated Charts • Bubble Text • Retro Synthwave
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
