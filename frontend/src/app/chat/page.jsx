"use client";

import { redirect, useSearchParams } from "next/navigation";
import MessagingSide from "../components/MessagingSide";
import RoomSidebar from "../components/room-sidebar";
import { io } from "socket.io-client";

import { useEffect, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [socket, setSocket] = useState("");
  const searchParams = useSearchParams();
  let roomId = searchParams.get("roomId");
  let username = searchParams.get("username");
  if (!roomId || !username) redirect("/");

  useEffect(() => {
    let newSocket = io(process.env.NEXT_PUBLIC_WEB_URI);
    setSocket(newSocket);

    // newSocket.on("connection");

    newSocket.on("roomUsers", (users) => {
      setAllUsers(users);
    });

    newSocket.on("user-exists", (msg) => {
      window.alert(msg);
      redirect("/");
    });
    newSocket.emit("join-room", { username, room: roomId });

    newSocket.on("msg", (msg) => {
      // let newMessage = {};

      // newMessage = msg;

      setMessages((prevMessage) => [...prevMessage, msg]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <RoomSidebar roomId={roomId} allUsers={allUsers} username={username} />
      <MessagingSide
        roomId={roomId}
        username={username}
        messages={messages}
        setMessages={setMessages}
        socket={socket}
      />
    </div>
  );
}

// "use client";

// import { useState } from "react";

// export default function HomeScreen() {
//   const [username, setUsername] = useState("");
//   const [roomId, setRoomId] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!username.trim()) {
//       setError("Username is required");
//       return;
//     }

//     if (!roomId.trim()) {
//       setError("Room ID is required");
//       return;
//     }

//     // onJoinRoom(username, roomId);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h1 className="text-2xl font-bold mb-6 text-center">Join Chat Room</h1>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label
//               htmlFor="username"
//               className="block text-gray-700 text-sm font-bold mb-2"
//             >
//               Username
//             </label>
//             <input
//               type="text"
//               id="username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter your username"
//             />
//           </div>

//           <div className="mb-6">
//             <label
//               htmlFor="roomId"
//               className="block text-gray-700 text-sm font-bold mb-2"
//             >
//               Room ID
//             </label>
//             <input
//               type="text"
//               id="roomId"
//               value={roomId}
//               onChange={(e) => setRoomId(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter room ID"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           >
//             Join Room
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
