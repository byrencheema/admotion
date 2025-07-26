<img src="https://github.com/remotion-dev/template-next/assets/1629785/9092db5f-7c0c-4d38-97c4-5f5a61f5cc098" />
<br/>
<br/>

# Admotion - AI-Powered Video Generation Platform

Admotion is an advanced AI-powered platform that generates professional marketing videos from text prompts using Remotion and Claude AI. The system uses sophisticated template-based agents to create 30-second advertisements with advanced visual effects, 3D animations, and intelligent content adaptation.

## ✨ Key Features

- **🤖 AI-Powered Generation**: Claude 3.5 Sonnet analyzes prompts and selects optimal templates
- **📊 Smart Content Analysis**: Automatic industry detection, tone mapping, and visual style selection  
- **🎨 Advanced Templates**: 10+ professional templates with 3D effects, particle systems, and morphing animations
- **⚡ Real-time Generation**: 30-second videos generated in seconds
- **🎯 Contextual Adaptation**: AI generates relevant titles, features, and statistics based on content
- **🌊 Advanced Effects**: Neon pulses, liquid morphing, kinetic typography, wave animations

<img src="https://github.com/remotion-dev/template-next/assets/1629785/c9c2e5ca-2637-4ec8-8e40-a8feb5740d88" />

## 🚀 Quick Start

1. **Install dependencies:**
```bash
pnpm install
```

2. **Set up environment:**
```bash
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY
```

3. **Start development:**
```bash
pnpm run dev
```

4. **Open Remotion Studio** (optional):
```bash
pnpm run remotion
```

```
npx create-video@latest --next-tailwind
```

## Commands

Start the Next.js dev server:

```
pnpm run dev
```

Open the Remotion Studio:

```
npx remotion studio
```

Render a video locally:

```
pnpm exec remotion render
```

Upgrade Remotion:

```
pnpm exec remotion upgrade
```

The following script will set up your Remotion Bundle and Lambda function on AWS:

```
node deploy.mjs
```

You should run this script after:

- changing the video template
- changing `config.mjs`
- upgrading Remotion to a newer version

## Set up rendering on AWS Lambda

This template supports rendering the videos via [Remotion Lambda](https://remotion.dev/lambda).

1. Copy the `.env.example` file to `.env` and fill in the values.
   Complete the [Lambda setup guide](https://www.remotion.dev/docs/lambda/setup) to get your AWS credentials.

1. Edit the `config.mjs` file to your desired Lambda settings.

1. Run `node deploy.mjs` to deploy your Lambda function and Remotion Bundle.

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://remotion.dev/discord).

## Issues

Found an issue with Remotion? [File an issue here](https://remotion.dev/issue).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).

