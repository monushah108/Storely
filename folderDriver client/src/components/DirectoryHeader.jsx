import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
      <h2 className="text-xl flex items-center gap-2 font-bold text-gray-700">
        <img src="icon.png" height="30px" width="30px" />
        storely
      </h2>

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
          <div className="relative align-text-bottom">
            <button
              className="rounded-full  hover:bg-gray-300 cursor-pointer align-bottom"
              onClick={() => setOpen(!open)}
            >
              {data.picture ? (
                <img
                  src={data.picture}
                  alt={data.name}
                  className="h-8 rounded-full"
                />
              ) : (
                <FaUser />
              )}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-64 rounded-lg border bg-white p-4 shadow-lg">
                {/* User information */}
                <p className="font-medium text-gray-800">{data.name}</p>

                <p className="text-sm text-gray-500">{data.email}</p>

                <hr className="my-3" />

                {/* Storage */}
                {data.storage && (
                  <div className="mb-4">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Storage
                      </span>

                      <span className="text-xs text-gray-500">
                        {data.storage.percentage.toFixed(1)}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-300"
                        style={{
                          width: `${Math.min(data.storage.percentage, 100)}%`,
                        }}
                      />
                    </div>

                    {/* Storage numbers */}
                    <div className="mt-1 flex justify-between text-xs text-gray-500">
                      <span>{formatBytes(data.storage.used)}</span>

                      <span>{formatBytes(data.storage.limit)}</span>
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      {formatBytes(data.storage.remaining)} available
                    </p>
                  </div>
                )}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full rounded-md bg-red-500 px-3 py-1 text-sm font-semibold text-white hover:bg-red-600"
                >
                  Logout
                </button>
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
