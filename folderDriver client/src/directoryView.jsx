import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useGetFileQuery } from "./store/slices/Flieslice";
import { useFetchUserQuery } from "./store/slices/UserSlice";

import DriveHeader from "./components/dashboard/DriveHeader";
import DriveSidebar from "./components/dashboard/DriveSidebar";
import DriveBreadcrumbs from "./components/dashboard/DriveBreadcrumbs";
import DriveToolbar from "./components/dashboard/DriveToolbar";
import FileDetailsDrawer from "./components/dashboard/FileDetailsDrawer";
import DriveDropzone from "./components/dashboard/DriveDropzone";
import DashboardContent from "./components/dashboard/DashboardContent";
import SharedSection from "./components/dashboard/SharedSection";
import DriveModalsGroup from "./components/dashboard/DriveModalsGroup";
import { filterAndSortItems } from "./components/dashboard/driveHelpers";
import { useDriveOperations } from "./components/dashboard/useDriveOperations";

export default function DirectoryView() {
  const param = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const contextMenuRef = useRef(null);

  // Queries
  const { data: driveResult, isLoading, isError, error, refetch, isFetching } =
    useGetFileQuery(param.id);
  const { data: userData, error: userError } = useFetchUserQuery();

  // Dashboard UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem("storely_view_mode") || "grid",
  );
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [activeTab, setActiveTab] = useState("my-drive");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Operations Hook
  const ops = useDriveOperations({
    folderId: param.id,
    selectedItem,
    setSelectedItem,
  });

  // Redirect on 401
  useEffect(() => {
    if (error?.status === 401 || userError?.status === 401) {
      navigate("/auth/login");
    }
  }, [error, userError, navigate]);

  useEffect(() => {
    localStorage.setItem("storely_view_mode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        ops.setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [ops]);

  const allItems = driveResult?.items || (Array.isArray(driveResult) ? driveResult : []);
  const currentFolder = driveResult?.currentFolder;
  const isRoot = !param.id;

  const processedItems = filterAndSortItems({
    items: allItems,
    searchQuery,
    filterType,
    activeTab,
    sortBy,
    sortOrder,
  });

  const folders = processedItems.filter((i) => !i.extension);
  const files = processedItems.filter((i) => !!i.extension);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        if (e.currentTarget.contains(e.relatedTarget)) return;
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.length) {
          ops.handleUploadFiles(e.dataTransfer.files);
        }
      }}
      className="flex h-screen w-screen flex-col overflow-hidden bg-[#f8fafd]"
    >
      <DriveDropzone isDragging={isDragging} />

      <DriveHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onToggleSidebar={() => setMobileOpen((prev) => !prev)}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        showDetails={showDetails}
        onToggleDetails={() => setShowDetails((prev) => !prev)}
      />

      <div className="flex flex-1 overflow-hidden">
        <DriveSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenCreateFolder={() => ops.setCreateFolderOpen(true)}
          onTriggerFileUpload={() => fileInputRef.current?.click()}
          userData={userData}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Main Content Card (Google Drive Material Design) */}
        <main className="m-2 mr-3 flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-6">
            <DriveBreadcrumbs currentFolder={currentFolder} isRoot={isRoot} />
          </div>

          {activeTab !== "shared" && (
            <DriveToolbar
              filterType={filterType}
              setFilterType={setFilterType}
              viewMode={viewMode}
              setViewMode={setViewMode}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          )}

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {activeTab === "shared" ? (
              <SharedSection
                availableFolders={folders}
                onShareFolder={(folderId) => ops.openShare(folderId, false)}
              />
            ) : (
              <DashboardContent
                isLoading={isLoading}
                isError={isError}
                error={error}
                refetch={refetch}
                processedItems={processedItems}
                folders={folders}
                files={files}
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery("")}
                onUploadClick={() => fileInputRef.current?.click()}
                viewMode={viewMode}
                selectedId={selectedItem?._id}
                onSelect={setSelectedItem}
                onOpenItem={ops.handleOpen}
                onContextMenu={ops.openContextMenu}
                onMenuClick={(e, item) => ops.openContextMenu(e, item)}
                onShare={(id, isFile = true) => ops.openShare(id, isFile)}
                deletingId={ops.deletingId}
              />
            )}
          </div>
        </main>

        {showDetails && (
          <FileDetailsDrawer
            item={selectedItem || currentFolder}
            isCurrentFolder={!selectedItem}
            onClose={() => setShowDetails(false)}
            onOpen={ops.handleOpen}
            onShare={(id, isFile = true) => ops.openShare(id, isFile)}
            onRename={(id, name, ext) => ops.prepareRename(id, name, ext)}
            onDelete={ops.handleDelete}
          />
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          ops.handleUploadFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <DriveModalsGroup
        contextMenu={ops.contextMenu}
        contextMenuRef={contextMenuRef}
        onCloseContextMenu={() => ops.setContextMenu((prev) => ({ ...prev, visible: false }))}
        handleOpen={ops.handleOpen}
        onPrepareRename={ops.prepareRename}
        handleShare={ops.openShare}
        handleDelete={ops.handleDelete}
        createFolderOpen={ops.createFolderOpen}
        onCloseCreateFolder={() => ops.setCreateFolderOpen(false)}
        folderName={ops.folderName}
        setFolderName={ops.setFolderName}
        onCreateFolder={ops.handleCreateFolderSubmit}
        renameOpen={ops.renameOpen}
        onCloseRename={() => ops.setRenameOpen(false)}
        newName={ops.newName}
        setNewName={ops.setNewName}
        onRename={ops.handleRenameSubmit}
        shareOpen={ops.shareOpen}
        onCloseShare={ops.setShareOpen}
        shareId={ops.shareId}
        isFileShare={ops.isFileShare}
        uploadingFile={ops.uploadingFile}
        isUploading={ops.isUploading}
        isUploadErr={ops.isUploadErr}
        uploadErr={ops.uploadErr}
        onCloseUploadWidget={() => {
          ops.resetUpload();
          ops.setUploadingFile(null);
        }}
      />
    </div>
  );
}
