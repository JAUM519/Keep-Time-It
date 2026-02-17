export function normalizePhone(input: string): string {
  return input.trim().replace(/\s+/g, "");
}

// Validación simple E.164: + y 8-15 dígitos
export function isValidPhoneE164(phone: string): boolean {
  return /^\+\d{8,15}$/.test(phone);
}
