"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { io, Socket } from "socket.io-client";
import {
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  Loader2,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Search,
  Send,
  Smile,
  UserRound,
  UsersRound,
  Clock3,
  Trash2,
  UserPlus,
  CheckCircle2,
  CircleAlert,
  EyeClosed,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import AdminSidebar from "../sidebar";

type SenderType = "user" | "support";

type Message = {
  _id: string;
  conversationId: string;
  senderId?: string;
  senderType: SenderType;
  message: string;
  createdAt: string;
};

type Conversation = {
  _id: string;
  // userId: string;

  userId: {
    _id?: string;
    name?: string;
    email?: string;
  };

  status: "open" | "closed";

  name?: string;
  email?: string;
  avatar?: string;
  lastMessage?: string;
  updatedAt?: string;
  createdAt?: string;
  online?: boolean;
};

type UserStatusPayload = {
  conversationId: string;
  // userId: string;
  online: boolean;
  userId: {
    _id?: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
};

type TypingPayload = {
  typing: boolean;
  userId?: string;
};

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL ?? "";



/* -------------------------------------------------------------------------- */
/*                              Main Page                                     */
/* -------------------------------------------------------------------------- */

export default function SupportAdminPage() {
  const socketRef = useRef<Socket | null>(null);
  const selectedConversationRef = useRef<string | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [connected, setConnected] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const [customerTyping, setCustomerTyping] = useState(false);

  const [error, setError] = useState("");

  /* ------------------------------------------------------------------------ */
  /*                         Selected conversation ref                        */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    selectedConversationRef.current = selectedConversation?._id ?? null;
  }, [selectedConversation]);

  /* ------------------------------------------------------------------------ */
  /*                              Socket setup                                */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      setError("");

      socket.emit("support:admin:get_conversations");
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("connect_error", () => {
      setConnected(false);
      setError("Unable to connect to support server.");
    });

    socket.on(
      "support:admin:conversations",
      (data: Conversation[] | { conversations?: Conversation[] }) => {
        const nextConversations = Array.isArray(data)
        ? data
        : data?.conversations ?? [];
        setConversations(nextConversations);
        setLoadingConversations(false);
      }
    );

    socket.on("support:history", (history: Message[]) => {
      const currentConversation = selectedConversationRef.current;

      if (!currentConversation) return;

      const filtered = history.filter(
        (item) => item.conversationId === currentConversation
      );

      setMessages(filtered);
      setLoadingMessages(false);
    });

    socket.on("support:message", (incomingMessage: Message) => {
      const currentConversation = selectedConversationRef.current;

      if (
        !currentConversation ||
        incomingMessage.conversationId !== currentConversation
      ) {
        setConversations((prev) =>
          prev.map((conversation) =>
            conversation._id === incomingMessage.conversationId
              ? {
                  ...conversation,
                  lastMessage: incomingMessage.message,
                  updatedAt: incomingMessage.createdAt,
                }
              : conversation
          )
        );

        return;
      }

      setMessages((prev) => {
        const exists = prev.some(
          (item) => item._id === incomingMessage._id
        );

        if (exists) return prev;

        return [...prev, incomingMessage];
      });

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation._id === incomingMessage.conversationId
            ? {
                ...conversation,
                lastMessage: incomingMessage.message,
                updatedAt: incomingMessage.createdAt,
              }
            : conversation
        )
      );

      setSending(false);

      if (incomingMessage.senderType === "user") {
        setCustomerTyping(false);
      }
    });

    socket.on(
      "support:typing",
      (payload: TypingPayload) => {
        setCustomerTyping(Boolean(payload.typing));
      }
    );

    socket.on(
      "support:user_status",
      (payload: UserStatusPayload) => {
        setConversations((prev) =>
          prev.map((conversation) =>
            conversation._id === payload.conversationId
              ? {
                  ...conversation,
                  online: payload.online,
                  // userId: payload.userId,
                  // user: payload.user,
                }
              : conversation
          )
        );

        setSelectedConversation((current) => {
          if (!current || current._id !== payload.conversationId) {
            return current;
          }

          return {
            ...current,
            online: payload.online,
          };
        });
      }
    );

    socket.on(
  "support:status",
  (payload: {
    conversationId: string;
    closed?: boolean;
    message?: string;
  }) => {
    if (!payload.closed) return;

    // Update conversation in the conversation list
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation._id === payload.conversationId
          ? {
              ...conversation,
              status: "closed",
            }
          : conversation
      )
    );

    // Update currently selected conversation
    setSelectedConversation((current) => {
      if (
        !current ||
        current._id !== payload.conversationId
      ) {
        return current;
      }

      return {
        ...current,
        status: "closed",
      };
    });

    // Optional: clear sending state
    setSending(false);
  }
);


    socket.on("support:error", (message: string) => {
      setError(message);
      setSending(false);
      setLoadingMessages(false);
    });

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (selectedConversationRef.current && socket.connected) {
        socket.emit("support:admin:leave", {
          conversationId: selectedConversationRef.current,
        });
      }

      socket.removeAllListeners();
      socket.disconnect();

      socketRef.current = null;
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                          Select conversation                             */
  /* ------------------------------------------------------------------------ */

  const selectConversation = useCallback(
    (conversation: Conversation) => {
      const socket = socketRef.current;

      if (!socket?.connected) {
        setError("Support server is not connected.");
        return;
      }

      if (
        selectedConversationRef.current &&
        selectedConversationRef.current !== conversation._id
      ) {
        socket.emit("support:admin:leave", {
          conversationId: selectedConversationRef.current,
        });
      }

      selectedConversationRef.current = conversation._id;

      setSelectedConversation(conversation);
      setMessages([]);
      setCustomerTyping(false);
      setError("");
      setLoadingMessages(true);

      socket.emit("support:admin:join", {
        conversationId: conversation._id,
      });
    },
    []
  );

  /* ------------------------------------------------------------------------ */
  /*                              Back button                                 */
  /* ------------------------------------------------------------------------ */

  const handleBackToConversations = useCallback(() => {
    const socket = socketRef.current;

    if (selectedConversationRef.current && socket?.connected) {
      socket.emit("support:admin:leave", {
        conversationId: selectedConversationRef.current,
      });
    }

    selectedConversationRef.current = null;

    setSelectedConversation(null);
    setMessages([]);
    setCustomerTyping(false);
    setMessage("");
    setSending(false);
    setLoadingMessages(false);
    setError("");
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                               Send message                               */
  /* ------------------------------------------------------------------------ */

  const sendMessage = useCallback(() => {
    const socket = socketRef.current;

    if (!socket?.connected || !selectedConversation || selectedConversation.status === "closed") {
      return;
    }

    const text = message.trim();

    if (!text) return;

    if (text.length > 5000) {
      setError("Message cannot exceed 5000 characters.");
      return;
    }

    socket.emit("support:message", {
      conversationId: selectedConversation._id,
      message: text,
    });

    socket.emit("support:typing", {
      conversationId: selectedConversation._id,
      typing: false,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    setMessage("");
    setSending(true);
  }, [message, selectedConversation]);

  /* ------------------------------------------------------------------------ */
  /*                                Typing                                    */
  /* ------------------------------------------------------------------------ */

  const handleTyping = useCallback(
    (value: string) => {
      setMessage(value);

      const socket = socketRef.current;

      if (!socket?.connected || !selectedConversation) {
        return;
      }

      socket.emit("support:typing", {
        conversationId: selectedConversation._id,
        typing: value.length > 0,
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("support:typing", {
          conversationId: selectedConversation._id,
          typing: false,
        });
      }, 1200);
    },
    [selectedConversation]
  );

  /* ------------------------------------------------------------------------ */
  /*                                Enter key                                 */
  /* ------------------------------------------------------------------------ */

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                                 Search                                    */
  /* ------------------------------------------------------------------------ */
   const [whichTab,setWhichTab] = useState<"all"|"open"|"closed">("all")

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    // if (!query) return conversations;/

    return conversations.filter((conversation) => {
      const name = getConversationName(conversation).toLowerCase();
      const email = getConversationEmail(conversation).toLowerCase();
      const lastMessage = (
        conversation.lastMessage || ""
      ).toLowerCase();
      if(whichTab=="open"){
        return ( conversation.status=="open" &&
        (name.includes(query) || email.includes(query) || lastMessage.includes(query)));
      }else if(whichTab=="closed"){
        return ( conversation.status=="closed" &&
        (name.includes(query) || email.includes(query) || lastMessage.includes(query)));
      }
      return (
        name.includes(query) ||
        email.includes(query) ||
        lastMessage.includes(query)
      );
    });
  }, [conversations, search, whichTab]);


  // close conversation
  // const closeConversation = useCallback(() => {
  //   const socket = socketRef.current;

  //   if (!socket?.connected || !selectedConversation) {
  //     return;
  //   }

  //   socket.emit("support:admin:close_conversation", {
  //     conversationId: selectedConversation._id,
  //   });
  // }, [selectedConversation]);
  const closeConversation = useCallback(() => {
  const socket = socketRef.current;

  if (!socket?.connected || !selectedConversation) {
    return;
  }

  const conversationId = selectedConversation._id;

  // Immediately update the UI
  setConversations((prev) =>
    prev.map((conversation) =>
      conversation._id === conversationId
        ? {
            ...conversation,
            status: "closed",
          }
        : conversation
    )
  );

  setSelectedConversation((current) =>
    current && current._id === conversationId
      ? {
          ...current,
          status: "closed",
        }
      : current
  );

  // Then tell the backend
  socket.emit("support:admin:close_conversation", {
    conversationId,
  });
}, [selectedConversation]);

  /* ------------------------------------------------------------------------ */
  /*                            Auto scroll                                    */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, customerTyping]);

  /* ------------------------------------------------------------------------ */
  /*                                  UI                                      */
  /* ------------------------------------------------------------------------ */

 

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-[#F7F3EC] text-[#321312]">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="shrink-0">
        <AdminSidebar activeTab="support" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main                                                               */}
      {/* ------------------------------------------------------------------ */}

      <main className="min-h-0 flex-1 overflow-hidden px-3 pb-3 pt-4 sm:px-5 lg:px-8 lg:pb-6 lg:pt-5">
        <div className="mx-auto flex h-full min-h-0 max-w-[1500px] flex-col">
          {/* -------------------------------------------------------------- */}
          {/* Hero                                                           */}
          {/* -------------------------------------------------------------- */}

          <div className="mb-4 flex shrink-0 items-end justify-between gap-5 lg:mb-5">
            <div>
              <div className="flex items-center gap-3">
                <span className="hidden text-3xl lg:block">⌁</span>

                <h1 className="font-title uppercase tracking-[0.06em] text-[#321312] text-[38px] leading-none sm:text-[48px] lg:text-[58px]">
                  Support
                </h1>

                <span className="hidden text-3xl lg:block">⌁</span>
              </div>

            </div>

          </div>

          {/* -------------------------------------------------------------- */}
          {/* Filters                                                         */}
          {/* -------------------------------------------------------------- */}

          <div className="mb-3 flex shrink-0 flex-col gap-3 rounded-2xl border border-[#DED3C8] bg-[#FBF8F2] p-2 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={20}
                strokeWidth={2}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C8580]"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email or message..."
                className="h-12 w-full rounded-xl font-text border border-[#D9CEC4] bg-[#FFFDF9] pl-12 pr-4 text-sm font-medium text-[#321312] outline-none transition placeholder:text-[#A49A94] focus:border-[#C8B8AA]"
              />
            </div>

            <div className="grid grid-cols-4 gap-2 sm:w-[670px]">
              <button
                type="button"
                onClick={()=>setWhichTab("all")}
                style={{
                  background: whichTab=="all"?"#FFD21A":"#fff",
                  borderColor: whichTab=="all"?"#FFD21A":"#ded3c8",
                }}
                className="font-text flex h-12 cursor-pointer transition duration-200 items-center justify-center border gap-2 rounded-xl  px-2 text-[11px] font-black uppercase text-[#321312] sm:text-xs"
              >
                <span>All</span>
                <span className="rounded-full bg-[#EEE9E3] px-2 py-0.5 text-[10px]">
                  {conversations.length}
                </span>
              </button>

              <button
                type="button"
                onClick={()=>setWhichTab("open")}
                style={{
                  background: whichTab=="open"?"#FFD21A":"#fff",
                  borderColor: whichTab=="open"?"#FFD21A":"#ded3c8",
                }}
                className="font-text flex h-12 cursor-pointer transition duration-200 items-center justify-center gap-2 rounded-xl border border-[#DED3C8] bg-[#FFFDF9] px-2 text-[11px] font-black uppercase text-[#321312] sm:text-xs"
              >
                <span>Open</span>
                <span className="rounded-full bg-[#EEE9E3] px-2 py-0.5 text-[10px]">
                  {conversations.filter(convo=>convo.status=="open").length}
                </span>
              </button>

              {/* <button
                type="button"
                className="font-text flex h-12 cursor-pointer transition duration-200 items-center justify-center gap-2 rounded-xl border border-[#DED3C8] bg-[#FFFDF9] px-2 text-[11px] font-black uppercase text-[#321312] sm:text-xs"
              >
                <span>Waiting</span>
                <span className="rounded-full bg-[#EEE9E3] px-2 py-0.5 text-[10px]">
                  3
                </span>
              </button> */}

              <button
                type="button"
                onClick={()=>setWhichTab("closed")}
                style={{
                  background: whichTab=="closed"?"#FFD21A":"#fff",
                  borderColor: whichTab=="closed"?"#FFD21A":"#ded3c8",
                }}
                className="font-text flex h-12 cursor-pointer transition duration-200 items-center justify-center gap-2 rounded-xl border border-[#DED3C8] bg-[#FFFDF9] px-2 text-[11px] font-black uppercase text-[#321312] sm:text-xs"
              >
                <span>Resolved</span>
                <span className="rounded-full bg-[#EEE9E3] px-2 py-0.5 text-[10px]">
                 {conversations.filter(convo=>convo.status=="closed").length}
                </span>
              </button>
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Workspace                                                       */}
          {/* -------------------------------------------------------------- */}

          <div data-lenis-prevent className="overflow-hidden overscroll-contain grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[350px_minmax(0,1fr)_255px]">
            {/* ============================================================ */}
            {/* Conversation list                                             */}
            {/* ============================================================ */}

            <section
              className={`${
                selectedConversation ? "hidden lg:flex" : "flex"
              } min-h-0 flex-col overflow-hidden rounded-2xl border border-[#DED3C8] bg-[#FBF8F2]`}
            >
              <div className="flex h-12 shrink-0 items-center gap-2 border-b border-[#E8DED2] px-4">
                <span className="text-lg">⌁</span>

                <h2 className="text-[15px] font-header uppercase tracking-tight">
                  Support Requests
                </h2>

                <span className="ml-auto text-lg">⌁</span>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-2">
                {loadingConversations ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2
                      size={26}
                      className="animate-spin text-[#8A7770]"
                    />
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center px-5 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F3E8DF]">
                      <MessageCircle size={22} />
                    </div>

                    <p className="text-sm font-bold">
                      No support requests
                    </p>

                    <p className="mt-1 text-xs text-[#8A7770]">
                      New customer conversations will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E8DED2]">
                    {filteredConversations.map((conversation:Conversation) => {
                      const isSelected =
                        selectedConversation?._id === conversation._id;

                      return (
                        <button
                          key={conversation._id}
                          type="button"
                          onClick={() =>
                            selectConversation(conversation)
                          }
                          className={`group flex w-full items-center gap-3 px-2 py-3 text-left transition ${
                            isSelected
                              ? "my-1 rounded-xl bg-[#FFE7A1]"
                              : "hover:bg-[#F5EEE7]"
                          }`}
                        >
                          <CustomerAvatar
                            conversation={conversation}
                            size="normal"
                          />

                          <div className="min-w-0 flex-1 font-text tracking-wider">
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate text-[13px] font-bold " >
                                {getConversationName(conversation)}
                              </span>

                              <span className="shrink-0 text-[10px] font-medium text-[#81766F]">
                                {formatRelativeTime(
                                  conversation.updatedAt ||
                                    conversation.createdAt
                                )}
                              </span>
                            </div>

                            <div className="mt-1 flex items-center justify-between gap-2">
                              <p className="min-w-0 truncate text-[11px] font-medium text-[#685D57]">
                                {/* {conversation.lastMessage || "No messages yet"} */}
                                {isSelected ? messages.length == 0 ? "No Messages yet" : messages.at(-1)?.message  : "No messages yet" }
                              </p>

                              <span
                                className={`h-2 w-2 shrink-0 rounded-full ${
                                  conversation.online
                                    ? "bg-[#EF2929]"
                                    : "bg-[#B7B1AE]"
                                }`}
                              />
                            </div>

                            <div className="mt-2">
                              {conversation.status == "open" ? 
                              <StatusBadge status="open" /> : 
                              <StatusBadge status="resolved" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* ============================================================ */}
            {/* Chat                                                           */}
            {/* ============================================================ */}

            <section
              className={`${
                selectedConversation ? "flex" : "hidden lg:flex"
              } min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-[#DED3C8] bg-[#FBF8F2]`}
            >
              {selectedConversation ? (
                <>
                  {/* ------------------------------------------------------ */}
                  {/* Chat header                                             */}
                  {/* ------------------------------------------------------ */}

                  <div className="flex min-h-[72px] shrink-0 items-center gap-3 border-b border-[#E1D7CD] px-3 sm:px-5">
                    <button
                      type="button"
                      onClick={handleBackToConversations}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D9CEC4] bg-[#FFFDF9] lg:hidden"
                      aria-label="Back to conversations"
                    >
                      <ChevronLeft size={19} />
                    </button>

                    <CustomerAvatar
                      conversation={selectedConversation}
                      size="large"
                    />

                    <div className="min-w-0 flex-1 font-text">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-base font-black sm:text-lg">
                          {getConversationName(selectedConversation)}
                        </h2>

                        {selectedConversation.status == "open" ? 
                              <StatusBadge status="open" /> : 
                              <StatusBadge status="resolved" />}
                      </div>

                      <div className="mt-1 flex min-w-0 items-center gap-2 text-xs text-[#81766F]">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            selectedConversation.online
                              ? "bg-[#EF2929]"
                              : "bg-[#B7B1AE]"
                          }`}
                        />

                        <span className="truncate">
                          {selectedConversation.online
                            ? "Online"
                            : getConversationEmail(
                                selectedConversation
                              )}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        className="hidden h-9 w-9 items-center justify-center rounded-full hover:bg-[#F1E9E2] sm:flex"
                      >
                        <MoreHorizontal size={19} />
                      </button>

                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F1E9E2]"
                      >
                        <Mail size={17} />
                      </button>
                    </div>
                  </div>

                  {/* ------------------------------------------------------ */}
                  {/* Order card                                               */}
                  {/* ------------------------------------------------------ */}

                  {/* <div className="shrink-0 px-3 pt-3 sm:px-5">
                    <div className="flex items-center gap-3 rounded-xl border border-[#DED3C8] bg-[#FFFDF9] p-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F4D6BD] text-2xl">
                        🍪
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold">
                          Order #SR10245
                        </p>

                        <p className="mt-1 text-[11px] text-[#746A64]">
                          ₹1,240{" "}
                          <span className="mx-1">•</span>{" "}
                          3 items
                        </p>
                      </div>

                      <button
                        type="button"
                        className="hidden shrink-0 rounded-xl bg-[#FFD21A] px-5 py-2.5 text-[11px] font-black sm:block"
                      >
                        View Order
                      </button>

                      <ChevronLeft
                        size={18}
                        className="rotate-180 text-[#321312] sm:hidden"
                      />
                    </div>
                  </div> */}

                  {/* ------------------------------------------------------ */}
                  {/* Messages                                                 */}
                  {/* ------------------------------------------------------ */}

                  <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-5">
                    <div className="mx-auto flex max-w-4xl flex-col gap-5">
                      {loadingMessages ? (
                        <div className="flex flex-1 items-center justify-center py-16">
                          <Loader2
                            size={26}
                            className="animate-spin text-[#8A7770]"
                          />
                        </div>
                      ) : selectedConversation.status =="closed" ? <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
                          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DF]">
                            <EyeClosed size={24} />
                          </div>

                          <p className="text-sm font-text font-bold">
                            Conversation is Resolved
                          </p>

                          <p className="mt-1 max-w-xs font-text text-xs text-[#8A7770]">
                            This conversation is already beeen resolved.
                          </p>
                        </div> : messages.length === 0 ? (
                        <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
                          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8DF]">
                            <MessageCircle size={24} />
                          </div>

                          <p className="text-sm font-text font-bold">
                            Start the conversation
                          </p>

                          <p className="mt-1 max-w-xs font-text text-xs text-[#8A7770]">
                            Send a message to help the customer with
                            their request.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 py-1">
                            <div className="h-px flex-1 bg-[#E8DED2]" />

                            <span className="text-[10px] font-text font-bold uppercase tracking-widest text-[#9A8E87]">
                              Conversation
                            </span>

                            <div className="h-px flex-1 bg-[#E8DED2]" />
                          </div>

                          {messages.map((item) => (
                            <AdminChatMessage
                              key={item._id}
                              message={item}
                            />
                          ))}

                          <AdminTypingIndicator
                            visible={customerTyping}
                          />

                          <div ref={messagesEndRef} />
                        </>
                      )}
                    </div>
                  </div>

                  {/* ------------------------------------------------------ */}
                  {/* Composer                                                 */}
                  {/* ------------------------------------------------------ */}

                  <div className="shrink-0 border-t border-[#E1D7CD] p-3 sm:p-4">
                    <div className="flex items-end gap-2 rounded-2xl border border-[#DED3C8] bg-[#FFFDF9] p-2">
                      <button
                      style={{cursor: selectedConversation.status=="closed" ? "not-allowed":"default"}}
                        type="button"
                        className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#675C56] hover:bg-[#F3ECE6]"
                      >
                        <Paperclip size={18} />
                      </button>

                      <textarea
                        value={message}
                        onChange={(event) =>
                          handleTyping(event.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        disabled={sending || selectedConversation.status=="closed"}
                        rows={1}
                        maxLength={5000}
                        style={{cursor: selectedConversation.status=="closed" ? "not-allowed":"text"}}
                        placeholder="Type your reply..."
                        className="max-h-28 min-h-[38px] flex-1 font-text resize-none bg-transparent px-2 py-2 text-[12px] font-medium text-[#321312] outline-none placeholder:text-[#A39A94]"
                      />

                      <button
                        type="button"
                        style={{cursor: selectedConversation.status=="closed" ? "not-allowed":"default"}}
                        className="mb-0.5 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#675C56] hover:bg-[#F3ECE6] sm:flex"
                      >
                        <Smile size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={sendMessage}
                        disabled={sending || !message.trim()}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFD21A] text-[#321312] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {sending ? (
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
                        ) : (
                          <Send size={17} fill="currentColor" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* ---------------------------------------------------------- */
                /* Empty chat state                                            */
                /* ---------------------------------------------------------- */

                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#F2E8DE]">
                    <MessageCircle
                      size={34}
                      strokeWidth={1.7}
                    />
                  </div>

                  <h2 className="text-xl font-text font-bold">
                    Select a conversation
                  </h2>

                  <p className="mt-2 max-w-sm text-sm font-text leading-6 text-[#81766F]">
                    Choose a customer from your support requests to
                    view the conversation and reply.
                  </p>
                </div>
              )}
            </section>

            {/* ============================================================ */}
            {/* Details                                                        */}
            {/* ============================================================ */}

            <aside className="hidden min-h-0 flex-col gap-3 overflow-y-auto xl:flex">
              {selectedConversation ? (
                <>
                  <div className="rounded-2xl border border-[#DED3C8] bg-[#FBF8F2] p-4 font-text tracking-wider">
                    <div className="mb-5 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F1E8DF]">
                        <UsersRound size={15} />
                      </div>

                      <h3 className="text-[12px] font-text font-bold uppercase">
                        Conversation Details
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-medium text-[#81766F]">
                          Customer Name
                        </p>

                        <p className="mt-1 text-[12px] font-bold">
                          {getConversationName(
                            selectedConversation
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-medium text-[#81766F]">
                          Email
                        </p>

                        <p className="mt-1 break-all text-[12px] font-bold">
                          {getConversationEmail(
                            selectedConversation
                          ) || "Not available"}
                        </p>
                      </div>

                      <div className="border-t border-[#E4D9CF] pt-4">
                        <p className="text-[10px] font-medium text-[#81766F]">
                          Phone
                        </p>

                        <p className="mt-1 text-[12px] font-bold">
                          Not available
                        </p>
                      </div>

                      <div className="border-t border-[#E4D9CF] pt-4">
                        <p className="text-[10px] font-medium text-[#81766F]">
                          Order Information
                        </p>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <span className="text-[12px] font-black">
                            None
                          </span>

                          <button
                            type="button"
                            className="rounded-xl bg-[#FFD21A] px-3 py-2 text-[10px] font-black"
                          >
                            View Order
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-[#E4D9CF] pt-4">
                        <p className="text-[10px] font-medium text-[#81766F]">
                          Last Message
                        </p>

                        <p className="mt-1 text-[12px] font-bold">
                          {formatRelativeTime(
                            selectedConversation.updatedAt ||
                              selectedConversation.createdAt
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="mb-2 text-[10px] font-medium text-[#81766F]">
                          Status
                        </p>

                        {selectedConversation.status == "open" ? 
                              <StatusBadge status="open" /> : 
                              <StatusBadge status="resolved" />}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}

                  <div className="rounded-2xl border border-[#DED3C8] bg-[#FBF8F2] p-4">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F1E8DF]">
                        <UsersRound size={15} />
                      </div>

                      <h3 className="text-[12px] font-text font-bold tracking-wider uppercase">
                        Actions
                      </h3>
                    </div>

                    <div className="space-y-2">
                      {selectedConversation.status == "open" && <button
                      onClick={()=>closeConversation()}
                        type="button"
                        className="flex w-full hover:bg-teal-300 transition duration-200 cursor-pointer items-center gap-3 rounded-xl border border-[#B7DFC1] bg-[#E4F4E6] px-3 py-2.5 text-left text-[11px] font-bold text-[#276C40]"
                      >
                        <Send size={15} />
                        Mark as Resolved
                      </button>}

                      {/* <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-xl border border-[#DED3C8] bg-[#FFFDF9] px-3 py-2.5 text-left text-[11px] font-bold"
                      >
                        <span className="flex items-center gap-3">
                          <Clock3 size={15} />
                          Change Status
                        </span>

                        <ChevronDown size={14} />
                      </button> */}

                      {/* <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-xl border border-[#DED3C8] bg-[#FFFDF9] px-3 py-2.5 text-left text-[11px] font-bold"
                      >
                        <span className="flex items-center gap-3">
                          <UserPlus size={15} />
                          Assign to
                        </span>

                        <ChevronDown size={14} />
                      </button> */}

                      <button
                        type="button"
                        className="flex hover:bg-red-400 hover:text-white transition duration-200 cursor-pointer w-full items-center gap-3 rounded-xl border border-[#F2BABA] bg-[#FFF3F3] px-3 py-2.5 text-left text-[11px] font-bold text-[#E33333]"
                      >
                        <Trash2 size={15} />
                        Delete Conversation
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-[#DED3C8] bg-[#FBF8F2] p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1E8DF]">
                    <UserRound size={18} />
                  </div>

                  <h3 className="mt-4 text-sm font-text font-bold">
                    Conversation Details
                  </h3>

                  <p className="mt-2 text-xs leading-5 font-text text-[#81766F]">
                    Select a support request to see customer and
                    order information.
                  </p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* Connection error                                                   */}
      {/* ------------------------------------------------------------------ */}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-md items-center gap-3 rounded-xl border border-[#E4B6B6] bg-[#FFF4F4] px-4 py-3 shadow-xl sm:left-auto sm:right-5"
          >
            <CircleAlert
              size={18}
              className="shrink-0 text-[#D52D2D]"
            />

            <p className="flex-1 text-xs font-semibold text-[#8F2929]">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-xs font-black text-[#8F2929]"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function getConversationName(conversation: Conversation) {
  return conversation.userId.name || conversation.name || "Customer";
}

function getConversationEmail(conversation: Conversation) {
  return conversation.userId.email || conversation.email || "";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatTime(date?: string) {
  if (!date) return "";

  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeTime(date?: string) {
  if (!date) return "";

  const diff = Date.now() - new Date(date).getTime();

  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);

  if (days === 1) return "1d ago";

  return `${days}d ago`;
}

/* -------------------------------------------------------------------------- */
/*                                  Avatar                                    */
/* -------------------------------------------------------------------------- */

function CustomerAvatar({
  conversation,
  size = "normal",
}: {
  conversation: Conversation;
  size?: "small" | "normal" | "large";
}) {
  const name = getConversationName(conversation);
  const avatar = conversation.avatar;

  const sizeClasses = {
    small: "h-10 w-10 text-sm",
    normal: "h-12 w-12 text-base",
    large: "h-14 w-14 text-lg",
  };

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F5CFC0] font-bold text-[#321312] ${sizeClasses[size]}`}
    >
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        getInitials(name)
      )}

      {conversation.online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#FFFDF9] bg-[#EF2929]" />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Status Badge                                  */
/* -------------------------------------------------------------------------- */

function StatusBadge({
  status = "open",
}: {
  status?: "open" | "waiting" | "resolved";
}) {
  if (status === "resolved") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D8F0DE] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#247A43]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#29965B]" />
        Resolved
      </span>
    );
  }

  if (status === "waiting") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCE9F8] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#31577E]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#7A8FA8]" />
        Waiting
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD21A] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#321312]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#EF2929]" />
      Open
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Chat Message                                  */
/* -------------------------------------------------------------------------- */

