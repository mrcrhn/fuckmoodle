import type { Socket } from "socket.io-client"
import type { ClientToServerEvents, Message, ServerToClientEvents } from "/$/socket"

import { io } from "socket.io-client"
import { ls, qs } from "./util"

declare global {
  interface Window {
    fuckmoodle: Fuckmoodle
  }
}
type FuckSocket = Socket<ServerToClientEvents, ClientToServerEvents>

const ADDR = import.meta.env.VITE_SERVER_SOCKET

const NAVBAR = "ul.navbar-nav:not(.usernav)"
const FOOTER = "footer"
const NAME = ".usermenu .userbutton .usertext"
const SKIP_LOAD = "skipfuck"

const MESSAGE_HISTORY_LENGTH = 100

class Fuckmoodle {
  public socket = io(ADDR, { path: "/fuckmoodle" }) as FuckSocket
  public navbar = qs(NAVBAR)
  public nameEl = qs<HTMLSpanElement>(NAME)
  public footer = qs<HTMLElement>(FOOTER)
  public wrapper?: HTMLDivElement
  public messageList?: HTMLDivElement

  public username: string

  public chatHistory = [] as Message[]

  constructor() {
    if (location.hash.includes(SKIP_LOAD)) {
      location.hash = ""
      throw "loading prevented"
    }

    const savedHistory = ls("chatHistory")
    if (savedHistory) this.chatHistory = savedHistory

    this.connectionStatusDisplay()
    const surname = this.nameEl?.innerText.split(" ")[0]
    this.username = surname ?? "errorschese"

    this.messageListener()
    this.setupChatbox()
    this.cssStyles()
    this.renderMessages()

    console.log("fuckmoodle initialized")
  }

  unload = () => {
    console.log("preventing next load")

    location.hash = SKIP_LOAD
    location.reload()
  }

  connectionStatusDisplay = () => {
    const statusDisplayList = document.createElement("li")
    statusDisplayList.classList.add("nav-item")

    const statusDisplay = document.createElement("a")
    statusDisplay.classList.add("nav-item", "nav-link")
    statusDisplay.href = "#"
    statusDisplay.onclick = () => this.unload()

    const connected = (isConnected: boolean) =>
      (statusDisplay.innerText = isConnected ? ":)" : ":(")

    this.socket.on("connect", () => connected(true))
    this.socket.on("disconnect", () => connected(false))
    connected(this.socket.connected)

    statusDisplayList.appendChild(statusDisplay)
    this.navbar?.prepend(statusDisplayList)

    const logo = qs<HTMLImageElement>("a > .logo > img")
    if (logo) {
      const originalURL = logo.src
      const scheise = "https://hetzner.vaaski.dev/fuckmoodle/assets/oszscheise.png"
      logo.onpointerenter = () => (logo.src = scheise)
      logo.onpointerleave = () => (logo.src = originalURL)
    }
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
      this.chatHistory.unshift(message)
      this.chatHistory = this.chatHistory.slice(0, MESSAGE_HISTORY_LENGTH)

      this.renderMessages()
    })

    this.socket.on("reload", () => location.reload())
  }

  renderMessages = () => {
    ls("chatHistory", this.chatHistory)

    if (!this.messageList) return

    const chat = this.chatHistory.map(m => `<div>${m.from}: ${m.text}</div>`)

    this.messageList.innerHTML = chat.join("")
  }

  setupChatbox = () => {
    if (!this.footer) throw "no footer found"
    this.footer.style.position = "relative"

    this.wrapper = document.createElement("div")
    this.wrapper.classList.add("fuckmoodle-footerwrapper")

    this.messageList = document.createElement("div")
    this.messageList.classList.add("fuckmoodle-messages")
    this.wrapper.appendChild(this.messageList)

    const input = document.createElement("input")
    input.classList.add("fuckmoodle-input")

    input.onkeydown = event => {
      if (event.key !== "Enter") return
      if (!input.value) return

      this.sendMessage(input.value)
      input.value = ""
    }

    this.wrapper.appendChild(input)
    this.footer.prepend(this.wrapper)
  }

  cssStyles = () => {
    const style = document.createElement("style")

    let footerColor = "#353a40"
    if (this.footer) footerColor = window.getComputedStyle(this.footer).backgroundColor

    style.innerHTML = `
    .fuckmoodle-footerwrapper {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      overflow: hidden;
      transition: 100ms;
      opacity: 0;
      z-index: 9999;
      background-color: ${footerColor};
    }

    .fuckmoodle-footerwrapper:hover {
      opacity: 1;
    }

    .fuckmoodle-messages {
      max-height: calc(100% - 1.5em);
      overflow: auto;
    }

    .fuckmoodle-input {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 1.5em;
    }
    `

    window.document.body.appendChild(style)
  }

  reloadAll = () => this.socket.emit("reload")
}

const init = () => {
  if (window.fuckmoodle) return location.reload()

  window.fuckmoodle = new Fuckmoodle()
}

if (window.document.readyState === "complete") init()
else window.document.body.onload = () => init()
