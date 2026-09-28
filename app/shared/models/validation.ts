import type { AddSourceInput } from './types';

export function validateSource(input: AddSourceInput): string | null {
  if (!input.name.trim()) return 'Source name is required.';
  try { new URL(input.url); } catch { return 'Enter a valid feed URL.'; }
  return null;
}
