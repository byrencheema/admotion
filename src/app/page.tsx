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
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [showCode, setShowCode] = useState<boolean>(false);
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
        setGeneratedCode(data.componentCode);
        setShowCode(true);
        alert(data.message + ' The page will refresh to show your new video.');
        // Refresh the page to load the new component
        setTimeout(() => window.location.reload(), 1000);
      } else {
        console.error('❌ Generation failed:', data.message);
        alert('Generation failed: ' + data.message);
        if (data.componentCode) {
          setGeneratedCode(data.componentCode);
          setShowCode(true);
        }
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
        setGeneratedCode("");
        setShowCode(false);
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
          <h1 className="text-3xl font-bold mb-4 text-center">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admotion
            </span>
            <div className="text-lg text-gray-600 dark:text-gray-400 mt-1">AI Marketing Video Generator</div>
          </h1>
          <div className="flex gap-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your marketing video... (e.g., 'Product launch announcement with gold accents' or 'Brand intro with elegant animations')"
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg resize-none h-20"
              disabled={isGenerating || isResetting}
            />
            <div className="flex flex-col gap-2">
              <button
                onClick={generateVideo}
                disabled={isGenerating || isResetting || !prompt.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? '🤖 Generating...' : '✨ Generate'}
              </button>
              <button
                onClick={resetVideo}
                disabled={isGenerating || isResetting}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
        
        {showCode && (
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-black dark:text-white">Generated Code</h3>
              <button
                onClick={() => setShowCode(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <pre className="bg-black dark:bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto max-h-96">
              <code>{generatedCode}</code>
            </pre>
          </div>
        )}
        
        <div className="text-center text-gray-600 dark:text-gray-400 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">🎯 Marketing Video Templates:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <strong>🚀 Product Launch:</strong><br/>
              <em>"New product announcement with luxury gold reveal and premium gradient"</em>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">  
              <strong>📱 App Promotion:</strong><br/>
              <em>"Download our app CTA with modern tech aesthetics and call-to-action"</em>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <strong>🏢 Brand Intro:</strong><br/>
              <em>"Corporate brand introduction with professional blue gradient and clean typography"</em>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
              <strong>🎉 Sale Alert:</strong><br/>
              <em>"Limited time offer announcement with urgency red gradients and attention-grabbing effects"</em>
            </div>
            <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200">
              <strong>📈 Success Story:</strong><br/>
              <em>"Customer success testimonial with trustworthy design and professional animations"</em>
            </div>
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
              <strong>📺 Social Media:</strong><br/>
              <em>"Instagram story template with trendy gradients and engaging social media effects"</em>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">💡 Marketing Video Pro Tips:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>🎯 Marketing Styles:</strong> professional, corporate, luxury, trendy, trustworthy, urgent
              </div>
              <div>
                <strong>🎨 Brand Colors:</strong> corporate blue, luxury gold, trust green, urgency red, tech neon
              </div>
              <div>
                <strong>⚡ Call-to-Actions:</strong> subscribe, download, buy now, learn more, sign up, get started
              </div>
              <div>
                <strong>📱 Platforms:</strong> Instagram story, TikTok, LinkedIn post, Twitter video, YouTube short
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
