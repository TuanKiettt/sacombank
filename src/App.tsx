import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MainLayout } from "./layout/MainLayout";
import { WelcomePage } from "./components/WelcomePage";
import { InformationPage } from "./components/InformationPage";
import { type InformationFormData } from "./schema/inforSchema";
import saveInformationData, { readInformationData } from "./lib/information";
import { submitInvitationFromForm } from "./api/submitInvitationFromForm";
import { ConfirmPage } from "./components/ConfirmPage";
import ProgressRing from "./components/ProgressRing";
import { ResultPage } from "./components/ResultPage";
import { readGuestSession } from "./api/guest";

function App() {
  const [step, setStep] = useState(0);
  const [resultData, setResultData] = useState<any>(null);

  useEffect(() => {
    const session = readGuestSession();
    const token = session?.access_token;
    if (!token) return;

    try {
      const raw = localStorage.getItem(`sacombank.invitation.result.${token}`);
      if (!raw) return;

      const cached = JSON.parse(raw);
      if (cached?.id || cached?.status || cached?.url || cached?.video_url) {
        setResultData(cached);
        setStep(4);
      }
    } catch {
      // ignore invalid cache
    }
  }, []);

  const handleRegisterSubmit = (data: InformationFormData) => {
    try {
      saveInformationData(data);
      setStep(2);
    } catch (error) {
      console.error("Lỗi khi lưu thông tin:", error);
      alert("Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại!");
    }
  };

  const handleConfirmRegistration = async () => {
    const currentData = readInformationData();
    if (!currentData || !currentData.email || !currentData.phone) {
      alert("Không tìm thấy thông tin đăng ký hợp lệ.");
      setStep(1);
      return;
    }

    const guestSession = readGuestSession();
    const token = guestSession?.access_token;

    if (token) {
      const raw = localStorage.getItem(`sacombank.invitation.result.${token}`);
      if (raw) {
        try {
          const cached = JSON.parse(raw);
          if (cached?.id || cached?.status || cached?.url || cached?.video_url) {
            setResultData(cached);
            setStep(4);
            return;
          }
        } catch {
          // ignore invalid cache
        }
      }
    }

    setStep(3);

    try {
      const data = await submitInvitationFromForm({
        fullName: currentData.fullName,
        phone: currentData.phone || "",
        email: currentData.email || "",
        university: currentData.university || "",
        studentId: currentData.studentId || "",
        gender: currentData.gender || "",
      });

      setResultData(data);
      setStep(4);
    } catch (error: any) {
      console.error("Lỗi khi lưu database:", error);
      alert(error.message || "Có lỗi xảy ra khi lưu vào hệ thống");
      setStep(2);
    }
  };

  const appearAnimation = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 },
    transition: { duration: 0.3, ease: "easeInOut" as const },
  };

  return (
    <div className="flex min-h-dvh w-full justify-center bg-black overflow-hidden relative">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step-0"
            {...appearAnimation}
            className="app-screen absolute inset-0 flex justify-center bg-black w-full h-full"
          >
            <WelcomePage onNext={() => setStep(1)} />
          </motion.div>
        )}

        {step >= 1 && step < 3 && (
          <motion.div
            key="main-layout-steps"
            {...appearAnimation}
            className="app-screen absolute inset-0 flex justify-center bg-black w-full h-full"
          >
            <MainLayout step={step}>
              {step === 1 && (
                <InformationPage onSubmitSuccess={handleRegisterSubmit} />
              )}
              {step === 2 && (
                <ConfirmPage
                  onConfirm={handleConfirmRegistration}
                  onBack={() => setStep(1)}
                />
              )}
            </MainLayout>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="app-screen absolute inset-0 flex justify-center bg-black w-full h-full"
          >
            <ProgressRing size={200} autoAdvance={false} />
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="app-screen absolute inset-0 flex justify-center bg-black w-full h-full"
          >
            <div className="result-scroll relative h-dvh w-full max-w-240 flex flex-col items-center bg-black">
              <ResultPage resultData={resultData} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;