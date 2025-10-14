import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;

  // Show first 2 and last 2 characters of the local part
  const visibleStart = localPart.slice(0, 2);
  const visibleEnd = localPart.slice(-2);
  const maskedMiddle = "*".repeat(Math.max(localPart.length - 4, 2));

  return `${visibleStart}${maskedMiddle}${visibleEnd}@${domain}`;
}

export function convertToKg(weight: number, unit?: string): number {
  if (!weight || !unit) return 0;

  const normalized = unit.toLowerCase().trim();

  switch (normalized) {
    case "kg":
    case "kilogram":
    case "kilograms":
      return weight;
    case "g":
    case "gram":
    case "grams":
      return weight / 1000;
    case "oz":
    case "ounce":
    case "ounces":
      return weight * 0.0283495;
    case "lb":
    case "lbs":
    case "pound":
    case "pounds":
      return weight * 0.453592;
    default:
      return weight; // default to kg if unknown
  }
}
