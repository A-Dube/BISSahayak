import { createContext, useContext, useState, useEffect } from "react";

const DICTIONARY = {
  English: {
    // Navigation / Sidebar
    officialAssistant: "OFFICIAL AI ASSISTANT",
    startCertification: "Start Certification",
    home: "Home",
    assistant: "AI Assistant",
    standards: "Standards",
    certification: "Certification",
    labs: "Testing Labs",
    hallmarking: "Hallmarking",
    recentChats: "Recent Chats",
    chat: "Chat",
    chatOptions: "Chat options",
    shareConversation: "Share conversation",
    pin: "Pin",
    rename: "Rename",
    delete: "Delete",
    newChat: "New Chat",
    profile: "Profile",
    help: "Help",
    logout: "Logout",

    // Home Dashboard
    heroTitle: "How can I help you today?",
    heroSubtitle: "Ask about ISI Mark, HUID, or search standards.",
    searchPlaceholder: "e.g., How to apply for ISI mark for cement?",
    quickServices: "Quick Services",
    verifyHuidTitle: "Verify HUID",
    verifyHuidDesc: "Check authenticity of hallmarked jewellery.",
    checkIsMarkTitle: "Check IS Mark",
    checkIsMarkDesc: "Verify licenses and IS mark validity.",
    productFinderTitle: "Product Finder",
    productFinderDesc: "Search standards by product category.",
    certHelpTitle: "Cert Help",
    certHelpDesc: "Guide for certification process.",
    newsAmendments: "News & Amendments",
    viewAll: "View All",
    recentActivity: "Recent Activity",
    viewAllHistory: "View All History",
    loadingDashboard: "Loading dashboard & updates...",
    alert: "ALERT",
    update: "UPDATE",
    defaultNews1Title: "Mandatory Certification for Footwear",
    defaultNews1Summary:
      "QCO implementation date for footwear products extended. Check updated guidelines for compliance.",
    defaultNews2Title: "Revision of IS 10500: Drinking Water",
    defaultNews2Summary:
      "New amendments published regarding heavy metal limits. Effective from next month.",
    defaultAct1Title: "IS 1293: Plugs and Socket-Outlets",
    defaultAct1Desc: "Viewed standard details and testing requirements.",
    defaultAct1Time: "2 hours ago",
    defaultAct2Title: '"What is the fee for factory inspection?"',
    defaultAct2Desc: "AI Assistant chat query regarding Scheme-I.",
    defaultAct2Time: "Yesterday",
    defaultAct3Title: "IS 456: Plain and Reinforced Concrete",
    defaultAct3Desc: "Downloaded PDF document.",
    defaultAct3Time: "Oct 21, 2023",

    // Profile & Settings
    profileTitle: "Profile & Settings",
    profileSubtitle: "Manage your personal account details and preferences",
    registeredUser: "Registered User",
    noEmail: "No email on file",
    editProfile: "Edit Profile",
    cancel: "Cancel",
    basicInfoTitle: "Basic Personal Information",
    basicInfoSubtitle: "Your personal contact and identity details",
    fullName: "Full Name",
    emailAddress: "Email Address",
    phoneNumber: "Phone Number",
    addPhoneNumber: "Add phone number",
    location: "Location (Optional)",
    locationPlaceholder: "e.g. New Delhi, India",
    saveChanges: "Save Changes",
    saving: "Saving…",
    saved: "Saved",
    close: "Close",
    preferencesTitle: "Preferences",
    preferencesSubtitle: "Customize your assistant experience",
    prefLanguage: "Preferred Language",
    prefLanguageDesc: "Select the primary language for interactions and reports",
    notifications: "Notifications",
    notificationsDesc: "Receive updates and alerts regarding your queries",
    securityTitle: "Account & Security",
    securitySubtitle: "Manage your authentication and view legal terms",
    changePassword: "Change Password",
    privacyPolicy: "Privacy Policy",
    termsConditions: "Terms & Conditions",
    retry: "Retry",
    loadErrorFallback: "Couldn't load your profile.",
    saveErrorFallback: "Couldn't save your changes.",

    // AI Assistant
    assistantGreeting: "How can I help you today?",
    assistantSubtext:
      "Ask about Indian Standards, certification, ISI Mark, HUID, testing requirements, or BIS services.",
    assistantInputPlaceholder:
      "Ask about standards, certification processes, or upload documents for review...",
    docPlaceholder: "Ask something about the selected document...",
    sourcesCount: "Sources",
    reference: "Reference",
    openLink: "Open Link",
    queryingRegistry: "BIS Sahayak is querying standards registry...",
    preparingChat: "Preparing your secure conversation...",
    initChatError: "Failed to initialize conversation.",
    newChatError: "Unable to create a new conversation.",
    sessionNotReady: "Conversation session is not ready.",
    mlError: "Failed to process ML response.",
    voiceSupportError: "Voice recognition is only supported in Chrome/Edge.",
    voiceInputError: "Voice input error. Check microphone permissions.",
    fileSizeError: "File size must be under 10 MB.",
    q1: "What are the main activities of BIS?",
    q2: "What is the ISI Mark?",
    q3: "Show me standards for plugs and sockets",

    // Certification Page
    complianceRoadmap: "Compliance Journey Roadmap",
    certificationSubtitle:
      "Certification Steps, Milestones, and Clause Requirements",
    completed: "Completed",
    currentStep: "Current Step",
    pendingPrevious: "Pending previous milestone",
    acknowledge: "Acknowledge",
    viewDetails: "View Details",
    keyRequirements: "Key Requirements",
    referenceClauses: "Reference Clauses",
    downloadChecklist: "Download Checklist",
    connectExpert: "Connect with Expert",

    // Standards Page
    searchStandardsPlaceholder: "Search standards, e.g. Water Purifiers",
    filtersLabel: "FILTERS:",
    mandatory: "Mandatory",
    voluntary: "Voluntary",
    draft: "Draft",
    moreFilters: "More Filters",
    searchResults: "Search Results",
    searchPrompt: "Search above to find applicable standards.",
    sortBy: "Sort by:",
    relevance: "Relevance",
    searchingDb: "Searching standards database...",
    fetchingStandards: "Fetching latest standards...",
    noStandardsFound: "No standards found",
    adjustFilters: "Try a different search term or adjust your filters.",
    standardsSearchNotLive: "Standards search isn't live yet — waiting on the backend endpoint.",
    foundResultsText: "Found {total} standard{plural} related to '{query}'",
  },
  Hindi: {
    // Navigation / Sidebar
    officialAssistant: "आधिकारिक एआई सहायक",
    startCertification: "प्रमाणीकरण शुरू करें",
    home: "होम",
    assistant: "एआई सहायक",
    standards: "मानक",
    certification: "प्रमाणीकरण",
    labs: "परीक्षण प्रयोगशालाएं",
    hallmarking: "हॉलमार्किंग",
    recentChats: "हाल की बातचीत",
    chat: "बातचीत",
    chatOptions: "चैट विकल्प",
    shareConversation: "बातचीत साझा करें",
    pin: "पिन करें",
    rename: "नाम बदलें",
    delete: "हटाएं",
    newChat: "नई चैट",
    profile: "प्रोफ़ाइल",
    help: "सहायता",
    logout: "लॉगआउट",

    // Home Dashboard
    heroTitle: "आज मैं आपकी क्या मदद कर सकता हूँ?",
    heroSubtitle: "आईएसआई मार्क, एचयूआईडी या भारतीय मानकों के बारे में पूछें।",
    searchPlaceholder: "उदा. सीमेंट के लिए आईएसआई मार्क हेतु आवेदन कैसे करें?",
    quickServices: "त्वरित सेवाएं",
    verifyHuidTitle: "एचयूआईडी सत्यापित करें",
    verifyHuidDesc: "हॉलमार्क वाले आभूषणों की प्रामाणिकता जांचें।",
    checkIsMarkTitle: "आईएस मार्क जांचें",
    checkIsMarkDesc: "लाइसेंस और आईएस मार्क की वैधता सत्यापित करें।",
    productFinderTitle: "उत्पाद खोजक",
    productFinderDesc: "उत्पाद श्रेणी के अनुसार मानक खोजें।",
    certHelpTitle: "प्रमाणीकरण सहायता",
    certHelpDesc: "प्रमाणीकरण प्रक्रिया के लिए मार्गदर्शिका।",
    newsAmendments: "समाचार एवं संशोधन",
    viewAll: "सभी देखें",
    recentActivity: "हाल की गतिविधि",
    viewAllHistory: "संपूर्ण इतिहास देखें",
    loadingDashboard: "डैशबोर्ड और अपडेट लोड हो रहे हैं...",
    alert: "सूचना",
    update: "अपडेट",
    defaultNews1Title: "फुटवियर के लिए अनिवार्य प्रमाणीकरण",
    defaultNews1Summary:
      "फुटवियर उत्पादों के लिए क्यूसीओ कार्यान्वयन तिथि बढ़ाई गई। अनुपालन दिशानिर्देश देखें।",
    defaultNews2Title: "आईएस 10500 का संशोधन: पीने का पानी",
    defaultNews2Summary:
      "भारी धातु सीमाओं के संबंध में नए संशोधन प्रकाशित। अगले महीने से प्रभावी।",
    defaultAct1Title: "आईएस 1293: प्लग और सॉकेट-आउटलेट",
    defaultAct1Desc: "मानक विवरण और परीक्षण आवश्यकताएं देखी गईं।",
    defaultAct1Time: "2 घंटे पहले",
    defaultAct2Title: '"कारखाना निरीक्षण शुल्क कितना है?"',
    defaultAct2Desc: "स्कीम-I के संबंध में एआई सहायक से की गई चैट।",
    defaultAct2Time: "कल",
    defaultAct3Title: "आईएस 456: सादा और प्रबलित कंक्रीट",
    defaultAct3Desc: "पीडीएफ दस्तावेज़ डाउनलोड किया गया।",
    defaultAct3Time: "21 अक्टूबर 2023",

    // Profile & Settings
    profileTitle: "प्रोफ़ाइल और सेटिंग्स",
    profileSubtitle: "अपने व्यक्तिगत खाते के विवरण और प्राथमिकताओं का प्रबंधन करें",
    registeredUser: "पंजीकृत उपयोगकर्ता",
    noEmail: "कोई ईमेल दर्ज नहीं है",
    editProfile: "प्रोफ़ाइल संपादित करें",
    cancel: "रद्द करें",
    basicInfoTitle: "मूल व्यक्तिगत जानकारी",
    basicInfoSubtitle: "आपके व्यक्तिगत संपर्क और पहचान विवरण",
    fullName: "पूरा नाम",
    emailAddress: "ईमेल पता",
    phoneNumber: "फ़ोन नंबर",
    addPhoneNumber: "फ़ोन नंबर जोड़ें",
    location: "स्थान (वैकल्पिक)",
    locationPlaceholder: "उदा. नई दिल्ली, भारत",
    saveChanges: "बदलाव सहेजें",
    saving: "सहेजा जा रहा है…",
    saved: "सहेजा गया",
    close: "बंद करें",
    preferencesTitle: "प्राथमिकताएं",
    preferencesSubtitle: "अपने सहायक अनुभव को अनुकूलित करें",
    prefLanguage: "पसंदीदा भाषा",
    prefLanguageDesc: "बातचीत और रिपोर्ट के लिए प्राथमिक भाषा चुनें",
    notifications: "सूचनाएं",
    notificationsDesc: "अपने प्रश्नों के संबंध में अपडेट और अलर्ट प्राप्त करें",
    securityTitle: "खाता और सुरक्षा",
    securitySubtitle: "अपने प्रमाणीकरण का प्रबंधन करें और कानूनी शर्तें देखें",
    changePassword: "पासवर्ड बदलें",
    privacyPolicy: "गोपनीयता नीति",
    termsConditions: "नियम और शर्तें",
    retry: "पुनः प्रयास करें",
    loadErrorFallback: "आपकी प्रोफ़ाइल लोड नहीं हो सकी।",
    saveErrorFallback: "आपके बदलाव सहेजे नहीं जा सके।",

    // AI Assistant
    assistantGreeting: "आज मैं आपकी क्या मदद कर सकता हूँ?",
    assistantSubtext:
      "भारतीय मानकों, प्रमाणीकरण, आईएसआई मार्क, एचयूआईडी, परीक्षण आवश्यकताओं या बीआईएस सेवाओं के बारे में पूछें।",
    assistantInputPlaceholder:
      "मानकों, प्रमाणीकरण प्रक्रियाओं के बारे में पूछें, या समीक्षा के लिए दस्तावेज़ अपलोड करें...",
    docPlaceholder: "चयनित दस्तावेज़ के बारे में कुछ पूछें...",
    sourcesCount: "स्रोत",
    reference: "संदर्भ",
    openLink: "लिंक खोलें",
    queryingRegistry: "बीआईएस सहायक मानक रजिस्ट्री खोज रहा है...",
    preparingChat: "आपकी सुरक्षित बातचीत तैयार की जा रही है...",
    initChatError: "बातचीत प्रारंभ करने में विफल।",
    newChatError: "नई बातचीत शुरू करने में असमर्थ।",
    sessionNotReady: "बातचीत सत्र तैयार नहीं है।",
    mlError: "प्रतिक्रिया संसाधित करने में विफल।",
    voiceSupportError: "आवाज़ पहचान केवल क्रोम या एज ब्राउज़र में समर्थित है।",
    voiceInputError: "माइक्रोफ़ोन त्रुटि। अनुमतियों की जाँच करें।",
    fileSizeError: "फ़ाइल का आकार 10 एमबी से कम होना चाहिए।",
    q1: "बीआईएस की मुख्य गतिविधियाँ क्या हैं?",
    q2: "आईएसआई मार्क क्या है?",
    q3: "प्लग और सॉकेट के मानक दिखाएं",

    // Certification Page
    complianceRoadmap: "अनुपालन यात्रा रोडमैप",
    certificationSubtitle: "प्रमाणीकरण चरण, मील के पत्थर और खंड आवश्यकताएं",
    completed: "पूर्ण",
    currentStep: "वर्तमान चरण",
    pendingPrevious: "पिछला चरण लंबित है",
    acknowledge: "स्वीकार करें",
    viewDetails: "विवरण देखें",
    keyRequirements: "मुख्य आवश्यकताएं",
    referenceClauses: "संदर्भ खंड",
    downloadChecklist: "चेकलिस्ट डाउनलोड करें",
    connectExpert: "विशेषज्ञ से जुड़ें",

    // Standards Page
    searchStandardsPlaceholder: "मानक खोजें, उदा. वॉटर प्यूरीफायर",
    filtersLabel: "फ़िल्टर:",
    mandatory: "अनिवार्य",
    voluntary: "स्वैच्छिक",
    draft: "प्रारूप (ड्राफ्ट)",
    moreFilters: "अन्य फ़िल्टर",
    searchResults: "खोज परिणाम",
    searchPrompt: "लागू मानकों को खोजने के लिए ऊपर खोजें।",
    sortBy: "क्रमबद्ध करें:",
    relevance: "प्रासंगिकता",
    searchingDb: "मानक डेटाबेस खोजा जा रहा है...",
    fetchingStandards: "नवीनतम मानक प्राप्त किए जा रहे हैं...",
    noStandardsFound: "कोई मानक नहीं मिला",
    adjustFilters: "भिन्न खोज शब्द का प्रयास करें या अपने फ़िल्टर समायोजित करें।",
    standardsSearchNotLive: "मानक खोज अभी लाइव नहीं है — बैकएंड एंडपॉइंट की प्रतीक्षा है।",
    foundResultsText: "'{query}' से संबंधित {total} मानक मिले",
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("preferred_language") || "English"
  );

  useEffect(() => {
    const handleSync = () => {
      setLanguage(localStorage.getItem("preferred_language") || "English");
    };
    window.addEventListener("languageChange", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("languageChange", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("preferred_language", lang);
    window.dispatchEvent(new Event("languageChange"));
  };

  const t = (key, params = {}) => {
    let str = DICTIONARY[language]?.[key] || DICTIONARY.English[key] || key;
    Object.keys(params).forEach((k) => {
      str = str.replace(`{${k}}`, params[k]);
    });
    return str;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);