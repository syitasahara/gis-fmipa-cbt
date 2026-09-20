"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  Calendar,
} from "lucide-react";
import { authAPI, removeToken } from "./utils/api";
import {
  checkExamSchedule,
  examSchedules,
  getCurrentExamStatus,
  getTimeUntilExamStarts,
} from "./utils/examSchedule";
import { isExamInProgress } from "./utils/examProtection";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [examStatuses, setExamStatuses] = useState({});
  const [currentTime, setCurrentTime] = useState(
    new Date().toTimeString().slice(0, 5),
  );
  const [hasActiveExam, setHasActiveExam] = useState(false);

  // Update current time and exam statuses every minute
  useEffect(() => {
    // Only redirect to quiz if exam is in progress AND user is authenticated
    if (isExamInProgress()) {
      // Check if user has a valid token before redirecting
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      if (token) {
        console.log(
          "Exam in progress and user authenticated, redirecting to quiz",
        );
        router.push("/quiz");
        return;
      } else {
        console.log(
          "Exam in progress but user not authenticated, staying on login",
        );
        // Clear exam protection cookies if user is not authenticated
        if (typeof document !== "undefined") {
          document.cookie =
            "examStarted=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
          document.cookie =
            "examStartTime=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
          document.cookie =
            "examEndTime=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        }
        if (typeof window !== "undefined") {
          localStorage.removeItem("examStarted");
          localStorage.removeItem("examStartTime");
          localStorage.removeItem("examEndTime");
        }
      }
    }

    const updateStatus = () => {
      setCurrentTime(new Date().toTimeString().slice(0, 5));
      const statuses = getCurrentExamStatus();
      setExamStatuses(statuses);

      // Check if any exam is currently active
      const hasActive = Object.values(statuses).some(
        (status) => status.status === "active",
      );
      setHasActiveExam(hasActive);
    };

    // Initial update
    updateStatus();

    // Update every minute
    const interval = setInterval(updateStatus, 60000);

    return () => clearInterval(interval);
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authAPI.login(formData.email, formData.password);

      // Login successful, redirect to start-exam page
      console.log("Login successful, redirecting to start-exam");
      // Small delay to ensure token is properly set
      setTimeout(() => {
        router.push("/start-exam");
      }, 100);
    } catch (err) {
      // Handle different types of errors
      let errorMessage = "Login gagal. Periksa email dan password Anda.";

      if (err.message.includes("Login failed")) {
        errorMessage =
          "Akun Anda tidak aktif. Silakan hubungi administrator untuk mengaktifkan akun Anda.";
      } else if (err.message.includes("Koneksi ke server gagal")) {
        errorMessage =
          "Salah username atau password. Lalu, periksa koneksi internet Anda.";
      } else if (err.message.includes("Masalah akses server")) {
        errorMessage =
          "Terjadi masalah teknis. Tim kami sedang memperbaikinya.";
      } else if (
        err.message.includes("Unauthorized") ||
        err.message.includes("401")
      ) {
        errorMessage = "Email atau password salah. Silakan coba lagi.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-1 gap-0">
            {/* Left Column - Login Form */}
            <div className="p-8 lg:p-10">
              {/* Header */}
              <div className="text-center mb-2">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg mx-auto w-fit mb-4 lg:hidden">
                  <LogIn className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent mb-2">
                  Login Peserta
                </h1>
                <p className="text-purple-600/80 lg:text-gray-600">
                  <span className="lg:hidden">Gebyar Ilmiah Sains - CBT</span>
                  <span className="hidden lg:inline">
                    Masuk ke sistem ujian online
                  </span>
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  className={`border-2 rounded-xl p-4 mb-6 flex items-start space-x-3 ${
                    error.includes("dimulai") || error.includes("berakhir")
                      ? "bg-amber-50 border-amber-300"
                      : error.includes("tidak aktif") ||
                          error.includes("belum diverifikasi")
                        ? "bg-orange-50 border-orange-300"
                        : "bg-red-50 border-red-300"
                  }`}
                >
                  <AlertCircle
                    className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      error.includes("dimulai") || error.includes("berakhir")
                        ? "text-amber-500"
                        : error.includes("tidak aktif") ||
                            error.includes("belum diverifikasi")
                          ? "text-orange-500"
                          : "text-red-500"
                    }`}
                  />
                  <div className="flex-1">
                    <span
                      className={`text-sm font-medium ${
                        error.includes("dimulai") || error.includes("berakhir")
                          ? "text-amber-700"
                          : error.includes("tidak aktif") ||
                              error.includes("belum diverifikasi")
                            ? "text-orange-700"
                            : "text-red-700"
                      }`}
                    >
                      {error}
                    </span>
                    {(error.includes("dimulai") ||
                      error.includes("berakhir")) && (
                      <div className="mt-2">
                        <button
                          onClick={() => router.push("/schedule")}
                          className="text-xs text-amber-800 underline hover:text-amber-900 font-medium transition-colors"
                        >
                          Lihat detail jadwal ujian →
                        </button>
                      </div>
                    )}
                    {(error.includes("tidak aktif") ||
                      error.includes("belum diverifikasi")) && (
                      <div className="mt-2">
                        <p className="text-xs text-orange-800 font-medium">
                          💡 Hubungi administrator untuk mengaktifkan akun Anda
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 text-gray-700 rounded-xl transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 hover:border-gray-300"
                      placeholder="Masukkan email Anda"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-14 py-4 border-2 border-gray-200 text-gray-700 rounded-xl transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 hover:border-gray-300"
                      placeholder="Masukkan password Anda"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Masuk</span>
                    </>
                  )}
                </button>
              </form>

              {/* Important Notice */}
              <div className="mt-4 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl shadow-sm">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-amber-800 mb-2">
                      Perhatian Penting
                    </h4>
                    <p className="text-sm text-amber-800 mb-4 leading-relaxed">
                      Anda bisa login kapan saja, namun ujian baru dapat dimulai
                      tepat waktu sesuai jadwal jenjang Anda.
                    </p>
                    <button
                      onClick={() => router.push("/schedule")}
                      className="inline-flex items-center px-4 py-2 bg-amber-200 text-amber-900 rounded-lg hover:bg-amber-300 font-semibold text-sm transition-all duration-200 group shadow-sm"
                    >
                      Lihat Detail Jadwal
                      <span className="ml-2 group-hover:ml-3 transition-all duration-200">
                        →
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
