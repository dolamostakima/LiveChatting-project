const socket = io();
let myName = ""

const loginDiv = document.getElementById("login");
const chatDiv = document.getElementById("chat-container");
const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const msgInput = document.getElementById("msg");
const uploadForm = document.getElementById("upload-form");
const fileInput = document.getElementById("fileInput");

function setUsername(){
	const input = document.getElementById("username");
	myName = input.value.trim();
  if (myName) {
    loginDiv.style.display = "none";
    chatDiv.style.display = "block";
    socket.emit("set username", myName);
  }
}


chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (msgInput.value && myName) {
    socket.emit("chat message", {
      name: myName,
      text: msgInput.value
    });
    msgInput.value = "";
  }
});



socket.on("chat message", (msg) => {
  const item = document.createElement("div");
  const isMe = msg.name === myName;
  item.className = isMe ? "message me" : "message other";

  item.innerHTML = `
    <div class="sender-name">${msg.name}</div>
    <div class="message-text">${msg.text}</div>
  `;

  chatBox.appendChild(item);
  chatBox.scrollTop = chatBox.scrollHeight;
});


socket.on("system message", (msg) => {
  const item = document.createElement("div");
  item.style.fontStyle = "italic";
  item.textContent = msg;
  chatBox.appendChild(item);
  chatBox.scrollTop = chatBox.scrollHeight;
});


uploadForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  fetch("/upload", {
    method: "POST",
    headers: {
      username: myName
    },
    body: formData
  });

  fileInput.value = "";
});


socket.on("file-uploaded", (data) => {
  const isMe = data.sender === myName;

  const fileDiv = document.createElement("div");
  fileDiv.className = `message ${isMe ? "me" : "other"}`;

  fileDiv.innerHTML = `
    <div class="sender-name">${data.sender}</div>
    <div class="file-bubble">
     <a href="${data.fileUrl}" target="_blank">${data.fileName}</a>
    </div>
  `;

  chatBox.appendChild(fileDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
});


