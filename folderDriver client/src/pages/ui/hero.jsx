import { ArrowRight, Check, Cloud, Folder, Lock, Upload } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Hero({ data }) {
  const navigate = useNavigate();
  return (
    <main>
      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            {/* Hero text */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600">
                <Cloud className="h-3.5 w-3.5" />
                Simple cloud storage
              </div>

              <h1 className="max-w-xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Keep your files organized and easy to access.
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-gray-500 sm:text-lg">
                Storely gives you a simple place to upload, organize, and manage
                your files without the clutter.
              </p>
              {data ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  className=" mt-8  inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Dashboard
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => navigate("/register")}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Get started
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => navigate("/login")}
                    className="rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Sign in
                  </button>
                </div>
              )}

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  Easy to use
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  Secure storage
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  Simple sharing
                </div>
              </div>
            </div>

            {/* Product preview */}
            <div className="relative">
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                {/* Fake header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <p className="text-xs text-gray-400">Storely</p>
                    <h3 className="mt-1 text-lg font-semibold text-gray-800">
                      My Files
                    </h3>
                  </div>

                  <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white">
                    <Upload className="h-3.5 w-3.5" />
                    Upload
                  </button>
                </div>

                {/* Folders */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {["Projects", "Documents", "Images", "Videos"].map(
                    (folder) => (
                      <div
                        key={folder}
                        className="rounded-lg border border-gray-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/30"
                      >
                        <Folder className="h-6 w-6 text-blue-500" />

                        <p className="mt-3 text-sm font-medium text-gray-700">
                          {folder}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">12 files</p>
                      </div>
                    ),
                  )}
                </div>

                {/* Files */}
                <div className="mt-5">
                  <p className="mb-3 text-xs font-medium text-gray-500">
                    Recent files
                  </p>

                  <div className="space-y-2">
                    {["Project.pdf", "Resume.pdf", "design.png"].map((file) => (
                      <div
                        key={file}
                        className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-blue-50" />

                          <span className="text-xs font-medium text-gray-600">
                            {file}
                          </span>
                        </div>

                        <span className="text-[10px] text-gray-400">
                          2.4 MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Small floating security card */}
              <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex">
                <div className="rounded-lg bg-green-50 p-2">
                  <Lock className="h-4 w-4 text-green-600" />
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-700">
                    Your files are protected
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400">
                    Secure access
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-gray-200 bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-blue-600">
              EVERYTHING YOU NEED
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              A simple way to manage your files.
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Storely keeps your files organized so you can spend less time
              managing them and more time using them.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={Upload}
              title="Upload files"
              description="Upload your documents, images, videos and other files in one place."
            />

            <Feature
              icon={Folder}
              title="Organize folders"
              description="Create folders and keep your workspace clean and easy to navigate."
            />

            <Feature
              icon={Lock}
              title="Keep files secure"
              description="Your files stay inside your account and are accessible only to you."
            />
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm sm:px-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to organize your files?
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500">
            Create your Storely account and start keeping everything in one
            simple place.
          </p>

          <button
            onClick={() => navigate("/register")}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Create your account
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </main>
  );
}

function Feature({ icon: Icon, title, description }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>

      <h3 className="mt-5 text-base font-semibold text-gray-800">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
    </div>
  );
}
