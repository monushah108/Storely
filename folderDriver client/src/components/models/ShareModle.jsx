import { X, Copy, Check } from "lucide-react";
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

        const response = await fetch(`${apiUrl}/share/${shareId}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to generate link");
        }

        const data = await response.json();

        setShareUrl(`${window.location.origin}/guest/${data.token}`);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    generateShareLink();
  }, [IsShare, shareId, apiUrl]);

  const copyLink = async () => {
    if (!shareUrl) return;

    await navigator.clipboard.writeText(shareUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (!IsShare) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Share File</h2>

          <button
            onClick={() => setIsShare(false)}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-2">
          <input
            readOnly
            value={loading ? "Generating link..." : shareUrl}
            className="flex-1 rounded-lg border px-3 py-2"
          />

          <button
            onClick={copyLink}
            disabled={!shareUrl}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
        <p className="text-red-500 text-sm">{error}</p>
        <div className="my-6 border-t" />

        <h3 className="mb-4 text-sm text-gray-500">Share via</h3>

        <div className="flex gap-4">
          <FacebookShareButton url={shareUrl}>
            <div className="transition hover:scale-110">
              <FacebookIcon size={50} round />
            </div>
          </FacebookShareButton>

          <WhatsappShareButton url={shareUrl}>
            <div className="transition hover:scale-110">
              <WhatsappIcon size={50} round />
            </div>
          </WhatsappShareButton>
        </div>
      </div>
    </div>,
    document.getElementById("portal"),
  );
}
