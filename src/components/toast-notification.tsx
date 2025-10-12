import { useEffect, useState, FC } from "react";
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

export type ToastType = "error" | "success" | "warning" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

const getToastStyles = (type: ToastType): { bg: string; icon: FC<{ className: string }> } => {
  const styles: Record<ToastType, { bg: string; icon: FC<{ className: string }> }> = {
    error: { bg: "bg-red-700", icon: AlertCircle },
    success: { bg: "bg-green-700", icon: CheckCircle },
    warning: { bg: "bg-yellow-700", icon: AlertTriangle },
    info: { bg: "bg-blue-700", icon: Info },
  };
  return styles[type];
};

export const Toast: FC<ToastProps> = ({
  message,
  type = "error",
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const { bg, icon: Icon } = getToastStyles(type);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 left-4 right-4 ${bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-top-2 z-50`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1 text-sm">{message}</span>
      <button
        onClick={() => setIsVisible(false)}
        className="hover:bg-white/20 p-1 rounded transition-colors flex-shrink-0"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
