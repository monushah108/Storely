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

export default function DirectoryHeader({ onProgress, setOnprogress }) {
  const param = useParams();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  // Create folder modal
  const [directoryName, setDirectoryName] = useState("");

  //modle
  const [openModle, setOpenModle] = useState(false);
  const [uploadFile] = useUploadFileMutation();
  const [createDirectory] = useCreateDirectoryMutation();
  const { data, error } = useFetchUserQuery();
  const [logout] = useLogoutMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (error?.status == 401) {
      navigate("/login");
    }
  }, [error]);

  useEffect(() => {
    if (onProgress == 100) {
      setOnprogress(null);
    }
  }, [onProgress]);

  const handleLogout = () => {
    logout();
    setUser(null);
    setOpen(false);
  };

  const handleUplaodFile = (e) => {
    const file = e.target.files[0];

    uploadFile({ paramId: param.id, file, onProgress: setOnprogress });
  };

  return (
    <div className="flex items-center justify-between bg-white px-6 py-3 shadow-md">
      {/* Logo/Title */}
      <h2 className="text-xl font-bold text-gray-700">📂 Folder Driver</h2>

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
              <div className="absolute right-0 mt-2 w-48 rounded-lg border bg-white p-4 shadow-lg">
                <p className="font-medium text-gray-800">{data.name}</p>
                <p className="text-sm text-gray-500">{data.email}</p>
                <hr className="my-2" />
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
    </div>
  );
}
