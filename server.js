const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formateMessage = require("./utils/message");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatCord";

// runs when client connect
io.on("connection", socket => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    //welcomes current user
    socket.emit("message", formateMessage(botName, "Welcome to ChatCord!"));

    // BroadCast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formateMessage(botName, `${user.username} has joined the chat room`)
      ); // the broadcast will emit to every one exept for the user who emits
    // send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // to catch the chat message
  socket.on("chatMessage", msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formateMessage(user.username, msg));
  });

  // Runs when a client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
    }
    io.to(user.room).emit(
      "message",
      formateMessage(botName, `${user.username} has left the chat`)
    );

    // send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// https://youtu.be/jD7FnbI76Hg?t=2063
