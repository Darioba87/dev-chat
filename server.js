import express from "express";
import http from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import cookie from "cookie";

const prisma = new PrismaClient();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const extractUserIdFromCookie = (cookieHeader) => {
  if (!cookieHeader) return null;

  const cookies = cookie.parse(cookieHeader);
  const authToken = cookies.authToken;

  if (!authToken || !authToken.startsWith("token-")) return null;

  const tokenWithoutPrefix = authToken.slice(6); // Remueve "token-"
  const lastHyphenIndex = tokenWithoutPrefix.lastIndexOf("-"); // Encuentra el último guion
  if (lastHyphenIndex === -1) return null;

  const userId = tokenWithoutPrefix.slice(0, lastHyphenIndex);
  return userId;
};

io.on("connection", async (socket) => {
  const cookieHeader = socket.handshake.headers.cookie;

  const userId = extractUserIdFromCookie(cookieHeader);
  console.log("Extracted userId:", userId);

  if (!userId) {
    console.log("Connection rejected: invalid token");
    socket.emit("error", "Invalid authentication token.");
    return socket.disconnect();
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      console.log("Connection refused: user not found");
      socket.emit("error", "User not found.");
      return socket.disconnect();
    }

    console.log(`user with: ${user.nickname} (ID: ${userId})`);

    socket.on("message", (data) => {
      const messagePayload = {
        ...data,
        nickname: user.nickname,
        time: new Date().toISOString(),
      };

      console.log(`Message received from ${user.nickname}:`, messagePayload);

      socket.broadcast.emit("message", messagePayload);
    });

    socket.on("disconnect", () => {
      console.log(`User disconected: ${user.nickname} (ID: ${userId})`);
    });
  } catch (error) {
    console.error("Error during connection:", error);
    socket.emit("error", "An internal error occurred.");
    socket.disconnect();
  }
});

server.listen(4000, () => {
  console.log("Socket.io server running on port 4000");
});
