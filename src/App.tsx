import { useState } from "react";
import { MainLayout } from "./layout/MainLayout";
import { WelcomePage } from "./components/WelcomePage";
import { InformationPage } from "./components/InformationPage";
import { type InformationFormData } from "./schema/inforSchema";
import saveInformationData from "./lib/information";
import { ConfirmPage } from "./components/ConfirmPage";
import ProgressRing from "./components/ProgressRing";
import { ResultPage } from "./components/ResultPage";

function App() {
  const [step, setStep] = useState(0);

  const handleRegisterSubmit = (data: InformationFormData) => {
    try {
      saveInformationData(data);
      console.log("Đã lưu thông tin đăng ký thành công:", data);
      setStep(2);
    } catch (error) {
      console.error("Lỗi khi lưu thông tin:", error);
      alert("Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại!");
    }
  };

  return (
    <div className="flex min-h-dvh w-full justify-center bg-black">
      {/* Các bước từ 0 đến 2 và bước 4 dùng MainLayout */}
      {step < 3 && (
        <MainLayout>
          {step === 0 && <WelcomePage onNext={() => setStep(1)} />}
          {step === 1 && (
            <InformationPage onSubmitSuccess={handleRegisterSubmit} />
          )}
          {step === 2 && (
            <ConfirmPage
              onConfirm={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
        </MainLayout>
      )}

      {/* Step 3: ProgressRing hiển thị độc lập */}
      {step === 3 && (
        <div className="relative h-dvh w-full max-w-107.5 overflow-hidden bg-black flex flex-col items-center justify-center">
          <img
            src="/img/background.png"
            alt="background"
            className="absolute inset-0 z-0 h-full w-full object-cover pointer-events-none"
          />
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
            <ProgressRing size={200} onComplete={() => setStep(4)} />
          </div>
        </div>
      )}

      {/* Step 4: ResultPage độc lập trong khung MainLayout */}
      {step === 4 && (
        <div className="relative h-dvh w-full max-w-107.5 overflow-hidden flex flex-col items-center justify-center">
          <ResultPage />
        </div>
      )}
    </div>
  );
}

export default App;
