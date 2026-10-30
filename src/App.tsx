import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <AnimatePresence mode="wait">
      {/* Bước 0 đến 2: Dùng chung MainLayout (Logo đứng yên, nội dung trượt đổi) */}
      {step < 3 && (
        <MainLayout key="main-layout" step={step}>
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
        <motion.div
          key="step-3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex min-h-dvh w-full justify-center bg-black"
        >
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
        </motion.div>
      )}

      {/* Step 4: ResultPage độc lập */}
      {step === 4 && (
        <motion.div
          key="step-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="flex min-h-dvh w-full justify-center bg-black"
        >
          <div className="relative h-dvh w-full max-w-107.5 overflow-hidden flex flex-col items-center justify-center bg-black">
            <ResultPage />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;