import type { Socket } from "socket.io-client"
import type { ClientToServerEvents, ServerToClientEvents } from "/$/socket"

import { io } from "socket.io-client"
import { ls, qs } from "./util"

declare global {
  interface Window {
    fuckmoodle: Fuckmoodle
  }
}
type FuckSocket = Socket<ServerToClientEvents, ClientToServerEvents>

const PORT = import.meta.env.VITE_SERVER_PORT
const ADDR = import.meta.env.VITE_SERVER_ADDR

const NAVBAR = "ul.navbar-nav:not(.usernav)"
const FOOTER = "footer"

class Fuckmoodle {
  public socket = io(`${ADDR}:${PORT}`) as FuckSocket
  public navbar = qs(NAVBAR)
  public footer = qs<HTMLElement>(FOOTER)
  public wrapper?: HTMLDivElement
  public messageList?: HTMLDivElement

  public username: string

  constructor() {
    this.connectionStatusDisplay()
    this.username = ls("username") ?? ""

    if (!this.username) {
      let usernameInput: string | null = null
      while (!usernameInput) usernameInput = prompt("scheiss name eingeben hier junge")

      this.username = usernameInput
      ls("username", usernameInput)
    }

    this.messageListener()
    this.setupChatbox()
    this.cssStyles()
  }

  connectionStatusDisplay = () => {
    const statusDisplayList = document.createElement("li")
    statusDisplayList.classList.add("nav-item")

    const statusDisplay = document.createElement("a")
    statusDisplay.classList.add("nav-item", "nav-link")

    const connected = (isConnected: boolean) =>
      (statusDisplay.innerText = isConnected ? ":)" : ":(")

    this.socket.on("connect", () => connected(true))
    this.socket.on("disconnect", () => connected(false))
    connected(this.socket.connected)

    statusDisplayList.appendChild(statusDisplay)
    this.navbar?.prepend(statusDisplayList)
  }

  sendMessage = (message: string) => {
    this.socket.emit("sendMessage", {
      from: this.username,
      text: message,
    })
  }

  messageListener = () => {
    this.socket.on("chatMessage", message => {
      console.log(message)
      if (!this.messageList) return

      this.messageList.innerHTML =
        `<div>${message.from}: ${message.text}` + this.messageList.innerHTML
    })
  }

  setupChatbox = () => {
    if (!this.footer) throw "no footer found"
    this.footer.style.position = "relative"

    this.wrapper = document.createElement("div")
    this.wrapper.classList.add("fuckmoodle-footerwrapper")

    this.messageList = document.createElement("div")
    this.wrapper.appendChild(this.messageList)

    const input = document.createElement("input")
    input.style.position = "absolute"
    input.style.bottom = "0"
    input.style.left = "0"

    input.onkeydown = event => {
      if (event.key !== "Enter") return

      this.sendMessage(input.value)
      input.value = ""
    }

    this.wrapper.appendChild(input)
    this.footer.prepend(this.wrapper)
  }

  cssStyles = () => {
    const style = document.createElement("style")
    style.innerHTML = `
    .fuckmoodle-footerwrapper {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      width: 50%;
      overflow: hidden;
      transition: 100ms;
      opacity: 0;
      z-index: 9999;
    }

    .fuckmoodle-footerwrapper:hover {
      opacity: 1;
    }
    `

    window.document.body.appendChild(style)
  }
}

const init = () => (window.fuckmoodle = new Fuckmoodle())

if (window.document.readyState === "complete") init()
else window.document.body.onload = () => init()