function AdminChatMessage({
  message,
}: {
  message: Message;
}) {
  const isSupport = message.senderType === "support";

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full ${
        isSupport ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[88%] items-end gap-2 sm:max-w-[75%]  font-text ${
          isSupport ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {!isSupport && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5CFC0] text-[11px] font-bold text-[#321312]">
            RS
          </div>
        )}

        <div
          className={`min-w-0 ${
            isSupport ? "items-end" : "items-start"
          } flex flex-col`}
        >
          <div
            className={`mb-1 flex items-center gap-2 px-1 ${
              isSupport ? "flex-row-reverse" : ""
            }`}
          >
            <span className="text-[11px] font-semibold text-[#321312]">
              {isSupport ? "You" : "User"}
            </span>

            <span className="text-[10px] text-[#8D817B]">
              {formatTime(message.createdAt)}
            </span>
          </div>

          <div
            className={`relative rounded-[15px] px-4 py-3 text-[13px] leading-6 ${
              isSupport
                ? "rounded-br-[5px] bg-[#FFD969] text-[#321312] shadow-[0_5px_14px_rgba(255,210,26,0.18)]"
                : "rounded-bl-[5px] border border-[#E8DED2] bg-[#F6EDE5] text-[#321312]"
            }`}
          >
            <p className="whitespace-pre-wrap break-words">
              {message.message}
            </p>
          </div>

          {isSupport && (
            <div className="mt-1 flex items-center gap-1 px-1 text-[#6F625C]">
              <CheckCheck size={13} strokeWidth={2.5} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           Typing Indicator                                 */
/* -------------------------------------------------------------------------- */

function AdminTypingIndicator({
  visible,
}: {
  visible: boolean;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="flex items-center gap-2"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5CFC0] text-[11px] font-bold">
            RS
          </div>

          <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-[#E8DED2] bg-[#F6EDE5] px-4 py-3">
            {[0, 1, 2].map((item) => (
              <motion.span
                key={item}
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 0.65,
                  repeat: Infinity,
                  delay: item * 0.12,
                }}
                className="h-1.5 w-1.5 rounded-full bg-[#8D817B]"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}