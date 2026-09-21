export const filterAndSortItems = ({
  items = [],
  searchQuery = "",
  filterType = "all",
  activeTab = "my-drive",
  sortBy = "name",
  sortOrder = "asc",
}) => {
  let filtered = [...items];

  // 1. Tab filter
  if (activeTab === "trash") {
    filtered = filtered.filter((i) => i.isTrash);
  } else if (activeTab === "starred") {
    filtered = filtered.filter((i) => i.isStarred);
  } else if (activeTab === "shared") {
    filtered = filtered.filter((i) => i.isShared);
  }

  // 2. Search query filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter((item) =>
      (item.name || "").toLowerCase().includes(q),
    );
  }

  // 3. Category / Type filter
  if (filterType !== "all") {
    filtered = filtered.filter((item) => {
      const ext = (item.extension || "").toLowerCase();
      const isFolder = !item.extension;

      switch (filterType) {
        case "folders":
          return isFolder;
        case "documents":
          return ["doc", "docx", "txt", "rtf", "odt", "md"].includes(ext);
        case "spreadsheets":
          return ["xls", "xlsx", "csv", "ods"].includes(ext);
        case "images":
          return ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"].includes(ext);
        case "pdfs":
          return ext === "pdf";
        case "media":
          return ["mp4", "mkv", "avi", "mov", "mp3", "wav"].includes(ext);
        default:
          return true;
      }
    });
  }

  // 4. Sorting
  filtered.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === "name") {
      valA = (a.name || "").toLowerCase();
      valB = (b.name || "").toLowerCase();
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    if (sortBy === "size") {
      valA = a.size || 0;
      valB = b.size || 0;
    } else if (sortBy === "updatedAt" || sortBy === "createdAt") {
      valA = getItemDate(a)?.getTime() || 0;
      valB = getItemDate(b)?.getTime() || 0;
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return filtered;
};

export const getItemDate = (item) => {
  if (!item) return null;
  if (item.createdAt) return new Date(item.createdAt);
  if (item.updatedAt) return new Date(item.updatedAt);
  const idStr = item._id || item.id;
  if (idStr && typeof idStr === "string" && idStr.length === 24) {
    try {
      return new Date(parseInt(idStr.substring(0, 8), 16) * 1000);
    } catch {
      return new Date();
    }
  }
  return null;
};

export const getFolderDetailsText = (folder) => {
  if (!folder) return "Folder";
  const count = folder.itemCount !== undefined ? folder.itemCount : 0;
  const countStr = count === 0 ? "Empty folder" : count === 1 ? "1 item" : `${count} items`;
  if (folder.size && folder.size > 0) {
    return `${countStr} • ${formatBytes(folder.size)}`;
  }
  return countStr;
};

export const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
};

export const formatDateShort = (dateInput) => {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateTime = (dateInput) => {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const getItemTypeLabel = (item) => {
  if (!item) return "Unknown";
  if (!item.extension) return "Folder";
  const ext = (item.extension || "").toLowerCase();

  const map = {
    pdf: "PDF Document",
    doc: "Word Document",
    docx: "Word Document",
    xls: "Excel Spreadsheet",
    xlsx: "Excel Spreadsheet",
    csv: "CSV Spreadsheet",
    ppt: "PowerPoint Presentation",
    pptx: "PowerPoint Presentation",
    txt: "Text Document",
    md: "Markdown File",
    jpg: "JPEG Image",
    jpeg: "JPEG Image",
    png: "PNG Image",
    gif: "GIF Image",
    webp: "WebP Image",
    svg: "SVG Vector Image",
    mp4: "MP4 Video",
    mkv: "MKV Video",
    avi: "AVI Video",
    mov: "QuickTime Video",
    mp3: "MP3 Audio",
    wav: "WAV Audio",
    zip: "ZIP Archive",
    rar: "RAR Archive",
    tar: "TAR Archive",
    gz: "GZ Archive",
    js: "JavaScript File",
    jsx: "React JSX File",
    ts: "TypeScript File",
    tsx: "React TSX File",
    json: "JSON Document",
    html: "HTML Document",
    css: "CSS Stylesheet",
    py: "Python Script",
    java: "Java Source File",
  };

  return map[ext] || `${ext.toUpperCase()} File`;
};
