import React, { useState, useEffect } from "react";
import ForgotPassword from "./ForgotPassword";
import VerifyOtp from "./VerifyOtp";
import ResetPassword from "./ResetPassword";

const ForgotPasswordFlow = () => {
  const [step, setStep] = useState<"forgot" | "verify" | "reset">(() => {
    const savedStep = sessionStorage.getItem("resetStep");
    return (savedStep as "forgot" | "verify" | "reset") || "forgot";
  });

  const [email, setEmail] = useState<string>(() => {
    return sessionStorage.getItem("resetEmail") || "";
  });

  useEffect(() => {
    sessionStorage.setItem("resetStep", step);
    sessionStorage.setItem("resetEmail", email);
  }, [step, email]);

  const handleForgotSuccess = (email: string) => {
    setEmail(email);
    setStep("verify");
  };

  const handleResetSuccess = () => {
    sessionStorage.removeItem("resetStep");
    sessionStorage.removeItem("resetEmail");
  };

  return (
    <>
      {step === "forgot" && <ForgotPassword onSuccess={handleForgotSuccess} />}
      {step === "verify" && (
        <VerifyOtp
          email={email}
          onSuccess={() => setStep("reset")}
          onBack={() => setStep("forgot")}
        />
      )}
      {step === "reset" && (
        <ResetPassword email={email} onSuccess={handleResetSuccess} />
      )}
    </>
  );
};

export default ForgotPasswordFlow;
