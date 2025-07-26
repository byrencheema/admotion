import React from 'react';
import { AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { wipe } from '@remotion/transitions/wipe';
import { slide } from '@remotion/transitions/slide';
import { fade } from '@remotion/transitions/fade';
import { Scene1 } from '../Scenes/Scene1';
import { Scene2 } from '../Scenes/Scene2';
import { Scene3 } from '../Scenes/Scene3';
import { Scene4 } from '../Scenes/Scene4';
import { Scene5 } from '../Scenes/Scene5';

export const GeneratedComp: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        
        <TransitionSeries.Sequence durationInFrames={180}>
          <Scene1 images={["/uploads/images/1753571338613_grammarly-logo.png"]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({durationInFrames: 15})}
          presentation={fade()}
        />
      
        <TransitionSeries.Sequence durationInFrames={210}>
          <Scene2 images={["/uploads/images/1753571338613_grammarly-logo.png"]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({durationInFrames: 20})}
          presentation={slide()}
        />
      
        <TransitionSeries.Sequence durationInFrames={180}>
          <Scene3 images={["/uploads/images/1753571338613_grammarly-logo.png"]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({durationInFrames: 15})}
          presentation={wipe()}
        />
      
        <TransitionSeries.Sequence durationInFrames={165}>
          <Scene4 images={["/uploads/images/1753571338613_grammarly-logo.png"]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({durationInFrames: 15})}
          presentation={fade()}
        />
      
        <TransitionSeries.Sequence durationInFrames={150}>
          <Scene5 images={["/uploads/images/1753571338613_grammarly-logo.png"]} />
        </TransitionSeries.Sequence>
        
      
      </TransitionSeries>
    </AbsoluteFill>
  );
};