import { createPortal } from "react-dom";

export default function RenameModle({
  renameModal,
  newName,
  setNewname,
  closeModal,
  HandleRename,
}) {
  if (!renameModal) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Rename</h3>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewname(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800 dark:focus:ring-blue-900/40"
        />
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={() => closeModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
            onClick={HandleRename}
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("portal") || document.body
  );
}
