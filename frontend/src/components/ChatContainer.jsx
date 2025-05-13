import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
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
                  className="ml-2 text-xs text-red-500 hover:underline"
                  onClick={() => deleteMessage(message._id)}
                  aria-label="Delete message"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="chat-bubble flex flex-col p-2 relative max-w-[80vw] sm:max-w-md">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.audio && (
                <div className="flex items-center gap-2 py-1 px-2 rounded-full w-fit min-w-[90px] max-w-[220px]">
                  <audio
                    src={`data:audio/webm;base64,${message.audio}`}
                    controls
                    className="w-full min-w-[60px] max-w-[140px] h-8 bg-transparent border-none outline-none"
                    style={{ boxShadow: 'none', background: 'none' }}
                  />
                  <button className="focus:outline-none ml-1" tabIndex="-1" aria-label="Play voice message" onClick={e => {
                    const audio = e.currentTarget.previousSibling;
                    if (audio.paused) audio.play(); else audio.pause();
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-blue-600 dark:text-blue-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.25v13.5m13.5-13.5v13.5M12 8.25v7.5" />
                    </svg>
                  </button>
                </div>
              )}
              {message.text && <p className="break-words text-base leading-relaxed">{message.text}</p>}
              {/* Seen indicator under the message bubble */}
              {message.senderId === authUser._id && message.seen && (
                <span className="text-xs text-blue-500 mt-1 self-end absolute left-1/2 -bottom-5 -translate-x-1/2 whitespace-nowrap">Seen</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
