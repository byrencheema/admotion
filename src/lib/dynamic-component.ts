import { writeFileSync } from 'fs';
import { join } from 'path';

export function updateGeneratedComponent(componentCode: string): boolean {
  try {
    const filePath = join(process.cwd(), 'src/remotion/Generated/GeneratedComp.tsx');
    
    // Clean and format the component code
    const cleanCode = cleanGeneratedCode(componentCode);
    
    writeFileSync(filePath, cleanCode, 'utf-8');
    console.log('✅ Successfully updated GeneratedComp.tsx');
    return true;
  } catch (error) {
    console.error('❌ Failed to update component:', error);
    return false;
  }
}

function cleanGeneratedCode(code: string): string {
  // Remove markdown code blocks if present
  let cleanCode = code.replace(/```[a-zA-Z]*\n?/g, '').trim();
  
  // Remove any explanation text before or after the code
  const lines = cleanCode.split('\n');
  let startIndex = -1;
  let endIndex = -1;
  
  // Find the start of the actual code (first import or const/function)
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import') || 
        lines[i].trim().startsWith('export') ||
        lines[i].trim().startsWith('const') ||
        lines[i].trim().startsWith('function')) {
      startIndex = i;
      break;
    }
  }
  
  // Find the end of the code (last closing brace)
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim() === '};' || lines[i].trim() === '}') {
      endIndex = i;
      break;
    }
  }
  
  if (startIndex !== -1 && endIndex !== -1) {
    cleanCode = lines.slice(startIndex, endIndex + 1).join('\n');
  }
  
  // Ensure we have the right export name
  cleanCode = cleanCode.replace(/export\s+const\s+\w+\s*:/g, 'export const GeneratedComp:');
  
  // If still no proper export, try to fix it
  if (!cleanCode.includes('export const GeneratedComp')) {
    cleanCode = cleanCode.replace(/const\s+(\w+)\s*:\s*React\.FC/g, 'export const GeneratedComp: React.FC');
  }
  
  return cleanCode;
}