const socket = io();
const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const msgInput = document.getElementById("msg");
const uploadForm = document.getElementById("upload-form");
const fileInput = document.getElementById("fileInput");

// Send Chat Message
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (msgInput.value) {
    socket.emit("chat message", msgInput.value);
    msgInput.value = "";
  }
});

// Receive Chat Message
socket.on("chat message", (msg) => {
  const item = document.createElement("div");
  item.textContent = msg;
  chatBox.appendChild(item);
});

// File Upload Handler
uploadForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  fetch("/upload", {
    method: "POST",
    body: formData,
  }).then((res) => {
    fileInput.value = "";
  });
});

// Receive Uploaded File Info
socket.on("file-uploaded", (data) => {
  const link = document.createElement("a");
  link.href = data.fileUrl;
  link.textContent = `📎 ${data.fileName}`;
  link.target = "_blank";
  chatBox.appendChild(link);
});
