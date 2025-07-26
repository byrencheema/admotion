import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { fade } from '@remotion/transitions/fade';
import { Scene1 } from '../Scenes/Scene1';
import { Scene2 } from '../Scenes/Scene2';
import { Scene3 } from '../Scenes/Scene3';
import { Scene4 } from '../Scenes/Scene4';
import { Scene5 } from '../Scenes/Scene5';

export const GeneratedComp: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Audio Layer */}
      {/* Audio disabled - no audio files available */}
      
      {/* Scene Transitions */}
      <TransitionSeries>
        
        <TransitionSeries.Sequence durationInFrames={180}>
          <Scene1 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({durationInFrames: 20})}
          presentation={slide()}
        />
        <TransitionSeries.Sequence durationInFrames={210}>
          <Scene2 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({durationInFrames: 15})}
          presentation={wipe()}
        />
        <TransitionSeries.Sequence durationInFrames={150}>
          <Scene3 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({durationInFrames: 15})}
          presentation={fade()}
        />
        <TransitionSeries.Sequence durationInFrames={180}>
          <Scene4 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({durationInFrames: 20})}
          presentation={slide()}
        />
        <TransitionSeries.Sequence durationInFrames={180}>
          <Scene5 />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};