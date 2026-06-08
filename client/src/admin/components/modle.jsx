import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50 z-50"
    >
      <div className="bg-white rounded shadow-lg p-6 w-96 relative">
        {/* Close button */}
        <button
          onClick={() => onClose(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        {children}
      </div>
    </div>,
    document.getElementById("portal")
  );
}
