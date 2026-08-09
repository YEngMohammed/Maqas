import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  FolderKanban,
  CheckCircle2,
  Clock,
  Users,
  Plus,
  MoreHorizontal,
  Star,
  Calendar,
  ChevronDown,
  Grid3X3,
  List,
  X,
  Briefcase,
  Target,
  Award,
  Layers,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function ProjectsDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("الكل");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("الأحدث");

  // Statistics Data
  const stats = [
    {
      title: "إجمالي المشاريع",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: FolderKanban,
      color: "#6366f1",
      bgColor: "bg-indigo-50",
    },
    {
      title: "المشاريع المكتملة",
      value: "89",
      change: "+8%",
      trend: "up",
      icon: CheckCircle2,
      color: "#10b981",
      bgColor: "bg-emerald-50",
    },
    {
      title: "قيد التنفيذ",
      value: "42",
      change: "-3%",
      trend: "down",
      icon: Clock,
      color: "#f59e0b",
      bgColor: "bg-amber-50",
    },
    {
      title: "أعضاء الفريق",
      value: "28",
      change: "+5%",
      trend: "up",
      icon: Users,
      color: "#8b5cf6",
      bgColor: "bg-violet-50",
    },
  ];

  // Projects Data
  const projects = [
    {
      id: 1,
      name: "منصة التعليم الإلكتروني",
      description: "تطوير منصة تعليمية متكاملة للطلاب والمعلمين مع نظام اختبار متقدم",
      status: "مكتمل",
      progress: 100,
      category: "تعليم",
      team: ["أحمد", "سارة", "خالد", "نورة"],
      dueDate: "2026-08-15",
      budget: "250,000",
      priority: "عالية",
    },
    {
      id: 2,
      name: "تطبيق إدارة المخزون",
      description: "نظام متكامل لإدارة المخزون والمبيعات مع تقارير تحليلية متقدمة",
      status: "قيد التنفيذ",
      progress: 68,
      category: "أعمال",
      team: ["محمود", "فاطمة", "عمر"],
      dueDate: "2026-09-30",
      budget: "180,000",
      priority: "متوسطة",
    },
    {
      id: 3,
      name: "موقع التجارة الإلكترونية",
      description: "بناء متجر إلكتروني متكامل مع بوابة دفع آمنة ونظام إعلانات",
      status: "قيد التنفيذ",
      progress: 45,
      category: "تجارة",
      team: ["يوسف", "هند", "طارق", "ليلى", "سامي"],
      dueDate: "2026-10-20",
      budget: "320,000",
      priority: "عالية",
    },
    {
      id: 4,
      name: "تطبيق الصحة واللياقة",
      description: "تطبيق هاتف ذكي لتتبع التمارين والتغذية مع مجتمع تفاعلي",
      status: "مكتمل",
      progress: 100,
      category: "صحة",
      team: ["عبدالله", "رانيا"],
      dueDate: "2026-07-01",
      budget: "95,000",
      priority: "متوسطة",
    },
    {
      id: 5,
      name: "نظام إدارة الموارد البشرية",
      description: "منصة شاملة لإدارة الموظفين والرواتب والتقييمات السنوية",
      status: "قيد التنفيذ",
      progress: 28,
      category: "أعمال",
      team: ["سارة", "خالد", "أحمد", "نورة", "مريم"],
      dueDate: "2026-12-15",
      budget: "400,000",
      priority: "عالية",
    },
    {
      id: 6,
      name: "تطبيق توصيل الطعام",
      description: "نظام توصيل طعام سريع مع تتبع الطلبات وإدارة المطاعم",
      status: "قيد المراجعة",
      progress: 92,
      category: "تجارة",
      team: ["ياسر", "دانة", "فهد"],
      dueDate: "2026-08-25",
      budget: "275,000",
      priority: "عالية",
    },
    {
      id: 7,
      name: "منصة العمل الحر",
      description: "سوق إلكتروني لربط المستقلين بأصحاب المشاريع عبر العالم العربي",
      status: "معلق",
      progress: 15,
      category: "أعمال",
      team: ["منى", "بدر"],
      dueDate: "2027-02-28",
      budget: "350,000",
      priority: "منخفضة",
    },
    {
      id: 8,
      name: "تطبيق السياحة والسفر",
      description: "تطبيق شامل لحجز الرحلات والفنادق مع دليل سياحي تفاعلي",
      status: "قيد التنفيذ",
      progress: 55,
      category: "سياحة",
      team: ["نوال", "سلطان", "ريم"],
      dueDate: "2026-11-10",
      budget: "220,000",
      priority: "متوسطة",
    },
  ];

  const categories = ["الكل", "تعليم", "أعمال", "تجارة", "صحة", "سياحة"];
  const statuses = ["الكل", "مكتمل", "قيد التنفيذ", "قيد المراجعة", "معلق"];
  const sortOptions = ["الأحدث", "الأقدم", "الأولوية", "الميزانية"];

  const getStatusColor = (status) => {
    switch (status) {
      case "مكتمل":
        return "bg-emerald-100 text-emerald-700";
      case "قيد التنفيذ":
        return "bg-amber-100 text-amber-700";
      case "قيد المراجعة":
        return "bg-blue-100 text-blue-700";
      case "معلق":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "عالية":
        return "text-red-500";
      case "متوسطة":
        return "text-amber-500";
      case "منخفضة":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        selectedStatus === "الكل" || project.status === selectedStatus;
      const matchesCategory =
        selectedCategory === "الكل" || project.category === selectedCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, selectedStatus, selectedCategory]);

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">مشاريعي</h1>
                <p className="text-xs text-slate-500">لوحة التحكم الرئيسية</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5">
                <Plus className="w-4 h-4" />
                <span className="font-medium">مشروع جديد</span>
              </button>
              <button className="sm:hidden w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-colors">
                <Activity className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            مرحباً بك 👋
          </h2>
          <p className="text-slate-600">
            إليك ملخص شامل لجميع مشاريعك ونشاطاتك الأخيرة
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
                    stat.trend === "up"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-500">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-xl shadow-slate-200/50 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن مشروع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 bg-slate-100/80 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-300 hover:bg-slate-400 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border transition-all ${
                showFilters
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Filter className="w-5 h-5" />
              <span className="font-medium">الفلترة</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full lg:w-40 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 cursor-pointer pr-10"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  الحالة
                </label>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedStatus === status
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  الفئة
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) =>