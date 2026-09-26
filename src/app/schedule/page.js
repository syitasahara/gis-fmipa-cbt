"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  FlaskConical,
  ClipboardList,
  Trophy,
  Play,
  ChevronRight,
} from "lucide-react";

import { getCurrentExamStatus, examSchedules } from "../utils/examSchedule";
import { isExamInProgress } from "../utils/examProtection";
import {
  modeSchedules,
  getModeSchedule,
  checkModeActive,
} from "../utils/examSchedule";

const MODE_ICONS = {
  simulasi: FlaskConical,
  tryout: ClipboardList,
  penyisihan: Trophy,
};

export default function ExamSchedulePage() {
  const router = useRouter();
  const [examStatuses, setExamStatuses] = useState({});
  const [modeStatuses, setModeStatuses] = useState({});
  const [currentTime, setCurrentTime] = useState(
    new Date().toTimeString().slice(0, 5),
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update current time and exam statuses every minute
  useEffect(() => {
    // Jika ujian sedang berlangsung, redirect ke quiz
    if (isExamInProgress()) {
      router.push("/quiz");
      return;
    }

    const updateStatus = () => {
      setCurrentTime(new Date().toTimeString().slice(0, 5));
      setExamStatuses(getCurrentExamStatus());
    };

    const updateStatuses = () => {
      const statuses = {};
      Object.keys(modeSchedules).forEach((key) => {
        statuses[key] = {
          sd: checkModeActive(key, "sd"),
          smp: checkModeActive(key, "smp"),
        };
      });
      setModeStatuses(statuses);
    };

    // Initial update
    updateStatus();
    updateStatuses();
    // Update every minute
    const interval = setInterval(() => {
      updateStatus();
      updateStatuses();
    }, 60000);

    return () => clearInterval(interval);
  }, [router]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setCurrentTime(new Date().toTimeString().slice(0, 5));
    setExamStatuses(getCurrentExamStatus());
    const statuses = {};
    Object.keys(modeSchedules).forEach((key) => {
      statuses[key] = {
        sd: checkModeActive(key, "sd"),
        smp: checkModeActive(key, "smp"),
      };
    });
    setModeStatuses(statuses);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getStatusInfo = (status) => {
    switch (status.status) {
      case "active":
        return {
          color: "green",
          bgColor: "bg-green-50",
          borderColor: "border-green-300",
          textColor: "text-green-700",
          icon: "🟢",
          label: "Sedang Berlangsung",
        };
      case "not_started":
        return {
          color: "blue",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-300",
          textColor: "text-blue-700",
          icon: "🔵",
          label: "Belum Dimulai",
        };
      case "ended":
        return {
          color: "red",
          bgColor: "bg-red-50",
          borderColor: "border-red-300",
          textColor: "text-red-700",
          icon: "🔴",
          label: "Telah Berakhir",
        };
      default:
        return {
          color: "gray",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-300",
          textColor: "text-gray-700",
          icon: "⚪",
          label: "Tidak Diketahui",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/start-exam")}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Jadwal Ujian SC
                </h1>
                <p className="text-gray-600">Gebyar Ilmiah Sains</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Waktu Saat Ini</p>

              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="text-lg font-semibold text-purple-700">
                  {currentTime}
                </span>
                <button
                  onClick={handleRefresh}
                  className={`p-1 text-purple-600 hover:text-purple-800 transition ${isRefreshing ? "animate-spin" : ""}`}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Current Status Alert */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Status Ujian Saat Ini
            </h2>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(examSchedules).map(([jenjang, schedule]) => {
              const status = examStatuses[jenjang] || { status: "unknown" };
              const statusInfo = getStatusInfo(status);

              return (
                <div
                  key={jenjang}
                  className={`p-6 rounded-xl border-2 ${statusInfo.bgColor} ${statusInfo.borderColor} transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800">
                      {jenjang}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.textColor} bg-white border`}
                    >
                      {statusInfo.icon} {statusInfo.label}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Waktu Ujian:</span>
                      <span className="font-semibold text-gray-800">
                        {schedule.startTime} - {schedule.endTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Durasi:</span>
                      <span className="font-semibold text-gray-800">
                        90 menit
                      </span>
                    </div>
                  </div>

                  {status.message && (
                    <div
                      className={`mt-4 p-3 rounded-lg ${statusInfo.bgColor} border ${statusInfo.borderColor}`}
                    >
                      <p className={`text-sm ${statusInfo.textColor}`}>
                        {status.message}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div> */}
          {/* Mode Selection Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {Object.entries(modeSchedules).map(([key, schedule]) => {
              const Icon = MODE_ICONS[key] || BookOpen;

              const accent =
                {
                  simulasi: {
                    border: "border-violet-200",
                    iconBg: "bg-violet-100",
                    iconText: "text-violet-600",
                    gradient: "from-violet-700 to-purple-700",
                    badge: "bg-green-200 text-green-800 animate-pulse",
                  },
                  tryout: {
                    border: "border-purple-200",
                    iconBg: "bg-purple-100",
                    iconText: "text-purple-600",
                    gradient: "from-purple-700 to-fuchsia-700",
                    badge: "bg-green-200 text-green-800 animate-pulse",
                  },
                  penyisihan: {
                    border: "border-fuchsia-200",
                    iconBg: "bg-fuchsia-100",
                    iconText: "text-fuchsia-600",
                    gradient: "from-fuchsia-700 to-pink-700",
                    badge: "bg-green-200 text-green-800 animate-pulse",
                  },
                }[key] || {};

              return (
                <div
                  key={key}
                  className={`relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border-2 ${accent.border} text-left transition-all duration-300 pointer-events-none`}
                >
                  <div
                    className={`${accent.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-7 h-7 ${accent.iconText}`} />
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {schedule.label}
                  </h3>

                  <div className="space-y-3">
                    {["sd", "smp"].map((jenjang) => {
                      const levelSchedule = getModeSchedule(key, jenjang);
                      const status = modeStatuses[key]?.[jenjang] || {
                        status: "unknown",
                      };
                      const isActive = status.status === "active";
                      const statusLabel =
                        status.status === "active"
                          ? "Dibuka"
                          : status.status === "not_started"
                            ? "Belum dimulai"
                            : status.status === "ended"
                              ? "Berakhir"
                              : "Memuat";

                      return (
                        <div
                          key={jenjang}
                          className="flex items-center justify-between gap-3 text-sm text-gray-600"
                        >
                          <span className="font-semibold uppercase">
                            {jenjang}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {levelSchedule.startTime} - {levelSchedule.endTime}
                          </span>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {statusLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Informasi Penting
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-800 mb-2">
                Aturan Akses Ujian
              </h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>
                  • Login hanya dapat dilakukan sesuai jadwal jenjang
                  masing-masing
                </li>
                <li>
                  • Sistem akan menolak login di luar waktu yang ditentukan
                </li>
                <li>
                  • Pastikan Anda login tepat waktu sesuai jadwal jenjang Anda
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                Ketentuan Ujian
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Durasi ujian adalah 90 menit untuk semua jenjang</li>
                <li>
                  • Tidak diperbolehkan meninggalkan halaman ujian (tab
                  switching)
                </li>
                <li>
                  • Pelanggaran sebanyak 5 kali akan mengakibatkan
                  diskualifikasi otomatis
                </li>
                <li>
                  • Jawaban akan otomatis tersimpan setiap kali Anda menjawab
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Tips Sukses</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Pastikan koneksi internet stabil</li>
                <li>
                  • Gunakan browser yang mendukung (Chrome, Firefox, Safari)
                </li>
                <li>• Tutup aplikasi lain yang tidak diperlukan</li>
                <li>• Baca soal dengan teliti sebelum menjawab</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Auto Refresh Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Halaman ini akan otomatis memperbarui status setiap menit. Klik
            tombol refresh untuk memperbarui manual.
          </p>
        </div>
      </div>
    </div>
  );
}
