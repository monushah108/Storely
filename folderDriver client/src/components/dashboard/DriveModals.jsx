import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export function CreateFolderModal({
  isOpen,
  onClose,
  folderName,
  setFolderName,
  onCreate,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && folderName.trim()) {
      onCreate();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 dark:border-slate-800 dark:bg-slate-900"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">New folder</h3>

        <div className="mt-4">
          <input
            ref={inputRef}
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Untitled folder"
            className="w-full rounded-lg border border-blue-600 px-3.5 py-2.5 text-sm text-gray-800 outline-none ring-2 ring-blue-100 dark:border-blue-500 dark:bg-slate-800 dark:text-slate-100 dark:ring-blue-900/40"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onCreate}
            disabled={!folderName.trim()}
            className="rounded-full bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function RenameModal({
  isOpen,
  onClose,
  newName,
  setNewName,
  onRename,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && newName.trim()) {
      onRename();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 dark:border-slate-800 dark:bg-slate-900"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Rename</h3>

        <div className="mt-4">
          <input
            ref={inputRef}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter name"
            className="w-full rounded-lg border border-blue-600 px-3.5 py-2.5 text-sm text-gray-800 outline-none ring-2 ring-blue-100 dark:border-blue-500 dark:bg-slate-800 dark:text-slate-100 dark:ring-blue-900/40"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onRename}
            disabled={!newName.trim()}
            className="rounded-full bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
