import type { ClientToServerEvents, ServerToClientEvents } from "/$/socket"

import { createServer } from "http"
import { Server } from "socket.io"

import express from "express"
const app = express()

const PORT = process.env.VITE_SERVER_PORT

const httpServer = createServer(app)
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: "*" },
})

app.use((req, res, next) => {
  console.log(req.url)
  next()
})
app.get("/fuckmoodle", (_, res) => res.send("sup"))
app.use("/fuckmoodle/static", express.static("dist"))
app.use("/fuckmoodle/assets", express.static("assets"))

io.on("connection", socket => {
  console.log(`new connection ${socket.id}`)

  // forward messages
  socket.on("sendMessage", message => io.emit("chatMessage", message))
  socket.on("reload", () => socket.broadcast.emit("reload"))
})

httpServer.listen(PORT).on("listening", () => console.log(`listening on ${PORT}`))
