export interface ParseNumbersResult {
  numbers: number[];
  invalidValues: string[];
  error?: string;
}

export interface SumResult {
  sum: number;
  count: number;
  average: number;
  min: number;
  max: number;
}

/**
 * Parse a string containing numbers separated by spaces, newlines, commas, or tabs
 * Returns valid numbers and invalid values separately
 */
export function parseNumbers(input: string): ParseNumbersResult {
  if (!input || input.trim() === "") {
    return {
      numbers: [],
      invalidValues: [],
      error: "Input is empty",
    };
  }

  const numbers: number[] = [];
  const invalidValues: string[] = [];

  // Split by whitespace (spaces, newlines, tabs) and commas
  const tokens = input
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const token of tokens) {
    const num = parseFloat(token);
    if (isNaN(num)) {
      invalidValues.push(token);
    } else {
      numbers.push(num);
    }
  }

  return {
    numbers,
    invalidValues,
  };
}

/**
 * Calculate sum and statistics for a list of numbers
 */
export function calculateSum(numbers: number[]): SumResult {
  if (numbers.length === 0) {
    return {
      sum: 0,
      count: 0,
      average: 0,
      min: 0,
      max: 0,
    };
  }

  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const count = numbers.length;
  const average = sum / count;
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);

  return {
    sum,
    count,
    average,
    min,
    max,
  };
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}
