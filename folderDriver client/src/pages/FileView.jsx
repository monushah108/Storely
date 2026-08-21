import { useLocation } from "react-router-dom";
import { ChevronLeft, Download, FileText } from "lucide-react";

export default function FileView() {
  const { state } = useLocation();
  if (!state) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <p className="text-gray-500 text-lg">No file selected.</p>
      </div>
    );
  }

  const { name, url } = state;

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-medium shadow transition hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        {/* File Header */}
        <div className="rounded-2xl bg-white p-4 shadow">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-semibold sm:text-xl">
                {name?.split(" ").splice(0, 15).join("") + "..."}
              </h1>
              <p className="text-sm text-gray-500">Previewing file</p>
            </div>
            <a
              href={url.replace("/upload/", "/upload/fl_attachment/")}
              className="text-blue-600 px-2"
            >
              <Download />
            </a>
          </div>
        </div>

        {/* File Viewer */}
        <div className="overflow-hidden rounded-2xl bg-white shadow">
          <iframe
            src={url}
            title={name}
            className="h-[70vh] w-full sm:h-[80vh]"
          />
        </div>
      </div>
    </div>
  );
}
