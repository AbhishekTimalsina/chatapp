export default function ChatArea({ messages, username }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, i) => {
        if (message.type == "join") {
          return <WelcomeMessage key={i} username={message.username} />;
        }

        if (message.type == "left") {
          return <LeaveMessage key={i} username={message.username} />;
        }
        return (
          <div
            key={i}
            className={`flex ${
              message.username === username ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.username === username
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.username !== username && (
                <div className="text-xs text-gray-600 mb-1">
                  {message.username}
                </div>
              )}
              <p>{message.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WelcomeMessage({ username }) {
  return (
    <div className="flex justify-center ">
      <p className="text-center bg-gray-200 w-fit p-1 px-10 rounded-md">
        {username} joined the room.
      </p>
    </div>
  );
}

function LeaveMessage({ username }) {
  return (
    <div className="flex justify-center ">
      <p className="text-center bg-gray-200 w-fit p-1 px-10 rounded-md">
        {username} left the room.
      </p>
    </div>
  );
}
