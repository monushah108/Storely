import cloudinary from "../config/cloudinary.js";

/**
 * Extract publicId from a Cloudinary URL if not explicitly provided.
 * Handles formats like:
 *   https://res.cloudinary.com/<cloud>/image/upload/v1234567/storely/filename.pdf
 *   https://res.cloudinary.com/<cloud>/raw/upload/v1234567/storely/filename.pdf
 */
export const extractPublicId = (url) => {
  if (!url || typeof url !== "string") return "";
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    return match ? match[1] : "";
  } catch (err) {
    return "";
  }
};

/**
 * Attaches valid signed delivery and download URLs for files,
 * especially PDFs which are restricted by default in Cloudinary accounts.
 */
export const attachFileUrls = (file) => {
  if (!file) return file;

  // Handle mongoose document or plain object
  const fileObj = typeof file.toObject === "function" ? file.toObject() : { ...file };

  const isPdf =
    fileObj.extension?.toLowerCase() === "pdf" ||
    fileObj.name?.toLowerCase().endsWith(".pdf");

  let url = fileObj.url || "";
  let downloadUrl = url ? url.replace("/upload/", "/upload/fl_attachment/") : "";

  const publicId = fileObj.publicId || extractPublicId(url);

  if (isPdf && publicId) {
    try {
      // Generate signed inline view URL (bypasses Cloudinary's default 401 PDF restriction)
      const signedViewUrl = cloudinary.utils.private_download_url(
        publicId,
        "pdf",
        {
          type: "upload",
          expires_at: Math.floor(Date.now() / 1000) + 86400, // 24 hours
          resource_type: fileObj.resourceType || "image",
        }
      );

      // Generate signed direct-download attachment URL
      const signedDownloadUrl = cloudinary.utils.private_download_url(
        publicId,
        "pdf",
        {
          type: "upload",
          attachment: true,
          expires_at: Math.floor(Date.now() / 1000) + 86400, // 24 hours
          resource_type: fileObj.resourceType || "image",
        }
      );

      url = signedViewUrl;
      downloadUrl = signedDownloadUrl;
    } catch (err) {
      console.error("Failed to generate signed PDF URL:", err);
    }
  }

  return {
    ...fileObj,
    url,
    downloadUrl,
    viewUrl: url,
  };
};
