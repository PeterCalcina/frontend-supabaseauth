import { useToastStore } from '@/stores/toastStore'
import { CheckCircle, XCircle, AlertCircle, X, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center gap-2 p-4 rounded-lg shadow-lg text-white min-w-[300px]',
            {
              'bg-cyan-600': toast.type === 'success',
              'bg-red-500': toast.type === 'error',
              'bg-yellow-500': toast.type === 'warning',
              'bg-blue-500': toast.type === 'info',
            }
          )}
        >
          {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {toast.type === 'error' && <XCircle className="w-5 h-5" />}
          {toast.type === 'warning' && <AlertCircle className="w-5 h-5" />}
          {toast.type === 'info' && <Info className="w-5 h-5" />}
          <p className="flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
} 