import { useEffect, useRef, useState } from "react";
import { domToPng } from "modern-screenshot";
import { readInformationData, type InformationData } from "../lib/information";

export const ResultPage = () => {
  const [formData, setFormData] = useState<InformationData | null>(null);
  const captureRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const data = readInformationData();
    if (data) {
      setFormData(data);
    }
  }, []);

  const universityName = formData?.university ?? "Đại học Duy Tân Đà Nẵng";
  const eventAddress =
    formData?.address ?? "120 Hoàng Minh Thảo, Hòa Khánh Nam, Đà Nẵng";

  const handleDownload = async () => {
    if (!captureRef.current) return;

    const button = captureRef.current.querySelector(
      ".download-button",
    ) as HTMLElement | null;

    try {
      await document.fonts.ready;

      if (button) button.style.display = "none";

      const dataUrl = await domToPng(captureRef.current, {
        scale: 2,
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "thiep-moi.png";
      link.click();
    } catch (error) {
      console.error("Không thể tải thiệp mời:", error);
    } finally {
      if (button) button.style.display = "";
    }
  };

  return (
    <div
      ref={captureRef}
      className="relative isolate h-dvh w-full overflow-hidden bg-black flex flex-col justify-between py-1 px-6"
    >
      <img
        src="/img/background-result.png"
        alt="Background Result"
        className="absolute inset-0 z-0 h-full w-full object-fill pointer-events-none select-none"
      />

      <div className="relative z-10 flex h-full w-full max-w-97.5 flex-col justify-between mx-auto">
        <div className="relative z-10 flex flex-col justify-center items-center shrink-0 w-full pt-4">
          <div className="flex flex-row items-center justify-between w-full px-1 gap-2">
            <div>
              <img
                src="/img/logo_hoi.png"
                alt=""
                className="w-20 object-contain"
              />
            </div>
            <div className="p-1">
              <img
                src="/img/sacombank.png"
                alt=""
                className="w-30 object-contain"
              />
            </div>
          </div>

          <div className="relative mt-3 h-full">
            <img
              src="/img/invitation.png"
              alt="Logo Event"
              className="w-auto h-1/2 object-contain"
            />
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full my-auto gap-1 px-3 mx-auto bottom-[12%]">
          <div className="flex flex-col items-center text-center">
            <p className="text-amber-200/90 italic text-xs sm:text-sm uppercase tracking-wider font-semibold drop-shadow">
              Chào mừng bạn
            </p>
            <h2 className="text-yellow-300 font-bold text-lg sm:text-xl uppercase tracking-wide drop-shadow-md mt-0.5">
              {formData?.fullName || "Nguyễn Văn A"}
            </h2>
          </div>

          <div className="relative flex flex-col items-center w-full gap-2.5 mx-auto">
            <div className="relative w-full flex items-center justify-center">
              <img
                src="/img/register_complete.png"
                alt="Register Complete Frame"
                className="relative w-full h-auto object-contain pointer-events-none drop-shadow-sm"
              />
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
                <p className="font-extrabold text-sm font-inforfont mt-7 text-blue-700">
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

            <div className="relative w-full flex items-center justify-center">
              <img
                src="/img/event_address.png"
                alt="Address Frame"
                className="relative w-full h-auto object-contain pointer-events-none drop-shadow-sm"
              />
              <div className="absolute inset-0 z-10 flex flex-col justify-center text-left px-8 sm:px-10 overflow-hidden left-[9%] mb-2">
                <div className="flex items-center gap-1.5 flex-nowrap w-full overflow-hidden">
                  <span className="text-[0.5rem] text-blue-400 uppercase font-bold shrink-0">
                    Địa chỉ:
                  </span>
                  <span className="text-xs font-extrabold text-blue-800">
                    {universityName}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-blue-500 font-semibold mt-0.5">
                  {eventAddress}
                </span>
              </div>
            </div>

            <div className="relative w-full flex items-center justify-center">
              <img
                src="/img/event_time.png"
                alt="Time Frame"
                className="relative w-full h-auto object-contain pointer-events-none drop-shadow-sm"
              />
              <div className="absolute inset-0 z-10 flex items-center justify-between px-7 sm:px-9 left-[9%] mb-4">
                <div className="flex items-center gap-1 sm:gap-2 text-left">
                  <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-bold shrink-0">
                    Thời gian:
                  </span>
                  <span className="font-inforfont text-xs sm:text-sm font-extrabold text-blue-800">
                    8:00 - 17:00
                  </span>
                </div>

                <div className="h-5 w-px bg-slate-300 mx-1"></div>

                <div className="flex items-center text-right">
                  <span className="font-inforfont text-xs sm:text-sm font-extrabold text-blue-800">
                    28.11.2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="download-button relative z-10 flex flex-col items-center w-full shrink-0"
          onClick={handleDownload}
        >
          <button type="button" className="w-full p-0 flex justify-center">
            <img
              src="/btn/download.png"
              alt="Tải thiệp mời xuống"
              className="w-full h-auto object-contain max-h-20 drop-shadow-md"
            />
          </button>
        </div>

        <div className="relative z-10 flex items-center justify-center gap-1.5 pb-1 text-[0.5rem] leading-none text-white/80">
          <span>Powered by</span>
          <img
            src="/img/invitation-logo.png"
            alt="Invitation"
            className="h-[min(4dvh,1.5rem)] max-w-[45%] object-contain"
          />
        </div>  
      </div>
    </div>
  );
};
