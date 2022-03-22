import type { ClientToServerEvents, ServerToClientEvents } from "/$/socket"

import { createServer } from "http"
import { Server } from "socket.io"

const PORT = process.env.VITE_SERVER_PORT
// const ADDR = process.env.VITE_SERVER_ADDR

const httpServer = createServer()
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: "*" },
})

io.on("connection", socket => {
  console.log(`new connection ${socket.id}`)

  // forward messages
  socket.on("sendMessage", message => io.emit("chatMessage", message))
})

httpServer.listen(PORT).on("listening", () => console.log(`listening on ${PORT}`))
