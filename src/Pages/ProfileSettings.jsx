import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import {
  Search,
  Pencil,
  Clock,
  Shield,
  FileText,
  LogOut,
  ChevronRight,
  ExternalLink,
  Check,
  Plus,
  AlertCircle,
  X,
} from "lucide-react";
import api from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useSidebarNav } from "../Utils/Navigation";
import { useLanguage } from "../context/LanguageContext";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const onNavigate = useSidebarNav();
  const { user, logout } = useAuth();
  const { language, changeLanguage, t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications_enabled");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [addingPhone, setAddingPhone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      let profileData = null;

      try {
        const res = await api.get("/auth/get-me");
        profileData = res.data?.user || res.data;
      } catch {
        const res = await api.get("/profile");
        profileData = res.data?.user || res.data;
      }

      if (profileData) {
        setFullName(
          profileData.fullName ||
            profileData.username ||
            profileData.name ||
            user?.fullName ||
            ""
        );
        setEmail(profileData.email || user?.email || "");
        setPhone(profileData.phone || profileData.phoneNumber || "");
        setLocation(profileData.location || profileData.city || "");

        if (profileData.language && profileData.language !== language) {
          changeLanguage(profileData.language);
        }

        const prefNotif =
          profileData.notifications ??
          (localStorage.getItem("notifications_enabled") !== null
            ? JSON.parse(localStorage.getItem("notifications_enabled"))
            : true);
        setNotifications(prefNotif);
        localStorage.setItem(
          "notifications_enabled",
          JSON.stringify(prefNotif)
        );
      }
    } catch (err) {
      if (user) {
        setFullName(user.fullName || user.username || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
        setLocation(user.location || "");
      } else {
        setLoadError(
          err.response?.data?.message || err.message || t("loadErrorFallback")
        );
      }
    } finally {
      setLoading(false);
    }
  }, [user, language, changeLanguage, t]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const payload = { fullName, email, phone, location };
      try {
        await api.put("/profile", payload);
      } catch {
        await api.put("/auth/update-me", payload);
      }
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setIsEditing(false);
      }, 1500);
    } catch (err) {
      setSaveError(err.response?.data?.message || t("saveErrorFallback"));
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = async (patch) => {
    if ("language" in patch) {
      changeLanguage(patch.language);
    }
    if ("notifications" in patch) {
      setNotifications(patch.notifications);
      localStorage.setItem(
        "notifications_enabled",
        JSON.stringify(patch.notifications)
      );
    }

    setSaveError(null);

    try {
      await api.patch("/profile/preferences", patch);
    } catch {
      try {
        await api.put("/profile", patch);
      } catch {}
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] font-sans">
      <Sidebar
        active="profile"
        onNavigate={onNavigate}
        onStartCertification={() => navigate("/certification")}
        onLogout={logout}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <span
                className="cursor-pointer hover:text-gray-600"
                onClick={() => navigate("/")}
              >
                {t("home")}
              </span>
              <span>›</span>
              <span className="text-gray-500">{t("profileTitle")}</span>
            </div>
            <button
              type="button"
              aria-label="Search"
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <Search size={17} />
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-[22px] font-semibold text-gray-900">
              {t("profileTitle")}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {t("profileSubtitle")}
            </p>
          </div>

          {loadError && (
            <div className="flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
              <span className="flex items-center gap-2">
                <AlertCircle size={15} />
                {loadError}
              </span>
              <button
                type="button"
                onClick={fetchProfile}
                className="font-medium underline underline-offset-2 hover:text-red-800 cursor-pointer"
              >
                {t("retry")}
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200/70 shadow-sm p-5 mb-6 flex items-center justify-between">
            {loading ? (
              <div className="flex items-center gap-3.5 w-full">
                <div className="w-11 h-11 rounded-full bg-gray-200 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3.5 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-44 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-semibold">
                    {initials || "?"}
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-gray-900">
                      {fullName || t("registeredUser")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {email || t("noEmail")}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing((prev) => !prev)}
                  className={`flex items-center gap-1.5 text-sm font-medium border rounded-full px-4 py-1.5 transition-colors cursor-pointer ${
                    isEditing
                      ? "border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {isEditing ? (
                    <>
                      <X size={13} />
                      {t("cancel")}
                    </>
                  ) : (
                    <>
                      <Pencil size={13} />
                      {t("editProfile")}
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {isEditing && (
            <div className="bg-white rounded-2xl border border-gray-200/70 shadow-sm p-6 mb-6">
              <h2 className="text-[15px] font-semibold text-gray-900">
                {t("basicInfoTitle")}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5 mb-5">
                {t("basicInfoSubtitle")}
              </p>
              <div className="border-t border-gray-100 pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <Field
                    id="profile-fullname-input"
                    label={t("fullName")}
                    value={fullName}
                    onChange={setFullName}
                  />
                  <Field
                    label={t("emailAddress")}
                    value={email}
                    onChange={setEmail}
                    type="email"
                  />

                  {phone || addingPhone ? (
                    <Field
                      label={t("phoneNumber")}
                      value={phone}
                      onChange={setPhone}
                      type="tel"
                      placeholder="+91 98765 43210"
                      autoFocus={addingPhone && !phone}
                    />
                  ) : (
                    <div>
                      <span className="text-sm font-medium text-gray-900 block mb-1.5">
                        {t("phoneNumber")}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAddingPhone(true)}
                        className="w-full flex items-center gap-1.5 text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg px-3.5 py-2.5 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <Plus size={14} />
                        {t("addPhoneNumber")}
                      </button>
                    </div>
                  )}

                  <Field
                    label={t("location")}
                    value={location}
                    onChange={setLocation}
                    placeholder={t("locationPlaceholder")}
                  />
                </div>

                {saveError && (
                  <p className="text-sm text-red-600 mt-3">{saveError}</p>
                )}

                <div className="flex items-center gap-3 mt-5">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Check size={14} />
                    {saving ? t("saving") : saved ? t("saved") : t("saveChanges")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-sm font-medium text-neutral-600 border border-neutral-300 rounded-lg px-4 py-2.5 hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    {t("close")}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200/70 shadow-sm p-6 mb-6">
            <h2 className="text-[15px] font-semibold text-gray-900">
              {t("preferencesTitle")}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5 mb-5">
              {t("preferencesSubtitle")}
            </p>
            <div className="border-t border-gray-100 pt-5 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {t("prefLanguage")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t("prefLanguageDesc")}
                  </p>
                </div>
                <select
                  value={language}
                  disabled={loading}
                  onChange={(e) =>
                    updatePreference({ language: e.target.value })
                  }
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 w-40 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 disabled:opacity-60 cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {t("notifications")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t("notificationsDesc")}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications}
                  disabled={loading}
                  onClick={() =>
                    updatePreference({ notifications: !notifications })
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 disabled:opacity-60 cursor-pointer ${
                    notifications ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      notifications ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/70 shadow-sm p-6 mb-6">
            <h2 className="text-[15px] font-semibold text-gray-900">
              {t("securityTitle")}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5 mb-5">
              {t("securitySubtitle")}
            </p>
            <div className="border-t border-gray-100 pt-5 space-y-3">
              <SettingsRow
                icon={Clock}
                label={t("changePassword")}
                trailing="chevron"
              />
              <SettingsRow
                icon={Shield}
                label={t("privacyPolicy")}
                trailing="external"
                onClick={() =>
                  window.open(
                    "https://www.bis.gov.in/privacy-policy/",
                    "_blank"
                  )
                }
              />
              <SettingsRow
                icon={FileText}
                label={t("termsConditions")}
                trailing="external"
                onClick={() =>
                  window.open(
                    "https://www.bis.gov.in/terms-and-conditions/",
                    "_blank"
                  )
                }
              />
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 text-sm font-medium text-red-500 border border-red-200 rounded-lg px-4 py-2.5 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            {t("logout")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoFocus,
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-900">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full text-sm text-gray-700 border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
      />
    </label>
  );
}

function SettingsRow({ icon: Icon, label, trailing, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <span className="flex items-center gap-2.5 text-sm font-medium text-gray-800">
        <Icon size={15} className="text-gray-500" />
        {label}
      </span>
      {trailing === "chevron" ? (
        <ChevronRight size={16} className="text-gray-400" />
      ) : (
        <ExternalLink size={14} className="text-gray-400" />
      )}
    </button>
  );
}