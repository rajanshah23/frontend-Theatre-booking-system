import React, { useState, useEffect } from "react";
import ForgotPassword from "./ForgotPassword";
import VerifyOtp from "./VerifyOtp";
import ResetPassword from "./ResetPassword";

const ForgotPasswordFlow = () => {
  const [step, setStep] = useState<"forgot" | "verify" | "reset">("forgot");
  const [email, setEmail] = useState<string>("");

  // Initialize from session storage
  useEffect(() => {
    const savedStep = sessionStorage.getItem('resetStep');
    const savedEmail = sessionStorage.getItem('resetEmail');
    
    if (savedStep && ["forgot", "verify", "reset"].includes(savedStep)) {
      setStep(savedStep as any);
    }
    
    if (savedEmail && typeof savedEmail === 'string') {
      setEmail(savedEmail);
    }
  }, []);

 
  useEffect(() => {
    sessionStorage.setItem('resetStep', step);
    sessionStorage.setItem('resetEmail', email);
  }, [step, email]);

  const handleForgotSuccess = (userEmail: string) => {
    if (userEmail && typeof userEmail === 'string') {
      setEmail(userEmail.trim());
      setStep("verify");
    }
  };

  const handleResetSuccess = () => {
    sessionStorage.removeItem('resetStep');
    sessionStorage.removeItem('resetEmail');
  };

  return (
    <>
      {step === "forgot" && (
        <ForgotPassword onSuccess={handleForgotSuccess} />
      )}
      
      {step === "verify" && (
        <VerifyOtp
          email={email}
          onSuccess={() => setStep("reset")}
          onBack={() => setStep("forgot")}
        />
      )}
      
      {step === "reset" && (
        <ResetPassword
          email={email}
          onSuccess={handleResetSuccess}
        />
      )}
    </>
  );
};

export default ForgotPasswordFlow;