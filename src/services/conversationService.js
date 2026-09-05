import api from "./authService";

export const MOCK_CONVERSATIONS = [
  {
    id: "conv-1",
    title: "BIS Activities Overview",
    createdAt: new Date().toISOString(),
  },
  {
    id: "conv-2",
    title: "ISI Mark for Electronics",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const MOCK_MESSAGES_BY_CONV = {
  "conv-1": [
    {
      id: "msg-1",
      role: "user",
      text: "What are the main activities of BIS?",
    },
    {
      id: "msg-2",
      role: "assistant",
      text: "The Bureau of Indian Standards (BIS) operates standard formulation, product certification (ISI Mark), hallmarking of gold and silver jewellery, laboratory testing, management system certification, and consumer awareness programs across India.",
    },
  ],
  "conv-2": [
    {
      id: "msg-3",
      role: "user",
      text: "Show me standards for plugs and sockets",
    },
    {
      id: "msg-4",
      role: "assistant",
      text: "Here is the relevant Indian Standard for household plugs and socket-outlets:",
      standard: {
        code: "IS 1293:2019",
        status: "Active",
        category: "Electrotechnical",
        title: "Plugs and Socket-Outlets for Domestic and Similar Purposes",
        description:
          "This standard applies to plugs and fixed or portable socket-outlets for a.c. only, with or without earthing contact, with a rated voltage up to 250 V.",
        aiInsight:
          "Mandatory QCO in place. Testing requires temperature rise and mechanical strength checks under Section 13.",
        relevanceMatch: 98,
        pdfUrl: "https://www.services.bis.gov.in/",
      },
    },
  ],
};

export const getConversations = async () => {
  try {
    const res = await api.get("/conversations");
    const data = Array.isArray(res.data) ? res.data : res.data?.conversations;
    return data && data.length > 0 ? data : MOCK_CONVERSATIONS;
  } catch {
    return MOCK_CONVERSATIONS;
  }
};

export const getMessages = async (conversationId) => {
  try {
    const res = await api.get(`/conversations/${conversationId}/messages`);
    const data = Array.isArray(res.data) ? res.data : res.data?.messages;
    return data && data.length > 0 ? data : (MOCK_MESSAGES_BY_CONV[conversationId] || []);
  } catch {
    return MOCK_MESSAGES_BY_CONV[conversationId] || [];
  }
};

export const createConversation = async (payload) => {
  try {
    const res = await api.post("/conversations", payload);
    return res.data;
  } catch {
    return {
      id: `conv-${Date.now()}`,
      title: payload.title || "New Conversation",
    };
  }
};

export const sendChatMessage = async (message, conversationId = null) => {
  try {
    const res = await api.post("/chat", { message, conversationId });
    return res.data;
  } catch {
    if (/standard|isi|plug|socket|cement|steel/i.test(message)) {
      return {
        reply: "Here is the applicable Indian Standard based on your inquiry:",
        standard: {
          code: "IS 1293:2019",
          status: "Active",
          category: "Electrotechnical",
          title: "Plugs and Socket-Outlets — Specifications (Third Revision)",
          description:
            "Prescribes constructional details, dimensional requirements, and rigorous safety tests for general purpose power outlets.",
          aiInsight:
            "Mandatory standard under Scheme-I. Ensure your test lab is NABL-accredited for IS 1293 before submitting application forms.",
          relevanceMatch: 96,
        },
      };
    }

    return {
      reply:
        "The Bureau of Indian Standards (BIS) regulates product certification (ISI Mark), hallmarking, and conformity assessments to safeguard quality and consumer safety.",
    };
  }
};
export const sendMessagePlaceholder = sendChatMessage;