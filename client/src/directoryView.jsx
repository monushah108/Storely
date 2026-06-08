import DirectoryList from "./components/DirectoryList";
import DirectoryHeader from "./components/DirectoryHeader";
import { useGetFileQuery } from "./store/slices/Flieslice";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DirectoryView() {
  const param = useParams();
  const {
    data: DriveData,
    isLoading,
    isError,
    error,
  } = useGetFileQuery(param.id);
  const [onProgress, setOnprogress] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (error?.status == 401) {
      navigate("/login");
    }
  }, [error]);

  return (
    <div className="flex h-screen flex-col bg-gray-50 ">
      <DirectoryHeader setOnprogress={setOnprogress} onProgress={onProgress} />
      <main>
        {isError ? (
          "something is wrong"
        ) : isLoading ? (
          <p className="font-semibold text-lg m-3">...Fetching Data</p>
        ) : DriveData.length > 0 ? (
          <DirectoryList DriveData={DriveData} onProgress={onProgress} />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500 mt-4 font-semibold">
            No files or directories found.
          </div>
        )}
      </main>
    </div>
  );
}
