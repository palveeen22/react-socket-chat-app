const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
const port = 3001;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    //spesifikasikan ke url mana (client) kita akan tuju atau gunakan
    origin: "http://localhost:3000",
    // menspesifikasikan method yang akan kita gunakan
    methods: ["GET", "POST"],
  },
});

//listen to events, menspesifikasikan apa yang kita dengan atau kita koneksikan
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  //mengatur join room dari fe
  // dan join_room ini yang di panggil nanti di fe
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`server running on port ${port}`);
});
