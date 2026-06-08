import {
  FaFilePdf,
  FaFileImage,
  FaFileVideo,
  FaFileArchive,
  FaFileCode,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileCsv,
  FaFileAlt,
} from "react-icons/fa";

export default function RenderFileIcon(extension) {
  switch (extension.toLowerCase()) {
    // PDF
    case "pdf":
      return <FaFilePdf size={40} className="text-red-500" />;

    // Images
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
    case "svg":
    case "webp":
      return <FaFileImage size={40} className="text-green-500" />;

    // Videos
    case "mp4":
    case "mkv":
    case "avi":
    case "mov":
    case "wmv":
    case "flv":
      return <FaFileVideo size={40} className="text-purple-500" />;

    // Archives
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return <FaFileArchive size={40} className="text-yellow-500" />;

    // Code files
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
    case "html":
    case "css":
    case "json":
    case "xml":
    case "py":
    case "java":
    case "c":
    case "cpp":
    case "cs":
    case "php":
    case "rb":
    case "go":
    case "swift":
      return <FaFileCode size={40} className="text-blue-500" />;

    // Office docs
    case "doc":
    case "docx":
      return <FaFileWord size={40} className="text-blue-700" />;

    case "xls":
    case "xlsx":
      return <FaFileExcel size={40} className="text-green-600" />;

    case "ppt":
    case "pptx":
      return <FaFilePowerpoint size={40} className="text-orange-600" />;

    // CSV
    case "csv":
      return <FaFileCsv size={40} className="text-emerald-600" />;

    // Default
    default:
      return <FaFileAlt size={40} className="text-gray-500" />;
  }
}
