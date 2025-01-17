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
    origin: env("SOCKET_URL"),
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
    console.log("Conexión rechazada: token inválido");
    socket.emit("error", "Invalid authentication token.");
    return socket.disconnect();
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      console.log("Conexión rechazada: usuario no encontrado");
      socket.emit("error", "User not found.");
      return socket.disconnect();
    }

    console.log(`Usuario conectado: ${user.nickname} (ID: ${userId})`);

    socket.on("message", (data) => {
      const messagePayload = {
        ...data,
        nickname: user.nickname,
        time: new Date().toISOString(),
      };

      console.log(`Mensaje recibido de ${user.nickname}:`, messagePayload);

      socket.broadcast.emit("message", messagePayload);
    });

    socket.on("disconnect", () => {
      console.log(`Usuario desconectado: ${user.nickname} (ID: ${userId})`);
    });
  } catch (error) {
    console.error("Error durante la conexión:", error);
    socket.emit("error", "An internal error occurred.");
    socket.disconnect();
  }
});

server.listen(process.env.PORT || 4000, () => {
  console.log("Servidor Socket.io ejecutándose en el puerto 4000");
});
