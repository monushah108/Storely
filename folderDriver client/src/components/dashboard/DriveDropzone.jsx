import React from "react";
import { UploadCloud } from "lucide-react";

export default function DriveDropzone({ isDragging }) {
  if (!isDragging) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-blue-600/10 p-6 backdrop-blur-xs dark:bg-blue-950/20">
      <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-blue-500 bg-white/95 p-10 text-center shadow-2xl dark:border-blue-500 dark:bg-slate-900/95">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          <UploadCloud className="h-9 w-9" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
          Drop files to upload
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Your files will be uploaded to the current folder in Storely Drive
        </p>
      </div>
    </div>
  );
}
