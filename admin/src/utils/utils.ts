import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const BACKEND_BASE_URL = "${import.meta.env.VITE_API_URL}";

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
