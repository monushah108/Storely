import { X, Copy, Check, Link2, Share2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  FacebookIcon,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

export default function ShareModal({ IsShare, setIsShare, shareId, isFile }) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (!IsShare || !shareId) return;

    const generateShareLink = async () => {
      try {
        setLoading(true);
        setError("");
        setShareUrl("");

        const response = await fetch(`${apiUrl}/share/${shareId}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to generate share link");
        }

        const data = await response.json();

        setShareUrl(`${window.location.origin}/guest/${data.token}`);
      } catch (err) {
        console.error(err);
        setError("Unable to generate the share link. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    generateShareLink();
  }, [IsShare, shareId, apiUrl]);

  const copyLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const closeModal = () => {
    setIsShare(false);
    setCopied(false);
    setError("");
  };

  if (!IsShare) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          closeModal();
        }
      }}
    >
      <div
        className="
          w-full max-w-md
          overflow-hidden
          rounded-2xl
          border border-gray-200
          bg-white
          shadow-[0_25px_70px_rgba(0,0,0,0.18)]
          animate-in
          fade-in
          zoom-in-95
          duration-200
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Share2 size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Share {isFile ? "file" : "folder"}
              </h2>

              <p className="mt-0.5 text-sm text-gray-500">
                Anyone with the link can access it
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-lg
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-gray-700
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Share link
          </label>

          {/* Link input */}
          <div
            className="
              flex items-center
              overflow-hidden
              rounded-xl
              border border-gray-200
              bg-gray-50
              transition
              focus-within:border-blue-500
              focus-within:ring-4
              focus-within:ring-blue-500/10
            "
          >
            <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
              <Link2 size={17} className="shrink-0 text-gray-400" />

              <input
                readOnly
                value={loading ? "Generating share link..." : shareUrl}
                placeholder="Your share link will appear here"
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  py-3
                  text-sm
                  text-gray-700
                  outline-none
                  placeholder:text-gray-400
                "
              />
            </div>

            <button
              onClick={copyLink}
              disabled={!shareUrl || loading}
              className="
                mr-1.5
                flex h-9 w-9
                shrink-0
                items-center justify-center
                rounded-lg
                bg-blue-600
                text-white
                transition
                hover:bg-blue-700
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
              title={copied ? "Copied" : "Copy link"}
            >
              {copied ? <Check size={17} /> : <Copy size={17} />}
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <Loader2 size={14} className="animate-spin" />
              Creating a secure share link...
            </div>
          )}

          {/* Success */}
          {copied && (
            <p className="mt-3 text-xs font-medium text-green-600">
              Link copied to clipboard
            </p>
          )}

          {/* Error */}
          {error && (
            <div className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />

            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Share via
            </span>

            <div className="h-px flex-1 bg-gray-100" />
          </div>

          {/* Social buttons */}
          <div className="flex gap-3">
            <FacebookShareButton
              url={shareUrl}
              disabled={!shareUrl}
              className="disabled:opacity-40"
            >
              <div
                className="
                  flex items-center gap-2.5
                  rounded-xl
                  border border-gray-200
                  bg-white
                  px-4 py-2.5
                  text-sm font-medium
                  text-gray-700
                  shadow-sm
                  transition
                  hover:-translate-y-0.5
                  hover:border-blue-200
                  hover:bg-blue-50
                  hover:shadow-md
                "
              >
                <FacebookIcon size={32} round />
                <span>Facebook</span>
              </div>
            </FacebookShareButton>

            <WhatsappShareButton
              url={shareUrl}
              disabled={!shareUrl}
              className="disabled:opacity-40"
            >
              <div
                className="
                  flex items-center gap-2.5
                  rounded-xl
                  border border-gray-200
                  bg-white
                  px-4 py-2.5
                  text-sm font-medium
                  text-gray-700
                  shadow-sm
                  transition
                  hover:-translate-y-0.5
                  hover:border-green-200
                  hover:bg-green-50
                  hover:shadow-md
                "
              >
                <WhatsappIcon size={32} round />
                <span>WhatsApp</span>
              </div>
            </WhatsappShareButton>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50/70 px-6 py-4">
          <p className="text-center text-xs text-gray-400">
            Sharing this link gives others access to this{" "}
            {isFile ? "file" : "folder"}.
          </p>
        </div>
      </div>
    </div>,
    document.getElementById("portal"),
  );
}
