import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  FileText,
  Lock,
  Download,
  MessageCircle,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useSidebarNav } from "../Utils/Navigation";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/authService";

const DEFAULT_JOURNEY = {
  productName: "Decorative Lighting & Luminaires",
  steps: [
    {
      id: "step-1",
      title: "Identify Standard & Quality Control Order (QCO)",
      description: "Verify applicability under Scheme-I for IS 10322 (Part 5/Sec 1).",
      status: "completed",
      standard: {
        code: "IS 10322 (Part 5/Sec 1): 2012",
        title: "Luminaires - Particular Requirements: General Purpose",
      },
    },
    {
      id: "step-2",
      title: "Sample Testing at NABL / BIS Approved Lab",
      description: "Submit product samples for insulation, thermal resistance, and photobiological safety testing.",
      status: "current",
      tag: "Testing in Progress",
    },
    {
      id: "step-3",
      title: "Factory Audit & Quality Inspection",
      description: "BIS inspection officer visits the manufacturing plant for in-house testing facility verification.",
      status: "pending",
    },
    {
      id: "step-4",
      title: "Grant of BIS License & ISI Mark Allotment",
      description: "Issuance of the official license number (CML) and marking authorization.",
      status: "pending",
    },
  ],
  keyRequirements: [
    { label: "Valid Factory Registration / MSME Udyam", met: true },
    { label: "In-house Test Laboratory Setup", met: true },
    { label: "NABL Test Report for Raw Materials", met: false },
    { label: "Designated Quality Control In-Charge", met: false },
  ],
  referenceClauses: [
    { title: "Clause 4.2 - Electric Shock Protection", desc: "Insulation barriers must withstand 1.5 kV withstand voltage test." },
    { title: "Clause 8.1 - Resistance to Heat & Fire", desc: "Glow wire test verification at 650°C for non-metallic enclosures." },
  ],
};

function StepIcon({ status }) {
  if (status === "completed") {
    return (
      <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
      </div>
    );
  }
  if (status === "current") {
    return (
      <div className="w-7 h-7 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-white" />
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full bg-neutral-100 border-2 border-neutral-200 flex items-center justify-center shrink-0 text-xs text-neutral-400 font-semibold">
      {status?.order ?? "•"}
    </div>
  );
}

export default function Certification() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const onNavigate = useSidebarNav();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const [journey, setJourney] = useState(DEFAULT_JOURNEY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    api
      .get(`/certification/journey/${productId || "current"}`)
      .then((res) => {
        if (!cancelled && res.data) {
          setJourney(res.data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setJourney(DEFAULT_JOURNEY);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId, user?.id]);

  return (
    <div className="min-h-screen bg-neutral-50 flex font-sans">
      <Sidebar
        active="certification"
        onNavigate={onNavigate}
        onStartCertification={() => navigate("/certification")}
        onLogout={logout}
      />

      <div className="flex-1 min-w-0 px-10 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">
            {journey?.productName || t("complianceRoadmap")}
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            {t("certificationSubtitle")}
          </p>
        </div>

        <div className="flex gap-8 flex-col lg:flex-row">
          <div className="flex-1 min-w-0 space-y-0">
            {(journey?.steps || []).map((step, i) => {
              const isLast = i === journey.steps.length - 1;
              return (
                <div key={step.id || i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <StepIcon
                      status={
                        step.status === "pending"
                          ? { order: i + 1 }
                          : step.status
                      }
                    />
                    {!isLast && (
                      <div
                        className={`w-px flex-1 my-1 ${
                          step.status === "completed"
                            ? "bg-emerald-300"
                            : "bg-neutral-200"
                        }`}
                        style={{ minHeight: "48px" }}
                      />
                    )}
                  </div>

                  <div
                    className={`flex-1 mb-4 rounded-xl p-5 ${
                      step.status === "current"
                        ? "bg-white border-2 border-neutral-900 shadow-xs"
                        : step.status === "completed"
                        ? "bg-white border border-neutral-200"
                        : "bg-neutral-100/60 border border-neutral-100"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p
                          className={`font-semibold ${
                            step.status === "pending"
                              ? "text-neutral-400"
                              : "text-neutral-900"
                          }`}
                        >
                          {step.title}
                        </p>
                        <p
                          className={`text-sm mt-1 ${
                            step.status === "pending"
                              ? "text-neutral-400"
                              : "text-neutral-500"
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                      {step.status === "completed" && (
                        <span className="shrink-0 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-full px-3 py-1">
                          {t("completed")}
                        </span>
                      )}
                      {step.status === "current" && (
                        <span className="shrink-0 text-xs font-semibold text-white bg-neutral-900 rounded-full px-3 py-1">
                          {t("currentStep")}
                        </span>
                      )}
                    </div>

                    {step.status === "pending" && (
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-3">
                        <Lock className="w-3 h-3" />
                        {t("pendingPrevious")}
                      </div>
                    )}

                    {step.tag && (
                      <span className="inline-block text-xs font-medium text-neutral-600 bg-neutral-100 rounded px-2 py-1 mt-3">
                        {step.tag}
                      </span>
                    )}

                    {step.standard && (
                      <div className="flex items-center gap-3 bg-neutral-50 rounded-lg p-3 mt-4 border border-neutral-200/60">
                        <div className="w-8 h-8 rounded bg-neutral-900 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">
                            {step.standard.code}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {step.standard.title}
                          </p>
                        </div>
                      </div>
                    )}

                    {step.status === "current" && (
                      <div className="flex gap-3 mt-4">
                        <button
                          type="button"
                          className="text-sm font-semibold text-white bg-neutral-900 rounded-lg px-4 py-2 hover:bg-neutral-800 transition-colors cursor-pointer"
                        >
                          {t("acknowledge")}
                        </button>
                        <button
                          type="button"
                          className="text-sm font-semibold text-neutral-700 border border-neutral-300 rounded-lg px-4 py-2 hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                          {t("viewDetails")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="w-full lg:w-72 shrink-0 space-y-4">
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
              <p className="font-semibold text-neutral-900 text-sm mb-3">
                {t("keyRequirements")}
              </p>
              <ul className="space-y-2.5">
                {(journey?.keyRequirements || []).map((req) => (
                  <li key={req.label} className="flex items-start gap-2 text-sm">
                    {req.met ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-neutral-200 shrink-0 mt-0.5" />
                    )}
                    <span className={req.met ? "text-neutral-700" : "text-neutral-400"}>
                      {req.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
              <p className="font-semibold text-neutral-900 text-sm mb-3">
                {t("referenceClauses")}
              </p>
              <div className="space-y-3">
                {(journey?.referenceClauses || []).map((clause) => (
                  <div key={clause.title}>
                    <p className="text-sm font-medium text-neutral-800">{clause.title}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{clause.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 border border-neutral-300 rounded-lg px-4 py-2.5 hover:bg-white transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {t("downloadChecklist")}
          </button>
          <button
            type="button"
            onClick={() => navigate("/assistant")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-neutral-900 rounded-lg px-4 py-2.5 hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            {t("connectExpert")}
          </button>
        </div>
      </div>
    </div>
  );
}