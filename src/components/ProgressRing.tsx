import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const fakeFetch = (current: number) =>
  new Promise<number>((resolve) =>
    setTimeout(
      () =>
        resolve(Math.min(100, Math.round(current + 6 + Math.random() * 14))),
      400 + Math.random() * 600,
    ),
  );

  interface ProgressRingProps {
    size?: number;
    onComplete?: () => void
  }
export default function ProgressRing({ size = 200, onComplete }: ProgressRingProps) {
  const arcRef = useRef<SVGCircleElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const runningRef = useRef(false);

  const [runId, setRunId] = useState(0);

  useGSAP(
    () => {
      const state = { value: 0, target: 0 };
      let cancelled = false;

      runningRef.current = true;

      const render = () => {
        if (!arcRef.current || !labelRef.current) return;

        arcRef.current.style.opacity = state.value < 0.3 ? "0" : "1";
        arcRef.current.setAttribute("stroke-dasharray", `${state.value} 100`);
        labelRef.current.textContent = `${Math.round(state.value)}%`;
      };

      render();

      const tick = (_time: number, dt: number) => {
        if (state.value === state.target) return;

        state.value +=
          (state.target - state.value) * (1 - Math.exp((-dt / 1000) * 2.5));

        if (Math.abs(state.target - state.value) < 0.01) {
          state.value = state.target;
        }

        render();
      };

      gsap.ticker.add(tick);

      (async () => {
        while (!cancelled && state.target < 100) {
          const next = await fakeFetch(state.target);

          if (cancelled) return;

          state.target = next;
        }

        if (!cancelled) {
          runningRef.current = false;

          setTimeout(() => {
            if (onComplete) onComplete();
          }, 500);
        }
      })();

      return () => {
        cancelled = true;
        gsap.ticker.remove(tick);
      };
    },
    { dependencies: [runId] },
  );

  const handleClick = () => {
    if (runningRef.current) return;

    setRunId((n) => n + 1);
  };

  return (
    <div className="relative isolate h-dvh w-full max-w-107.5 overflow-hidden bg-black flex flex-col">
      {/* Background chung */}
      <img
        src="/img/background.png"
        alt="background"
        className="absolute inset-0 z-0 h-full w-full object-cover pointer-events-none"
      />

      {/* Phần Header chứa Logo luôn ở trên cùng */}
      <div className="relative z-10 flex flex-col justify-center items-center shrink-0 w-full pt-4">
        {/* Logo hai bên (Hội & Sacombank) */}
        <div className="flex flex-row items-center justify-between w-full px-5">
          <div className="">
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

        {/* Logo Event */}
        <div className="relative mt-2 w-[80%] max-w-lvh">
          <img
            src="/img/Logo_event.png"
            alt="Logo Event"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      <main className="relative z-10 flex flex-col flex-1 items-center justify-center w-full px-5 pb-8 gap-6">
        <div
          className="relative cursor-pointer"
          style={{ width: size, height: size }}
          onClick={handleClick}
        >
          <img
            src="/img/processFrame.png"
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full object-contain"
          />

          <img
            src="./img/circle.png"
            alt=""
            draggable={false}
            className="absolute inset-0 w-[70%] top-1/2 left-1/2 -translate-1/2 z-10 object-contain"
          />

          <svg
            viewBox="0 0 100 100"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          >
            <circle
              ref={arcRef}
              cx="50"
              cy="50"
              r="37"
              pathLength={100}
              strokeDasharray="0 100"
              className="origin-center -rotate-90 fill-none stroke-white [filter:drop-shadow(0_0_1.2px_#fff)_drop-shadow(0_0_3px_#7df3ff)] [stroke-linecap:round] [stroke-width:9]"
            />
          </svg>

          <div
            ref={labelRef}
            className="font-orbitron absolute z-20 inset-0 grid place-items-center font-bold tracking-[2px] text-white select-none [text-shadow:0_0_8px_#7df3ff,0_0_22px_#7df3ff]"
            style={{ fontSize: size * 0.16 }}
          >
            0%
          </div>
        </div>

        <div className="relative flex flex-col items-center text-center">
          <p className="text-white font-bold font-inforfont text-lg sm:text-xl tracking-wide drop-shadow-md">
            Đang tải dữ liệu...
          </p>
          <p className="text-blue-200/90 text-xs sm:text-sm font-inforfont mt-0.5 italic">
            Bạn vui lòng chờ trong giây lát
          </p>
        </div>
      </main>
    </div>
  );
}