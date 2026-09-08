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
} from "lucide-react";

import Sidebar from "../Components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useSidebarNav } from "../Utils/Navigation";
import api from "../services/authService";

export default function Verification() {
  const { logout } = useAuth();
  const onNavigate = useSidebarNav();

  /* =========================================================
     HUID STATE
  ========================================================= */

  const [huid, setHuid] = useState("");
  const [huidLoading, setHuidLoading] = useState(false);
  const [huidResult, setHuidResult] = useState(null);
  const [huidError, setHuidError] = useState("");

  /* =========================================================
     LICENSE STATE
  ========================================================= */

  const [license, setLicense] = useState("");
  const [licenseLoading, setLicenseLoading] = useState(false);
  const [licenseResult, setLicenseResult] = useState(null);
  const [licenseError, setLicenseError] = useState("");

  /* =========================================================
     HELPERS
  ========================================================= */

  const getData = (response) => {
    return (
      response?.data?.data ||
      response?.data?.result ||
      response?.data
    );
  };

  const isValidResult = (data) => {
    return (
      data?.valid === true ||
      data?.isValid === true ||
      data?.verified === true ||
      data?.status === "valid" ||
      data?.status === "Valid" ||
      data?.status === "active" ||
      data?.status === "Active"
    );
  };

  /* =========================================================
     HUID VERIFICATION
  ========================================================= */

  const handleHuidVerify = async (e) => {
    e.preventDefault();

    if (!huid.trim()) {
      setHuidError("Please enter a HUID number.");
      setHuidResult(null);
      return;
    }

    try {
      setHuidLoading(true);
      setHuidError("");
      setHuidResult(null);

      const response = await api.post("/verify/huid", {
        huid: huid.trim(),
      });

      const data = getData(response);

      setHuidResult(data);
    } catch (error) {
      console.error("HUID verification error:", error);

      setHuidResult(null);

      setHuidError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Unable to verify this HUID. Please check the number and try again."
      );
    } finally {
      setHuidLoading(false);
    }
  };

  /* =========================================================
     LICENSE VERIFICATION
  ========================================================= */

  const handleLicenseVerify = async (e) => {
    e.preventDefault();

    if (!license.trim()) {
      setLicenseError("Please enter a BIS licence number.");
      setLicenseResult(null);
      return;
    }

    try {
      setLicenseLoading(true);
      setLicenseError("");
      setLicenseResult(null);

      const response = await api.post("/verify/license", {
        license: license.trim(),
      });

      const data = getData(response);

      setLicenseResult(data);
    } catch (error) {
      console.error("Licence verification error:", error);

      setLicenseResult(null);

      setLicenseError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Unable to verify this licence. Please check the licence number and try again."
      );
    } finally {
      setLicenseLoading(false);
    }
  };

  /* =========================================================
     GENERIC DETAIL VALUE
  ========================================================= */

  const displayValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "Not available";
    }

    if (Array.isArray(value)) {
      return value.join(", ");
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-neutral-50 flex font-sans">

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <Sidebar
        active="hallmarking"
        onNavigate={onNavigate}
        onStartCertification={() =>
          onNavigate?.("certification")
        }
        onLogout={logout}
      />

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="flex-1 min-w-0 px-6 lg:px-10 py-8 overflow-y-auto">

        <div className="max-w-6xl mx-auto">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-8">

            <p className="text-sm font-medium text-emerald-600 mb-2">
              Verification Services
            </p>

            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              Verify BIS Information
            </h1>

            <p className="text-sm text-neutral-500 mt-2 max-w-2xl">
              Verify HUID numbers and BIS licences to check
              authenticity and available certification details.
            </p>

          </div>

          {/* =================================================
              HUID VERIFICATION
          ================================================= */}

          <section className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden mb-6">

            <div className="px-6 py-5 border-b border-neutral-100">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Gem className="w-5 h-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-neutral-900">
                    HUID Verification
                  </h2>

                  <p className="text-xs text-neutral-500 mt-1">
                    Verify the authenticity of a jewellery HUID number.
                  </p>
                </div>

              </div>

            </div>

            <div className="p-6">

              <form
                onSubmit={handleHuidVerify}
                className="flex flex-col sm:flex-row gap-3"
              >

                <div className="flex-1 relative">

                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />

                  <input
                    type="text"
                    value={huid}
                    onChange={(e) => setHuid(e.target.value)}
                    placeholder="Enter HUID number"
                    className="w-full h-12 pl-12 pr-4 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
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
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Verify HUID
                    </>
                  )}

                </button>

              </form>

              {/* HUID ERROR */}

              {huidError && (
                <div className="mt-4 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">

                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />

                  <div>
                    <p className="text-sm font-semibold text-red-700">
                      Verification Failed
                    </p>

                    <p className="text-xs text-red-600 mt-1">
                      {huidError}
                    </p>
                  </div>

                </div>
              )}

              {/* HUID RESULT */}

              {huidResult && (
                <div className="mt-6">

                  <VerificationResultHeader
                    valid={isValidResult(huidResult)}
                    title={
                      isValidResult(huidResult)
                        ? "HUID is Valid"
                        : "HUID is Invalid"
                    }
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">

                    <DetailItem
                      label="HUID Number"
                      value={
                        huidResult?.huid ||
                        huidResult?.huidNumber ||
                        huid
                      }
                    />

                    <DetailItem
                      label="Jewellery Type"
                      value={
                        huidResult?.jewelleryType ||
                        huidResult?.jewelryType ||
                        huidResult?.productType ||
                        huidResult?.articleType
                      }
                    />

                    <DetailItem
                      label="Purity"
                      value={
                        huidResult?.purity ||
                        huidResult?.fineness
                      }
                    />

                    <DetailItem
                      label="Metal"
                      value={
                        huidResult?.metal ||
                        huidResult?.metalType
                      }
                    />

                    <DetailItem
                      label="Jeweller"
                      value={
                        huidResult?.jeweller ||
                        huidResult?.jewellerName ||
                        huidResult?.sellerName
                      }
                    />

                    <DetailItem
                      label="BIS Registration"
                      value={
                        huidResult?.registrationNumber ||
                        huidResult?.bisRegistrationNumber ||
                        huidResult?.registration
                      }
                    />

                    <DetailItem
                      label="Verification Date"
                      value={
                        huidResult?.verificationDate ||
                        huidResult?.verifiedAt
                      }
                    />

                    <DetailItem
                      label="Status"
                      value={
                        huidResult?.status ||
                        (isValidResult(huidResult)
                          ? "Valid"
                          : "Invalid")
                      }
                    />

                  </div>

                  {/* Additional information */}

                  {huidResult?.message && (
                    <div className="mt-4 p-4 bg-neutral-50 border border-neutral-100 rounded-xl">

                      <p className="text-xs font-semibold text-neutral-500 mb-1">
                        Verification Information
                      </p>

                      <p className="text-sm text-neutral-700">
                        {huidResult.message}
                      </p>

                    </div>
                  )}

                </div>
              )}

            </div>

          </section>

          {/* =================================================
              BIS LICENCE VERIFICATION
          ================================================= */}

          <section className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-6 py-5 border-b border-neutral-100">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileCheck2 className="w-5 h-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-neutral-900">
                    BIS Licence Verification
                  </h2>

                  <p className="text-xs text-neutral-500 mt-1">
                    Verify a BIS licence and view available licence details.
                  </p>
                </div>

              </div>

            </div>

            <div className="p-6">

              <form
                onSubmit={handleLicenseVerify}
                className="flex flex-col sm:flex-row gap-3"
              >

                <div className="flex-1 relative">

                  <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />

                  <input
                    type="text"
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    placeholder="Enter BIS licence number"
                    className="w-full h-12 pl-12 pr-4 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
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
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Verify Licence
                    </>
                  )}

                </button>

              </form>

              {/* LICENSE ERROR */}

              {licenseError && (
                <div className="mt-4 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">

                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />

                  <div>
                    <p className="text-sm font-semibold text-red-700">
                      Licence Not Found
                    </p>

                    <p className="text-xs text-red-600 mt-1">
                      {licenseError}
                    </p>
                  </div>

                </div>
              )}

              {/* LICENSE RESULT */}

              {licenseResult && (
                <div className="mt-6">

                  <VerificationResultHeader
                    valid={isValidResult(licenseResult)}
                    title={
                      isValidResult(licenseResult)
                        ? "Licence is Valid"
                        : "Licence is Invalid"
                    }
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">

                    <DetailItem
                      label="Licence Number"
                      value={
                        licenseResult?.license ||
                        licenseResult?.licence ||
                        licenseResult?.licenseNumber ||
                        licenseResult?.licenceNumber ||
                        license
                      }
                    />

                    <DetailItem
                      label="Status"
                      value={
                        licenseResult?.status ||
                        (isValidResult(licenseResult)
                          ? "Active"
                          : "Invalid")
                      }
                    />

                    <DetailItem
                      label="Licence Holder"
                      value={
                        licenseResult?.licenseHolder ||
                        licenseResult?.licenceHolder ||
                        licenseResult?.holderName ||
                        licenseResult?.companyName ||
                        licenseResult?.manufacturer
                      }
                    />

                    <DetailItem
                      label="Product"
                      value={
                        licenseResult?.product ||
                        licenseResult?.productName
                      }
                    />

                    <DetailItem
                      label="Standard"
                      value={
                        licenseResult?.standard ||
                        licenseResult?.standardNumber ||
                        licenseResult?.isNumber
                      }
                    />

                    <DetailItem
                      label="Manufacturer"
                      value={
                        licenseResult?.manufacturer ||
                        licenseResult?.manufacturerName
                      }
                    />

                    <DetailItem
                      label="Issue Date"
                      value={
                        licenseResult?.issueDate ||
                        licenseResult?.issuedDate
                      }
                    />

                    <DetailItem
                      label="Expiry Date"
                      value={
                        licenseResult?.expiryDate ||
                        licenseResult?.validTill
                      }
                    />

                  </div>

                  {licenseResult?.message && (
                    <div className="mt-4 p-4 bg-neutral-50 border border-neutral-100 rounded-xl">

                      <p className="text-xs font-semibold text-neutral-500 mb-1">
                        Verification Information
                      </p>

                      <p className="text-sm text-neutral-700">
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

/* =========================================================
   RESULT HEADER
========================================================= */

function VerificationResultHeader({ valid, title }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 p-4 rounded-xl border ${
        valid
          ? "bg-emerald-50 border-emerald-100"
          : "bg-red-50 border-red-100"
      }`}
    >

      <div className="flex items-center gap-3">

        {valid ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        ) : (
          <XCircle className="w-6 h-6 text-red-600" />
        )}

        <div>

          <p
            className={`text-sm font-bold ${
              valid
                ? "text-emerald-700"
                : "text-red-700"
            }`}
          >
            {title}
          </p>

          <p
            className={`text-xs mt-0.5 ${
              valid
                ? "text-emerald-600"
                : "text-red-600"
            }`}
          >
            {valid
              ? "The verification details are available below."
              : "The provided information could not be verified."}
          </p>

        </div>

      </div>

      <span
        className={`text-xs font-bold px-3 py-1.5 rounded-full ${
          valid
            ? "bg-white text-emerald-700"
            : "bg-white text-red-700"
        }`}
      >
        {valid ? "VALID" : "INVALID"}
      </span>

    </div>
  );
}

/* =========================================================
   DETAIL ITEM
========================================================= */

function DetailItem({ label, value }) {
  return (
    <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-xl">

      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
        {label}
      </p>

      <p className="text-sm font-medium text-neutral-800 mt-1">
        {value === undefined ||
        value === null ||
        value === ""
          ? "Not available"
          : typeof value === "object"
          ? JSON.stringify(value)
          : String(value)}
      </p>

    </div>
  );
}