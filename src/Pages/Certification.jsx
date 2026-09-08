import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Lock,
  MessageCircle,
  Package,
  ChevronRight,
  FileText,
} from "lucide-react";

import Sidebar from "../Components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useSidebarNav } from "../Utils/Navigation";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/authService";

/* =========================================================
   FALLBACK PRODUCTS
========================================================= */

const DEFAULT_PRODUCTS = [
  {
    id: "earbuds",
    product_id: "earbuds",
    name: "Earbuds",
    productName: "Earbuds",
    product_name: "Earbuds",
  },
  {
    id: "speaker",
    product_id: "speaker",
    name: "Speaker",
    productName: "Speaker",
    product_name: "Speaker",
  },
  {
    id: "smartwatch",
    product_id: "smartwatch",
    name: "Smartwatch",
    productName: "Smartwatch",
    product_name: "Smartwatch",
  },
];

/* =========================================================
   FALLBACK JOURNEYS
========================================================= */

const DEFAULT_JOURNEYS = {
  earbuds: {
    productName: "Earbuds",
    steps: [
      {
        id: "step-1",
        title: "Identify Applicable Standard",
        description:
          "Identify the relevant Indian Standard and applicable compliance requirements for earbuds.",
        status: "completed",
      },
      {
        id: "step-2",
        title: "Product Testing",
        description:
          "Submit product samples for testing against applicable safety and performance requirements.",
        status: "current",
        tag: "Testing in Progress",
      },
      {
        id: "step-3",
        title: "Factory Inspection",
        description:
          "Manufacturing facility and quality control arrangements are verified.",
        status: "pending",
      },
      {
        id: "step-4",
        title: "Certification & Marking",
        description:
          "Complete certification requirements and obtain authorization for applicable marking.",
        status: "pending",
      },
    ],
    keyRequirements: [
      {
        label: "Applicable Standard Identified",
        met: true,
      },
      {
        label: "Product Test Report",
        met: false,
      },
      {
        label: "Factory Inspection",
        met: false,
      },
      {
        label: "Quality Control Documentation",
        met: false,
      },
    ],
  },

  speaker: {
    productName: "Speaker",
    steps: [
      {
        id: "step-1",
        title: "Identify Applicable Standard",
        description:
          "Determine the applicable Indian Standard and compliance requirements for the speaker.",
        status: "completed",
      },
      {
        id: "step-2",
        title: "Submit Product for Testing",
        description:
          "Product samples are tested for applicable electrical and safety requirements.",
        status: "completed",
      },
      {
        id: "step-3",
        title: "Factory Inspection",
        description:
          "BIS verifies the manufacturing facility and in-house quality control arrangements.",
        status: "current",
        tag: "Inspection in Progress",
      },
      {
        id: "step-4",
        title: "Certification & Marking",
        description:
          "Certification is granted after successful completion of all compliance requirements.",
        status: "pending",
      },
    ],
    keyRequirements: [
      {
        label: "Applicable Standard Identified",
        met: true,
      },
      {
        label: "Product Test Report",
        met: true,
      },
      {
        label: "Factory Inspection",
        met: false,
      },
      {
        label: "Certification Documentation",
        met: false,
      },
    ],
  },

  smartwatch: {
    productName: "Smartwatch",
    steps: [
      {
        id: "step-1",
        title: "Identify Applicable Standard",
        description:
          "Identify standards and regulatory requirements applicable to the smartwatch.",
        status: "completed",
      },
      {
        id: "step-2",
        title: "Product Testing",
        description:
          "Product samples undergo required safety and performance testing.",
        status: "completed",
      },
      {
        id: "step-3",
        title: "Factory Inspection",
        description:
          "Manufacturing and quality control processes are reviewed for compliance.",
        status: "completed",
      },
      {
        id: "step-4",
        title: "Certification & Marking",
        description:
          "Final certification and applicable marking authorization are processed.",
        status: "current",
        tag: "Certification in Progress",
      },
    ],
    keyRequirements: [
      {
        label: "Applicable Standard Identified",
        met: true,
      },
      {
        label: "Product Test Report",
        met: true,
      },
      {
        label: "Factory Inspection",
        met: true,
      },
      {
        label: "Certification Documentation",
        met: false,
      },
    ],
  },
};

/* =========================================================
   NORMALIZE STATUS
========================================================= */

