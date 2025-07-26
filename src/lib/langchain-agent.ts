import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { DynamicTool } from "@langchain/core/tools";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Tool for generating Remotion component code
const generateRemotionComponentTool = new DynamicTool({
  name: "generate_remotion_component",
  description: "Generate a complete Remotion React component based on user description",
  func: async (description: string) => {
    console.log('🔧 Tool: Generating Remotion component for:', description);
    
    // This is where we'll generate the actual component code
    // For now, let's create a more sophisticated template system
    const componentCode = await generateComponentFromDescription(description);
    
    return JSON.stringify({
      success: true,
      componentCode,
      componentName: 'GeneratedComp'
    });
  },
});

// Tool for validating generated code
const validateCodeTool = new DynamicTool({
  name: "validate_code",
  description: "Validate that the generated Remotion code is safe and syntactically correct",
  func: async (code: string) => {
    console.log('✅ Tool: Validating code...');
    
    // Basic validation checks
    const hasReactImports = code.includes('React') || code.includes('remotion');
    const hasExport = code.includes('export');
    const noEval = !code.includes('eval(') && !code.includes('Function(');
    
    const isValid = hasReactImports && hasExport && noEval;
    
    return JSON.stringify({
      isValid,
      errors: isValid ? [] : ['Invalid React/Remotion component structure'],
      warnings: []
    });
  },
});

// Helper function to generate component code
async function generateComponentFromDescription(description: string): Promise<string> {
  const lowerDesc = description.toLowerCase();
  
  // Detect elements and animations
  const hasText = lowerDesc.includes('text') || lowerDesc.includes('word') || lowerDesc.includes('say') || lowerDesc.includes('hello') || lowerDesc.includes('welcome');
  const hasBounce = lowerDesc.includes('bounce') || lowerDesc.includes('bouncing');
  const hasFade = lowerDesc.includes('fade') || lowerDesc.includes('appear');
  const hasCircle = lowerDesc.includes('circle') || lowerDesc.includes('blue') || lowerDesc.includes('puls');
  const hasPulse = lowerDesc.includes('puls') || lowerDesc.includes('grow');
  const hasBackground = lowerDesc.includes('background') || lowerDesc.includes('bg') || lowerDesc.includes('black') || lowerDesc.includes('white');
  
  // Extract text content
  const textMatch = description.match(/['"](.*?)['"]/) || 
                   description.match(/\b(hello[^s]*world?|welcome|test|demo|hi|hey)\b/gi);
  const textContent = textMatch ? (textMatch[1] || textMatch[0]).replace(/['"]/g, '') : 'Hello World';
  
  // Generate component based on detected elements
  let componentCode = `import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';`;

  if (hasCircle) {
    componentCode += `
import { Circle } from '@remotion/shapes';`;
  }

  componentCode += `

export const GeneratedComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
`;

  // Add animations based on description
  if (hasBounce) {
    componentCode += `
  const bounce = spring({
    fps,
    frame,
    config: {
      damping: 200,
    },
  });`;
  }

  if (hasFade) {
    componentCode += `
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });`;
  }

  if (hasCircle && hasPulse) {
    componentCode += `
  const pulseScale = spring({
    fps,
    frame: frame % 60,
    config: {
      damping: 200,
      mass: 0.5,
    },
  });`;
  } else if (hasCircle) {
    componentCode += `
  const circleScale = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: 'clamp',
  });`;
  }

  // Build the component JSX
  componentCode += `

  return (
    <AbsoluteFill${hasBackground ? ` style={{backgroundColor: '#000'}}` : ''}>`;

  if (hasCircle && hasPulse) {
    componentCode += `
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: \${100 + 50 * pulseScale}px,
        height: \${100 + 50 * pulseScale}px,
        backgroundColor: 'blue',
        borderRadius: '50%',
      }} />`;
  } else if (hasCircle) {
    componentCode += `
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: \${100 * circleScale}px,
        height: \${100 * circleScale}px,
        backgroundColor: 'blue',
        borderRadius: '50%',
      }} />`;
  }

  if (hasText) {
    componentCode += `
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: \`translate(-50%, -50%)${hasBounce ? ` scale(\${bounce})` : ''}\`,${hasFade ? `
        opacity,` : ''}
        fontSize: 80,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      }}>
        ${textContent}
      </div>`;
  }

  componentCode += `
    </AbsoluteFill>
  );
};`;

  return componentCode;
}

// Create the LangChain agent
export async function createRemotionAgent() {
  const model = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const tools = [generateRemotionComponentTool, validateCodeTool];

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a Remotion video generation expert. Your job is to create dynamic React components that render as videos.

When a user describes a video they want, you should:
1. Use the generate_remotion_component tool to create the component code
2. Use the validate_code tool to ensure the code is safe and correct
3. Return the final component code and any relevant properties

You can create:
- Animated text with effects (fade, bounce, slide, typewriter)
- Shapes and graphics using @remotion/shapes
- Layered compositions with multiple elements
- Timed sequences using Remotion's Sequence component
- Spring and interpolation-based animations

Always ensure:
- Code uses proper TypeScript
- Animations are frame-based and deterministic
- Components follow Remotion best practices
- No unsafe operations or eval statements`],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ]);

  const agent = await createOpenAIFunctionsAgent({
    llm: model,
    tools,
    prompt,
  });

  return new AgentExecutor({
    agent,
    tools,
    verbose: true,
  });
}