"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // ✅ FIXED

    const res = await fetch("/api/classify", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    router.push(`/result?item=${data.detectedItem}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-green-50 to-green-200">

      <div className="px-10 py-6">
        <Link href="/" className="text-2xl font-bold text-green-700">
          Upyog ♻️
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-6">
        <div className="bg-white w-full max-w-lg p-10 rounded-2xl shadow-xl border border-green-200 text-center">

          <h1 className="text-3xl font-bold text-green-700">
            Upload Your Item
          </h1>

          <p className="text-green-600 mt-3">
            Let AI detect your product
          </p>

          <label className="mt-8 flex flex-col items-center justify-center border-2 border-dashed border-green-400 rounded-xl p-12 cursor-pointer hover:bg-green-50 transition">
            <span className="text-green-700 font-medium">
              Click to upload image
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
              className="hidden"
            />
          </label>

          {preview && (
            <div className="mt-6">
              <img
                src={preview}
                alt="Preview"
                className="rounded-xl max-h-64 mx-auto shadow-md"
              />
            </div>
          )}

          {file && (
            <button
              onClick={handleAnalyze}
              className="mt-8 bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition"
            >
              Analyze Item →
            </button>
          )}

        </div>
      </div>
    </div>
  );
}