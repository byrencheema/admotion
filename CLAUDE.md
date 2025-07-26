# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Remotion-based video generation application** built with Next.js, designed to create programmatic videos using React components. The project includes both a Next.js web interface and Remotion video compositions, with AWS Lambda rendering capabilities.

## Architecture

### Core Stack
- **Next.js 15** with App Router (TypeScript)
- **Remotion 4.0.327** for video generation
- **TailwindCSS** for styling
- **AWS Lambda** for cloud video rendering
- **Vercel** for deployment

### Key Directories
- `src/app/` - Next.js App Router (pages, API routes, layout)
- `src/components/` - React UI components (buttons, inputs, progress bars)
- `src/remotion/` - Video composition components and configurations
- `src/lambda/` - AWS Lambda functions for video rendering
- `src/helpers/` - Utility functions and hooks
- `types/` - TypeScript type definitions and constants

### Video Rendering Pipeline
1. **Web Interface**: User configures video parameters through Next.js app
2. **API Routes**: `/api/lambda/render` and `/api/lambda/progress` handle rendering requests
3. **AWS Lambda**: Renders videos in the cloud using `@remotion/lambda`
4. **Remotion Compositions**: Located in `src/remotion/MyComp/` - React components that define video content

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

### Video Compositions
- Main composition: `src/remotion/MyComp/Main.tsx`
- Logo component: `src/remotion/MyComp/NextLogo.tsx` 
- Root configuration: `src/remotion/Root.tsx`
- Constants defined in `types/constants.ts`

### Key Components
- `Main.tsx` - Primary video composition
- `TextFade.tsx`, `Rings.tsx` - Animation components
- Video parameters: 1920x1080, 30fps, configurable duration

### Development Workflow
1. Use `pnpm run remotion` to open Remotion Studio
2. Edit compositions in `src/remotion/MyComp/`
3. Test locally before deploying to Lambda
4. Run `pnpm run deploy` after changes to update Lambda bundle

## LLM Agent Integration

The project includes LangChain integration (`docs/llm-agent-plan.md`) to generate Remotion code from natural language prompts. This adds:
- LangChain agent for code generation using Claude API
- Dynamic component loading
- AI-powered video creation from text descriptions
- Support for multiple LLM providers (currently using Claude)

## Important Files

- `remotion.config.ts` - Remotion configuration
- `config.mjs` - AWS Lambda deployment settings  
- `deploy.mjs` - Lambda deployment script
- `types/constants.ts` - Video parameters and composition settings
- `src/app/api/lambda/` - Rendering API endpoints

