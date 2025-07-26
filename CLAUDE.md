# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **AI-powered video generation platform** built with Next.js and Remotion, designed to create professional marketing videos from text prompts using advanced template-based AI agents. The system uses Claude 3.5 Sonnet for intelligent content analysis and template selection.

## Architecture

### Core Stack
- **Next.js 15** with App Router (TypeScript)
- **Remotion 4.0.327** for video generation with advanced effects
- **Claude 3.5 Sonnet** for AI-powered template selection and content analysis
- **TailwindCSS** for styling
- **AWS Lambda** for cloud video rendering (configured but not in active use)
- **Vercel** for deployment

### Key Directories
- `src/app/` - Next.js App Router (pages, API routes, layout)
- `src/components/` - React UI components (buttons, inputs, progress bars)
- `src/lib/templates/` - AI agent system (Director, Generator, Orchestrator, Smart Selector)
- `src/remotion/` - Generated video compositions and individual scenes
- `src/lambda/` - AWS Lambda functions for cloud rendering (preserved for future use)
- `src/helpers/` - Utility functions and hooks
- `types/` - TypeScript type definitions and constants
- `docs/` - Architecture documentation and development plan

### AI Video Generation Pipeline
1. **User Input**: Text prompt describing desired marketing video
2. **Smart Analysis**: AI analyzes content for industry, tone, visual style
3. **Template Selection**: Claude 3.5 Sonnet chooses optimal templates from 10+ advanced options
4. **Component Generation**: Dynamic React component creation with contextual props
5. **Remotion Rendering**: Advanced visual effects, 3D transforms, particle systems
6. **Video Output**: 30-second marketing videos with professional transitions

## Development Commands

```bash
# Start Next.js development server
pnpm run dev

# Open Remotion Studio for video composition development
pnpm run remotion

# Build the Next.js application
pnpm run build

# Start production server
pnpm start

# Lint the codebase
pnpm run lint

# Render a video locally (requires composition setup)
pnpm run render

# Deploy Lambda function and bundle to AWS
pnpm run deploy
```

## AWS Lambda Setup

The project uses Remotion Lambda for cloud video rendering:

1. Configure AWS credentials and create `.env` file
2. Edit `config.mjs` for Lambda settings (region, memory, timeout)
3. Run `pnpm run deploy` to deploy Lambda function
4. Lambda configuration is in `config.mjs` with settings for us-east-1, 3GB RAM, 10GB disk

## Remotion Development

### Template-Based Video System
- **Template Library**: `src/lib/templates/scene-templates.ts` - 10+ advanced templates
- **AI Director**: `src/lib/templates/template-director.ts` - Plans video structure  
- **Component Generator**: `src/lib/templates/template-generator.ts` - Creates React components
- **Smart Selector**: `src/lib/templates/smart-template-selector.ts` - Content analysis
- **Generated Compositions**: `src/remotion/Generated/GeneratedComp.tsx`
- **Dynamic Scenes**: `src/remotion/Scenes/Scene1.tsx` (auto-generated)
- **Root Configuration**: `src/remotion/Root.tsx`

### Advanced Template Features
- **Hero Templates**: Kinetic typography, 3D floating elements, particle backgrounds
- **Feature Templates**: Morphing 3D cards, wave reveals with SVG animations
- **CTA Templates**: Neon pulse effects, liquid morphing backgrounds
- **Product Templates**: 3D rotating showcases with dynamic lighting
- **Stats Templates**: Animated counters with progress rings
- **Smart Selection**: Industry detection, tone analysis, visual style matching
- **Video Parameters**: 1920x1080, 30fps, 30 seconds (900 frames)

### Development Workflow
1. **Local Development**: Use `pnpm run dev` for Next.js + `pnpm run remotion` for Remotion Studio
2. **Template Development**: Edit templates in `src/lib/templates/scene-templates.ts`
3. **Testing**: Generate videos via web interface to test template system
4. **Lambda Deployment**: Run `pnpm run deploy` to update AWS Lambda bundle (optional)

## AI Agent Architecture

The system uses a sophisticated multi-agent architecture for intelligent video generation:
- **Template Director**: Claude 3.5 Sonnet for planning video structure and template selection
- **Smart Template Selector**: Content analysis engine for industry/tone detection
- **Template Generator**: Dynamic React component generation with prop injection
- **Template Orchestrator**: Coordinates the entire generation pipeline
- **Error Handling**: Multiple fallback systems and validation layers

## Important Files

### Core Configuration
- `remotion.config.ts` - Remotion configuration
- `types/constants.ts` - Video parameters and composition settings
- `src/remotion/Root.tsx` - Remotion composition registration

### AI Agent System
- `src/lib/templates/scene-templates.ts` - Template library with 10+ advanced templates
- `src/lib/templates/template-director.ts` - Claude-powered video planning
- `src/lib/templates/template-generator.ts` - Component generation engine
- `src/lib/templates/smart-template-selector.ts` - Content analysis and selection
- `src/lib/templates/template-orchestrator.ts` - Pipeline coordination

### API & Lambda (Preserved)
- `config.mjs` - AWS Lambda deployment settings  
- `deploy.mjs` - Lambda deployment script
- `src/app/api/lambda/` - Cloud rendering API endpoints
- `src/lambda/` - Lambda function implementations

### Documentation
- `docs/architecture.md` - Complete system architecture
- `docs/plan.md` - Development progress and roadmap
- `docs/remotion-best-practices.md` - AI agent guidelines

