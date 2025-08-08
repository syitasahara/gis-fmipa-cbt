import React from 'react';
import { BookOpen, Clock, Award, Users, ChevronRight, Play, Target, CheckCircle } from 'lucide-react';

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-purple-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-2 rounded-xl shadow-md">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent">
                Gebyar Ilmiah Sains
              </h1>
              <p className="text-sm text-purple-600/80">Olimpiade CBT Science Competition</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center">          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 bg-clip-text text-transparent">
              Science Competition
            </span>
          </h1>
          
          <p className="text-lg text-purple-800/90 mb-8 max-w-2xl mx-auto">
            Siap menghadapi Olimpiade? Mulai ujian sekarang!
          </p>

          {/* Main CTA Button */}
          <div className="mb-8">
            <a href="/login" className="group inline-block">
              <button className="bg-gradient-to-r from-violet-700 to-purple-700 hover:from-violet-800 hover:to-purple-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-200/50 transform hover:scale-[1.02] transition-all duration-300 flex items-center space-x-3 mx-auto">
                <Play className="w-5 h-5" />
                <span>Mulai Ujian</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
          </div>
        </div>

        {/* Simple Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-purple-100 max-w-md mx-auto">
          <div className="text-center space-y-3">
            <div className="text-2xl font-bold text-violet-700">50 Soal</div>
            <div className="text-purple-600/90">90 menit waktu</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;