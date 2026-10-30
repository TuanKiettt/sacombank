import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MainLayoutProps {
  children: React.ReactNode;
  step: number; // Nhận step để trigger animation khi đổi trang con
}

export const MainLayout = ({ children, step }: MainLayoutProps) => {
  return (
    <div className="flex min-h-dvh w-full justify-center bg-black">
      {/* Khung giả lập mobile tổng */}
      <div className="relative isolate h-dvh w-full max-w-107.5 overflow-hidden bg-black flex flex-col">
        {/* Background chung */}
        <img
          src="/img/background1.png"
          alt="background"
          className="absolute inset-0 z-0 h-full w-full object-cover pointer-events-none"
        />

        {/* Phần Header chứa Logo luôn cố định ở trên cùng */}
        <div className="relative z-10 flex flex-col justify-center items-center shrink-0 w-full pt-4">
          {/* Logo hai bên (Hội & Sacombank) */}
          <div className="flex flex-row items-center justify-between w-full px-5">
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

          {/* Logo Event */}
          <div className="relative mt-2">
            <img
              src="/img/Logo_event.png"
              alt="Logo Event"
              className="w-auto h-24 object-contain"
            />
          </div>
        </div>

        {/* Phần Content có hiệu ứng chuyển động mượt mà khi đổi step */}
        <main className="relative z-10 flex flex-col flex-1 w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col flex-1 w-full h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};