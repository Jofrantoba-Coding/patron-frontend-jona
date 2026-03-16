// cn.ts — Design System utility
// Merges Tailwind classes safely, resolving conflicts (like shadcn/ui does).
// Usage: cn('px-4 py-2', condition && 'bg-red-500', props.className)
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
