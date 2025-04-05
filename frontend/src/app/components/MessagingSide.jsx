"use client";

import ChatArea from "./chat-area";
import MessageInput from "./message-input";

export default function MessagingSide({
  messages,
  setMessages,
  socket,
  username,
}) {
  const handleSendMessage = (text) => {
    if (!text.trim()) return;
    socket.emit("msg", text);

    const newMessage = {
      id: Date.now().toString(),
      text,
      username: username,
    };

    setMessages((prevMessage) => [...prevMessage, newMessage]);
  };
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <ChatArea messages={messages} username={username} />
      <MessageInput onSendMessage={handleSendMessage} username={username} />
    </div>
  );
}
