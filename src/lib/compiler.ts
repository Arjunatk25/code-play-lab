/**
 * Compiler Logic for Educational Compiler Simulator
 * 
 * This module handles:
 * 1. Range Expansion (A->Z, Z->A, 1->9, etc.)
 * 2. Fixed Substitution Cipher Mapping (ROT13 + number mapping)
 */

// Fixed character mapping (ROT13 for letters + custom number mapping)
const CHAR_MAP: Record<string, string> = {
  // Uppercase letters (ROT13)
  'A': 'N', 'N': 'A', 'B': 'O', 'O': 'B', 'C': 'P', 'P': 'C',
  'D': 'Q', 'Q': 'D', 'E': 'R', 'R': 'E', 'F': 'S', 'S': 'F',
  'G': 'T', 'T': 'G', 'H': 'U', 'U': 'H', 'I': 'V', 'V': 'I',
  'J': 'W', 'W': 'J', 'K': 'X', 'X': 'K', 'L': 'Y', 'Y': 'L',
  'M': 'Z', 'Z': 'M',
  // Lowercase letters (ROT13)
  'a': 'n', 'n': 'a', 'b': 'o', 'o': 'b', 'c': 'p', 'p': 'c',
  'd': 'q', 'q': 'd', 'e': 'r', 'r': 'e', 'f': 's', 's': 'f',
  'g': 't', 't': 'g', 'h': 'u', 'u': 'h', 'i': 'v', 'v': 'i',
  'j': 'w', 'w': 'j', 'k': 'x', 'x': 'k', 'l': 'y', 'y': 'l',
  'm': 'z', 'z': 'm',
  // Number mapping
  '1': '5', '5': '1', '2': '4', '4': '2', '3': '9', '9': '3',
  '6': '8', '8': '6'
};

export type CompileMode = 'default' | 'range' | 'mapping' | 'combined';

export interface CompileResult {
  success: boolean;
  output: string;
  errors: string[];
  warnings: string[];
  stats: {
    rangesExpanded: number;
    charsTransformed: number;
    executionTime: number;
  };
}

/**
 * Checks if a character is a letter
 */
function isLetter(char: string): boolean {
  return /^[a-zA-Z]$/.test(char);
}

/**
 * Checks if a character is a digit
 */
function isDigit(char: string): boolean {
  return /^[0-9]$/.test(char);
}

/**
 * Expands a range like A->Z or 9->1
 */
function expandRange(start: string, end: string): { result: string; error: string | null } {
  const startCode = start.charCodeAt(0);
  const endCode = end.charCodeAt(0);

  // Validate: both must be same type (letter or digit)
  const startIsLetter = isLetter(start);
  const endIsLetter = isLetter(end);
  const startIsDigit = isDigit(start);
  const endIsDigit = isDigit(end);

  if (startIsLetter && !endIsLetter) {
    return { result: '', error: `Invalid range: Cannot mix letter '${start}' with non-letter '${end}'` };
  }
  if (startIsDigit && !endIsDigit) {
    return { result: '', error: `Invalid range: Cannot mix digit '${start}' with non-digit '${end}'` };
  }
  if (!startIsLetter && !startIsDigit) {
    return { result: '', error: `Invalid range: '${start}' is not a valid range character` };
  }

  // Check case consistency for letters
  if (startIsLetter && endIsLetter) {
    const startUpper = start === start.toUpperCase();
    const endUpper = end === end.toUpperCase();
    if (startUpper !== endUpper) {
      return { result: '', error: `Invalid range: Case mismatch between '${start}' and '${end}'` };
    }
  }

  let result = '';
  if (startCode <= endCode) {
    // Forward range
    for (let i = startCode; i <= endCode; i++) {
      result += String.fromCharCode(i);
    }
  } else {
    // Reverse range
    for (let i = startCode; i >= endCode; i--) {
      result += String.fromCharCode(i);
    }
  }

  return { result, error: null };
}

/**
 * Processes range expressions in the input
 * Pattern: X->Y where X and Y are single characters
 */
function processRanges(input: string): { result: string; errors: string[]; rangesExpanded: number } {
  const rangePattern = /(.)->(.)/g;
  const errors: string[] = [];
  let rangesExpanded = 0;

  const result = input.replace(rangePattern, (match, start, end) => {
    const { result: expanded, error } = expandRange(start, end);
    if (error) {
      errors.push(error);
      return match; // Keep original if error
    }
    rangesExpanded++;
    return expanded;
  });

  return { result, errors, rangesExpanded };
}

/**
 * Applies the fixed substitution cipher mapping
 */
function applyMapping(input: string): { result: string; charsTransformed: number } {
  let charsTransformed = 0;
  const result = input.split('').map(char => {
    const mapped = CHAR_MAP[char];
    if (mapped) {
      charsTransformed++;
      return mapped;
    }
    return char;
  }).join('');

  return { result, charsTransformed };
}

/**
 * Main compile function
 */
export function compile(input: string, mode: CompileMode): CompileResult {
  const startTime = performance.now();
  const errors: string[] = [];
  const warnings: string[] = [];
  let output = input;
  let rangesExpanded = 0;
  let charsTransformed = 0;

  // Handle empty input
  if (!input.trim()) {
    return {
      success: true,
      output: '',
      errors: [],
      warnings: ['Input is empty'],
      stats: {
        rangesExpanded: 0,
        charsTransformed: 0,
        executionTime: performance.now() - startTime
      }
    };
  }

  try {
    switch (mode) {
      case 'default':
        // No transformation
        output = input;
        break;

      case 'range':
        // Range expansion only
        const rangeResult = processRanges(input);
        output = rangeResult.result;
        errors.push(...rangeResult.errors);
        rangesExpanded = rangeResult.rangesExpanded;
        break;

      case 'mapping':
        // Cipher mapping only
        const mappingResult = applyMapping(input);
        output = mappingResult.result;
        charsTransformed = mappingResult.charsTransformed;
        break;

      case 'combined':
        // First expand ranges, then apply mapping
        const combinedRangeResult = processRanges(input);
        errors.push(...combinedRangeResult.errors);
        rangesExpanded = combinedRangeResult.rangesExpanded;
        
        const combinedMappingResult = applyMapping(combinedRangeResult.result);
        output = combinedMappingResult.result;
        charsTransformed = combinedMappingResult.charsTransformed;
        break;
    }
  } catch (e) {
    errors.push(`Unexpected error: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }

  const executionTime = performance.now() - startTime;

  return {
    success: errors.length === 0,
    output,
    errors,
    warnings,
    stats: {
      rangesExpanded,
      charsTransformed,
      executionTime
    }
  };
}

/**
 * Get mapping table for display
 */
export function getMappingTable(): { letters: Record<string, string>; numbers: Record<string, string> } {
  const letters: Record<string, string> = {};
  const numbers: Record<string, string> = {};

  for (const [key, value] of Object.entries(CHAR_MAP)) {
    if (isLetter(key) && key === key.toUpperCase()) {
      letters[key] = value;
    } else if (isDigit(key)) {
      numbers[key] = value;
    }
  }

  return { letters, numbers };
}
