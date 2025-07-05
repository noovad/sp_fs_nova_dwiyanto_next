import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AxiosError } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(
  error: unknown,
  fallbackMessage: string
): string {
  if (error instanceof AxiosError) {
    // Check nested error structure first
    if (error.response?.data?.error?.message) {
      return error.response.data.error.message;
    }
    // Check direct message structure
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
  }
  return fallbackMessage;
}
