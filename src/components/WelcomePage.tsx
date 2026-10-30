interface WelcomePageProps {
  onNext: () => void;
}

export const WelcomePage = ({ onNext }: WelcomePageProps) => {
  return (
    <div className="flex min-h-dvh w-full justify-center bg-black">
      <div className="relative isolate h-dvh w-full max-w-107.5 overflow-hidden bg-black flex flex-col">
        <img
          src="/img/background.png"
          alt="background"
          className="absolute inset-0 z-0 h-full w-full object-cover pointer-events-none"
        />

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
        <div className="relative flex flex-col items-center justify-center h-full w-full">
          {/* Hình nền nằm gọn trong khung content của MainLayout */}
          <div className="flex flex-col text-center text-white/85 font-jakarta font-bold uppercase tracking-wider drop-shadow-lg z-5 absolute top-0">
            <p className="text-2xl sm:text-3xl">Tự chủ tài chính</p>
            <p className="text-2xl sm:text-3xl">Kiến tạo tương lai</p>
          </div>

          {/* <div className="relative w-full h-full max-h-[70dvh] items-center justify-center">
        <img
          src="/img/Model-removebg-preview.png"
          alt="Welcome background"
          className="w-full h-auto absolute bottom-[23%]"
        />

        <img
          src="/img/model_shadow.png"
          alt="model"
          className="w-full h-auto bottom-0 absolute"
        />
      </div> */}

          {/* Nút bấm ở dưới đáy khung content */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-[8%] px-[5%] cursor-pointer bottom-[2%]">
            <button onClick={onNext} className="w-full">
              <img
                src="/btn/start_btn.png"
                alt="Start Button"
                className="w-full h-auto object-contain"
              />
            </button>
          </div>
          <div>
            <div className="absolute inset-x-0 bottom-0 z-5 flex items-center justify-center gap-1.5 text-[0.5rem] leading-none text-white/80">
              <span>Powered by</span>
              <img
                src="/img/invitation-logo.png"
                alt="Invitation"
                className="h-[min(4dvh,1.5rem)] max-w-[45%] object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
