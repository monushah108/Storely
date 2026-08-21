import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Loader, Skull, User } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function Guest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/share/${id}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (res.status === 404) {
        setError(data.message);
      }

      if (res.status == 410) {
        setError(data.message);
      }

      setFile(data);
      setLoading(false);
    } catch (err) {
      toast.error("failed to load data");
      console.log(err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="animate-spin" />
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center gap-1 font-semibold">
        <Skull className="animate-pulse text-red-500" size={32} />
        {error}
      </div>
    );
  }
  console.log(!file);

  if (!file) return null;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <Toaster richColors position="top-center" />
      <div className="mx-auto max-w-6xl space-y-4">
        {/* Header */}
        <div className="rounded-2xl bg-white p-5 shadow">
          <div className="flex items-center gap-4">
            <FileText className="h-10 w-10 text-blue-500" />

            <div className="flex-1 overflow-hidden">
              <h1 className="truncate text-lg font-semibold">{file.name}</h1>

              <p className="mt-1 text-sm text-gray-500">
                Shared by {file.userId.name}
              </p>
            </div>

            <img
              src={file.userId.picture}
              className="h-12 w-12 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="overflow-hidden rounded-2xl bg-white shadow">
          {file.resourceType === "video" ? (
            <video controls className="h-[70vh] w-full bg-black">
              <source src={file.url} />
            </video>
          ) : (
            <iframe
              src={file.url}
              title={file.name}
              className="h-[80vh] w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
