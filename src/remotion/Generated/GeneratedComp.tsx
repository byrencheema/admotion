import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { Scene1 } from '../Scenes/Scene1';
import { Scene2 } from '../Scenes/Scene2';
import { Scene3 } from '../Scenes/Scene3';
import { Scene4 } from '../Scenes/Scene4';
import { Scene5 } from '../Scenes/Scene5';

export const GeneratedComp: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Audio Layer */}
      
      {/* Background Music */}
      <Audio src={staticFile('audio/background/relaxing-guitar-loop.mp3')} volume={0.15} />
      {/* Transition effect for fade */}
      <Sequence from={120} durationInFrames={50}>
        <Audio src={staticFile('audio/effects/bubble-pop.mp3')} volume={0.4} />
      </Sequence>
      {/* Transition effect for slide */}
      <Sequence from={320} durationInFrames={55}>
        <Audio src={staticFile('audio/effects/whoosh-short-realistic.mp3')} volume={0.4} />
      </Sequence>
      {/* Transition effect for wipe */}
      <Sequence from={545} durationInFrames={50}>
        <Audio src={staticFile('audio/effects/bubble-pop.mp3')} volume={0.4} />
      </Sequence>
      {/* Transition effect for fade */}
      <Sequence from={745} durationInFrames={50}>
        <Audio src={staticFile('audio/effects/bubble-pop.mp3')} volume={0.4} />
      </Sequence>
      
      {/* Scene Transitions */}
      <TransitionSeries>
        
        <TransitionSeries.Sequence durationInFrames={150}>
          <Scene1 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({durationInFrames: 20})}
          presentation={fade()}
        />
        <TransitionSeries.Sequence durationInFrames={180}>
          <Scene2 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({durationInFrames: 25})}
          presentation={slide()}
        />
        <TransitionSeries.Sequence durationInFrames={200}>
          <Scene3 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({durationInFrames: 20})}
          presentation={wipe()}
        />
        <TransitionSeries.Sequence durationInFrames={180}>
          <Scene4 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({durationInFrames: 20})}
          presentation={fade()}
        />
        <TransitionSeries.Sequence durationInFrames={190}>
          <Scene5 />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};