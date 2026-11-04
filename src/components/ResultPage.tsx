import { useEffect, useMemo, useRef, useState } from "react";
import { readInformationData, type InformationData } from "../lib/information";
import { Volume2, VolumeX } from "lucide-react";

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
  // const [audioPromptOpen, setAudioPromptOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);

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

  const handleDownload = () => {
    if (!videoUrl) return;

    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = "result-video";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleVideoEnded = () => {
    setHasPlayedOnce(true);

    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play().catch(() => {});
  };

  return (
    <div className="result-page relative isolate h-dvh w-full overflow-hidden bg-black">
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <div
          className="relative h-dvh w-[100vw] overflow-hidden"
          style={{
            maxWidth: "min(100vw, calc(100dvh * 9 / 16))",
          }}
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
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-black text-white">
              ...
            </div>
          )}
        </div>
      </div>

      {videoUrl && (
        <button
          type="button"
          onClick={() => setIsMuted((prev) => !prev)}
          aria-label={isMuted ? "Bật âm" : "Tắt âm"}
          className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white shadow-lg shadow-black/30 backdrop-blur-sm transition-colors hover:bg-black/55"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </button>
      )}

      {videoUrl && (
        <div className="download-button relative z-10 flex flex-col items-end w-full shrink-0">
          <button
            type="button"
            onClick={handleDownload}
            className="bottom-0 w-full p-0 flex justify-center disabled:cursor-wait"
          >
            <img
              src="/btn/download.png"
              alt="Tải thiệp mời xuống"
              className="w-full h-auto object-contain max-h-20 drop-shadow-md"
            />
          </button>
        </div>
      )}
    </div>
  );
};
