interface WelcomePageProps {
  onNext: () => void;
}

export const WelcomePage = ({ onNext }: WelcomePageProps) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full">
      {/* Hình nền nằm gọn trong khung content của MainLayout */}
      <div className="flex flex-col text-center text-white/85 font-jakarta font-bold uppercase tracking-wider drop-shadow-lg z-5 absolute top-0">
        <p className="text-2xl sm:text-3xl">Tự chủ tài chính</p>
        <p className="text-2xl sm:text-3xl">Kiến tạo tương lai</p>
      </div>

      <div className="relative w-full h-full max-h-[70dvh] items-center justify-center">
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
      </div>

      {/* Nút bấm ở dưới đáy khung content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-[8%] px-[5%]">
        <button
          onClick={onNext}
          className="w-full"
        >
          <img
            src="/btn/start_btn.png"
            alt="Start Button"
            className="w-full h-auto object-contain"
          />
        </button>
      </div>
    </div>
  );
};
