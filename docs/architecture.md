# Admotion Architecture Documentation

## Overview

Admotion is an AI-powered video generation platform that creates professional marketing videos using Remotion (React-based video framework) and Claude AI. The system uses a template-based architecture with intelligent template selection to generate dynamic, visually stunning advertisements.

## Core Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER INTERFACE (Next.js)                    │
├─────────────────────────────────────────────────────────────────┤
│  /src/app/                                                      │
│  ├── page.tsx           - Main video generation interface       │
│  ├── api/generate       - Video generation API endpoint         │
│  └── api/lambda/        - AWS Lambda rendering endpoints        │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                 AI AGENT SYSTEM (Template-Based)               │
├─────────────────────────────────────────────────────────────────┤
│  /src/lib/templates/                                            │
│  ├── template-orchestrator.ts  - Coordinates entire process    │
│  ├── template-director.ts      - Plans video structure         │
│  ├── template-generator.ts     - Generates scene components    │
│  ├── scene-templates.ts        - Template library (10+ types)  │
│  └── smart-template-selector.ts - AI content analysis         │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                REMOTION VIDEO ENGINE                           │
├─────────────────────────────────────────────────────────────────┤
│  /src/remotion/                                                 │
│  ├── Generated/GeneratedComp.tsx - Master composition          │
│  ├── Scenes/Scene1.tsx          - Individual scene components  │
│  ├── Scenes/Scene2.tsx          - ...dynamically generated     │
│  └── Root.tsx                   - Remotion root configuration  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│              VIDEO OUTPUT & RENDERING                          │
├─────────────────────────────────────────────────────────────────┤
│  • Local: Remotion Studio & CLI rendering                      │
│  • Cloud: AWS Lambda rendering (via @remotion/lambda)          │
│  • Output: MP4 videos (1920x1080, 30fps, 30 seconds)          │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Input Processing
```
User Prompt → Smart Template Selector → Content Analysis
                                      ↓
                               Industry Detection
                               Tone Analysis  
                               Visual Style Mapping
                               Complexity Assessment
```

### 2. AI Agent Pipeline
```
Template Director (Claude 3.5 Sonnet)
├── Receives: User prompt + Available templates + Smart analysis
├── Plans: Video structure (scenes, transitions, timing)
└── Output: TemplateVideoStructure JSON

Template Generator
├── Receives: Video structure + Template library
├── Generates: React components for each scene
└── Output: TypeScript scene files + Master composition

Template Orchestrator
├── Coordinates: Director → Generator → File System
├── Manages: Error handling, validation, cleanup
└── Output: Complete Remotion project
```

### 3. Remotion Rendering
```
Generated React Components
├── Scene1.tsx (Hero with 3D floating elements)
├── Scene2.tsx (Morphing feature cards)
├── Scene3.tsx (Dynamic statistics)
├── Scene4.tsx (Neon CTA effects)
└── Scene5.tsx (Logo reveal)
                ↓
GeneratedComp.tsx (Master composition)
├── TransitionSeries wrapper
├── Scene sequencing (180-210 frames each)
├── Transition effects (fade, wipe, slide)
└── Audio integration (disabled currently)
                ↓
Remotion Engine
├── Frame-by-frame rendering
├── Spring animations & interpolations
├── 3D transforms & particle systems
└── MP4 output (900 frames = 30 seconds)
```

## Template System

### Template Library Structure
```typescript
interface SceneTemplate {
  id: string;                    // 'hero-kinetic-text'
  name: string;                  // 'Kinetic Typography Hero'  
  description: string;           // 'Dynamic word-by-word animation'
  category: 'hero' | 'features' | 'cta' | 'logo' | 'product' | 'stats';
  complexity: 'simple' | 'medium' | 'complex';
  visualStyle: 'minimal' | 'modern' | 'futuristic' | 'organic' | 'retro';
  requiredProps: string[];       // ['title', 'subtitle']
  code: string;                  // React component template
}
```

### Available Templates (10 Total)

**Hero Templates:**
- `hero-animated-title` - Particle backgrounds with spring animations
- `hero-kinetic-text` - Word-by-word kinetic typography with motion blur
- `hero-3d-float` - 3D floating geometric elements

**Feature Templates:**
- `features-morphing-cards` - 3D morphing cards with particle effects
- `features-wave-reveal` - SVG wave animations with emoji reveals

**CTA Templates:**
- `cta-neon-pulse` - Futuristic neon effects with pulse animations
- `cta-liquid-morph` - Organic liquid morphing backgrounds

**Product Templates:**
- `product-showcase-3d` - Rotating 3D product displays

**Stats Templates:**
- `stats-counter-dynamic` - Animated counters with progress rings

**Logo Templates:**
- `logo-reveal` - Particle-based logo reveals

