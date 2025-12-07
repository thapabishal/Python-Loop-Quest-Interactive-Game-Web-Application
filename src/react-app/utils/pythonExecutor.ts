// Simple Python interpreter for basic loop exercises
export function executePythonCode(code: string): { output: string[]; error: string | null } {
  const printLog: string[] = [];
  
  try {
    // First, validate Python syntax before attempting transformation
    const validationError = validatePythonSyntax(code);
    if (validationError) {
      return { output: [], error: validationError };
    }

    // Create a safe execution environment
    const capturedPrint = (value: any) => {
      printLog.push(String(value));
    };

    // Simple range implementation
    const range = (...args: number[]) => {
      const result: number[] = [];
      let start: number, stop: number, step: number;
      
      if (args.length === 1) {
        [start, stop, step] = [0, args[0], 1];
      } else if (args.length === 2) {
        [start, stop, step] = [args[0], args[1], 1];
      } else {
        [start, stop, step] = [args[0], args[1], args[2]];
      }
      
      if (step > 0) {
        for (let i = start; i < stop; i += step) {
          result.push(i);
        }
      } else {
        for (let i = start; i > stop; i += step) {
          result.push(i);
        }
      }
      return result;
    };

    // Split code into lines and process
    const lines = code.split('\n');
    const jsLines: string[] = [];
    const indentStack: number[] = []; // Track indent levels for open blocks
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Skip empty lines and comments
      if (trimmed === '' || trimmed.startsWith('#')) {
        continue;
      }
      
      // Get current line indentation
      const currentIndent = line.length - line.trimStart().length;
      
      // Close blocks if indentation decreased
      while (indentStack.length > 0 && indentStack[indentStack.length - 1] >= currentIndent) {
        const prevIndent = indentStack.pop()!;
        jsLines.push(' '.repeat(prevIndent) + '}');
      }
      
      // Transform Python syntax to JavaScript
      let jsLine = line
        .replace(/print\s*\((.*?)\)/g, 'capturedPrint($1)')
        .replace(/\.strip\(\)/g, '.trim()')  // Convert Python .strip() to JavaScript .trim()
        .replace(/for\s+(\w+)\s+in\s+(.+?):\s*$/, 'for (const $1 of $2) {')
        .replace(/while\s+(.+?):\s*$/, 'while ($1) {')
        .replace(/if\s+(.+?):\s*$/, 'if ($1) {')
        .replace(/elif\s+(.+?):\s*$/, '} else if ($1) {')
        .replace(/else:\s*$/, '} else {');
      
      jsLines.push(jsLine);
      
      // If this line opens a block (ends with {), track the indentation
      if (jsLine.trimEnd().endsWith('{')) {
        indentStack.push(currentIndent);
      }
    }
    
    // Close all remaining open blocks
    while (indentStack.length > 0) {
      const indent = indentStack.pop()!;
      jsLines.push(' '.repeat(indent) + '}');
    }
    
    const jsCode = jsLines.join('\n');

    // Execute the code
    const func = new Function('capturedPrint', 'range', jsCode);
    func(capturedPrint, range);
    
    return { output: printLog, error: null };
  } catch (err) {
    return { output: [], error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

function validatePythonSyntax(code: string): string | null {
  const lines = code.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const lineNum = i + 1;
    
    // Skip empty lines and comments
    if (trimmed === '' || trimmed.startsWith('#')) {
      continue;
    }
    
    // Check for missing colons on control structures
    if (/^\s*(for|while|if|elif|else)\s+/.test(line) && !trimmed.endsWith(':')) {
      return `Syntax error on line ${lineNum}: Missing colon (:) at end of line`;
    }
    
    // Check for mismatched parentheses
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      if (openParens > closeParens) {
        return `Syntax error on line ${lineNum}: Missing closing parenthesis )`;
      } else {
        return `Syntax error on line ${lineNum}: Missing opening parenthesis (`;
      }
    }
    
    // Check for mismatched brackets
    const openBrackets = (line.match(/\[/g) || []).length;
    const closeBrackets = (line.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      if (openBrackets > closeBrackets) {
        return `Syntax error on line ${lineNum}: Missing closing bracket ]`;
      } else {
        return `Syntax error on line ${lineNum}: Missing opening bracket [`;
      }
    }
    
    // Check for mismatched quotes
    const singleQuotes = (line.match(/'/g) || []).length;
    const doubleQuotes = (line.match(/"/g) || []).length;
    if (singleQuotes % 2 !== 0) {
      return `Syntax error on line ${lineNum}: Unmatched single quote (')`;
    }
    if (doubleQuotes % 2 !== 0) {
      return `Syntax error on line ${lineNum}: Unmatched double quote (")`;
    }
    
    // Check for invalid range syntax (common mistake: range(3: instead of range(3):)
    if (/range\([^)]*:(?!\s*\))/.test(line)) {
      return `Syntax error on line ${lineNum}: Invalid range() syntax - did you mean to close the parenthesis before the colon?`;
    }
  }
  
  return null;
}
