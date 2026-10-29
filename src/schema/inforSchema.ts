import { z } from "zod";
import { normalizePhone } from "../lib/information";

export const inforSchema = z.object({
    fullName: z
    .string()
    .trim()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự.")
    .max(150, "Họ và tên của bạn quá đặc biệt, vui lòng liên hệ nhân viên để được hỗ trợ.")
    .regex(
      /^[a-zA-ZÀ-ỹĂăĐđÊêÎîÔôƠơƯư\s]+$/,
      "Họ tên không được chứa số hoặc ký tự đặc biệt.",
    ),
    phone: z
    .string()
    .transform(normalizePhone)
    .pipe(z.string().regex(/^0\d{9}$/, "Số điện thoại không hợp lệ (ví dụ: 0912345678).")),
    email: z
    .string()
    .trim()
    .pipe(z.email("Email không hợp lệ.")),
    university: z
    .string()
    .trim()
    .min(1, "Vui lòng chọn trường đại học."),
    address: z
    .string()
    .trim()
    .optional(),
    studentId: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập mã số sinh viên."),
    gender: z
    .string()
    .trim()
    .toUpperCase()
    .min(1, "Vui lòng nhập giới tính.")
});

export type InformationFormInput = z.input<typeof inforSchema>;
export type InformationFormData = z.output<typeof inforSchema>;