import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { userSchema, type UserFormData } from "@/schema/userSchema";
import { ZodError } from "zod";

export default function FormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for the field being changed
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      // Clear file error if it exists
      if (errors.file) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.file;
          return newErrors;
        });
      }
    }
  };

  const validateForm = async () => {
    try {
      await userSchema.parseAsync(formData);
      if (!file) {
        throw new Error("Please select a file");
      }
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      } else if (error instanceof Error) {
        setErrors({ file: error.message });
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const isValid = await validateForm();
    if (!isValid) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", file as File);
      formDataToSend.append("userData", JSON.stringify(formData));

      const response = await axios.post(
        "http://localhost:4001/api/upload",
        formDataToSend,
        {
          headers: {
            "Content-type": "multipart/form-data",
          },
        }
      );

      localStorage.setItem("processedData", JSON.stringify(response.data.data)); // Store the result in localStorage
      router.push("/result");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error?.message ||
          "An error occurred while uploading";
        setErrors({ submit: errorMessage });
      } else {
        setErrors({ submit: "An unexpected error occurred" });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderError = (field: string) => {
    return errors[field] ? (
      <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
    ) : null;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Upload Document</h1>

        {errors.submit && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              } px-3 py-2`}
            />
            {renderError("firstName")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              } px-3 py-2`}
            />
            {renderError("lastName")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.dateOfBirth ? "border-red-500" : "border-gray-300"
              } px-3 py-2`}
            />
            {renderError("dateOfBirth")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={`mt-1 block w-full ${
                errors.file ? "text-red-500" : "text-gray-700"
              }`}
            />
            {renderError("file")}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
