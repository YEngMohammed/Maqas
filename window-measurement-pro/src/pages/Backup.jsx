import React, { useState } from "react";
import {
  Download,
  Upload,
  Cloud,
  Clock,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RefreshCw,
  Settings,
  FileArchive,
  Database,
  Shield,
  ChevronLeft,
  MoreVertical,
  Search,
  Filter,
  Calendar,
  Server,
  Zap,
  Globe,
} from "lucide-react";

export default function BackupPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedBackups, setSelectedBackups] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const stats = [
    {
      label: "إجمالي النسخ",
      value: "247",
      icon: FileArchive,
      color: "from-violet-500 to-purple-600",
      bgColor: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      label: "آخر نسخة احتياطية",
      value: "منذ ساعتين",
      icon: Clock,
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "المساحة المستخدمة",
      value: "12.4 GB",
      icon: HardDrive,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "النسخ المحمية",
      value: "100%",
      icon: Shield,
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  const backups = [
    {
      id: 1,
      name: "نسخة كاملة - أغسطس 2026",
      type: "full",
      size: "4.2 GB",
      date: "2026-08-09 14:30",
      status: "completed",
      location: "السحابة + محلي",
      files: 12847,
    },
    {
      id: 2,
      name: "نسخة تزايدية - بيانات العملاء",
      type: "incremental",
      size: "890 MB",
      date: "2026-08-09 08:00",
      status: "completed",
      location: "السحابة",
      files: 342,
    },
    {
      id: 3,
      name: "نسخة قاعدة البيانات",
      type: "database",
      size: "1.2 GB",
      date: "2026-08-08 22:00",
      status: "completed",
      location: "محلي",
      files: 1,
    },
    {
      id: 4,
      name: "نسخة الملفات الوسائطية",
      type: "media",
      size: "3.8 GB",
      date: "2026-08-08 03:00",
      status: "completed",
      location: "السحابة",
      files: 4521,
    },
    {
      id: 5,
      name: "نسخة يومية تلقائية",
      type: "auto",
      size: "2.1 GB",
      date: "2026-08-07 06:00",
      status: "completed",
      location: "السحابة + محلي",
      files: 892,
    },
    {
      id: 6,
      name: "نسخة أسبوعية",
      type: "weekly",
      size: "5.6 GB",
      date: "2026-08-01 01:00",
      status: "completed",
      location: "السحابة",
      files: 15632,
    },
  ];

  const scheduledBackups = [
    {
      name: "نسخة يومية",
      time: "02:00 ص",
      days: ["سبت", "أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة"],
      enabled: true,
      type: "incremental",
    },
    {
      name: "نسخة أسبوعية",
      time: "01:00 ص",
      days: ["الجمعة"],
      enabled: true,
      type: "full",
    },
    {
      name: "نسخة شهرية",
      time: "03:00 ص",
      days: ["الأول"],
      enabled: false,
      type: "full",
    },
  ];

  const getTypeLabel = (type) => {
    const labels = {
      full: "كاملة",
      incremental: "تزايدية",
      database: "قاعدة بيانات",
      media: "وسائط",
      auto: "تلقائية",
      weekly: "أسبوعية",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      full: "bg-violet-100 text-violet-700",
      incremental: "bg-blue-100 text-blue-700",
      database: "bg-emerald-100 text-emerald-700",
      media: "bg-amber-100 text-amber-700",
      auto: "bg-cyan-100 text-cyan-700",
      weekly: "bg-pink-100 text-pink-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const toggleSelectBackup = (id) => {
    setSelectedBackups((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const tabs = [
    { id: "all", label: "الكل" },
    { id: "automatic", label: "تلقائية" },
    { id: "manual", label: "يدوية" },
    { id: "scheduled", label: "مجدولة" },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50 p-6 lg:p-8 font-sans">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap');
        body {
          font-family: 'Noto Sans Arabic', sans-serif;
        }
      `}</style>

      {/* Floating Glassmorphism Background Elements */}
      <div className="fixed top-20 right-20 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <button className="p-2 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">النسخ الاحتياطي</h1>
            <p className="text-slate-500 mt-1">إدارة واستعادة نسخك الاحتياطية بأمان</p>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
            <p className="text-slate-500 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Import/Export & Actions */}
        <div className="xl:col-span-1 space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/50">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600" />
              إجراءات سريعة
            </h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-l from-indigo-600 to-indigo-700 text-white hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 group">
                <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <p className="font-medium">إنشاء نسخة احتياطية</p>
                  <p className="text-xs text-indigo-200">نسخة كاملة فورية</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-300 group">
                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                  <Download className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-700">استيراد بيانات</p>
                  <p className="text-xs text-slate-400">رفع ملف نسخة احتياطية</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-300 group">
                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-700">استعادة نسخة</p>
                  <p className="text-xs text-slate-400">استعادة من نسخة سابقة</p>
                </div>
              </button>
            </div>
          </div>

          {/* Import Drop Zone */}
          <div
            className={`relative bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-sm border-2 border-dashed transition-all duration-300 ${
              isDragging
                ? "border-indigo-500 bg-indigo-50/50"
                : "border-slate-200 hover:border-indigo-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? "bg-indigo-100" : "bg-slate-100"}`}>
                <Cloud className={`w-10 h-10 ${isDragging ? "text-indigo-600" : "text-slate-400"}`} />
              </div>
              <h3 className="text-lg font-medium text-slate-700 mb-2">اسحب الملفات هنا</h3>
              <p className="text-sm text-slate-500 mb-4">أو انقر لاختيار ملف من جهازك</p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 text-xs bg-slate-100 text-slate-600 rounded-full">.zip</span>
                <span className="px-3 py-1 text-xs bg-slate-100 text-slate-600 rounded-full">.sql</span>
                <span className="px-3 py-1 text-xs bg-slate-100 text-slate-600 rounded-full">.json</span>
                <span className="px-3 py-1 text-xs bg-slate-100 text-slate-600 rounded-full">.tar.gz</span>
              </div>
            </div>
          </div>

          {/* Cloud Sync Status */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                المزامنة السحابية
              </h2>
              <span className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                متصل
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-slate-500" />
                  <span className="text-sm text-slate-700">AWS S3</span>
                </div>
                <span className="text-sm text-emerald-600 font-medium">متصل</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-slate-500" />
                  <span className="text-sm text-slate-700">Google Drive</span>
                </div>
                <span className="text-sm text-emerald-600 font-medium">متصل</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Backups List */}
        <div className="xl:col-span-2">
          {/* Tabs & Filters */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 mb-6">
            <div className="p-4 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Tabs */}
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                        activeTab === tab.id
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Search & Actions */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="بحث في النسخ..."
                      className="pr-10 pl-4 py-2 bg-slate-100 border-0 rounded-xl text