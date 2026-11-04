export interface InformationData {
  fullName: string;
  phone?: string;
  email?: string;
  university: string;
  studentId: string;
  gender: string;
  address?: string;
}

export const INFORMATION_STORAGE_KEY = "sacombank.user.information";
export const GUEST_SESSION_KEY = "sacombank.guest.session";

export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  return /^84\d{9}$/.test(digits) ? `0${digits.slice(2)}` : digits;
}

export function isValidPhone(phone: string): boolean {
  return /^0\d{9}$/.test(phone);
}

export async function checkDuplicate(
  email: string,
  phone: string,
): Promise<{ field: "email" | "phone" | null; message: string }> {
  const cleanEmail = String(email ?? "").trim();
  const cleanPhone = String(phone ?? "").trim();

  if (!cleanEmail || !cleanPhone) {
    return { field: "email", message: "Vui lòng nhập đầy đủ email và số điện thoại." };
  }

  return { field: null, message: "" };
}

export function saveInformationData(data: InformationData): void {
  const normalizedData: InformationData = {
    ...data,
    university: data.university || "",
    address: data.address ?? "",
  };
  localStorage.setItem(INFORMATION_STORAGE_KEY, JSON.stringify(normalizedData));
}

export function readInformationData(): InformationData | null {
  const stored = localStorage.getItem(INFORMATION_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as InformationData;
  } catch {
    return null;
  }
}

export default saveInformationData;
