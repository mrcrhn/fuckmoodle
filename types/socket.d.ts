export interface Message {
  from: string
  text: string
}

export interface ServerToClientEvents {
  chatMessage: (message: Message) => void
  reload: () => void
}

export interface ClientToServerEvents {
  sendMessage: (message: Message) => void
  reload: () => void
}
