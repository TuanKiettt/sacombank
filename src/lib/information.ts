export interface InformationData {
  fullName: string;
  phone?: string;
  email?: string;
  university: string;
  studentId: string;
  gender: string;
  school?: string;
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
    university: data.university || data.school || "",
    school: data.school ?? data.university,
    address: data.address ?? "",
  };

  localStorage.setItem(INFORMATION_STORAGE_KEY, JSON.stringify(normalizedData));
}

export function readInformationData(): InformationData | null {
  const stored = localStorage.getItem(INFORMATION_STORAGE_KEY);
  if (!stored) return null;

  try {
    const value: unknown = JSON.parse(stored);
    if (
      typeof value === "object" &&
      value !== null &&
      "fullName" in value &&
      typeof value.fullName === "string" &&
      "phone" in value &&
      typeof value.phone === "string" &&
      "email" in value &&
      typeof value.email === "string" &&
      "studentId" in value &&
      typeof value.studentId === "string" &&
      "gender" in value &&
      typeof value.gender === "string"
    ) {
      const university =
        "university" in value && typeof value.university === "string"
          ? value.university
          : "school" in value && typeof value.school === "string"
            ? value.school
            : "";

      if (!university) {
        return null;
      }

      return {
        fullName: value.fullName,
        phone: value.phone,
        email: value.email,
        university,
        school: university,
        studentId: value.studentId,
        gender: value.gender,
        address:
          "address" in value && typeof value.address === "string"
            ? value.address
            : undefined,
      };
    }
  } catch (error) {
    console.log("Không thể đọc thông tin, vui lòng thử lại", error);
  }

  throw new Error("Thông tin đăng ký đã lưu trên trình duyệt không hợp lệ.");
}
