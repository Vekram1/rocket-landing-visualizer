import { create } from 'zustand'
import { useEffect } from 'react'
import './toasts.css'

type ToastVariant = 'info' | 'error' | 'success'

type Toast = {
  id: string
  message: string
  variant: ToastVariant
  timeoutMs?: number
}

type ToastState = {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'> & { id?: string }) => void
  dismissToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => {
      const id = toast.id ?? crypto.randomUUID()
      return { toasts: [...state.toasts, { ...toast, id }] }
    }),
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((s) => s.dismissToast)

  useEffect(() => {
    if (!toast.timeoutMs) return
    const timer = setTimeout(() => dismiss(toast.id), toast.timeoutMs)
    return () => clearTimeout(timer)
  }, [dismiss, toast.id, toast.timeoutMs])

  return (
    <div className={`toast ${toast.variant}`}>
      <span>{toast.message}</span>
      <button className="toast-close" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification">
        ×
      </button>
    </div>
  )
}

export function Toasts() {
  const toasts = useToastStore((s) => s.toasts)

  if (!toasts.length) return null

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

export default Toasts