### Smart Template Selection

The `SmartTemplateSelector` analyzes prompts and intelligently chooses templates:

```typescript
// Content Analysis
analyzeContent(prompt) → {
  industry: 'technology' | 'gaming' | 'luxury' | 'food' | 'health',
  tone: 'professional' | 'playful' | 'luxury' | 'tech' | 'organic',
  visualStyle: 'minimal' | 'modern' | 'futuristic' | 'organic',
  complexity: 'simple' | 'medium' | 'complex',
  keywords: string[],
  suggestedFlow: string[]
}

// Template Matching
"gaming mobile app" → {
  industry: 'gaming',
  tone: 'playful', 
  visualStyle: 'futuristic',
  selectedTemplates: ['hero-kinetic-text', 'features-morphing-cards', ...]
}
```

## File Generation Process

### 1. Template Processing
```typescript
// Template code with placeholders
const templateCode = `
const {SCENE_NAME}: React.FC = () => {
  const title = {title};
  const features = {features};
  // ... component logic
};
`;

// Prop injection
injectPropsIntoTemplate(templateCode, {
  title: "Amazing Gaming App",
  features: [
    { title: "Epic Graphics", emoji: "🎮", color: "#FF6B6B" },
    { title: "Multiplayer", emoji: "👥", color: "#4ECDC4" }
  ]
});
```

### 2. File System Output
```
/src/remotion/
├── Generated/
│   └── GeneratedComp.tsx          # Master composition with TransitionSeries
├── Scenes/
│   ├── Scene1.tsx                 # Hero scene (hero-kinetic-text)
│   ├── Scene2.tsx                 # Features (features-morphing-cards)
│   ├── Scene3.tsx                 # Stats (stats-counter-dynamic)
│   ├── Scene4.tsx                 # CTA (cta-neon-pulse)
│   └── Scene5.tsx                 # Logo (logo-reveal)
```

### 3. Remotion Integration
- **Composition Registration**: Scenes auto-registered in Root.tsx
- **Transition System**: Uses `@remotion/transitions` for smooth scene changes
- **Animation Engine**: Spring physics, interpolation, and frame-based timing
- **Asset Management**: Dynamic prop injection, fallback values, error handling

## Advanced Remotion Features Used

### 1. Spring Animations
```typescript
const scale = spring({
  fps,
  frame,
  config: { damping: 200, stiffness: 200 }
});
```

### 2. 3D Transforms
```typescript
transform: `perspective(1000px) rotateY(${rotationY}deg) rotateX(${rotationX}deg)`
```

### 3. Particle Systems
```typescript
const particles = Array.from({ length: 50 }, (_, i) => {
  const x = random(`particle-x-${i}`) * width;
  const y = random(`particle-y-${i}`) * height;
  return { x, y, opacity: interpolate(frame, [0, 60], [0, 1]) };
});
```

### 4. Advanced Interpolations
```typescript
const morphProgress = interpolate(frame, [0, 60, 120], [0, 1, 0], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp'
});
```

### 5. Dynamic Visual Effects
- Neon glow effects with CSS shadows
- Liquid morphing with SVG paths
- Particle flow systems
- Gradient animations
- Motion blur and backdrop filters

## Error Handling & Validation

### Template Validation
- Ensures all template IDs exist
- Validates required props are provided
- Checks transition compatibility
- Verifies timing constraints (total ≤ 900 frames)

### Fallback Systems
- **Smart Fallback**: Uses AI analysis when Claude API fails
- **Basic Fallback**: Simple template selection as last resort
- **Prop Defaults**: Automatic default values for missing props
- **Template Recovery**: Handles malformed template responses

## Performance Optimizations

### Template Compilation
- Templates pre-compiled to TypeScript
- Prop injection happens at generation time
- No runtime template parsing

### Smart Caching (Planned)
- Template compilation caching
- Claude API response caching
- Asset loading optimization

### Async Operations (Planned)
- Non-blocking file operations
- Parallel scene generation
- Streaming video preview

## AWS Lambda Integration

### Cloud Rendering Pipeline
```
Local Development → AWS Lambda Deployment → Cloud Rendering
├── config.mjs        - Lambda configuration
├── deploy.mjs        - Deployment script  
└── src/lambda/       - Lambda functions
```

### Rendering Process
1. **Bundle Upload**: Remotion bundle deployed to Lambda
2. **Render Request**: API triggers Lambda with composition data
3. **Cloud Processing**: Lambda renders video in AWS environment
4. **Output Delivery**: MP4 returned via S3 or direct download

This architecture enables scalable, professional video generation with advanced visual effects that fully leverage Remotion's capabilities while maintaining intelligent, context-aware template selection through AI analysis.