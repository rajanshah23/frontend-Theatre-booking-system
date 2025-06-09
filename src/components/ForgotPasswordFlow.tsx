import React, { useState } from "react";
import ForgotPassword from "./ForgotPassword";
import VerifyOtp from "./VerifyOtp";
import ResetPassword from "./ResetPassword";

const ForgotPasswordFlow = () => {
  const [step, setStep] = useState<"forgot" | "verify" | "reset">("forgot");
  const [email, setEmail] = useState<string>("");

  const handleForgotSuccess = (email: string) => {
    setEmail(email);
    setStep("verify");
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
        <ResetPassword
          email={email}
          onSuccess={() => {
            console.log("Password reset successful!");
          }}
        />
      )}
    </>
  );
};

export default ForgotPasswordFlow;
