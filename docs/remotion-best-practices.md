# Remotion Best Practices for AI Agents

This document contains essential Remotion patterns and guidelines for AI agents generating video components.

## Core Principles

### 1. Use Deterministic Values
```typescript
// ❌ WRONG - Math.random() changes between frames
const randomX = Math.random() * 100;

// ✅ CORRECT - Use Remotion's random() function
import { random } from 'remotion';
const randomX = random('unique-seed') * 100;
```

### 2. Correct Component Props
```typescript
// ❌ WRONG - Circle doesn't have 'size' prop
<Circle size={30} />

// ✅ CORRECT - Use width and height
<Circle width={30} height={30} />
```

### 3. Animation Patterns

#### Spring Animations
```typescript
const scale = spring({
  fps,
  frame,
  config: { damping: 200, stiffness: 200 }
});
```

#### Interpolation
```typescript
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateRight: 'clamp'
});
```

### 4. Safe Imports
```typescript
// ✅ SAFE IMPORTS
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Sequence } from 'remotion';
import { Circle, Rect } from '@remotion/shapes';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';

// ❌ AVOID - These don't exist or cause errors
import { Text } from '@remotion/shapes'; // Doesn't exist
import { Image } from '@remotion/shapes'; // Doesn't exist  
import { crossfade } from '@remotion/transitions'; // Not available
```

### 5. Component Structure
```typescript
import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

interface Props {
  title: string;
  color?: string;
}

const MyScene: React.FC<Props> = ({ title, color = '#fff' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  return (
    <AbsoluteFill>
      {/* Content here */}
    </AbsoluteFill>
  );
};

export { MyScene };
```

## Common Patterns

### Text Animation
```typescript
<div style={{
  fontSize: 64,
  fontWeight: 'bold',
  color: 'white',
  textAlign: 'center',
  opacity: interpolate(frame, [0, 30], [0, 1]),
  transform: `scale(${spring({ fps, frame, config: { damping: 200 } })})`
}}>
  {text}
</div>
```

### Shapes with Animation
```typescript
<Circle
  width={60}
  height={60}
  color="#ff4b6e"
  x={interpolate(frame, [0, 60], [0, 100])}
  y={height / 2}
  opacity={0.8}
/>
```

### Audio Integration
```typescript
<Audio
  src={staticFile('background.mp3')}
  volume={0.3}
  startFrom={0}
  endAt={900}
/>
```

### Transitions
```typescript
<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={120}>
    <Scene1 />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    timing={linearTiming({durationInFrames: 15})}
    presentation={fade()}
  />
  <TransitionSeries.Sequence durationInFrames={180}>
    <Scene2 />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

## Timing Guidelines

- **30fps** standard frame rate
- **900 frames** = 30 seconds total
- **120-200 frames** per scene (4-7 seconds)
- **15-20 frames** for transitions
- **30-60 frames** for text animations

## Performance Tips

1. Avoid GPU-intensive CSS properties in complex animations
2. Use `extrapolateRight: 'clamp'` to prevent values beyond ranges
3. Limit particle counts (max 50 for smooth performance)
4. Use `Sequence` to control timing instead of conditional rendering

## Error Prevention

1. Always import `random` from 'remotion' for random values
2. Use `width` and `height` props for shapes, not `size`
3. Only use imported transition functions (`fade`, `slide`, `wipe`)
4. Avoid nested spring functions
5. Include `fps` parameter in all spring animations