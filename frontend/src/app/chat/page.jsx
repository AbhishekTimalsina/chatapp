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
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  let roomId = searchParams.get("roomId");
  let username = searchParams.get("username");
  if (!roomId || !username) redirect("/");

  useEffect(() => {
    let newSocket = io(process.env.NEXT_PUBLIC_WEB_URI);
    setSocket(newSocket);

    console.log("looking down");
    newSocket.on("connect", (msg) => {
      setLoading(false);
    });

    newSocket.on("roomUsers", (users) => {
      setAllUsers(users);
    });

    newSocket.on("user-exists", (msg) => {
      window.alert(msg);
      redirect("/");
    });
    newSocket.emit("join-room", { username, room: roomId });

    newSocket.on("msg", (msg) => {
      setMessages((prevMessage) => [...prevMessage, msg]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <RoomSidebar roomId={roomId} allUsers={allUsers} username={username} />

      {!loading ? (
        <MessagingSide
          roomId={roomId}
          username={username}
          messages={messages}
          setMessages={setMessages}
          socket={socket}
        />
      ) : (
        <Loading />
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="text-center w-full mt-10">
      <h2 className="text-3xl">Loading</h2>
      <p className="text-lg"> Connection may take some time...</p>
    </div>
  );
}
