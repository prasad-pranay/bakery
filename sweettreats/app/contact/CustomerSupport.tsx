"use client";

import {
    useEffect,
    useRef,
    useState,
    type KeyboardEvent,
} from "react";

import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    ArrowRight,
    Check,
    ChevronLeft,
    Clock3,
    MessageCircle,
    Send,
    Sparkles,
    X,
} from "lucide-react";

import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "../store/authStore";

/* ========================================================================= */
/* TYPES                                                                     */
/* ========================================================================= */

type ChatMessage = {
    id: string;
    sender: "user" | "support";
    message: string;
    createdAt: string;
    senderName?: string;
};

type CustomerSupportProps = {
    open: boolean;
    onClose: () => void;

    user?: {
        id: string;
        name?: string;
        email?: string;
    };
};

/* ========================================================================= */
/* SOCKET                                                                    */
/* ========================================================================= */

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;

function normalizeMessage(message: any): ChatMessage {
    return {
        id: String(message._id ?? message.id),
        sender:
            message.senderType === "support"
                ? "support"
                : message.sender === "support"
                ? "support"
                : "user",
        message: message.message,
        createdAt: message.createdAt,
        senderName:
            message.senderName ??
            (message.senderType === "support"
                ? "Admin"
                : undefined),
    };
}

/* ========================================================================= */
/* COMPONENT                                                                 */
/* ========================================================================= */

export default function CustomerSupport({
    open,
    onClose,
}: CustomerSupportProps) {
    const {user} = useAuthStore()
    const prefersReducedMotion = useReducedMotion();

    const socketRef = useRef<Socket | null>(null);

    const messagesEndRef =
        useRef<HTMLDivElement | null>(null);

    const inputRef =
        useRef<HTMLTextAreaElement | null>(null);

    const [messages, setMessages] = useState<ChatMessage[]>(
        []
    );

    const [message, setMessage] = useState("");

    const [connected, setConnected] =
        useState(false);

    const [supportOnline, setSupportOnline] =
        useState(false);

    const [supportTyping, setSupportTyping] =
        useState(false);

    const [connecting, setConnecting] =
        useState(true);

    const [sending, setSending] =
        useState(false);

    /* ===================================================================== */
    /* SCROLL                                                                */
    /* ===================================================================== */

    function scrollToBottom(smooth = true) {
        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({
                behavior: smooth ? "smooth" : "auto",
                block: "end",
            });
        });
    }

    /* ===================================================================== */
    /* SOCKET CONNECTION                                                     */
    /* ===================================================================== */

