import { createPortal } from "react-dom";

export default function Modal({
  isOpen,
  onClose,
  saveChange,
  InputValue,
  onInputChange,
}) {
  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50 z-50"
    >
      <div className="bg-white rounded shadow-lg p-6 w-96 relative">
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-800">
              Create Folder
            </h3>
            <input
              type="text"
              value={InputValue}
              onChange={onInputChange}
              placeholder="Enter folder name"
              className="mb-4 w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3">
              <button
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                onClick={saveChange}
              >
                Save
              </button>
              <button
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                onClick={() => onClose(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("portal")
  );
}
