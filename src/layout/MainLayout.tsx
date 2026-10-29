import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-dvh w-full justify-center bg-black">
      {/* Khung giả lập mobile tổng */}
      <div className="relative isolate h-dvh w-full max-w-107.5 overflow-hidden bg-black flex flex-col">
        {/* Background chung */}
        <img
          src="/img/background.png"
          alt="background"
          className="absolute inset-0 z-0 h-full w-full object-cover pointer-events-none"
        />

        {/* Phần Header chứa Logo luôn nằm ở trên cùng */}
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
          <div className="relative mt-2">
            <img
              src="/img/Logo_event.png"
              alt="Logo Event"
              className="w-auto h-24 object-contain"
            />
          </div>
        </div>

        {/* Phần Content chứa các trang con (luôn nằm phía dưới logo event và tự động co giãn) */}
        <main className="relative z-10 flex flex-col flex-1 w-full overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
