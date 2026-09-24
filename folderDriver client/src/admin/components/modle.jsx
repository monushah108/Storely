import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4 backdrop-blur-xs"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 w-96 relative">
        {/* Close button */}
        <button
          onClick={() => onClose(false)}
          className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          ✕
        </button>

        {children}
      </div>
    </div>,
    document.getElementById("portal") || document.body
  );
}
