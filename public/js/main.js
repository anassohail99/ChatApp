const chatForm = document.getElementById("chat-form");
const chat = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// get userName and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

// console.log(username, room);

const socket = io();

// joined chatRoom
socket.emit("joinRoom", { username, room });

//get room Users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputRoomUsers(users);
});

// Message from server
socket.on("message", message => {
  console.log(message);
  outPutMessage(message);

  //scroll on message
  chat.scrollTop = chat.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", e => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  // Emit a message to server
  socket.emit("chatMessage", msg);

  //clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// output message to dom
function outPutMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.userName} <span>${message.time}</span></p>
  <p class="text">
   ${message.text}
  </p>
  `;
  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to dom
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to dom
function outputRoomUsers(users) {
  userList.innerHTML = `
    ${users
      .map(
        user => `<li>
      ${user.username}
    </li>`
      )
      .join("")}
  `;
}
