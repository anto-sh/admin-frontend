import axios from 'axios'
export function isAbortRequestError(error: unknown): boolean {
  // axios отменяет с кодом ERR_CANCELED
  if (axios.isCancel(error)) return true
  // если используется AbortController, ошибка может быть DOMException с name 'AbortError'
  if (error instanceof DOMException && error.name === 'AbortError') return true
  // иногда код ошибки приходит в error.code
  return (error as any)?.code === 'ERR_CANCELED'
}
