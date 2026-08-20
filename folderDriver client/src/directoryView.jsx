import DirectoryList from "./components/DirectoryList";
import DirectoryHeader from "./components/DirectoryHeader";
import { useGetFileQuery } from "./store/slices/Flieslice";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { AlertCircle, FolderOpen, Loader2 } from "lucide-react";

export default function DirectoryView() {
  const param = useParams();
  const navigate = useNavigate();

  const {
    data: DriveData,
    isLoading,
    isError,
    error,
  } = useGetFileQuery(param.id);

  useEffect(() => {
    if (error?.status === 401) {
      navigate("/auth/login");
    }
  }, [error, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <DirectoryHeader />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Page heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Files</h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your files and folders
            </p>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />

                <p className="text-sm font-medium text-gray-500">
                  Fetching your files...
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {!isLoading && isError && error?.status !== 401 && (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-red-200 bg-white shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 rounded-full bg-red-100 p-3">
                  <AlertCircle className="h-7 w-7 text-red-500" />
                </div>

                <h2 className="font-semibold text-gray-800">
                  Something went wrong
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  We couldn't load your files. Please try again.
                </p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && !DriveData?.length && (
            <div className="flex min-h-[350px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white shadow-sm">
              <div className="flex max-w-sm flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-blue-50 p-4">
                  <FolderOpen className="h-10 w-10 text-blue-500" />
                </div>

                <h2 className="text-lg font-semibold text-gray-800">
                  Your folder is empty
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Upload a file or create a folder to start organizing your
                  files in Storely.
                </p>
              </div>
            </div>
          )}

          {/* Files */}
          {!isLoading && !isError && DriveData?.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <DirectoryList DriveData={DriveData} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
