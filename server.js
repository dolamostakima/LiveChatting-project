const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const multer = require("multer");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



app.post("/upload", upload.single("file"), (req, res) => {
  const fileUrl = `/uploads/${req.file.filename}`;
  const uploader = req.headers.username || "Unknown User";
  io.emit("file-uploaded", {
    name: uploader,
    fileName: req.file.originalname,
    fileUrl,
  });
  res.sendStatus(200);
});


io.on("connection", (socket) => {
  let userName = "";

  socket.on("set username", (name) => {
    userName = name;
    socket.broadcast.emit("system message", `👤 ${userName} joined the chat`);
  });

  socket.on("chat message", (data) => {
    io.emit("chat message", {
      name: data.name,
      text: data.text,
    });
  });

  socket.on("disconnect", () => {
    if (userName) {
      io.emit("system message", `👤 ${userName} left the chat`);
    }
  });
});

server.listen(5000, () => {
  console.log("Server running at http://192.168.31.210:5000");
});