useEffect(() => {
    const socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    setConnecting(true);

    socket.on("connect", () => {
        console.log("Support socket connected:", socket.id);

        setConnected(true);
        setConnecting(false);
    });

    socket.on("disconnect", (reason) => {
        console.log("Support socket disconnected:", reason);

        setConnected(false);
        setConnecting(false);
    });

    socket.on("connect_error", (error) => {
        console.error("Support socket error:", error);

        setConnected(false);
        setConnecting(false);
    });

    socket.on(
        "support:status",
        (data: {
            online?: boolean;
            closed?: boolean;
            message?: string;
        }) => {
            // console.log("Support status:", data);

            if (typeof data.online === "boolean") {
                setSupportOnline(data.online);
            }

            if (data.closed) {
                console.log("Conversation closed:", data.message);
            }
        }
    );

socket.on(
    "support:history",
    (history: any[]) => {
        // console.log("Support history:", history);

        const normalizedMessages = history.map(
            normalizeMessage
        );

        setMessages(normalizedMessages);

        requestAnimationFrame(() => {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({
                    behavior: "auto",
                    block: "end",
                });
            }, 50);
        });
    }
);

    socket.on(
    "support:message",
    (rawMessage: any) => {
        console.log(
            "NEW SUPPORT MESSAGE:",
            rawMessage
        );

        const newMessage =
            normalizeMessage(rawMessage);

        setMessages((previous) => {
            if (
                previous.some(
                    (item) =>
                        item.id === newMessage.id
                )
            ) {
                return previous;
            }

            return [
                ...previous,
                newMessage,
            ];
        });

        setSending(false);

        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }, 50);
    }
);

    socket.on(
        "support:typing",
        (data: {
            typing: boolean;
        }) => {
            console.log("Support typing:", data.typing);

            setSupportTyping(Boolean(data.typing));
        }
    );

    return () => {
        console.log("Destroying support socket");

        socket.off("connect");
        socket.off("disconnect");
        socket.off("connect_error");
        socket.off("support:status");
        socket.off("support:history");
        socket.off("support:message");
        socket.off("support:typing");

        socket.disconnect();

        socketRef.current = null;
    };
}, []);

    /* ===================================================================== */
    /* LOCK BODY SCROLL                                                      */
    /* ===================================================================== */

    useEffect(() => {
        if (!open) return;

        const previous =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow =
                previous;
        };
    }, [open]);

    /* ===================================================================== */
    /* AUTO SCROLL                                                           */
    /* ===================================================================== */

    useEffect(() => {
        if (messages.length === 0) return;

        scrollToBottom();
    }, [messages.length]);

    /* ===================================================================== */
    /* SEND MESSAGE                                                          */
    /* ===================================================================== */

    function sendMessage() {
        const trimmed = message.trim();

        if (!trimmed) return;

        if (!socketRef.current) return;

        if (!connected) return;

        setSending(true);

        socketRef.current.emit(
            "support:message",
            {
                message: trimmed,
            }
        );

        setMessage("");

        inputRef.current?.focus();
    }

    /* ===================================================================== */
    /* KEYBOARD                                                              */
    /* ===================================================================== */

    function handleKeyDown(
        event: KeyboardEvent<HTMLTextAreaElement>
    ) {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();

            sendMessage();
        }
    }

    /* ===================================================================== */
    /* TYPING                                                                */
    /* ===================================================================== */

    function handleTyping(
        value: string
    ) {
        setMessage(value);

        if (!socketRef.current) return;

        socketRef.current.emit(
            "support:typing",
            {
                typing:
                    value.trim().length > 0,
            }
        );
    }

    /* ===================================================================== */
    /* CLOSE                                                                 */
    /* ===================================================================== */

    function handleClose() {
        inputRef.current?.blur();

        onClose();
    }

    /* ===================================================================== */
    /* RENDER                                                                */
    /* ===================================================================== */

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                data-lenis-prevent
                    className="fixed inset-0 z-[9999] overflow-hidden sidebar-none overscroll-contain flex items-center justify-center p-3 sm:p-5 lg:p-8"
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                >
                    {/* ===================================================== */}
                    {/* BACKDROP                                               */}
                    {/* ===================================================== */}

                    <motion.button
                        type="button"
                        aria-label="Close customer support"
                        onClick={handleClose}
                        className="absolute inset-0 cursor-default bg-[#351A16]/50 backdrop-blur-md"
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                    />

                    {/* ===================================================== */}
                    {/* MODAL                                                  */}
                    {/* ===================================================== */}

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Customer support"
                        initial={
                            prefersReducedMotion
                                ? {
                                      opacity: 0,
                                  }
                                : {
                                      opacity: 0,
                                      y: 35,
                                      scale: 0.94,
                                  }
                        }
                        animate={
                            prefersReducedMotion
                                ? {
                                      opacity: 1,
                                  }
                                : {
                                      opacity: 1,
                                      y: 0,
                                      scale: 1,
                                  }
                        }
                        exit={
                            prefersReducedMotion
                                ? {
                                      opacity: 0,
                                  }
                                : {
                                      opacity: 0,
                                      y: 25,
                                      scale: 0.96,
                                  }
                        }
                        transition={{
                            duration: 0.45,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="relative flex h-[min(760px,calc(100dvh-24px))] w-full max-w-[1180px] overflow-hidden rounded-[30px] bg-[#FFF8EF] shadow-[0_35px_100px_rgba(53,26,22,0.3)] sm:h-[min(760px,calc(100dvh-40px))] sm:rounded-[38px]"
                    >
                        {/* ================================================= */}
                        {/* LEFT SIDE                                           */}
                        {/* ================================================= */}

                        <div className="relative hidden w-[39%] shrink-0 overflow-hidden bg-[#351A16] text-white lg:flex lg:flex-col">

                            {/* Decorations */}
                            <motion.div
                                animate={
                                    prefersReducedMotion
                                        ? undefined
                                        : {
                                              x: [
                                                  0,
                                                  15,
                                                  0,
                                              ],
                                              y: [
                                                  0,
                                                  -10,
                                                  0,
                                              ],
                                          }
                                }
                                transition={{
                                    duration: 7,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FFD91A]"
                            />

                            <motion.div
                                animate={
                                    prefersReducedMotion
                                        ? undefined
                                        : {
                                              x: [
                                                  0,
                                                  -10,
                                                  0,
                                              ],
                                              y: [
                                                  0,
                                                  12,
                                                  0,
                                              ],
                                          }
                                }
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[#FF7043] opacity-60"
                            />

                            <div className="relative z-10 flex h-full flex-col justify-between p-9 xl:p-12">

                                {/* Top */}
                                <div>
                                    <div className="flex items-center gap-3">
                                        <motion.div
                                            animate={
                                                prefersReducedMotion
                                                    ? undefined
                                                    : {
                                                          rotate: [
                                                              0,
                                                              -8,
                                                              8,
                                                              0,
                                                          ],
                                                      }
                                            }
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                repeatDelay: 2,
                                            }}
                                            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD91A] text-[#351A16]"
                                        >
                                            <MessageCircle
                                                size={21}
                                            />
                                        </motion.div>

                                        <span className="font-title text-[10px] uppercase tracking-[0.18em] text-[#FFD91A]">
                                            Customer support
                                        </span>
                                    </div>

                                    <h2 className="mt-10 font-title text-[clamp(4rem,6vw,6.5rem)] font-black uppercase leading-[0.75] tracking-[0.06em]">
                                        LET&apos;S
                                        <br />
                                        TALK
                                        <span className="text-[#FFD91A]">
                                            .
                                        </span>
                                    </h2>

                                    <p className="mt-8 max-w-sm font-text text-sm leading-6 text-white/55">
                                        Have a question
                                        about an order,
                                        delivery, product,
                                        or something
                                        special?
                                    </p>
                                </div>

                                {/* Bottom */}
                                <div>
                                    <div className="flex items-center gap-3 rounded-[20px] border border-white/10 bg-white/5 p-4">
                                        <span className="relative flex h-3 w-3">
                                            <span
                                                className={`absolute inline-flex h-full w-full rounded-full ${
                                                    supportOnline
                                                        ? "animate-ping bg-[#69B77A]"
                                                        : "bg-white/20"
                                                }`}
                                            />

                                            <span
                                                className={`relative h-3 w-3 rounded-full ${
                                                    supportOnline
                                                        ? "bg-[#69B77A]"
                                                        : "bg-white/30"
                                                }`}
                                            />
                                        </span>

                                        <div>
                                            <p className="font-title text-[9px] uppercase">
                                                {supportOnline
                                                    ? "Support is online"
                                                    : "Support is away"}
                                            </p>

                                            <p className="mt-1 font-text text-[10px] text-white/40">
                                                {supportOnline
                                                    ? "Usually replies in a few minutes"
                                                    : "We'll get back to you soon"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <SidePill>
                                            Orders
                                        </SidePill>

                                        <SidePill>
                                            Delivery
                                        </SidePill>

                                        <SidePill>
                                            Products
                                        </SidePill>

                                        <SidePill>
                                            Custom
                                        </SidePill>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ================================================= */}
                        {/* RIGHT CHAT                                           */}
                        {/* ================================================= */}

                        <div className="flex min-w-0 flex-1 flex-col">

                            {/* ================================================= */}
                            {/* CHAT HEADER                                        */}
                            {/* ================================================= */}

                            <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#351A16]/8 bg-[#FFF8EF] px-4 sm:px-6">

                                <div className="flex min-w-0 items-center gap-3">

                                    {/* Mobile back */}
                                    <button
                                        type="button"
                                        onClick={
                                            handleClose
                                        }
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F0E5DA] lg:hidden"
                                        aria-label="Close support"
                                    >
                                        <ChevronLeft
                                            size={17}
                                        />
                                    </button>

                                    {/* Avatar */}
                                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFD91A] text-xl">
                                        🍪

                                        <span
                                            className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#FFF8EF] ${
                                                supportOnline
                                                    ? "bg-[#69B77A]"
                                                    : "bg-[#C6BDB4]"
                                            }`}
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate font-title text-sm uppercase">
                                            SWEETREATS SUPPORT
                                        </p>

                                        <div className="mt-0.5 flex items-center gap-1.5">
                                            <span
                                                className={`font-text text-[10px] ${
                                                    supportOnline
                                                        ? "text-[#34824F]"
                                                        : "text-[#351A16]/40"
                                                }`}
                                            >
                                                {connecting
                                                    ? "Connecting..."
                                                    : supportOnline
                                                      ? "Online"
                                                      : "Away"}
                                            </span>

                                            {connected && (
                                                <span className="text-[#351A16]/20">
                                                    •
                                                </span>
                                            )}

                                            {connected && (
                                                <span className="font-text text-[10px] text-[#351A16]/35">
                                                    Live chat
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Close */}
                                <button
                                    type="button"
                                    onClick={
                                        handleClose
                                    }
                                    className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#F0E5DA] transition-transform hover:rotate-6 lg:flex"
                                    aria-label="Close"
                                >
                                    <X size={17} />
                                </button>
                            </div>

                            {/* ================================================= */}
                            {/* CHAT BODY                                          */}
                            {/* ================================================= */}

                            <div className="relative min-h-0 flex-1 bg-[#F8F0E7]">

                                {/* Top decorative line */}
                                <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-8 bg-gradient-to-b from-[#F8F0E7] to-transparent" />

                                {/* Messages */}
                                <div className="h-full overflow-y-auto px-4 pb-5 pt-8 sm:px-6">

                                    {/* Intro */}
                                    {messages.length ===
                                        0 && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                y: 10,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            className="flex min-h-full flex-col items-center justify-center pb-16 text-center"
                                        >
                                            <motion.div
                                                animate={
                                                    prefersReducedMotion
                                                        ? undefined
                                                        : {
                                                              y: [
                                                                  0,
                                                                  -7,
                                                                  0,
                                                              ],
                                                              rotate: [
                                                                  -2,
                                                                  2,
                                                                  -2,
                                                              ],
                                                          }
                                                }
                                                transition={{
                                                    duration: 4,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                }}
                                                className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FFD91A] text-4xl shadow-[0_12px_30px_rgba(53,26,22,0.08)]"
                                            >
                                                🍪
                                            </motion.div>

                                            <h3 className="mt-6 font-title text-xl uppercase">
                                                Hey there!
                                            </h3>

                                            <p className="mt-2 max-w-xs font-text text-xs leading-5 text-[#351A16]/45">
                                                Welcome to
                                                SWEETREATS
                                                support. What
                                                can we help
                                                you with?
                                            </p>

                                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                                {[
                                                    "Order help",
                                                    "Delivery",
                                                    "Products",
                                                ].map(
                                                    (
                                                        topic
                                                    ) => (
                                                        <button
                                                            key={
                                                                topic
                                                            }
                                                            type="button"
                                                            onClick={() => {
                                                                setMessage(
                                                                    `Hi! I need help with ${topic.toLowerCase()}.`
                                                                );

                                                                inputRef.current?.focus();
                                                            }}
                                                            className="rounded-full border border-[#351A16]/10 bg-white px-3 py-2 font-title text-[9px] uppercase transition-all hover:-translate-y-0.5 hover:border-[#351A16]/20 hover:bg-[#FFD91A]"
                                                        >
                                                            {
                                                                topic
                                                            }
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Messages */}
                                    <div className="space-y-3">
                                        {messages.map(
                                            (
                                                item
                                            ) => (
                                                <ChatBubble
                                                    key={
                                                        item.id
                                                    }
                                                    message={
                                                        item
                                                    }
                                                    reducedMotion={Boolean(
                                                        prefersReducedMotion
                                                    )}
                                                />
                                            )
                                        )}
                                    </div>

                                    {/* Typing */}
                                    <AnimatePresence>
                                        {supportTyping && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    y: 8,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: 5,
                                                }}
                                                className="mt-4 flex items-end gap-2"
                                            >
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFD91A] text-sm">
                                                    🍪
                                                </div>

                                                <div className="rounded-[18px] rounded-bl-[5px] bg-white px-4 py-3 shadow-sm">
                                                    <div className="flex gap-1">
                                                        <TypingDot
                                                            delay={
                                                                0
                                                            }
                                                        />

                                                        <TypingDot
                                                            delay={
                                                                0.15
                                                            }
                                                        />

                                                        <TypingDot
                                                            delay={
                                                                0.3
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div
                                        ref={
                                            messagesEndRef
                                        }
                                    />
                                </div>
                            </div>

                            {/* ================================================= */}
                            {/* CHAT INPUT                                         */}
                            {/* ================================================= */}

                            <div className="shrink-0 border-t border-[#351A16]/8 bg-[#FFF8EF] p-3 sm:p-4">

                                {!connected && (
                                    <div className="mb-3 flex items-center gap-2 rounded-[14px] bg-[#FDE4DC] px-3 py-2.5 font-text text-[10px] text-[#8B3825]">
                                        <Clock3
                                            size={13}
                                        />

                                        {connecting
                                            ? "Connecting to support..."
                                            : "Connection lost. Trying to reconnect..."}
                                    </div>
                                )}

                                <div className="flex items-end gap-2 rounded-[22px] border-2 border-[#E7DCD1] bg-white p-2 transition-all focus-within:border-[#351A16] focus-within:ring-4 focus-within:ring-[#FFD91A]/20">

                                    <textarea
                                        ref={
                                            inputRef
                                        }
                                        value={
                                            message
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            handleTyping(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        onKeyDown={
                                            handleKeyDown
                                        }
                                        disabled={
                                            !connected ||
                                            sending
                                        }
                                        rows={1}
                                        placeholder={
                                            connected
                                                ? "Type a message..."
                                                : "Waiting for connection..."
                                        }
                                        className="max-h-28 min-h-[42px] flex-1 resize-none bg-transparent px-3 py-2.5 font-text text-sm leading-5 outline-none placeholder:text-[#351A16]/30 disabled:cursor-not-allowed disabled:opacity-50"
                                    />

                                    <motion.button
                                        type="button"
                                        onClick={
                                            sendMessage
                                        }
                                        disabled={
                                            !connected ||
                                            !message.trim() ||
                                            sending
                                        }
                                        whileHover={
                                            prefersReducedMotion
                                                ? undefined
                                                : {
                                                      scale: 1.05,
                                                  }
                                        }
                                        whileTap={{
                                            scale: 0.92,
                                        }}
                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFD91A] text-[#351A16] transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
                                        aria-label="Send message"
                                    >
                                        {sending ? (
                                            <motion.span
                                                animate={{
                                                    rotate: 360,
                                                }}
                                                transition={{
                                                    duration:
                                                        0.8,
                                                    repeat:
                                                        Infinity,
                                                    ease: "linear",
                                                }}
                                                className="h-4 w-4 rounded-full border-2 border-[#351A16]/20 border-t-[#351A16]"
                                            />
                                        ) : (
                                            <Send
                                                size={16}
                                            />
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ========================================================================= */
/* CHAT BUBBLE                                                               */
/* ========================================================================= */

function ChatBubble({
    message,
    reducedMotion,
}: {
    message: ChatMessage;
    reducedMotion: boolean;
}) {
    const isUser = message.sender === "user";

    const date = new Date(
        message.createdAt
    );

    const time = date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });

    return (
        <motion.div
            initial={
                reducedMotion
                    ? {
                          opacity: 0,
                      }
                    : {
                          opacity: 0,
                          y: 10,
                          scale: 0.97,
                      }
            }
            animate={{
                opacity: 1,
                y: 0,
                scale: 1,
            }}
            transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
            }}
            className={`flex items-end gap-2 ${
                isUser
                    ? "justify-end"
                    : "justify-start"
            }`}
        >
            {/* ADMIN AVATAR */}
            {!isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFD91A] text-sm">
                    🍪
                </div>
            )}

            <div
                className={`max-w-[78%] ${
                    isUser
                        ? "items-end"
                        : "items-start"
                }`}
            >
                {/* SENDER NAME */}
                <p
                    className={`mb-1 px-2 font-title text-[8px] uppercase ${
                        isUser
                            ? "text-right text-[#351A16]/35"
                            : "text-left text-[#351A16]/35"
                    }`}
                >
                    {isUser
                        ? "You"
                        : message.senderName ||
                          "Admin"}
                </p>

                {/* MESSAGE */}
                <div
                    className={`rounded-[19px] px-4 py-3 ${
                        isUser
                            ? "rounded-br-[5px] bg-[#351A16] text-white"
                            : "rounded-bl-[5px] bg-white text-[#351A16] shadow-[0_4px_15px_rgba(53,26,22,0.04)]"
                    }`}
                >
                    <p className="whitespace-pre-wrap break-words font-text text-sm leading-5">
                        {message.message}
                    </p>
                </div>

                {/* TIME */}
                <div
                    className={`mt-1 flex items-center gap-1 px-2 ${
                        isUser
                            ? "justify-end"
                            : "justify-start"
                    }`}
                >
                    <span
                        className={`font-text text-[8px] ${
                            isUser
                                ? "text-[#351A16]/30"
                                : "text-[#351A16]/25"
                        }`}
                    >
                        {time}
                    </span>

                    {isUser && (
                        <Check
                            size={10}
                            className="text-[#351A16]/30"
                        />
                    )}
                </div>
            </div>
        </motion.div>
    );
}

/* ========================================================================= */
/* TYPING DOT                                                               */
/* ========================================================================= */

function TypingDot({
    delay,
}: {
    delay: number;
}) {
    return (
        <motion.span
            animate={{
                y: [0, -3, 0],
                opacity: [0.35, 1, 0.35],
            }}
            transition={{
                duration: 0.8,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className="h-1.5 w-1.5 rounded-full bg-[#351A16]/40"
        />
    );
}

/* ========================================================================= */
/* SIDE PILL                                                                 */
/* ========================================================================= */

function SidePill({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <span className="rounded-full bg-white/10 px-3 py-2 font-title text-[9px] uppercase text-white/65">
            {children}
        </span>
    );
}