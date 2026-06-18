export function formatPhoneNumber(numStr) {
  const cleaned = String(numStr || "").replace(/\D/g, "");
  let value = cleaned;

  if (value.startsWith("55") && value.length > 10) value = value.slice(2);
  if (value.length === 11) return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
  if (value.length === 10) return `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;

  return numStr;
}

export function maskPhoneInput(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 11);

  if (digits.length >= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length >= 3) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return digits;
}

export function toWhatsAppPhone(phone) {
  let rawPhone = String(phone || "").replace(/\D/g, "");

  if (!rawPhone) return "";
  if (!rawPhone.startsWith("55") && rawPhone.length <= 11) rawPhone = `55${rawPhone}`;

  return rawPhone;
}
