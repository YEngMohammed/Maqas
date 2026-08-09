import { useState } from "react";

export default function SizeEditor() {
  const [sizes, setSizes] = useState([
    {
      id: 1,
      name: "شبكة صيد صغيرة",
      meshSize: 25,
      depth: 50,
      length: 100,
      material: "بولي إيثيلين",
      color: "#1e40af",
      customFields: [
        { key: "الوزن", value: "2.5 كجم" },
        { key: "سعة التحميل", value: "50 كجم" },
      ],
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "شبكة صيد متوسطة",
      meshSize: 40,
      depth: 75,
      length: 150,
      material: "نايلون مقوى",
      color: "#059669",
      customFields: [{ key: "الوزن", value: "4.2 كجم" }],
      createdAt: "2024-01-20",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    meshSize: "",
    depth: "",
    length: "",
    material: "",
    color: "#6366f1",
    customFields: [],
  });
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMaterial, setFilterMaterial] = useState("الكل");
  const [sortBy, setSortBy] = useState("newest");
  const [isDeleting, setIsDeleting] = useState(null);

  const materials = ["الكل", "بولي إيثيلين", "نايلون مقوى", "بولي بروبيلين", "قطن مشمع"];

  const resetForm = () => {
    setFormData({
      name: "",
      meshSize: "",
      depth: "",
      length: "",
      material: "",
      color: "#6366f1",
      customFields: [],
    });
    setNewFieldKey("");
    setNewFieldValue("");
    setEditingId(null);
  };

  const openModal = (size = null) => {
    if (size) {
      setFormData({
        name: size.name,
        meshSize: size.meshSize.toString(),
        depth: size.depth.toString(),
        length: size.length.toString(),
        material: size.material,
        color: size.color,
        customFields: [...size.customFields],
      });
      setEditingId(size.id);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const addCustomField = () => {
    if (newFieldKey.trim() && newFieldValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        customFields: [...prev.customFields, { key: newFieldKey.trim(), value: newFieldValue.trim() }],
      }));
      setNewFieldKey("");
      setNewFieldValue("");
    }
  };

  const removeCustomField = (index) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const sizeData = {
      id: editingId || Date.now(),
      name: formData.name,
      meshSize: parseFloat(formData.meshSize),
      depth: parseFloat(formData.depth),
      length: parseFloat(formData.length),
      material: formData.material,
      color: formData.color,
      customFields: formData.customFields,
      createdAt: editingId ? sizes.find((s) => s.id === editingId)?.createdAt : new Date().toISOString().split("T")[0],
    };

    if (editingId) {
      setSizes((prev) => prev.map((s) => (s.id === editingId ? sizeData : s)));
    } else {
      setSizes((prev) => [sizeData, ...prev]);
    }
    closeModal();
  };

  const deleteSize = (id) => {
    setIsDeleting(id);
    setTimeout(() => {
      setSizes((prev) => prev.filter((s) => s.id !== id));
      setIsDeleting(null);
    }, 300);
  };

  const filteredSizes = sizes
    .filter((size) => {
      const matchesSearch =
        size.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        size.material.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMaterial = filterMaterial === "الكل" || size.material === filterMaterial;
      return matchesSearch && matchesMaterial;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "meshSize") return b.meshSize - a.meshSize;
      return 0;
    });

  const colors = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#14b8a6",
    "#06b6d4",
    "#3b82f6",
    "#1e40af",
    "#6b7280",
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 font-sans">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">محرر المقاسات</h1>
                <p className="text-sm text-slate-500">إدارة وتعديل مقاسات الشباك</p>
              </div>
            </div>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>إضافة مقاس جديد</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "إجمالي المقاسات", value: sizes.length, icon: "M4 6h16M4 10h16M4 14h16M4 18h16", color: "from-indigo-500 to-indigo-600" },
            { label: "المواد المستخدمة", value: [...new Set(sizes.map((s) => s.material))].length, icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", color: "from-emerald-500 to-emerald-600" },
            { label: "متوسط حجم العيون", value: sizes.length ? Math.round(sizes.reduce((acc, s) => acc + s.meshSize, 0) / sizes.length) : 0, icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z", color: "from-amber-500 to-amber-600" },
            { label: "الحقول المخصصة", value: sizes.reduce((acc, s) => acc + s.customFields.length, 0), icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "from-rose-500 to-rose-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="البحث في المقاسات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 bg-slate-100/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <select
              value={filterMaterial}
              onChange={(e) => setFilterMaterial(e.target.value)}
              className="px-4 py-2.5 bg-slate-100/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              {materials.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-slate-100/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="newest">الأحدث أولاً</option>
              <option value="oldest">الأقدم أولاً</option>
              <option value="name">بالاسم</option>
              <option value="meshSize">بحجم العينة</option>
            </select>
          </div>
        </div>

        {filteredSizes.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 border border-white/50 shadow-sm text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">لا توجد مقاسات</h3>
            <p className="text-slate-500 mb-6">ابدأ بإضافة أول مقاس جديد لشبكتك</p>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>إضافة مقاس جديد</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSizes.map((size) => (
              <div
                key={size.id}
                className={`bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300 ${isDeleting === size.id ? "opacity-0 scale-