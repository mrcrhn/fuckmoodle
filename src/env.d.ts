/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_PORT: string
  readonly VITE_SERVER_SOCKET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
