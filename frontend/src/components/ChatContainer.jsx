import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime, formatSeenTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage,
    markAsSeen,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    // Mark all messages as seen when opening chat
    if (selectedUser && messages.length > 0) {
      markAsSeen(selectedUser._id);
    }
  }, [selectedUser._id, messages.length, markAsSeen]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Utility to format seconds as mm:ss
  function formatDuration(current, total) {
    const t = isNaN(total) ? 0 : total;
    const c = isNaN(current) ? 0 : current;
    const s = Math.floor(t - c);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
            style={{ fontFamily: 'Ubuntu, system-ui, sans-serif' }}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1 flex items-center justify-between">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
              {message.senderId === authUser._id && (
                <button
                  className="ml-2 text-xs text-error font-semibold hover:underline hover:bg-error/10 px-2 py-0.5 rounded-full transition-colors font-sans"
                  onClick={() => deleteMessage(message._id)}
                  aria-label="Delete message"
                  style={{ fontFamily: 'Ubuntu, system-ui, sans-serif', fontWeight: 500 }}
                >
                  Delete
                </button>
              )}
            </div>
            <div className="chat-bubble flex flex-col p-2 relative max-w-[80vw] sm:max-w-md bg-base-100 text-base-content shadow-md border border-primary/20" style={{ fontWeight: 500 }}>
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.audio && (
                <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-primary text-primary-content shadow-md w-fit min-w-[120px] max-w-[320px]">
                  <button
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-base-100 hover:bg-base-200 focus:outline-none transition-colors shadow"
                    tabIndex="-1"
                    aria-label="Play voice message"
                    onClick={e => {
                      const audio = e.currentTarget.nextSibling;
                      if (audio.paused) audio.play(); else audio.pause();
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-primary">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  {/* Static waveform SVG for visual effect */}
                  <svg height="32" width="80" className="mx-2">
                    <rect x="2" y="10" width="4" height="12" rx="2" fill="currentColor"/>
                    <rect x="10" y="6" width="4" height="20" rx="2" fill="currentColor"/>
                    <rect x="18" y="12" width="4" height="8" rx="2" fill="currentColor"/>
                    <rect x="26" y="8" width="4" height="16" rx="2" fill="currentColor"/>
                    <rect x="34" y="14" width="4" height="6" rx="2" fill="currentColor"/>
                    <rect x="42" y="7" width="4" height="18" rx="2" fill="currentColor"/>
                    <rect x="50" y="12" width="4" height="8" rx="2" fill="currentColor"/>
                    <rect x="58" y="9" width="4" height="14" rx="2" fill="currentColor"/>
                    <rect x="66" y="11" width="4" height="10" rx="2" fill="currentColor"/>
                    <rect x="74" y="8" width="4" height="16" rx="2" fill="currentColor"/>
                  </svg>
                  <audio
                    src={`data:audio/webm;base64,${message.audio}`}
                    className="hidden"
                    onTimeUpdate={e => {
                      const durationSpan = e.currentTarget.nextSibling;
                      if (durationSpan) durationSpan.textContent = formatDuration(e.currentTarget.currentTime, e.currentTarget.duration);
                    }}
                  />
                  <span className="text-xs font-semibold min-w-[36px] text-right select-none">
                    0:27
                  </span>
                </div>
              )}
              {message.text && <p className="break-words text-base leading-relaxed font-medium text-base-content" style={{ fontWeight: 500 }}>{message.text}</p>}
            </div>
            {/* Seen indicator under the message bubble, Instagram style */}
            {message.senderId === authUser._id && message.seen && (
              <div className="flex justify-end mt-1">
                <span className="text-xs text-primary font-semibold italic bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1" style={{ fontFamily: 'Ubuntu, system-ui, sans-serif', fontWeight: 500 }}>
                  Seen
                  {message.seenAt && (
                    <span className="ml-1 text-[10px] text-primary/70 font-normal not-italic">
                      {formatSeenTime(message.seenAt)}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
