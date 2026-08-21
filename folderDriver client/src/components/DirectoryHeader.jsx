import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaFolderPlus, FaUser, FaUpload, FaSignOutAlt } from "react-icons/fa";
import { ChevronDown, Cloud, HardDrive, Settings } from "lucide-react";

import Modle from "./models/Modle.jsx";
import StateModle from "./models/stateModle.jsx";

import {
  useCreateDirectoryMutation,
  useUploadFileMutation,
} from "../store/slices/Flieslice";

import {
  useFetchUserQuery,
  useLogoutMutation,
} from "../store/slices/UserSlice";

import { toast } from "sonner";
import Profile from "./ui/profile";

export default function DirectoryHeader() {
  const param = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (error?.status === 401) {
      navigate("/auth/login");
    }
  }, [error, navigate]);

  const handleUploadFile = (e) => {
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

  const handleCreateDirectory = async () => {
    if (!directoryName.trim()) {
      toast.error("Folder name is required");
      return;
    }

    try {
      await createDirectory({
        folderName: directoryName.trim(),
        parentId: param.id,
      }).unwrap();

      setDirectoryName("");
      setOpenModle(false);

      toast.success("Folder created successfully");
    } catch (error) {
      toast.error("Failed to create folder");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div
          className="
            mx-auto flex h-16 w-full max-w-[1800px]
            items-center justify-between
            px-3
            sm:px-5
            md:h-[68px]
            md:px-6
            lg:px-8
          "
        >
          {/* ================= LOGO ================= */}
          <Link to="/" className="group flex min-w-0 items-center gap-2.5">
            <div
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-xl
                bg-blue-600
                text-white
                shadow-sm
                transition
                group-hover:bg-blue-700
                group-hover:shadow-md
                sm:h-10
                sm:w-10
              "
            >
              <Cloud
                size={19}
                strokeWidth={2.2}
                className="sm:h-[21px] sm:w-[21px]"
              />
            </div>

            <div className="hidden xs:block sm:block">
              <h1 className="text-[16px] font-bold tracking-tight text-gray-900 sm:text-[17px]">
                Storely
              </h1>

              <p className="hidden text-[10px] font-medium uppercase tracking-wider text-gray-400 sm:block">
                Cloud Storage
              </p>
            </div>
          </Link>

          {/* ================= ACTIONS ================= */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Create Folder */}
            <button
              type="button"
              onClick={() => setOpenModle(true)}
              title="Create folder"
              aria-label="Create folder"
              className="
                group flex
                h-9 w-9
                items-center justify-center
                rounded-xl
                border border-gray-200
                bg-white
                text-gray-600
                shadow-sm
                transition-all
                hover:border-blue-200
                hover:bg-blue-50
                hover:text-blue-600
                active:scale-95
                sm:h-10
                sm:w-auto
                sm:gap-2
                sm:px-3
              "
            >
              <FaFolderPlus
                size={14}
                className="transition-transform group-hover:scale-110"
              />

              <span className="hidden text-sm font-medium sm:block">
                New folder
              </span>
            </button>

            {/* Upload */}
            <label
              htmlFor="file"
              title="Upload file"
              className="
                group flex
                h-9 w-9
                shrink-0
                cursor-pointer
                items-center justify-center
                rounded-xl
                bg-blue-600
                text-white
                shadow-sm
                transition-all
                hover:bg-blue-700
                hover:shadow-md
                active:scale-95
                sm:h-10
                sm:w-auto
                sm:gap-2
                sm:px-3
              "
            >
              <FaUpload
                size={13}
                className="transition-transform group-hover:-translate-y-0.5"
              />

              <span className="hidden text-sm font-medium sm:block">
                Upload
              </span>
            </label>

            <input
              type="file"
              id="file"
              name="file"
              className="hidden"
              onChange={handleUploadFile}
            />

            {/* Divider */}
            <div className="mx-0.5 hidden h-8 w-px bg-gray-200 sm:block" />

            {/* ================= USER ================= */}
            <Profile />
          </div>
        </div>
      </header>

      {/* Create Folder */}
      <Modle
        isOpen={openModle}
        onClose={setOpenModle}
        saveChange={handleCreateDirectory}
        InputValue={directoryName}
        onInputChange={(e) => setDirectoryName(e.target.value)}
      />

      {/* Upload */}
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
    </>
  );
}
