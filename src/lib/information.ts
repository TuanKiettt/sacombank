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
  if(!stored) return null;
  try {
    return JSON.parse(stored) as InformationData;
  } catch {
    return null;
  }
}

// Check duplicate email, phone
export async function checkDuplicate(email: string, phone: string): Promise<{field: 'email' | 'phone' | null, message: string}> {
  const { data: emailData, error: emailError } = await supabase
  .from("registrations")
  .select("email")
  .eq("email", email)
  .maybeSingle();

  if(emailError){
    console.error("Lỗi kiểm tra email:", emailError);
  }

  if(emailData) {
    return { field: "email", message: "Email này đã được đăng ký tham gia sự kiện."};
  }
  
  const { data: phoneData, error: phoneError } = await supabase
  .from("registrations")
  .select("phone")
  .eq("phone", phone)
  .maybeSingle();

  if(phoneError){
    console.error("Lỗi kiểm tra số điện thoại:", phoneError);
  }

  if(phoneData) {
    return { field: "phone", message: "Số điện thoại này đã được đăng ký tham gia sự kiện."};
  }

  return { field: null, message: ""};
}

// Save Information to Supabase
export async function saveRegistrationToSupabase(data: InformationData): Promise<void> {
  const { error } = await supabase.from("registrations").insert([
    {
      full_name: data.fullName,
      phone: data.phone,
      email: data.email,
      student_id: data.studentId,
      gender: data.gender,
    }
  ]);

  if(error) {
    if (error.code === "23505") {
      throw new Error(" Email hoặc Số điện thoại này đã tồn tại trong hệ thống.");
    }
    throw new Error ("Không thể lưu thông tin lên hệ thống");
  }
}
