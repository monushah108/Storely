import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaFolderPlus, FaUser, FaUpload } from "react-icons/fa";
import Modle from "./models/modle";
import {
  useCreateDirectoryMutation,
  useUploadFileMutation,
} from "../store/slices/Flieslice";
import {
  useFetchUserQuery,
  useLogoutMutation,
} from "../store/slices/UserSlice";
import { toast, Toaster } from "sonner";
import StateModle from "./models/stateModle";
import { Cloud } from "lucide-react";

export default function DirectoryHeader() {
  const param = useParams();
  const [open, setOpen] = useState(false);

  const [directoryName, setDirectoryName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [openModle, setOpenModle] = useState(false);
  const [
    uploadFile,
    {
      isLoading: isUploadLoading,
      isError: isUploadError,
      error: uploadError,
      reset: resetUpload,
    },
  ] = useUploadFileMutation();
  const [createDirectory] = useCreateDirectoryMutation();
  const { data, error } = useFetchUserQuery();
  const [logout, isSucess] = useLogoutMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (error?.status == 401) {
      navigate("/login");
    }
  }, [error]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();

      setUser(null);
      setOpen(false);

      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleUplaodFile = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    const form = new FormData();
    form.append("file", file);

    uploadFile({
      paramId: param.id,
      form,
    });

    e.target.value = "";
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) {
      return "0 Bytes";
    }

    const units = ["Bytes", "KB", "MB", "GB", "TB"];

    const index = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
  };

  return (
    <div className="flex items-center justify-between bg-white px-6 py-3 shadow-md">
      {/* Logo/Title */}
      <Link
        to="/"
        className="text-xl flex items-center gap-2 font-bold text-gray-700"
      >
        <Cloud className="h-7 w-7 " />
        storely
      </Link>

      {/* Action buttons */}
      <div className="flex items-center gap-4 justify-center">
        {/* Create Folder */}
        <button
          className="rounded-lg bg-blue-500 p-2 text-white shadow hover:bg-blue-600"
          onClick={() => setOpenModle(true)}
        >
          <FaFolderPlus />
        </button>

        {/* Upload File */}
        <label
          htmlFor="file"
          className="cursor-pointer rounded-lg bg-green-500 p-2 text-white shadow hover:bg-green-600"
        >
          <FaUpload />
        </label>
        <input
          type="file"
          id="file"
          name="file"
          className="hidden"
          onChange={handleUplaodFile}
        />

        {/* User Menu */}
        {data && (
          <div className="relative">
            {/* Avatar */}
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 transition hover:border-gray-300 hover:bg-gray-100"
            >
              {data.picture ? (
                <img
                  src={data.picture}
                  alt={data.name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FaUser className="text-sm text-gray-500" />
              )}
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                {/* User */}
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                      {data.picture ? (
                        <img
                          src={data.picture}
                          alt={data.name || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FaUser className="text-sm text-gray-500" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {data.name || "User"}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {data.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Storage */}
                {data.storage && (
                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Storage
                      </span>

                      <span className="text-xs font-medium text-gray-500">
                        {Math.min(data.storage.percentage, 100).toFixed(1)}%
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-300"
                        style={{
                          width: `${Math.min(data.storage.percentage, 100)}%`,
                        }}
                      />
                    </div>

                    {/* Storage info */}
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                      <span>{formatBytes(data.storage.used)} used</span>

                      <span>{formatBytes(data.storage.limit)}</span>
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      {formatBytes(data.storage.remaining)} available
                    </p>
                  </div>
                )}

                <div className="border-t border-gray-100" />

                {/* Logout */}
                <div className="p-3">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Modle
        isOpen={openModle}
        onClose={setOpenModle}
        saveChange={() => {
          createDirectory({ folderName: directoryName, parentId: param.id });
          setOpenModle(false);
        }}
        InputValue={directoryName}
        onInputChange={(e) => setDirectoryName(e.target.value)}
      />

      <StateModle
        file={selectedFile}
        isLoading={isUploadLoading}
        isError={isUploadError}
        error={uploadError}
        onClose={() => {
          resetUpload();
          setSelectedFile(null);
        }}
      />
    </div>
  );
}
