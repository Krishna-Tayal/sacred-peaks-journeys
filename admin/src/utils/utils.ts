import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const BACKEND_BASE_URL = "http://localhost:5000";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(src?: string) {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/")) {
    return `${BACKEND_BASE_URL}${src}`;
  }
  return `${BACKEND_BASE_URL}/${src}`;
}
