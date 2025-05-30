import React, { useState } from "react";

const VerifyOtp = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("OTP verified! Please reset your password.");
    
      } else {
        setMessage(data.message || "Invalid OTP");
      }
    } catch (err) {
      setMessage("Network error");
    }
  }

  return (
    <form onSubmit={handleVerifyOtp}>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={e => setOtp(e.target.value)}
        required
      />
      <button type="submit">Verify OTP</button>
      <p>{message}</p>
    </form>
  );
};

export default VerifyOtp;
