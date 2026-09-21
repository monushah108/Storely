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
    } else if (sortBy === "updatedAt") {
      valA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      valB = new Date(b.updatedAt || b.createdAt || 0).getTime();
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return filtered;
};
