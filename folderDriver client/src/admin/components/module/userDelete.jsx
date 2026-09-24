import React from "react";
import { createPortal } from "react-dom";
import { FiAlertTriangle, FiTrash2, FiX } from "react-icons/fi";

export default function UserDelete({
  selectedUser,
  portal,
  closeModal,
  isDeleting,

  hardDeleteConfirm,
  setHardDeleteConfirm,
  handleUserDelete,
}) {
  if (!portal && !selectedUser) return;
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          closeModal();
        }
      }}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/40">
              <FiTrash2 size={18} className="text-red-500 dark:text-red-400" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                Delete user
              </h2>

              <p className="mt-0.5 text-xs text-gray-400 dark:text-slate-400">
                This action affects the user's account.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeModal}
            disabled={isDeleting}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Warning */}
          <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/40 dark:bg-amber-950/30">
            <FiAlertTriangle
              size={17}
              className="mt-0.5 shrink-0 text-amber-500 dark:text-amber-400"
            />

            <div>
              <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                Please confirm this action
              </p>

              <p className="mt-1 text-[11px] leading-5 text-amber-600 dark:text-amber-400">
                The user will lose access to their account. Choose permanent
                deletion only if you are sure.
              </p>
            </div>
          </div>

          {/* User */}
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
              {selectedUser.picture ? (
                <img
                  src={selectedUser.picture}
                  alt={selectedUser.name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-gray-400">
                  {selectedUser.name?.charAt(0) || "U"}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                {selectedUser.name || "Unnamed user"}
              </p>

              <p className="truncate text-xs text-gray-400 dark:text-slate-400">
                {selectedUser.email}
              </p>
            </div>
          </div>

          {/* Permanent delete */}
          <label
            className={`mt-4 flex cursor-pointer gap-3 rounded-xl border p-3 transition ${
              hardDeleteConfirm
                ? "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/30"
                : "border-gray-200 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
            }`}
          >
            <input
              type="checkbox"
              checked={hardDeleteConfirm}
              onChange={(e) => setHardDeleteConfirm(e.target.checked)}
              disabled={isDeleting}
              className="mt-1 h-4 w-4 accent-red-600"
            />

            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Permanently delete
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-400 dark:text-slate-400">
                Permanently removes this user and their associated data. This
                cannot be undone.
              </p>
            </div>
          </label>
        </div>

        {/* Footer */}
        <div className="flex gap-2 border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/60">
          <button
            type="button"
            onClick={closeModal}
            disabled={isDeleting}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={handleUserDelete}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
              hardDeleteConfirm
                ? "bg-red-600 hover:bg-red-700"
                : "bg-slate-800 hover:bg-slate-700 dark:bg-blue-600 dark:hover:bg-blue-700"
            }`}
          >
            <FiTrash2 size={13} />

            {isDeleting
              ? "Deleting..."
              : hardDeleteConfirm
                ? "Delete Permanently"
                : "Delete User"}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("portal") || document.body,
  );
}
