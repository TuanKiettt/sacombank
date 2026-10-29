import { useEffect, useState } from "react";
import { readInformationData, type InformationData } from "../lib/information";

export const ResultPage = () => {
  const [formData, setFormData] = useState<InformationData | null>(null);

  useEffect(() => {
    const data = readInformationData();
    if (data) {
      setFormData(data);
    }
  }, []);

  const universityName = formData?.university ?? "Đại học Duy Tân Đà Nẵng";
  const eventAddress =
    formData?.address ?? "120 Hoàng Minh Thảo, Hòa Khánh Nam, Đà Nẵng";

  return (
    <div className="relative isolate h-dvh w-full max-w-107.5 overflow-hidden bg-black flex flex-col justify-between py-6 px-6">
      {/* Hình nền chính chứa sẵn logo và khung thiệp */}
      <img
        src="/img/background-result.png"
        alt="Background Result"
        className="absolute inset-0 z-0 h-full w-full object-fill pointer-events-none select-none"
      />

      {/* Khoảng trống đẩy nội dung vào đúng vùng khung xanh của thiệp */}
      <div className="shrink-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full my-auto gap-1 px-3 mx-auto mt-35">
        <div className="flex flex-col items-center text-center">
          <p className="text-amber-200/90 italic text-xs sm:text-sm uppercase tracking-wider font-semibold drop-shadow">
            Chào mừng bạn
          </p>
          <h2 className="text-yellow-300 font-bold text-lg sm:text-xl uppercase tracking-wide drop-shadow-md mt-0.5">
            {formData?.fullName || "Nguyễn Văn A"}
          </h2>
        </div>

        {/* 1. Khung "Đã đăng ký thành công" */}
        {/* Container chung cho 3 khung để đồng bộ tuyệt đối chiều rộng */}
        <div className="relative flex flex-col items-center w-full gap-2.5 mx-auto">
          {/* 1. Khung "Đã đăng ký thành công" */}
          <div className="relative w-full flex items-center justify-center">
            <img
              src="/img/register_complete.png"
              alt="Register Complete Frame"
              className="relative w-full h-auto object-contain pointer-events-none drop-shadow-sm"
            />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
              <p className="bg-linear-to-b from-[#1f3a98] to-[#4a96d8] bg-clip-text text-transparent font-extrabold text-sm font-inforfont mt-7">
                Đã đăng ký thành công
              </p>
              <p className="text-slate-700 text-[10px] font-semibold">
                <span className="text-blue-600">Chương trình </span>
                <span className="text-blue-800 font-bold">
                  Ngày Hội Tài Chính Số
                </span>
              </p>
            </div>
          </div>

          {/* 2. Khung Địa chỉ */}
          <div className="relative w-full flex items-center justify-center">
            <img
              src="/img/event_address.png"
              alt="Address Frame"
              className="relative w-full h-auto object-contain pointer-events-none drop-shadow-sm"
            />
            <div className="absolute inset-0 z-10 flex flex-col justify-center text-left px-8 sm:px-10 overflow-hidden ml-5">
              <div className="flex items-center gap-1.5 flex-nowrap w-full overflow-hidden">
                <span className="text-[0.5rem] text-blue-400 uppercase font-bold shrink-0">
                  Địa chỉ:
                </span>
                <span className="bg-linear-to-b from-[#1f3a98] to-[#4a96d8] bg-clip-text text-transparent font-inforfont text-xs  font-extrabold">
                  {universityName}
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] text-blue-500 font-semibold mt-0.5">
                {eventAddress}
              </span>
            </div>
          </div>

          {/* 3. Khung Thời gian */}
          <div className="relative w-full flex items-center justify-center">
            <img
              src="/img/event_time.png"
              alt="Time Frame"
              className="relative w-full h-auto object-contain pointer-events-none drop-shadow-sm"
            />
            <div className="absolute inset-0 z-10 flex items-center justify-between px-7 sm:px-9 ml-7">
              <div className="flex items-center gap-1 sm:gap-2 text-left">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-bold shrink-0">
                  Thời gian:
                </span>
                <span className="bg-linear-to-b from-[#1f3a98] to-[#4a96d8] bg-clip-text text-transparent font-inforfont text-xs sm:text-sm font-extrabold">
                  8:00 - 17:00
                </span>
              </div>

              {/* Đường chia cắt */}
              <div className="h-5 w-px bg-slate-300 mx-1"></div>

              <div className="flex items-center text-right">
                <span className="bg-linear-to-b from-[#1f3a98] to-[#4a96d8] bg-clip-text text-transparent font-inforfont text-xs sm:text-sm font-extrabold">
                  28.11.2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nút Tải thiệp mời xuống ở Footer */}
      <div className="relative z-10 flex flex-col items-center w-full  shrink-0">
        <button
          onClick={() => {
            alert("Đang tải thiệp mời xuống...");
          }}
          className="w-full p-0 flex justify-center"
        >
          <img
            src="/btn/download.png"
            alt="Tải thiệp mời xuống"
            className="w-full h-auto object-contain max-h-20 drop-shadow-md"
          />
        </button>
      </div>
    </div>
  );
};
