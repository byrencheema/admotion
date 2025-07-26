import { z } from "zod";

export interface Scene {
  id: string;
  description: string;
  durationInFrames: number;
  startFrame: number;
  elements: SceneElement[];
  transition?: TransitionConfig;
}

export interface SceneElement {
  type: 'text' | 'shape' | 'animation' | 'effect';
  content: string;
  style: Record<string, unknown>;
  animation: AnimationConfig;
}

export interface AnimationConfig {
  type: 'spring' | 'interpolate' | 'static';
  timing: {
    startFrame: number;
    durationInFrames: number;
  };
  properties: Record<string, unknown>;
}

export interface TransitionConfig {
  type: 'fade' | 'slide' | 'wipe' | 'zoom';
  durationInFrames: number;
}

export interface AudioConfig {
  backgroundMusic?: {
    src: string;
    volume: number;
    startFrame: number;
    endFrame: number;
  };
  soundEffects: {
    src: string;
    volume: number;
    triggerFrame: number;
  }[];
}

export interface VideoStructure {
  totalDurationInFrames: number;
  scenes: Scene[];
  audio: AudioConfig;
  style: {
    theme: string;
    colorScheme: string[];
    typography: string;
  };
}

export const VideoStructureSchema = z.object({
  totalDurationInFrames: z.number(),
  scenes: z.array(z.object({
    id: z.string(),
    description: z.string(),
    durationInFrames: z.number(),
    startFrame: z.number(),
    elements: z.array(z.any()),
    transition: z.any().optional()
  })),
  audio: z.object({
    backgroundMusic: z.any().optional(),
    soundEffects: z.array(z.any())
  }),
  style: z.object({
    theme: z.string(),
    colorScheme: z.array(z.string()),
    typography: z.string()
  })
});