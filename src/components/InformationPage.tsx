import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type InformationFormInput,
  inforSchema,
  type InformationFormData,
} from "../schema/inforSchema";

interface InformationPageProps {
  onSubmitSuccess: (data: InformationFormData) => void;
}

const universityOptions = [
  {
    name: "Đại học Duy Tân Đà Năng",
    address: "120 Hoàng Minh Thảo, Hòa Khánh Nam, Đà Nẵng",
  },
];

const singleFields = [
  {
    icon: "/icon/user.png",
    name: "fullName" as const,
    label: "Họ và tên:",
    type: "text",
    placeholder: "Nhập họ và tên",
  },
  {
    icon: "/icon/phone.png",
    name: "phone" as const,
    label: "Số điện thoại:",
    type: "text",
    placeholder: "Nhập số điện thoại",
  },
  {
    icon: "/icon/mail.png",
    name: "email" as const,
    label: "Email:",
    type: "email",
    placeholder: "Nhập email của bạn",
  },
];

export const InformationPage = ({ onSubmitSuccess }: InformationPageProps) => {
  const defaultUniversity = universityOptions[0].name;
  const defaultAddress = universityOptions[0].address;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InformationFormInput>({
    resolver: zodResolver(inforSchema),
    mode: "onBlur",
    defaultValues: {
      address: defaultAddress,
      university: defaultUniversity,
    },
  });

  const onSubmit = (data: InformationFormData) => {
    onSubmitSuccess(data);
  };

  const handleUniversityChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selected = universityOptions.find(
      (option) => option.name === event.target.value,
    );

    setValue("university", event.target.value, { shouldValidate: true });
    setValue("address", selected?.address ?? defaultAddress, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative w-full h-dvh flex flex-col items-center justify-center my-auto mt-3  lg:p-4"
      >
        <div className="relative w-full flex flex-col py-7 px-7">
          <img
            src="/img/info_frame.png"
            alt="Register Frame"
            className="absolute inset-0 z-0 w-full h-full object-fill"
          />

          <div className="relative flex items-center justify-center uppercase bg-linear-to-l from-[#8e4a15] to-[#c9892e] bg-clip-text text-transparent font-bold text-[1.5rem]">
            Đăng ký tham gia
          </div>
          <div className="relative flex flex-row items-center justify-center gap-2">
            <img src="/img/leftside.png" alt="" className="w-auto h-2" />
            <p className="bg-linear-to-b from-[#1f3a98] to-[#4a96d8] bg-clip-text text-transparent font-bold text-sm font-inforfont">
              Ngày Hội Tài Chính Số 2026
            </p>
            <img src="/img/rightside.png" alt="" className="w-auto h-2" />
          </div>

          <div className="relative z-10 flex flex-col gap-2.5 w-full overflow-y-auto max-h-[45dvh] px-3 py-2 mb-4 mt-3">
            {singleFields.map((field) => (
              <div key={field.name} className="flex flex-col gap-0.5">
                <label className="text-blue-900 flex items-center gap-1.5 text-xs font-semibold font-inforfont">
                  <img src={field.icon} alt={field.label} className="w-4 h-4" />
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  {...register(field.name)}
                  className="w-full rounded-lg bg-white/90 px-3 py-1.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 outline-none border border-blue-200 focus:border-blue-500 shadow-inner"
                />
                {errors[field.name] && (
                  <span className="text-red-500 text-[0.65rem] font-medium">
                    {errors[field.name]?.message}
                  </span>
                )}
              </div>
            ))}

            <div className="flex flex-col gap-0.5">
              <label className="text-blue-900 flex items-center gap-1.5 text-xs font-semibold font-inforfont">
                <img src="/icon/university.png" alt="Trường:" className="w-4 h-4" />
                <span>Trường:</span>
              </label>
              <select
                {...register("university")}
                onChange={handleUniversityChange}
                defaultValue={defaultUniversity}
                className="w-full rounded-lg bg-white/90 px-3 py-1.5 text-xs sm:text-sm text-gray-900 outline-none border border-blue-200 focus:border-blue-500 shadow-inner"
              >
                <option value={defaultUniversity}>{defaultUniversity}</option>
              </select>
              <input type="hidden" {...register("address")} />
              {errors.university && (
                <span className="text-red-500 text-[0.65rem] font-medium">
                  {errors.university.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-0.5">
                <label className="text-blue-900 flex items-center gap-1.5 text-xs font-semibold font-inforfont">
                  <img src="/icon/MSSV.png" alt="Mssv:" className="w-4 h-4" />
                  <span>Mssv:</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập mã số sinh viên"
                  {...register("studentId")}
                  className="w-full rounded-lg bg-white/90 px-3 py-1.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 outline-none border border-blue-200"
                />
                {errors.studentId && (
                  <span className="text-red-500 text-[0.65rem] font-medium">
                    {errors.studentId.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-0.5">
                <label className="text-blue-900 flex items-center gap-1.5 text-xs font-semibold font-inforfont">
                  <img
                    src="/icon/gender.png"
                    alt="Giới tính:"
                    className="w-4 h-4"
                  />
                  <span>Giới tính:</span>
                </label>

                <select
                  {...register("gender")}
                  defaultValue=""
                  className="w-3/4 rounded-lg bg-white/90 px-3 py-1.5 text-xs sm:text-sm text-gray-900 outline-none "
                >
                  <option value="" disabled className="text-gray-300">
                    Nam/Nữ
                  </option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>

                {errors.gender && (
                  <span className="text-red-500 text-[0.65rem] font-medium">
                    {errors.gender.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center w-full">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full max-w-60 transition-transform duration-200 active:scale-95 cursor-pointer border-none bg-transparent p-0"
          >
            <img
              src="/btn/register_btn.png"
              alt="Đăng ký ngay"
              className="w-full h-auto object-contain"
            />
          </button>
        </div>
      </form>
    </div>
  );
};
