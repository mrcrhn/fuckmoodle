export interface LocalStored {
  username: string
}
export function ls<L extends keyof LocalStored>(key: L): LocalStored[L] | null
export function ls<L extends keyof LocalStored>(key: L, value: LocalStored[L]): void
export function ls<L extends keyof LocalStored>(
  key: L,
  value?: LocalStored[L]
): LocalStored[L] | null {
  return value !== undefined
    ? localStorage.setItem(`fuckmoodle-${key}`, JSON.stringify(value))
    : JSON.parse(localStorage.getItem(`fuckmoodle-${key}`) as string)
}

export const qs = <T extends Element>(selector: string): T | null => {
  return document.querySelector(selector)
}
