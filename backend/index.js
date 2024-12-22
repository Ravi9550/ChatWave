const express = require("express");
const chats = require("./dummy_data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
dotenv.config();
connectDB();

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// --------------------------deployment------------------------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}
// --------------------------deployment------------------------------

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:3000","https://chatwave-26t5.onrender.com"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // Join chat room
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
  });

  // Handle new message
  socket.on("newMessage", (message) => {
    const chatId = message.chatId;
    if (!chatId) {
      return;
    }

    socket.to(chatId).emit("messageReceived", message);
  });

  // Typing event
  socket.on("typing", (chatId) => {
    socket.to(chatId).emit("typing");
  });

  // Stop typing event
  socket.on("stopTyping", (chatId) => {
    socket.to(chatId).emit("stopTyping");
  });

  // Disconnect
  socket.on("disconnect", () => {});
});

server.listen(port, () => console.log(`Server is started on port ${port}`));
