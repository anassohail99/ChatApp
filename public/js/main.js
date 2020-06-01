const chatForm = document.getElementById("chat-form");
const chat = document.querySelector(".chat-messages");
const socket = io();

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outPutMessage(message);

  //scroll on message
  chat.scrollTop = chat.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  // Emit a message to server
  socket.emit("chatMessage", msg);

  //clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.value.focus();
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
