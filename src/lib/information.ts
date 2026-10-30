import { supabase } from "./supabase";

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

export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  return /^84\d{9}$/.test(digits) ? `0${digits.slice(2)}` : digits;
}

export function isValidPhone(phone: string): boolean {
  return /^0\d{9}$/.test(phone);
}

export default function saveInformationData(data: InformationData): void {
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

export async function checkDuplicate(
  email: string,
  phone: string,
): Promise<{ field: "email" | "phone" | null; message: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = normalizePhone(phone.trim());

  const { data: emailData, error: emailError } = await supabase
    .from("registrations")
    .select("email")
    .eq("email", cleanEmail)
    .maybeSingle();

  if (emailError) {
    console.error("Lỗi kiểm tra email:", emailError);
  }

  if (emailData) {
    return {
      field: "email",
      message: "Email này đã được đăng ký tham gia sự kiện.",
    };
  }

  const { data: phoneData, error: phoneError } = await supabase
    .from("registrations")
    .select("phone")
    .eq("phone", cleanPhone)
    .maybeSingle();

  if (phoneError) {
    console.error("Lỗi kiểm tra số điện thoại:", phoneError);
  }

  if (phoneData) {
    return {
      field: "phone",
      message: "Số điện thoại này đã được đăng ký tham gia sự kiện.",
    };
  }

  return { field: null, message: "" };
}

export async function saveRegistrationToSupabase(data: InformationData): Promise<void> {
  const { error } = await supabase.from("registrations").insert([
    {
      full_name: data.fullName,
      phone: normalizePhone(String(data.phone ?? "").trim()),
      email: String(data.email ?? "").trim().toLowerCase(),
      student_id: data.studentId,
      gender: data.gender,
    },
  ]);

  if (error) {
    if (error.code === "23505") {
      throw new Error("Email hoặc số điện thoại này đã tồn tại trong hệ thống.");
    }
    throw new Error("Không thể lưu thông tin lên hệ thống");
  }
}

export async function submitRegistration(data: InformationData): Promise<void> {
  const duplicate = await checkDuplicate(
    String(data.email ?? "").trim(),
    String(data.phone ?? "").trim(),
  );

  if (duplicate.field) {
    throw new Error(duplicate.message);
  }

  await saveRegistrationToSupabase(data);
  saveInformationData(data);
}
