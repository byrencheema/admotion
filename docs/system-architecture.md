# Admotion - System Architecture

## Current State

**Admotion** is an AI-powered video generation system that transforms text prompts into Remotion videos using Claude API. Currently generates single-scene, 4-second marketing videos with animations and visual effects.

## Architecture

```
User Input → Claude API → Remotion Component → Video Preview
```

### Core Components

1. **Frontend** (`src/app/page.tsx`)
   - Text input for prompts
   - Generate button
   - Remotion Player for preview
   - Code preview panel

2. **API Layer** (`src/app/api/generate/route.ts`)
   - Receives prompt
   - Calls Claude API (claude-3-haiku)
   - Generates React/TypeScript code
   - Updates GeneratedComp.tsx

3. **Video Engine** (`src/remotion/`)
   - Root.tsx - Composition registry
   - Generated/GeneratedComp.tsx - Dynamic component

### Current Capabilities

- **Duration**: 4 seconds (120 frames)
- **Resolution**: 1920x1080
- **FPS**: 30
- **Effects**: Gradients, shapes, text animations, particles
- **Packages**: @remotion/shapes, @remotion/noise, react-confetti

### Limitations

- Single scene only
- No audio support
- Fixed 4-second duration
- Basic component structure
- No multi-element orchestration

## Tech Stack

- Next.js 15 (App Router)
- Remotion 4.0.327
- Claude API (Anthropic)
- LangChain (partial integration)
- TypeScript
- TailwindCSS