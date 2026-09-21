import React, { useState } from "react";
import {
  Folder,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Share2,
  Users,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import RenderFileIcon from "../../hook/RenderFileIcon";
import {
  useGetUserSharesQuery,
  useRevokeShareMutation,
} from "../../store/slices/Flieslice";
import {
  formatBytes,
  formatDateShort,
  formatDateTime,
  getItemDate,
  getFolderDetailsText,
} from "./driveHelpers";

export default function SharedSection({ onOpenShareFolderModal, availableFolders = [], onShareFolder }) {
  const [filter, setFilter] = useState("folders");
  const [copiedId, setCopiedId] = useState(null);
  const [revokingId, setRevokingId] = useState(null);

  const { data: sharedItems = [], isLoading, isError, refetch } =
    useGetUserSharesQuery();
  const [revokeShare] = useRevokeShareMutation();

  const handleCopyLink = async (token, shareId) => {
    const url = `${window.location.origin}/guest/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(shareId);
      toast.success("Share link copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleRevoke = async (shareId) => {
    if (!window.confirm("Are you sure you want to stop sharing this item? The link will stop working.")) {
      return;
    }
    setRevokingId(shareId);
    try {
      await revokeShare(shareId).unwrap();
      toast.success("Sharing access revoked");
    } catch {
      toast.error("Failed to revoke share link");
    } finally {
      setRevokingId(null);
    }
  };

  const filteredItems = sharedItems.filter((share) => {
    if (filter === "folders") return share.itemType === "directory";
    if (filter === "files") return share.itemType === "file";
    return true;
  });

  const folderCount = sharedItems.filter((s) => s.itemType === "directory").length;
  const fileCount = sharedItems.filter((s) => s.itemType === "file").length;

  return (
    <div className="flex flex-col h-full">
      {/* Section Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Share2 className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Folder & File Sharing</h2>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            View, share, and manage public access links for your folders and files
          </p>
        </div>

        {/* Quick share folder dropdown/action */}
        {availableFolders.length > 0 && (
          <div className="flex items-center gap-2">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  onShareFolder(e.target.value);
                  e.target.value = "";
                }
              }}
              defaultValue=""
              className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-xs outline-none hover:border-gray-300 focus:border-blue-600"
            >
              <option value="" disabled>+ Share a folder...</option>
              {availableFolders.map((f) => (
                <option key={f._id} value={f._id}>
                  📁 {f.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="mb-4 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setFilter("folders")}
          className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
            filter === "folders"
              ? "bg-blue-100 text-blue-800"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          Shared Folders ({folderCount})
        </button>

        <button
          type="button"
          onClick={() => setFilter("files")}
          className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
            filter === "files"
              ? "bg-blue-100 text-blue-800"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          Shared Files ({fileCount})
        </button>

        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
            filter === "all"
              ? "bg-blue-100 text-blue-800"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          All Shared ({sharedItems.length})
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center gap-2">
          <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          <span className="text-xs text-gray-500">Loading shared links...</span>
        </div>
      ) : isError ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
          <p className="text-xs font-medium text-red-500">Failed to load shared items</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-2 rounded-full bg-gray-100 px-3.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
          >
            Retry
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-[#f8fafd] p-8 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xs text-blue-600">
            <Users className="h-7 w-7" />
          </div>
          <h3 className="text-sm font-bold text-gray-800">
            No {filter === "folders" ? "shared folders" : filter === "files" ? "shared files" : "shared items"} yet
          </h3>
          <p className="mt-1 max-w-sm text-xs text-gray-500">
            Right-click any folder or click the Share icon to generate a secure guest link that anyone can access.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((share) => {
            const isFolder = share.itemType === "directory";
            const name = share.item?.name || (isFolder ? "Shared Folder" : "Shared File");
            const isCopied = copiedId === share._id;
            const isRevoking = revokingId === share._id;
            const createdDate = getItemDate(share) || (share.item ? getItemDate(share.item) : new Date());
            const detailsText = isFolder
              ? getFolderDetailsText(share.item)
              : formatBytes(share.item?.size);
            const tooltip = `Shared ${isFolder ? "Folder" : "File"}: ${name}\nDetails: ${detailsText}\nCreated/Shared: ${formatDateTime(createdDate)}`;

            return (
              <div
                key={share._id}
                title={tooltip}
                className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-xs transition hover:border-gray-300"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                        {isFolder ? (
                          <Folder className="h-5 w-5 fill-blue-600 text-blue-600" />
                        ) : (
                          <div className="scale-75">
                            {RenderFileIcon(share.item?.extension || "")}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p title={name} className="truncate text-sm font-semibold text-gray-800">
                          {name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-gray-400">
                          <span className="font-semibold text-blue-600">
                            {isFolder ? "Folder" : share.item?.extension?.toUpperCase() || "File"}
                          </span>
                          <span>•</span>
                          <span className="font-medium text-gray-600">
                            {detailsText}
                          </span>
                          <span>•</span>
                          <span title={`Shared: ${formatDateTime(createdDate)}`}>
                            {formatDateShort(createdDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 rounded-lg bg-[#f8fafd] p-2 text-xs font-mono text-gray-500 truncate">
                    {`${window.location.origin}/guest/${share.token}`}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(share.token, share._id)}
                      className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                        isCopied
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{isCopied ? "Copied" : "Copy Link"}</span>
                    </button>

                    <a
                      href={`/guest/${share.token}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>View</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRevoke(share._id)}
                    disabled={isRevoking}
                    title="Stop sharing this link"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    {isRevoking ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-red-500" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
