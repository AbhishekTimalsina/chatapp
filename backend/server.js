const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
require("dotenv").config();

const io = new Server(server, {
  // <--- Add options object here
  cors: {
    origin: "*", // Allow all origins (for development)
    // For production, replace "*" with your specific client URL like "http://your-client-domain.com"
    // origin: "http://localhost:3000", // Example if your React app runs on 3000
    methods: ["GET", "POST"], // Allowed HTTP methods
  },
});

console.log(process.env.WEB_URI);

const PORT = 4000;
let a = null;
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("<h1>Listening to websocket</h1>");
});

const roomUsers = {};

io.on("connection", (socket) => {
  let currentRoom = null;
  let username = "";

  socket.on("disconnect", () => {
    if (currentRoom) {
      roomUsers[currentRoom] =
        roomUsers[currentRoom]?.filter((el) => el.id != socket.id) || [];
    }

    io.to(currentRoom).emit("roomUsers", roomUsers[currentRoom]);
    socket
      .to(currentRoom)
      .emit("msg", { username: username, type: "left", id: socket.id });
  });

  socket.on("msg", (msg) => {
    if (currentRoom) {
      socket.to(currentRoom).emit("msg", {
        text: msg,
        type: "text",
        username: username,
      });
    } else {
      socket.broadcast.emit("msg", {
        type: "text",
        text: msg,
        username: username,
      });
    }
  });

  socket.on("join-room", (msg) => {
    socket.leave(currentRoom);
    if (!roomUsers[msg.room]) {
      roomUsers[msg.room] = [];
    }

    if (roomUsers[msg.room].some((e) => e.username == msg.username)) {
      io.to(socket.id).emit("user-exists", "User already exists");
      return;
    }

    roomUsers[msg.room].push({ id: socket.id, username: msg.username });
    socket.join(msg.room);

    io.to(msg.room).emit("msg", {
      type: "join",
      username: msg.username,
      id: socket.id,
    });

    io.to(msg.room).emit("roomUsers", roomUsers[msg.room]);

    username = msg.username;
    currentRoom = msg.room;
  });
});

server.listen(PORT, () => {
  console.log(`listening in http://localhost:${PORT}`);
});
