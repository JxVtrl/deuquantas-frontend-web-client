import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAppUrl = () => {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};
