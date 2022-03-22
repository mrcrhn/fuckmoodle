export interface Message {
  from: string
  text: string
}

export interface ServerToClientEvents {
  chatMessage: (message: Message) => void
}

export interface ClientToServerEvents {
  sendMessage: (message: Message) => void
}
