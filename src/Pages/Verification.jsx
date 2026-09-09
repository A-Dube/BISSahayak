import { useState } from "react";
import {
  Award,
  CheckCircle2,
  XCircle,
  Search,
  LoaderCircle,
  ShieldCheck,
  FileCheck2,
  Gem,
  AlertCircle,
  Sparkles,
} from "lucide-react";

import Sidebar from "../Components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useSidebarNav } from "../Utils/Navigation";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/authService";

export default function Verification() {
  const { logout } = useAuth();
  const onNavigate = useSidebarNav();
  const { language, t } = useLanguage();

  const isHindi = language === "Hindi";

  const HUID_SAMPLE = {
    valid: true,
    huid: "A8F2X9",
    articleType: isHindi ? "सोने की अंगूठी / 22K (916)" : "Gold Ring / 22K (916)",
    purity: isHindi ? "22 कैरेट (91.6% शुद्ध सोना)" : "22 Karat (91.6% Pure Gold)",
    metal: isHindi ? "सोना (Gold)" : "Gold",
    jewellerName: isHindi ? "तनिष्क ज्वैलर्स लिमिटेड" : "Tanishq Jewellers Ltd.",
    registrationNumber: "BIS-REG-982341",
    verificationDate: "14-Feb-2024",
    status: "Valid",
    message: isHindi
      ? "यह आभूषण बीआईएस मान्यता प्राप्त परख और हॉलमार्किंग केंद्र द्वारा प्रमाणित है।"
      : "This article is certified by a BIS recognized Assaying and Hallmarking Centre.",
  };

  const LICENSE_SAMPLE = {
    valid: true,
    license: "CM/L-1234567",
    status: "Active",
    holderName: isHindi ? "हैवेल्स इंडिया लिमिटेड" : "Havells India Limited",
    product: isHindi ? "प्लग और सॉकेट-आउटलेट" : "Plugs and Socket-Outlets",
    standard: "IS 1293: 2019",
    manufacturer: isHindi ? "हैवेल्स इंडिया प्लांट - 1, हरिद्वार" : "Havells India Plant - 1, Haridwar",
    issueDate: "01-Apr-2022",
    expiryDate: "31-Mar-2027",
    message: isHindi
      ? "निर्माता को प्रासंगिक भारतीय मानक के तहत वैध आईएसआई मार्क उपयोग प्राधिकरण प्राप्त है।"
      : "The manufacturer holds a valid ISI mark usage authorization under the relevant Indian Standard.",
  };

  const [huid, setHuid] = useState("");
  const [huidLoading, setHuidLoading] = useState(false);
  const [huidResult, setHuidResult] = useState(null);
  const [huidError, setHuidError] = useState("");

  const [license, setLicense] = useState("");
  const [licenseLoading, setLicenseLoading] = useState(false);
  const [licenseResult, setLicenseResult] = useState(null);
  const [licenseError, setLicenseError] = useState("");

  const getData = (response) => response?.data?.data || response?.data?.result || response?.data;

  const isValidResult = (data) =>
    data?.valid === true ||
    data?.isValid === true ||
    data?.verified === true ||
    String(data?.status).toLowerCase() === "valid" ||
    String(data?.status).toLowerCase() === "active";

  const handleHuidVerify = async (e) => {
    e?.preventDefault();
    if (!huid.trim()) {
      setHuidError(t("huidEmptyErr"));
      setHuidResult(null);
      return;
    }

    try {
      setHuidLoading(true);
      setHuidError("");
      setHuidResult(null);

      const response = await api.post("/verify/huid", { huid: huid.trim() });
      setHuidResult(getData(response));
    } catch (error) {
      if (huid.trim().toUpperCase() === "A8F2X9") {
        setHuidResult(HUID_SAMPLE);
      } else {
        setHuidResult(null);
        setHuidError(error?.response?.data?.message || t("couldNotVerifyMsg"));
      }
    } finally {
      setHuidLoading(false);
    }
  };

  const handleLicenseVerify = async (e) => {
    e?.preventDefault();
    if (!license.trim()) {
      setLicenseError(t("licenceEmptyErr"));
      setLicenseResult(null);
      return;
    }

    try {
      setLicenseLoading(true);
      setLicenseError("");
      setLicenseResult(null);

      const response = await api.post("/verify/license", { license: license.trim() });
      setLicenseResult(getData(response));
    } catch (error) {
      if (license.trim().toUpperCase() === "CM/L-1234567") {
        setLicenseResult(LICENSE_SAMPLE);
      } else {
        setLicenseResult(null);
        setLicenseError(error?.response?.data?.message || t("couldNotVerifyMsg"));
      }
    } finally {
      setLicenseLoading(false);
    }
  };

  const displayValue = (value) => {
    if (value === null || value === undefined || value === "") return t("notAvailable");
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex font-sans">
      <Sidebar
        active="hallmarking"
        onNavigate={onNavigate}
        onStartCertification={() => onNavigate?.("certification")}
        onLogout={logout}
      />

      <main className="flex-1 min-w-0 px-6 lg:px-10 py-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <p className="text-sm font-medium text-emerald-600 mb-2">
              {t("verificationServicesLabel")}
            </p>
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              {t("verifyBisInfoTitle")}
            </h1>
            <p className="text-sm text-neutral-500 mt-2 max-w-2xl">
              {t("verifyBisInfoSub")}
            </p>
          </div>

          {/* HUID Verification Section */}
          <section className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Gem className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">
                    {t("huidVerificationTitle")}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {t("huidVerificationSub")}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setHuid("A8F2X9");
                  setHuidError("");
                  setHuidResult(HUID_SAMPLE);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {t("previewSampleDetails")}
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleHuidVerify} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="text"
                      value={huid}
                      maxLength={6}
                      onChange={(e) => setHuid(e.target.value.toUpperCase())}
                      placeholder={t("enterHuidPlaceholder")}
                      className="w-full h-12 pl-12 pr-4 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all uppercase tracking-wider"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={huidLoading}
                    className="h-12 px-6 inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    {huidLoading ? (
                      <>
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                        {t("verifying")}
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        {t("verifyHuidActionBtn")}
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-400 pl-1">
                  <span>{t("sampleCodeLabel")}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setHuid("A8F2X9");
                      setHuidError("");
                      setHuidResult(HUID_SAMPLE);
                    }}
                    className="border border-neutral-300 rounded-md px-2 py-0.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    A8F2X9
                  </button>
                </div>
              </form>

              {huidError && (
                <div className="mt-4 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-700">{t("huidInvalidTitle")}</p>
                    <p className="text-xs text-red-600 mt-1">{huidError}</p>
                  </div>
                </div>
              )}

              {huidResult && (
                <div className="mt-6 border border-emerald-200/80 rounded-2xl p-5 bg-gradient-to-b from-emerald-50/20 to-transparent">
                  <VerificationResultHeader
                    valid={isValidResult(huidResult)}
                    title={isValidResult(huidResult) ? t("huidValidTitle") : t("huidInvalidTitle")}
                    t={t}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <DetailItem label={t("huidNumberLabel")} value={huidResult?.huid || huid} />
                    <DetailItem label={t("jewelleryTypeLabel")} value={displayValue(huidResult?.articleType || huidResult?.jewelleryType)} />
                    <DetailItem label={t("purityLabel")} value={displayValue(huidResult?.purity)} />
                    <DetailItem label={t("metalLabel")} value={displayValue(huidResult?.metal)} />
                    <DetailItem label={t("jewellerLabel")} value={displayValue(huidResult?.jewellerName || huidResult?.jeweller)} />
                    <DetailItem label={t("bisRegLabel")} value={displayValue(huidResult?.registrationNumber)} />
                    <DetailItem label={t("verificationDateLabel")} value={displayValue(huidResult?.verificationDate)} />
                    <DetailItem label={t("statusLabel")} value={isValidResult(huidResult) ? t("validStatusText") : t("invalidStatusText")} />
                  </div>

                  {huidResult?.message && (
                    <div className="mt-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                      <p className="text-xs font-semibold text-emerald-800 mb-1">
                        {t("verificationInfoHeading")}
                      </p>
                      <p className="text-xs text-neutral-700 leading-relaxed">
                        {huidResult.message}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* BIS Licence Verification Section */}
          <section className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">
                    {t("licenceVerificationTitle")}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {t("licenceVerificationSub")}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setLicense("CM/L-1234567");
                  setLicenseError("");
                  setLicenseResult(LICENSE_SAMPLE);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {t("previewSampleDetails")}
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleLicenseVerify} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="text"
                      value={license}
                      onChange={(e) => setLicense(e.target.value.toUpperCase())}
                      placeholder={t("enterLicencePlaceholder")}
                      className="w-full h-12 pl-12 pr-4 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all tracking-wider uppercase"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={licenseLoading}
                    className="h-12 px-6 inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    {licenseLoading ? (
                      <>
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                        {t("verifying")}
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        {t("verifyLicenceActionBtn")}
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-400 pl-1">
                  <span>{t("sampleLicenseLabel")}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLicense("CM/L-1234567");
                      setLicenseError("");
                      setLicenseResult(LICENSE_SAMPLE);
                    }}
                    className="border border-neutral-300 rounded-md px-2 py-0.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    CM/L-1234567
                  </button>
                </div>
              </form>

              {licenseError && (
                <div className="mt-4 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-700">{t("licenceNotFoundTitle")}</p>
                    <p className="text-xs text-red-600 mt-1">{licenseError}</p>
                  </div>
                </div>
              )}

              {licenseResult && (
                <div className="mt-6 border border-blue-200/80 rounded-2xl p-5 bg-gradient-to-b from-blue-50/20 to-transparent">
                  <VerificationResultHeader
                    valid={isValidResult(licenseResult)}
                    title={isValidResult(licenseResult) ? t("licenceValidTitle") : t("licenceInvalidTitle")}
                    t={t}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <DetailItem label={t("licenceNumberLabel")} value={licenseResult?.license || license} />
                    <DetailItem label={t("statusLabel")} value={isValidResult(licenseResult) ? t("validStatusText") : t("invalidStatusText")} />
                    <DetailItem label={t("licenceHolderLabel")} value={displayValue(licenseResult?.holderName || licenseResult?.licenseHolder)} />
                    <DetailItem label={t("productLabel")} value={displayValue(licenseResult?.product)} />
                    <DetailItem label={t("standardLabel")} value={displayValue(licenseResult?.standard)} />
                    <DetailItem label={t("manufacturerLabel")} value={displayValue(licenseResult?.manufacturer)} />
                    <DetailItem label={t("issueDateLabel")} value={displayValue(licenseResult?.issueDate)} />
                    <DetailItem label={t("expiryDateLabel")} value={displayValue(licenseResult?.expiryDate)} />
                  </div>

                  {licenseResult?.message && (
                    <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                      <p className="text-xs font-semibold text-blue-800 mb-1">
                        {t("verificationInfoHeading")}
                      </p>
                      <p className="text-xs text-neutral-700 leading-relaxed">
                        {licenseResult.message}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function VerificationResultHeader({ valid, title, t }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 p-4 rounded-xl border ${
        valid
          ? "bg-emerald-50 border-emerald-200 text-emerald-900"
          : "bg-red-50 border-red-200 text-red-900"
      }`}
    >
      <div className="flex items-center gap-3">
        {valid ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <XCircle className="w-6 h-6 text-red-600" />}
        <div>
          <p className="text-sm font-bold">{title}</p>
          <p className="text-xs mt-0.5 opacity-80">
            {valid ? t("detailsAvailableMsg") : t("couldNotVerifyMsg")}
          </p>
        </div>
      </div>
      <span
        className={`text-xs font-extrabold px-3 py-1.5 rounded-full border ${
          valid
            ? "bg-white text-emerald-700 border-emerald-200 shadow-xs"
            : "bg-white text-red-700 border-red-200 shadow-xs"
        }`}
      >
        {valid ? t("validStatusText") : t("invalidStatusText")}
      </span>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="p-4 bg-white border border-neutral-200/80 rounded-xl shadow-xs">
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{label}</p>
      <p className="text-sm font-semibold text-neutral-800 mt-1">{value}</p>
    </div>
  );
}