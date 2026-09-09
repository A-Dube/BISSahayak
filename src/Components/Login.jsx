import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ExternalLink, Eye, EyeOff, Globe } from "lucide-react";
import bisLogo from "../assets/BIS logo.png";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export default function Login({ onSignUp }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language, changeLanguage, t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = { email: "", password: "" };

    if (!email.trim()) {
      next.email = language === "Hindi" ? "ईमेल पता आवश्यक है।" : "Email address is required.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = language === "Hindi" ? "मान्य ईमेल पता दर्ज करें।" : "Enter a valid email address.";
    }

    if (!password) {
      next.password = language === "Hindi" ? "पासवर्ड आवश्यक है।" : "Password is required.";
    } else if (password.length < 8) {
      next.password = language === "Hindi" ? "पासवर्ड कम से कम 8 वर्णों का होना चाहिए।" : "Password must be at least 8 characters.";
    } else if (!PASSWORD_PATTERN.test(password)) {
      next.password = language === "Hindi" ? "पासवर्ड में कम से कम एक अक्षर और एक संख्या शामिल होनी चाहिए।" : "Password must include at least one letter and one number.";
    }

    setErrors(next);
    return !next.email && !next.password;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await login({ email: email.trim(), password });
      if (res?.data?.user?.language) {
        changeLanguage(res.data.user.language);
      }
      navigate("/home");
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          (language === "Hindi"
            ? "साइन इन विफल रहा। सर्वर पुनः प्रयास करने का अनुरोध कर सकता है।"
            : "Sign in failed. Server might be waking up, please retry.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToSignup = () => {
    if (onSignUp) {
      onSignUp();
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans relative">
      {/* Left Info Panel */}
      <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-[#0b1b3a] via-[#0d3a52] to-[#0f7a6e] p-20 flex-col justify-between">
        <div className="flex items-center gap-2 text-white/90">
          <ShieldCheck className="w-12 h-12" strokeWidth={1.75} />
          <span className="text-lg font-semibold tracking-wide">
            {t("govtOfIndia")}
          </span>
        </div>

        <div>
          <div className="w-20 h-20 rounded-xl bg-white flex items-center justify-center mb-6 shadow-lg p-2.5">
            <img
              src={bisLogo}
              alt="BIS Sahayak"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-6xl font-semibold text-white leading-tight mb-3">
            {t("empoweringStandards1")}
            <br />
            {t("empoweringStandards2")}
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-md">
            {t("authHeroSubtext")}
          </p>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="w-full md:w-1/2 flex flex-col p-10 min-h-screen relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-neutral-100/90 border border-neutral-200 rounded-full px-3 py-1.5 shadow-xs">
            <Globe className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-transparent text-xs font-semibold text-neutral-800 focus:outline-none cursor-pointer"
            >
              <option value="English">English</option>
              <option value="Hindi">हिंदी (Hindi)</option>
            </select>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5">
            <ShieldCheck className="w-4.5 h-4.5" strokeWidth={2} />
            {t("govtGradeSecurity")}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <h2 className="text-4xl font-bold text-neutral-900 mb-1">
            {t("namaste")}
          </h2>
          <p className="text-sm text-neutral-500 mb-6">
            {t("signInSubtitle")}
          </p>

          <form onSubmit={handleSignIn} className="space-y-4">
            {apiError && (
              <div className="bg-red-50 border border-red-100 text-red-700 text-xs rounded-lg px-3.5 py-2.5">
                {apiError}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold tracking-wide text-neutral-600 mb-1.5"
              >
                {t("emailLabel")}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@bis.gov.in"
                required
                maxLength={254}
                autoComplete="email"
                aria-invalid={!!errors.email}
                className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                  errors.email
                    ? "border-red-400 focus-visible:ring-red-500"
                    : "border-neutral-300 focus-visible:ring-[#0d234f]"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold tracking-wide text-neutral-600 mb-1.5"
              >
                {t("passwordLabel")}
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  maxLength={64}
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  className={`w-full border rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                    errors.password
                      ? "border-red-400 focus-visible:ring-red-500"
                      : "border-neutral-300 focus-visible:ring-[#0d234f]"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d234f] hover:bg-[#0a1c40] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl py-3 transition-colors cursor-pointer"
            >
              {loading ? t("signingInBtn") : t("signInBtn")}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <span className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-neutral-400">{t("orDivider")}</span>
            <span className="flex-1 h-px bg-neutral-200" />
          </div>

          <button
            type="button"
            onClick={handleNavigateToSignup}
            className="w-full bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-sm font-semibold rounded-xl py-3 transition-colors cursor-pointer"
          >
            {t("signUpBtn")}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs pt-6">
          <a href="#" className="text-neutral-500 hover:text-neutral-800">
            {t("troubleSigningIn")}
          </a>

          <a
            href="https://www.bis.gov.in"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-800"
          >
            {t("officialBisPortal")}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}