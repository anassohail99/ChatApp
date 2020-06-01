const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formateMessage = require("./utils/message");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatCord";

// runs when client connect
io.on("connection", (socket) => {
  //welcomes current user
  socket.emit("message", formateMessage(botName, "Welcome to ChatCord!"));

  // BroadCast when a user connects
  socket.broadcast.emit("message", "A user has joined the chat"); // the broadcast will emit to every one exept for the user who emits

  // Runs when a client disconnects
  socket.on("disconnect", () => {
    socket.broadcast.emit(
      "message",
      formateMessage(botName, "User has left the chat")
    );
  });

  // to catch the chat message
  socket.on("chatMessage", (msg) => {
    io.emit("message", formateMessage("USER", msg));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// https://youtu.be/jD7FnbI76Hg?t=2063
