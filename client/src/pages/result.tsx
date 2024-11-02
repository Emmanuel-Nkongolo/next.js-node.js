import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface FileInfo {
  originalName: string;
  mimetype: string;
  size: number;
}

interface ProcessedData {
  fullName: string;
  age: number;
  extractedText: string;
  fileInfo: FileInfo;
}

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<ProcessedData | null>(null);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("processedData");
      if (storedData) {
        setData(JSON.parse(storedData));
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error parsing stored data:", error);
      router.push("/");
    }
  }, [router]);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Results</h1>

        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
            <p>
              <span className="font-medium">Full Name:</span> {data.fullName}
            </p>
            <p>
              <span className="font-medium">Age:</span> {data.age}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Extracted Text</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="whitespace-pre-wrap">{data.extractedText}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Process Another Document
          </button>
        </div>
      </div>
    </div>
  );
}
