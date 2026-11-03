import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { domToBlob } from "modern-screenshot";
import { readInformationData, type InformationData } from "../lib/information";

export const ResultPage = () => {
  const [formData, setFormData] = useState<InformationData | null>(null);
  const captureRef = useRef<HTMLDivElement | null>(null);

  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadInProgress = useRef(false);
  const [preparedFile, setPreparedFile] = useState<File | null>(null);
  const [shareError, setShareError] = useState("");

  useEffect(() => () => {
    if (imgUrl) URL.revokeObjectURL(imgUrl);
  }, [imgUrl]);


  useEffect(() => {
    const data = readInformationData();
    if (data) {
      setFormData(data);
    }
  }, []);

  // The printed frame starts at 22.5% of the background image height.
  // Keep the content in its safe area and grow the whole ticket for long text.
  useLayoutEffect(() => {
    const ticket = captureRef.current;
    if (!ticket) return;
    const content = ticket.querySelector<HTMLElement>(".result-content");
    const header = ticket.querySelector<HTMLElement>(".result-header");
    const viewport = ticket.parentElement;
    if (!content || !header || !viewport) return;

    const resizeTicket = () => {
      const height = Math.ceil(Math.max(
        viewport.clientHeight,
        740,
        (header.offsetHeight + 24) / 0.24,
        (content.offsetHeight + 16) / 0.40,
      ));
      ticket.style.setProperty("--ticket-height", height + "px");
    };
    const observer = new ResizeObserver(resizeTicket);
    [content, header, viewport].forEach((element) => observer.observe(element));
    resizeTicket();
    return () => observer.disconnect();
  }, []);

  const universityName = "Đại học Duy Tân Đà Nẵng";
  const eventAddress = "120 Hoàng Minh Thảo, Hòa Khánh Nam, Đà Nẵng";

  const handleDownload = async () => {
    const ticket = captureRef.current;
    if (!ticket || downloadInProgress.current) return;
    downloadInProgress.current = true;
    setIsDownloading(true);
    const button = ticket.querySelector<HTMLElement>(".download-button");
    const previousVisibility = button?.style.visibility ?? "";

    try {
      await document.fonts.ready;
      await Promise.all(Array.from(ticket.querySelectorAll("img"), (img) => img.decode()));
      if (button) button.style.visibility = "hidden";

      const blob = await domToBlob(ticket, { scale: 2, type: "image/png" });
      const url = URL.createObjectURL(blob);
      setPreparedFile(new File([blob], "thiep-moi.png", { type: "image/png" }));
      setShareError("");
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
        || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      if (isIOS) {
        setImgUrl(url);
        return;
      }
      const link = document.createElement("a");
      if (!("download" in link)) {
        setImgUrl(url);
        return;
      }
      link.href = url;
      link.download = "thiep-moi.png";
      document.body.appendChild(link);
      try {
        link.click();
        // Give browsers time to consume the file before releasing its URL.
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      } catch {
        setImgUrl(url);
      } finally {
        link.remove();
      }
    } catch (error) {
      console.error("Không thể tải thiệp mời:", error);
      alert("Không thể tạo ảnh thiệp mời. Vui lòng thử lại.");
    } finally {
      if (button) button.style.visibility = previousVisibility;
      downloadInProgress.current = false;
      setIsDownloading(false);
    }
  };

  const handleSharePreparedImage = async () => {
    const file = preparedFile;
    if (!file || !navigator.canShare?.({ files: [file] })) return;
    try {
      // No image generation here: share runs directly from this new tap.
      await navigator.share({ title: "Thiệp mời sự kiện", files: [file] });
      setShareError("");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setShareError("Bạn có thể nhấn giữ ảnh để lưu hoặc chọn Tải tệp PNG bên dưới.");
    }
  };

  return (
    <div
      ref={captureRef}
      className="result-page mobile-canvas relative isolate h-dvh w-full overflow-hidden bg-black flex flex-col justify-between py-1 px-6"
    >
      <img
        src="/img/background-result.png"
        alt="Background Result"
        className="absolute inset-0 z-0 h-full w-full object-fill pointer-events-none select-none"
      />

      <div className="result-body relative z-10 flex h-full w-full max-w-97.5 flex-col justify-between mx-auto">
        <div className="result-header relative z-10 flex flex-col justify-center items-center shrink-0 w-full pt-4">
          <div className="brand-logos flex flex-row items-center justify-between w-full px-1 gap-2">
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

          <div className="result-invitation relative mt-5">
            <img
              src="/img/invitation.png"
              alt="Logo Event"
              className="w-auto h-2/3 object-contain"
            />
          </div>
        </div>

        <div className="result-content relative z-10 flex flex-col items-center w-full gap-1 mx-auto">
          <div className="flex flex-col items-center text-center">
            <p className="text-amber-200/90 italic text-xs sm:text-sm tracking-normal font-semibold drop-shadow">
              Chào mừng bạn
            </p>
            <h2 className="result-name text-yellow-300 font-bold text-lg sm:text-xl tracking-normal drop-shadow-md mt-0.5">
              {formData?.fullName || "Nguyễn Văn A"}
            </h2>
          </div>

          <div className="result-frames relative flex flex-col items-center w-full gap-2.5 mx-auto">
            <div className="relative w-full flex items-center justify-center">
              <img
                src="/img/register_complete.png"
                alt="Register Complete Frame"
                className="relative w-full h-auto object-contain pointer-events-none drop-shadow-sm"
              />
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
                <p className="result-success font-bold text-sm mt-7 text-blue-700">
                  Đã đăng ký thành công
                </p>
                <p className="result-program text-slate-700 text-[10px] font-semibold">
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
              <div className="result-address absolute inset-0 z-10 flex flex-col justify-center text-left px-8 sm:px-10 overflow-hidden left-[9%] ">
                <div className="flex items-baseline gap-1.5 flex-nowrap w-full overflow-hidden">
                  <span className="result-address-label text-[0.5rem] text-blue-400 font-semibold shrink-0">
                    Địa chỉ:
                  </span>
                  <span className="result-university text-xs font-extrabold bg-linear-to-b from-[#1f3a98] to-[#4a96d8] bg-clip-text text-transparent">
                    {universityName}
                  </span>
                </div>
                <span className="result-address-detail text-[9px] sm:text-[10px] text-blue-500 font-semibold mt-0.5">
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

              <div className="result-time absolute inset-0 z-10 flex items-center">
                <div className="result-time-row">
                  <span className="result-time-label text-blue-400 font-bold leading-none">
                    Thời gian:
                  </span>
                  <span className="result-time-value font-bold bg-linear-to-b from-[#1f3a98] to-[#4a96d8] bg-clip-text text-transparent leading-none">
                    8:00 - 17:00
                  </span>
                  <span aria-hidden="true" className="result-time-divider bg-slate-300" />
                  <span className="result-time-value font-bold bg-linear-to-b from-[#1f3a98] to-[#4a96d8] bg-clip-text text-transparent leading-none">
                    28.11.2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="result-logo relative z-10 flex items-center justify-center pointer-events-none">
          <img
            src="/img/Logo_event.png"
            alt="Logo Event Bottom"
            className="w-1/2 h-auto object-contain drop-shadow-md"
          />
        </div>
        <div
          className="download-button relative z-10 flex flex-col items-end w-full shrink-0"
        >
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            aria-busy={isDownloading}
            aria-label={isDownloading ? "Đang tạo thiệp mời" : "Tải thiệp mời xuống"}
            className="bottom-0 w-full p-0 flex justify-center disabled:cursor-wait"
          >
            <img
              src="/btn/download.png"
              alt="Tải thiệp mời xuống"
              className="w-full h-auto object-contain max-h-20 drop-shadow-md"
            />
          </button>
        </div>

        <div className="result-powered relative z-10 flex items-center justify-center gap-1.5 pb-1 text-[0.5rem] leading-none text-white/80">
          <span>Powered by</span>
          <img
            src="/img/invitation-logo.png"
            alt="Invitation"
            className="h-[min(4dvh,1.5rem)] max-w-[45%] object-contain"
          />
        </div>
      </div>
      {imgUrl && (
        <div role="dialog"
          aria-modal="true"
          aria-label="Lưu thiệp mời"
          className="save-image-dialog fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-start overflow-y-auto p-4">
          <div className="relative max-w-sm w-full flex flex-col items-center my-auto shrink-0">
            <p className="text-white text-xs mb-2 text-center font-medium">
              👉 Nhấn giữ vào hình ảnh bên dưới và chọn <br />
              <strong className="text-yellow-300">
                "Thêm vào Ảnh" (Add to Photos)
              </strong>{" "}
              để lưu thiệp!
            </p>
            <img
              src={imgUrl}
              alt="Thiệp mời của bạn"
              className="save-image-preview w-full rounded-lg shadow-2xl border border-white/20 object-contain max-h-[60dvh]"
            />
            {preparedFile && navigator.canShare?.({ files: [preparedFile] }) && (
              <button
                type="button"
                onClick={handleSharePreparedImage}
                className="mt-3 rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white"
              >
                Lưu / chia sẻ ảnh
              </button>
            )}
            {shareError && <p role="status" className="mt-2 text-center text-xs text-white">{shareError}</p>}
            <button
              type="button"
              onClick={() => setImgUrl(null)}
              className="mt-4 bg-white text-black font-bold px-6 py-2 rounded-full text-sm active:scale-95 transition-transform"
            >
              Đóng lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
