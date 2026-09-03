import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function OtpModal({
  open,
  email,
  verifyUrl,
  resendUrl,
  resendMethod = "post",
  resendPayload = {},
  onClose,
  onVerified,
}) {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendNotice, setResendNotice] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!open) return;
    setDigits(Array(OTP_LENGTH).fill(""));
    setError("");
    setResendNotice("");
    setCooldown(RESEND_SECONDS);
    const t = setTimeout(() => inputRefs.current[0]?.focus(), 50);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open || cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [open, cooldown]);

  if (!open) return null;

  const otp = digits.join("");

  const handleChange = (index, value) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }
    const next = [...digits];
    clean.split("").forEach((char, i) => {
      if (index + i < OTP_LENGTH) next[index + i] = char;
    });
    setDigits(next);
    const nextIndex = Math.min(index + clean.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const clean = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!clean) return;
    const next = Array(OTP_LENGTH).fill("");
    clean.split("").forEach((char, i) => (next[i] = char));
    setDigits(next);
    inputRefs.current[Math.min(clean.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setResendNotice("");

    if (otp.length !== OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit code sent to your email.`);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(verifyUrl, {
        params: { email, otp },
        withCredentials: true,
      });
      onVerified?.(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid or expired OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setError("");
    setResendNotice("");
    setResending(true);
    try {
      if (resendMethod === "get") {
        await axios.get(resendUrl, { params: resendPayload, withCredentials: true });
      } else {
        await axios.post(resendUrl, resendPayload, { withCredentials: true });
      }
      setCooldown(RESEND_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(""));
      setResendNotice("A new code has been sent to your email.");
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't resend the code. Try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-white/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-neutral-100 p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-neutral-900 mb-1">Enter OTP</h2>
        <p className="text-sm text-neutral-500 mb-6">
          {email ? (
            <>We&apos;ve sent a code to <span className="font-medium text-neutral-700">{email}</span></>
          ) : (
            "Sign in to your BIS Sahayak account"
          )}
        </p>

        <form onSubmit={handleVerify} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-xs rounded-lg px-3.5 py-2.5">
              {error}
            </div>
          )}

          {resendNotice && !error && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-lg px-3.5 py-2.5">
              {resendNotice}
            </div>
          )}

          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={OTP_LENGTH}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-11 h-12 text-center text-lg font-semibold border border-neutral-300 rounded-lg text-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0d234f] hover:bg-[#0a1c40] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl py-3 transition-colors"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <p className="text-center text-xs text-neutral-500">
            Didn&apos;t receive the code?{" "}
            {cooldown > 0 ? (
              <span className="text-neutral-400">Resend in {cooldown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-[#0d234f] font-semibold hover:underline disabled:opacity-60"
              >
                {resending ? "Resending..." : "Resend OTP"}
              </button>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}