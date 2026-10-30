import { useEffect, useState } from "react";
import  { saveInformationData,
  readInformationData,
  type InformationData,
} from "../lib/information";

interface ConfirmPageProps {
  onConfirm: () => void;
  onBack?: () => void;
}

export const ConfirmPage = ({ onConfirm, onBack }: ConfirmPageProps) => {
  const [data, setData] = useState<InformationData | null>(null);

  useEffect(() => {
    try {
      const storedData = readInformationData();
      setData(storedData);
    } catch (error) {
      console.error("Không thể đọc dữ liệu từ localStorage:", error);
    }
  }, []);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white text-center px-4">
        <p className="text-sm">
          Không tìm thấy thông tin đăng ký. Vui lòng thử lại!
        </p>
      </div>
    );
  }

  const normalizedGender = (data.gender ?? "").trim().toLowerCase();
  const isMaleGender = normalizedGender === "nam";

  const handleGenderSelect = (gender: "Nam" | "Nữ") => {
    setData((prev) => {
      if (!prev) return prev;
      const nextData = { ...prev, gender };
      saveInformationData(nextData);
      return nextData;
    });
  };

  const singleFields = [
    {
      key: "fullName",
      label: "Họ và tên:",
      value: data.fullName,
      icon: "/icon/user.png",
    },
    {
      key: "phone",
      label: "Số điện thoại:",
      value: data.phone,
      icon: "/icon/phone.png",
    },
    {
      key: "email",
      label: "Email:",
      value: data.email,
      icon: "/icon/mail.png",
    },
    {
      key: "university",
      label: "Trường:",
      value: data.university,
      icon: "/icon/university.png",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4">
      {/* Khung bọc tổng thể đồng bộ với InformationPage */}
      <div className="relative w-full h-dvh flex flex-col items-center justify-center">
        {/* Khung chứa background và nội dung thông tin */}
        <div className="relative w-full flex flex-col p-10">
          {/* Hình nền info_frame.png */}
          <img
            src="/img/info_frame.png"
            alt="Confirm Frame"
            className="absolute inset-0 z-0 w-full h-full object-fill"
          />

          <div className="relative z-10 text-center shrink-0">
            <div className="flex items-center justify-center mb-1 gap-2">
              <img src="/icon/check.png" alt="" className="w-7 h-7" />
              <div className="flex flex-col items-start">
                <h2 className="uppercase bg-linear-to-l from-[#8e4a15] to-[#c9892e] bg-clip-text text-transparent font-bold text-xl">
                  Xác nhận thông tin
                </h2>
                <p className="text-[0.55rem] sm:text-xs font-semibold text-blue-900/80">
                  Bạn vui lòng kiểm tra lại thông tin đã đăng ký
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-2.5 w-full overflow-y-auto max-h-[45dvh] p-3 mb-4 mt-2 bg-white/80 rounded-2xl">
            {/* Render các trường đơn */}
            {singleFields.map((field) => (
              <div
                key={field.key}
                className="flex items-center gap-2.5 border-b border-gray-300 pb-2"
              >
                <img src={field.icon} alt={field.label} className="w-6 h-6" />
                <div>
                  <label className="text-[#4a96d8] flex items-center gap-1.5 text-[0.5rem] font-semibold font-inforfont">
                    {field.label}
                  </label>
                  <div className="w-full text-xs sm:text-sm text-blue-900 font-medium shadow-inner ">
                    {field.value}
                  </div>
                </div>
              </div>
            ))}

            {/* MSSV */}
            <div className="grid grid-cols-2 gap-2">
              {/* Trường Mã số sinh viên */}
              <div className="flex flex-row gap-2.5 items-center">
                <img src="/icon/MSSV.png" alt="Mssv:" className="w-6 h-6" />
                <div className="flex flex-col">
                  <label className="text-[#4a96d8] flex items-center gap-2 text-[0.6rem] font-semibold font-inforfont">
                    <span>Mssv:</span>
                  </label>
                  <div className="w-full text-xs sm:text-sm text-blue-900 font-medium">
                    {data.studentId}
                  </div>
                </div>
              </div>

              {/* Giới tính */}
              <div className="flex flex-col gap-0.5">
                <div className="flex flex-row gap-2.5 items-center">
                  <img
                    src="/icon/gender.png"
                    alt="Giới tính:"
                    className="w-6 h-6"
                  />
                  <div className="flex flex-col">
                    <label className="text-[#4a96d8] flex items-center gap-2 text-[0.6rem] font-semibold font-inforfont">
                      <span>Giới tính:</span>
                    </label>
                    <div className="flex items-center gap-3 mt-1">
                      <button
                        type="button"
                        onClick={() => handleGenderSelect("Nam")}
                        className="flex items-center gap-1 text-blue-900 text-[0.6rem] sm:text-xs font-medium bg-transparent border-none p-0 cursor-pointer"
                      >
                        <img
                          src={isMaleGender ? "/icon/tick_frame.png" : "/icon/none_tick_frame.png"}
                          alt="Nam"
                          className="w-4 h-4"
                        />
                        <span>Nam</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleGenderSelect("Nữ")}
                        className="flex items-center gap-1 text-blue-900 text-[0.6rem] sm:text-xs font-medium bg-transparent border-none p-0 cursor-pointer"
                      >
                        <img
                          src={isMaleGender ? "/icon/none_tick_frame.png" : "/icon/tick_frame.png"}
                          alt="Nữ"
                          className="w-4 h-4"
                        />
                        <span>Nữ</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nút bấm xác nhận nằm bên ngoài khung nền, đồng bộ vị trí với nút đăng ký */}
        <div className="flex flex-row justify-center items-center gap-4 w-full">
          {/* Nút Quay lại */}
          <button
            onClick={onBack}
            className="w-full max-w-35 transition-transform duration-200 active:scale-95 cursor-pointer border-none bg-transparent p-0"
          >
            <img
              src="/btn/back_btn.png"
              alt="Quay lại"
              className="w-full h-auto object-contain"
            />
          </button>

          {/* Nút Xác nhận */}
          <button
            onClick={onConfirm}
            className="w-full max-w-35 transition-transform duration-200 active:scale-95 cursor-pointer border-none bg-transparent p-0"
          >
            <img
              src="/btn/accept_btn.png"
              alt="Xác nhận"
              className="w-full h-auto object-contain"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
