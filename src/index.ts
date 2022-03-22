import type { ClientToServerEvents, ServerToClientEvents } from "/$/socket"

import { createServer } from "http"
import { Server } from "socket.io"

const httpServer = createServer()
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: "*" },
})

io.on("connection", socket => {
  console.log(`new connection ${socket.id}`)

  // forward messages
  socket.on("sendMessage", message => io.emit("chatMessage", message))
})

httpServer.listen(3000).on("listening", () => console.log("listening on 3000"))
