"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  isAuthenticated,
  authAPI,
  answersAPI,
  removeToken,
  getToken,
  getPesertaId,
} from "../utils/api";
import {
  useStartExamProtection,
  isExamInProgress,
} from "../utils/examProtection";
import {
  modeSchedules,
  getModeSchedule,
  checkModeActive,
} from "../utils/examSchedule";
import { deleteCookie } from "../utils/cookies";
import {
  BookOpen,
  Clock,
  Calendar,
  Users,
  Play,
  ChevronRight,
  User,
  LogOut,
  CheckCircle,
  FlaskConical,
  ClipboardList,
  Trophy,
  AlertCircle,
} from "lucide-react";

// Icon per mode ujian
const MODE_ICONS = {
  simulasi: FlaskConical,
  tryout: ClipboardList,
  penyisihan: Trophy,
};

export default function StartExam() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modeStatuses, setModeStatuses] = useState({});
  const [examError, setExamError] = useState("");
  const [isStartingExam, setIsStartingExam] = useState(false);

  // State untuk dropdown menu logout
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { startExam } = useStartExamProtection();

  // Durasi ujian dari .env (menit)
  const examDurationMinutes =
    parseInt(process.env.NEXT_PUBLIC_EXAM_DURATION_MINUTES, 10) || 60;

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        // Token hasil login dibaca dari localStorage 'authToken' (diset oleh authAPI.login)
        const token = getToken();
        console.log(
          "🎫 START-EXAM: Token dari login:",
          token ? `✅ ${token.substring(0, 25)}...` : "❌ tidak ada",
        );

        if (!token || !isAuthenticated()) {
          if (isMounted) {
            router.push("/login");
          }
          return;
        }

        // Check if exam is in progress
        if (isExamInProgress()) {
          console.log("Exam already in progress, redirecting to quiz");
          if (isMounted) {
            router.push("/quiz");
          }
          return;
        }

        // User + data peserta (jenjang/sekolah/kelas dari /master/peserta/{id})
        const userData = await authAPI.getCurrentUserWithPeserta();
        if (isMounted) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth error:", error);

        // Clear invalid token
        removeToken();

        if (isMounted) {
          setTimeout(() => {
            router.push("/");
          }, 1000);
        }
        return;
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Refresh status jendela waktu tiap mode dan jenjang setiap 30 detik
  useEffect(() => {
    const updateStatuses = () => {
      const statuses = {};
      Object.keys(modeSchedules).forEach((key) => {
        statuses[key] = checkModeActive(key, user?.jenjang);
      });
      setModeStatuses(statuses);
    };

    updateStatuses();
    const interval = setInterval(updateStatuses, 30000);
    return () => clearInterval(interval);
  }, [user?.jenjang]);

  // Pilih mode ujian → cek jendela waktunya → mulai ujian
  const handleSelectMode = async (modeKey) => {
    if (isStartingExam) return;

    const scheduleCheck = checkModeActive(modeKey, user?.jenjang);
    if (!scheduleCheck.allowed) {
      setExamError(scheduleCheck.message);
      return;
    }

    setIsStartingExam(true);
    setExamError("");

    try {
      if (modeKey === "simulasi" || modeKey === "tryout") {
        let pesertaId = getPesertaId();
        if (!pesertaId && user) {
          pesertaId = user.pesertaId || user.peserta?.id || null;
        }
        if (!pesertaId) throw new Error("Peserta ID tidak ditemukan");

        // Jawaban peserta tidak memiliki session id di backend, jadi hapus
        // jawaban lama sebelum memulai sesi simulasi/tryout baru.
        await answersAPI.clearUserAnswers(pesertaId);
        deleteCookie(`ragu_ragu_${user.id}_${user.jenjang}`);
      }

      console.log(`🚀 START-EXAM: Mode dipilih: ${modeKey}`);
      localStorage.setItem("examMode", modeKey);
      startExam();
      router.push("/quiz");
    } catch (error) {
      console.error("Gagal mereset sesi ujian:", error);
      setExamError("Sesi sebelumnya belum dapat direset. Silakan coba lagi.");
      setIsStartingExam(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("examMode");
      await authAPI.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    }
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "";

    const d1 = new Date(startDate);
    const d2 = new Date(endDate);

    // Ambil tanggal, nama bulan, dan tahun untuk d1 dan d2
    const day1 = d1.getDate();
    const month1 = d1.toLocaleDateString("id-ID", { month: "long" });
    const year1 = d1.getFullYear();

    const day2 = d2.getDate();
    const month2 = d2.toLocaleDateString("id-ID", { month: "long" });
    const year2 = d2.getFullYear();

    // Kondisi 1: Jika di hari yang sama persis (contoh: 20 September 2026)
    if (year1 === year2 && month1 === month2 && day1 === day2) {
      return `${day1} ${month1} ${year1}`;
    }

    // Kondisi 2: Jika Bulan dan Tahun sama (contoh: 20 - 23 September 2026)
    if (year1 === year2 && month1 === month2) {
      return `${day1} - ${day2} ${month1} ${year1}`;
    }

    // Kondisi 3: Jika Tahun sama, tapi Bulan beda (contoh: 28 September - 2 Oktober 2026)
    if (year1 === year2) {
      return `${day1} ${month1} - ${day2} ${month2} ${year1}`;
    }

    // Kondisi 4: Jika Tahun beda (contoh: 20 Desember 2025 - 5 Januari 2026)
    return `${day1} ${month1} ${year1} - ${day2} ${month2} ${year2}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Mempersiapkan ujian...
          </h2>
          <p className="text-gray-600">Memuat data pengguna</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-purple-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-2 rounded-xl shadow-md">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent">
                  Gebyar Ilmiah Sains
                </h1>
                <p className="text-sm text-purple-600/80">
                  Olimpiade Science Competition
                </p>
              </div>
            </div>

            {/* User Info & Logout Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors focus:outline-none"
              >
                <User className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  {user?.name || user?.username || user?.nama || "User"}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full px-4 py-2 space-x-2 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 bg-clip-text text-transparent">
              Pilih Mode Ujian
            </span>
          </h1>

          <p className="text-lg text-purple-800/90 mb-8 max-w-2xl mx-auto">
            Pilih mode ujian yang ingin diikuti. Setelah dimulai, waktu akan
            berjalan terus.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-purple-100 text-center">
            <div className="bg-violet-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-violet-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Waktu Ujian
            </h3>
            <p className="text-2xl font-bold text-violet-700">
              {examDurationMinutes} Menit
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-purple-100 text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Jenjang</h3>
            <p className="text-2xl font-bold text-purple-700">
              {String(user?.jenjang || "SMP").toUpperCase()}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-purple-100 text-center">
            <div className="bg-fuchsia-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-fuchsia-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Nama</h3>
            <p className="text-xl font-bold text-fuchsia-700 break-words">
              {user?.name || user?.username || user?.nama || "Peserta"}
            </p>
          </div>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {Object.entries(modeSchedules).map(([key, schedule]) => {
            const status = modeStatuses[key] || { status: "unknown" };
            const participantSchedule = getModeSchedule(key, user?.jenjang);
            const isActive = status.status === "active";
            const Icon = MODE_ICONS[key] || BookOpen;

            const accent =
              {
                simulasi: {
                  border: "border-violet-200",
                  iconBg: "bg-violet-100",
                  iconText: "text-violet-600",
                  gradient: "from-violet-700 to-purple-700",
                },
                tryout: {
                  border: "border-purple-200",
                  iconBg: "bg-purple-100",
                  iconText: "text-purple-600",
                  gradient: "from-purple-700 to-fuchsia-700",
                },
                penyisihan: {
                  border: "border-fuchsia-200",
                  iconBg: "bg-fuchsia-100",
                  iconText: "text-fuchsia-600",
                  gradient: "from-fuchsia-700 to-pink-700",
                },
              }[key] || {};
            const statusBadge =
              {
                not_started: "bg-yellow-200 text-yellow-800",
                active: "bg-green-200 text-green-800 animate-pulse",
                ended: "bg-red-200 text-red-800",
              }[status.status] || "bg-gray-200 text-gray-600";

            return (
              <button
                key={key}
                onClick={() => handleSelectMode(key)}
                disabled={!isActive}
                className={`relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border-2 ${accent.border} text-left transition-all duration-300 ${
                  isActive
                    ? `hover:shadow-xl hover:scale-[1.02] cursor-pointer`
                    : "opacity-60 cursor-not-allowed"
                }`}
              >
                {/* Status badge */}
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${statusBadge}`}
                >
                  {isActive && "🟢 Dibuka"}
                  {status.status === "not_started" && "🟡 Belum Dimulai"}
                  {status.status === "ended" && "🔴 Berakhir"}
                  {status.status === "unknown" && "−"}
                </div>

                <div
                  className={`${accent.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-7 h-7 ${accent.iconText}`} />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {schedule.label}
                </h3>

                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>
                    {formatDateRange(schedule.startDate, schedule.endDate)}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>
                    {participantSchedule.startTime} -{" "}
                    {participantSchedule.endTime}
                  </span>
                </div>

                <div
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-sm ${
                    isActive
                      ? `bg-gradient-to-r ${accent.gradient} text-white shadow-md`
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>{isActive ? "Mulai" : "Tidak Tersedia"}</span>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Exam Schedule Error/Warning */}
        {examError && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <div className="bg-amber-100 p-2 rounded-full flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-amber-800 mb-2">
                  Mode Belum Tersedia
                </h4>
                <p className="text-amber-700">{examError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-md border border-purple-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            Petunjuk Ujian
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-purple-600 mr-3">•</span>
              <span>Pastikan koneksi internet Anda stabil</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-3">•</span>
              <span>
                Jangan menutup browser atau tab selama ujian berlangsung
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-3">•</span>
              <span>
                Anda dapat menandai soal yang diragu-ragukan untuk dikerjakan
                nanti
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-3">•</span>
              <span>Pastikan untuk submit jawaban sebelum waktu habis</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
