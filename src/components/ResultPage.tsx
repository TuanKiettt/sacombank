import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { readInformationData, type InformationData } from "../lib/information";

type ResultPageProps = {
  resultData?: any;
};

function resolveVideoUrl(input: unknown): string | null {
  if (!input) return null;

  const queue: unknown[] = [input];
  const seen = new Set<unknown>();

  while (queue.length > 0) {
    const current = queue.shift();

    if (current === null || current === undefined || seen.has(current)) {
      continue;
    }

    seen.add(current);

    if (typeof current === "string") {
      const value = current.trim();
      if (!value) continue;

      const isVideoString =
        /\.(mp4|webm|mov|ogg|m3u8)(\?.*)?$/i.test(value) ||
        /(?:video|media|output|result|file|url|src|stream|asset)/i.test(value);

      if (isVideoString && /^(https?:\/\/|\/|blob:)/i.test(value)) {
        return value;
      }

      if (/\.(mp4|webm|mov|ogg|m3u8)(\?.*)?$/i.test(value)) {
        return value;
      }

      continue;
    }

    if (Array.isArray(current)) {
      queue.push(...current);
      continue;
    }

    if (typeof current === "object") {
      const entries = Object.entries(current as Record<string, unknown>);
      for (const [key, value] of entries) {
        if (
          /(video|media|output|result|file|url|src|stream|asset|link|path)/i.test(
            key,
          )
        ) {
          queue.push(value);
        }
      }

      queue.push(...Object.values(current as Record<string, unknown>));
    }
  }

  return null;
}

export const ResultPage = ({ resultData }: ResultPageProps) => {
  const [formData, setFormData] = useState<InformationData | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [videoAspect, setVideoAspect] = useState(9 / 16);
  const [showDownloadHelp, setShowDownloadHelp] = useState(true);
  const isInAppBrowser = /Zalo|FBAN|FBAV|FB_IAB/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const videoUrl = useMemo(() => resolveVideoUrl(resultData), [resultData]);

  useEffect(() => {
    const data = readInformationData();
    if (data) {
      setFormData(data);
    }
  }, []);

  useEffect(() => {
    if (!videoUrl || !videoRef.current) return;

    const video = videoRef.current;
    video.muted = isMuted;
    video.volume = isMuted ? 0 : 0.8;

    if (!hasPlayedOnce) {
      video.play().catch(() => {});
    }
  }, [videoUrl, isMuted, hasPlayedOnce]);

  const handleVideoEnded = () => {
    setHasPlayedOnce(true);

    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play().catch(() => {});
  };

  return (
    <div className="result-page relative isolate h-dvh w-full overflow-hidden bg-black">
      <div className="result-video-viewport absolute inset-0 flex items-center justify-center">
        <div
          className="result-video-shell relative overflow-hidden bg-black"
          style={{ "--video-aspect": videoAspect } as CSSProperties}
        >
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              muted={isMuted}
              playsInline
              loop={hasPlayedOnce}
              className="h-full w-full object-contain"
              onEnded={handleVideoEnded}
              onLoadedMetadata={(event) => {
                const video = event.currentTarget;
                if (video.videoWidth && video.videoHeight) {
                  setVideoAspect(video.videoWidth / video.videoHeight);
                }
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-black text-white">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.28em] text-white/60">
                  Kết quả
                </p>
                <h2 className="mt-2 text-2xl font-bold text-yellow-300">
                  {formData?.fullName || "Đăng ký thành công"}
                </h2>
              </div>
            </div>
          )}
          {videoUrl && (
            <a
              href={videoUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="result-video-download absolute z-30 border-0 bg-transparent p-0 cursor-pointer"
            >
              <img
                src="/btn/download.png"
                alt="Tải thiệp mời xuống"
                className="block w-full h-auto drop-shadow-md"
              />
            </a>
          )}
        </div>
      </div>

      {videoUrl && (
        <>
          {showDownloadHelp && (isInAppBrowser || isIOS) && (
            <aside
              aria-label="Hướng dẫn lưu video"
              className="absolute left-4 right-20 top-[max(1rem,env(safe-area-inset-top))] z-40 max-w-sm rounded-xl bg-black/85 p-3 pr-8 text-xs leading-relaxed text-white shadow-lg"
            >
              <button
                type="button"
                onClick={() => setShowDownloadHelp(false)}
                aria-label="Đóng hướng dẫn"
                className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center text-lg"
              >×</button>
              {isInAppBrowser && (
                <p>Nếu Zalo/Facebook không cho tải, hãy mở liên kết video bằng Safari hoặc Chrome qua menu của ứng dụng, hoặc sao chép liên kết video sang trình duyệt.</p>
              )}
              {isIOS && (
                <p>Trên iPhone/iPad, nếu video mở ra, nhấn Chia sẻ rồi chọn Lưu video hoặc Lưu vào Tệp nếu có. File tải xuống có thể nằm trong Tệp → Tải về.</p>
              )}
            </aside>
          )}
          <button
            type="button"
            onClick={() => setIsMuted((prev) => !prev)}
            aria-label={isMuted ? "Bật âm" : "Tắt âm"}
            className="absolute right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white shadow-lg shadow-black/30 backdrop-blur-sm transition-colors hover:bg-black/55"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>

        </>
      )}
    </div>
  );
};
