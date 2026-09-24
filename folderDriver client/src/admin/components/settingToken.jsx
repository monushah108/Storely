import { FaCheck, FaCopy, FaKey, FaTrash } from "react-icons/fa";

export default function SettingToken({
  expiresInDays,
  setExpiresInDays,
  generatingToken,
  handleGenerateToken,
  handleClearToken,
  clearingToken,
  handleCopy,
  token,
  copied,
  expiresAt,
}) {
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="border-b border-gray-200 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-800">
            <FaKey size={14} className="text-gray-500 dark:text-slate-400" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Admin Access Token
            </h2>

            <p className="mt-0.5 text-xs text-gray-400 dark:text-slate-400">
              Generate temporary access for another user.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Token Settings */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-500 dark:text-slate-400">
              Token expires after
            </label>

            <select
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-gray-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-blue-500 sm:w-48"
            >
              <option value={1} className="dark:bg-slate-800">1 day</option>
              <option value={7} className="dark:bg-slate-800">7 days</option>
              <option value={30} className="dark:bg-slate-800">30 days</option>
            </select>
          </div>

          <button
            type="button"
            disabled={generatingToken}
            onClick={handleGenerateToken}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <FaKey size={11} />

            {generatingToken ? "Generating..." : "Generate Token"}
          </button>
        </div>

        {/* Generated Token */}
        {token && (
          <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-850">
            <div className="mb-2">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                Generated Access Token
              </p>

              <p className="mt-1 text-[11px] text-gray-400 dark:text-slate-400">
                Share this token only with the intended user.
              </p>
            </div>

            {/* Token + Actions */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex min-w-0 flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                <input
                  type="text"
                  readOnly
                  value={token}
                  className="min-w-0 flex-1 bg-transparent px-3 py-2.5 font-mono text-xs text-gray-600 outline-none dark:text-slate-200"
                />

                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex shrink-0 items-center gap-2 border-l border-gray-200 px-3 text-xs font-medium text-gray-500 transition hover:bg-gray-50 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                >
                  {copied ? (
                    <>
                      <FaCheck size={11} />
                      Copied
                    </>
                  ) : (
                    <>
                      <FaCopy size={11} />
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* Clear Token */}
              <button
                type="button"
                onClick={handleClearToken}
                disabled={clearingToken}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                <FaTrash size={10} />

                {clearingToken ? "Clearing..." : "Clear Access"}
              </button>
            </div>

            {expiresAt && (
              <p className="mt-2 text-[11px] text-gray-400 dark:text-slate-400">
                Expires: {formatDate(expiresAt)}
              </p>
            )}
          </div>
        )}

        {/* Information */}
        <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-850">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
            About access tokens
          </p>

          <p className="mt-1 text-[11px] leading-5 text-gray-400 dark:text-slate-400">
            Access tokens provide temporary admin access and automatically
            become invalid after their expiration time.
          </p>
        </div>
      </div>
    </div>
  );
}