function normalizeStatus(status) {
  if (!status) return "pending";

  const value = String(status).toLowerCase().trim();

  if (
    value === "completed" ||
    value === "complete" ||
    value === "done"
  ) {
    return "completed";
  }

  if (
    value === "current" ||
    value === "in_progress" ||
    value === "in-progress" ||
    value === "in progress" ||
    value === "ongoing" ||
    value === "processing"
  ) {
    return "current";
  }

  return "pending";
}

/* =========================================================
   STATUS ICON
========================================================= */

function StatusIcon({ status, index }) {
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus === "completed") {
    return (
      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 border-4 border-white shadow-sm">
        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
      </div>
    );
  }

  if (normalizedStatus === "current") {
    return (
      <div className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center shrink-0 border-4 border-white shadow-sm">
        <LoaderCircle className="w-4 h-4 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-9 h-9 rounded-full bg-neutral-100 border-4 border-white shadow-sm flex items-center justify-center shrink-0">
      <span className="text-xs font-bold text-neutral-400">
        {index + 1}
      </span>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Completed
      </span>
    );
  }

  if (normalizedStatus === "current") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 bg-neutral-100 border border-neutral-200 rounded-full px-3 py-1.5">
        <Clock3 className="w-3.5 h-3.5" />
        In Progress
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 bg-neutral-50 border border-neutral-200 rounded-full px-3 py-1.5">
      <Lock className="w-3.5 h-3.5" />
      Pending
    </span>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Certification() {
  const navigate = useNavigate();
  const onNavigate = useSidebarNav();

  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [journey, setJourney] = useState(null);

  const [productsLoading, setProductsLoading] = useState(true);
  const [journeyLoading, setJourneyLoading] = useState(false);
  const [error, setError] = useState("");

  /* =======================================================
     HELPERS
  ======================================================= */

  const getProductId = (product) => {
    if (!product) return null;

    return (
      product.product_id ||
      product.productId ||
      product.id ||
      product._id
    );
  };

  const getProductName = (product) => {
    if (!product) return "Product";

    return (
      product.name ||
      product.productName ||
      product.product_name ||
      product.product_name_en ||
      product.title ||
      product.product ||
      "Product"
    );
  };

  const getStepTitle = (step) => {
    return (
      step?.title ||
      step?.step_name ||
      step?.stepName ||
      step?.stage_name ||
      step?.stageName ||
      step?.name ||
      "Compliance Stage"
    );
  };

  const getStepDescription = (step) => {
    return (
      step?.description ||
      step?.step_description ||
      step?.stepDescription ||
      step?.details ||
      "Complete this compliance requirement."
    );
  };

  const getStepStatus = (step) => {
    return normalizeStatus(
      step?.status ||
        step?.step_status ||
        step?.stage_status
    );
  };

  const getJourneyProductName = () => {
    return (
      journey?.productName ||
      journey?.product_name ||
      journey?.productName_en ||
      journey?.product ||
      getProductName(
        products.find(
          (product) =>
            getProductId(product) === selectedProduct
        )
      )
    );
  };

  /* =======================================================
     FETCH PRODUCTS
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        setError("");

        const res = await api.get("/compliance/products");

        const apiProducts =
          res.data?.products ||
          res.data?.data ||
          res.data;

        if (cancelled) return;

        if (
          Array.isArray(apiProducts) &&
          apiProducts.length > 0
        ) {
          setProducts(apiProducts);

          const firstProductId =
            getProductId(apiProducts[0]);

          setSelectedProduct(firstProductId);
        } else {
          setProducts(DEFAULT_PRODUCTS);
          setSelectedProduct(DEFAULT_PRODUCTS[0].id);
        }
      } catch (err) {
        if (cancelled) return;

        console.error(
          "Products loading error:",
          err
        );

        setProducts(DEFAULT_PRODUCTS);
        setSelectedProduct(DEFAULT_PRODUCTS[0].id);
      } finally {
        if (!cancelled) {
          setProductsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  /* =======================================================
     FETCH JOURNEY
  ======================================================= */

  useEffect(() => {
    if (!selectedProduct) return;

    let cancelled = false;

    const loadJourney = async () => {
      try {
        setJourneyLoading(true);
        setError("");

        const res = await api.get(
          `/compliance/journey/${selectedProduct}`
        );

        if (cancelled) return;

        const journeyData =
          res.data?.journey ||
          res.data?.data ||
          res.data;

        if (journeyData) {
          setJourney(journeyData);
        } else {
          setJourney(
            DEFAULT_JOURNEYS[selectedProduct] || null
          );
        }
      } catch (err) {
        if (cancelled) return;

        console.error(
          "Journey loading error:",
          err
        );

        setJourney(
          DEFAULT_JOURNEYS[selectedProduct] || null
        );
      } finally {
        if (!cancelled) {
          setJourneyLoading(false);
        }
      }
    };

    loadJourney();

    return () => {
      cancelled = true;
    };
  }, [selectedProduct]);

  /* =======================================================
     JOURNEY DATA
  ======================================================= */

  const steps = Array.isArray(journey?.steps)
    ? journey.steps
    : Array.isArray(journey?.stages)
    ? journey.stages
    : [];

  const completedSteps = steps.filter(
    (step) => getStepStatus(step) === "completed"
  ).length;

  const inProgressSteps = steps.filter(
    (step) => getStepStatus(step) === "current"
  ).length;

  const pendingSteps = steps.filter(
    (step) => getStepStatus(step) === "pending"
  ).length;

  const progress =
    steps.length > 0
      ? Math.round(
          (completedSteps / steps.length) * 100
        )
      : 0;

  const journeyStatus =
    steps.length > 0 &&
    steps.every(
      (step) =>
        getStepStatus(step) === "completed"
    )
      ? "completed"
      : inProgressSteps > 0
      ? "current"
      : "pending";

  /* =======================================================
     LOADING
  ======================================================= */

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="w-7 h-7 text-emerald-600 animate-spin" />

          <p className="text-sm text-neutral-500">
            Loading compliance products...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-neutral-50 flex font-sans">

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <Sidebar
        active="certification"
        onNavigate={onNavigate}
        onStartCertification={() =>
          navigate("/certification")
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
              Compliance Journey
            </p>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

              <div>

                <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                  Product Compliance Journey
                </h1>

                <p className="text-sm text-neutral-500 mt-2 max-w-2xl">
                  Select a product to understand its current
                  compliance stage and the steps required for
                  certification.
                </p>

              </div>

              {/* Progress */}

              {journey && (
                <div className="bg-white border border-neutral-200 rounded-xl px-5 py-4 min-w-[190px]">

                  <div className="flex items-center justify-between mb-2">

                    <span className="text-xs font-medium text-neutral-500">
                      Overall Progress
                    </span>

                    <span className="text-sm font-bold text-neutral-900">
                      {progress}%
                    </span>

                  </div>

                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                      }}
                    />

                  </div>

                  <p className="text-[11px] text-neutral-400 mt-2">
                    {completedSteps} of {steps.length} stages
                    completed
                  </p>

                </div>
              )}

            </div>
          </div>

          {/* =================================================
              PRODUCT SELECTION
          ================================================= */}

          <section className="mb-8">

            <div className="flex items-center gap-2 mb-4">

              <Package className="w-5 h-5 text-neutral-700" />

              <h2 className="text-lg font-semibold text-neutral-900">
                Select Product
              </h2>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {products.map((product) => {

                const productId =
                  getProductId(product);

                const productName =
                  getProductName(product);

                const isSelected =
                  selectedProduct === productId;

                return (
                  <button
                    key={productId}
                    type="button"
                    onClick={() =>
                      setSelectedProduct(productId)
                    }
                    className={`text-left p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-neutral-900 border-neutral-900 text-white shadow-md"
                        : "bg-white border-neutral-200 text-neutral-900 hover:border-emerald-400 hover:shadow-sm"
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? "bg-white/10 text-emerald-400"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        <Package className="w-5 h-5" />
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      )}

                    </div>

                    <p
                      className={`mt-4 font-semibold ${
                        isSelected
                          ? "text-white"
                          : "text-neutral-900"
                      }`}
                    >
                      {productName}
                    </p>

                    <p
                      className={`text-xs mt-1 ${
                        isSelected
                          ? "text-neutral-400"
                          : "text-neutral-500"
                      }`}
                    >
                      View compliance journey
                    </p>

                  </button>
                );
              })}

            </div>
          </section>

          {/* =================================================
              JOURNEY LOADING
          ================================================= */}

          {journeyLoading ? (

            <div className="bg-white border border-neutral-200 rounded-2xl min-h-[350px] flex items-center justify-center">

              <div className="flex flex-col items-center gap-3">

                <LoaderCircle className="w-7 h-7 text-emerald-600 animate-spin" />

                <p className="text-sm text-neutral-500">
                  Loading compliance journey...
                </p>

              </div>

            </div>

          ) : journey ? (

            <section>

              {/* =================================================
                  JOURNEY HEADER
              ================================================= */}

              <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-6">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Selected Product
                    </p>

                    <h2 className="text-xl font-bold text-neutral-900">
                      {getJourneyProductName()}
                    </h2>

                  </div>

                  <div className="flex items-center gap-2">

                    <span className="text-xs font-medium text-neutral-500">
                      Status
                    </span>

                    <StatusBadge status={journeyStatus} />

                  </div>

                </div>
              </div>

              {/* =================================================
                  TIMELINE
              ================================================= */}

              <div className="bg-white border border-neutral-200 rounded-2xl p-6 lg:p-8">

                <div className="mb-7">

                  <h3 className="text-lg font-semibold text-neutral-900">
                    Compliance Timeline
                  </h3>

                  <p className="text-xs text-neutral-500 mt-1">
                    Track every stage of the product compliance
                    process.
                  </p>

                </div>

                {steps.length === 0 ? (

                  <div className="py-12 text-center">

                    <Package className="w-10 h-10 text-neutral-300 mx-auto mb-3" />

                    <h3 className="font-semibold text-neutral-900">
                      No stages available
                    </h3>

                    <p className="text-sm text-neutral-500 mt-1">
                      No compliance stages were returned for
                      this product.
                    </p>

                  </div>

                ) : (

                  <div className="relative">

                    {steps.map((step, index) => {

                      const isLast =
                        index === steps.length - 1;

                      const status =
                        getStepStatus(step);

                      const isCompleted =
                        status === "completed";

                      const isCurrent =
                        status === "current";

                      return (
                        <div
                          key={
                            step.id ||
                            step.step_id ||
                            step.stage_id ||
                            index
                          }
                          className="relative flex gap-5"
                        >

                          {/* Timeline */}

                          <div className="flex flex-col items-center">

                            <StatusIcon
                              status={status}
                              index={index}
                            />

                            {!isLast && (
                              <div
                                className={`w-0.5 flex-1 my-1 ${
                                  isCompleted
                                    ? "bg-emerald-300"
                                    : "bg-neutral-200"
                                }`}
                                style={{
                                  minHeight: "80px",
                                }}
                              />
                            )}

                          </div>

                          {/* Step */}

                          <div className="flex-1 pb-7">

                            <div
                              className={`rounded-xl p-5 transition-all ${
                                isCurrent
                                  ? "border-2 border-neutral-900 bg-white shadow-sm"
                                  : isCompleted
                                  ? "border border-emerald-100 bg-emerald-50/30"
                                  : "border border-neutral-200 bg-neutral-50/60"
                              }`}
                            >

                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                                <div className="min-w-0">

                                  <div className="flex items-center gap-2 mb-1">

                                    <span
                                      className={`text-[10px] font-bold uppercase tracking-wider ${
                                        isCompleted
                                          ? "text-emerald-600"
                                          : isCurrent
                                          ? "text-neutral-700"
                                          : "text-neutral-400"
                                      }`}
                                    >
                                      Stage {index + 1}
                                    </span>

                                  </div>

                                  <h4
                                    className={`font-semibold ${
                                      status === "pending"
                                        ? "text-neutral-400"
                                        : "text-neutral-900"
                                    }`}
                                  >
                                    {getStepTitle(step)}
                                  </h4>

                                  <p
                                    className={`text-sm mt-1.5 leading-relaxed ${
                                      status === "pending"
                                        ? "text-neutral-400"
                                        : "text-neutral-500"
                                    }`}
                                  >
                                    {getStepDescription(step)}
                                  </p>

                                </div>

                                <StatusBadge
                                  status={status}
                                />

                              </div>

                              {/* TAG */}

                              {(step.tag ||
                                step.label ||
                                step.status_label) && (

                                <span className="inline-flex items-center text-xs font-medium text-neutral-600 bg-neutral-100 border border-neutral-200 rounded-md px-2.5 py-1 mt-4">
                                  {step.tag ||
                                    step.label ||
                                    step.status_label}
                                </span>

                              )}

                              {/* STANDARD */}

                              {step.standard && (

                                <div className="flex items-center gap-3 bg-white rounded-lg p-3 mt-4 border border-neutral-200">

                                  <div className="w-9 h-9 rounded-lg bg-neutral-900 flex items-center justify-center shrink-0">

                                    <FileText className="w-4 h-4 text-white" />

                                  </div>

                                  <div className="min-w-0">

                                    <p className="text-sm font-semibold text-neutral-900">
                                      {step.standard.code ||
                                        step.standard.standard_code ||
                                        "Standard"}
                                    </p>

                                    <p className="text-xs text-neutral-500 mt-0.5">
                                      {step.standard.title ||
                                        step.standard.standard_name ||
                                        ""}
                                    </p>

                                  </div>

                                </div>

                              )}

                              {/* PENDING MESSAGE */}

                              {status === "pending" && (
                                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-4">

                                  <Lock className="w-3.5 h-3.5" />

                                  This stage will unlock after
                                  previous requirements are
                                  completed.

                                </div>
                              )}

                            </div>

                          </div>

                        </div>
                      );
                    })}

                  </div>
                )}

              </div>

              {/* =================================================
                  KEY REQUIREMENTS
              ================================================= */}

              {Array.isArray(
                journey.keyRequirements
              ) &&
                journey.keyRequirements.length > 0 && (

                  <div className="mt-6 bg-white border border-neutral-200 rounded-2xl p-6">

                    <h3 className="text-lg font-semibold text-neutral-900 mb-5">
                      Key Requirements
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                      {journey.keyRequirements.map(
                        (req, index) => (

                          <div
                            key={
                              req.label ||
                              req.name ||
                              index
                            }
                            className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-100"
                          >

                            {req.met ||
                            req.completed ||
                            req.status ===
                              "completed" ? (

                              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />

                            ) : (

                              <div className="w-5 h-5 rounded-full border-2 border-neutral-200 shrink-0" />

                            )}

                            <span
                              className={`text-sm ${
                                req.met ||
                                req.completed ||
                                req.status ===
                                  "completed"
                                  ? "text-neutral-700"
                                  : "text-neutral-400"
                              }`}
                            >
                              {req.label ||
                                req.name ||
                                req.requirement ||
                                "Requirement"}
                            </span>

                          </div>

                        )
                      )}

                    </div>

                  </div>
                )}

              {/* =================================================
                  SUMMARY
              ================================================= */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">

                <div className="bg-white border border-neutral-200 rounded-xl p-4">

                  <p className="text-xs text-neutral-400">
                    Completed
                  </p>

                  <p className="text-xl font-bold text-emerald-600 mt-1">
                    {completedSteps}
                  </p>

                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-4">

                  <p className="text-xs text-neutral-400">
                    In Progress
                  </p>

                  <p className="text-xl font-bold text-neutral-900 mt-1">
                    {inProgressSteps}
                  </p>

                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-4">

                  <p className="text-xs text-neutral-400">
                    Pending
                  </p>

                  <p className="text-xl font-bold text-neutral-400 mt-1">
                    {pendingSteps}
                  </p>

                </div>

              </div>

              {/* =================================================
                  ACTION
              ================================================= */}

              <div className="flex flex-wrap justify-end gap-3 mt-6">

                <button
                  type="button"
                  onClick={() =>
                    navigate("/assistant")
                  }
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-neutral-900 rounded-xl px-5 py-3 hover:bg-neutral-800 transition-colors cursor-pointer"
                >

                  <MessageCircle className="w-4 h-4" />

                  Ask AI Assistant

                  <ChevronRight className="w-4 h-4" />

                </button>

              </div>

            </section>

          ) : (

            <div className="bg-white border border-neutral-200 rounded-2xl p-10 text-center">

              <Package className="w-10 h-10 text-neutral-300 mx-auto mb-3" />

              <h3 className="font-semibold text-neutral-900">
                No compliance journey available
              </h3>

              <p className="text-sm text-neutral-500 mt-1">
                We couldn't load the compliance journey for
                this product.
              </p>

            </div>

          )}

        </div>
      </main>
    </div>
  );
}