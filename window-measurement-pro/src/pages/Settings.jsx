import { useState } from "react";
import {
  Settings,
  User,
  Palette,
  Bell,
  Shield,
  Database,
  Layers,
  Sliders,
  Globe,
  ChevronRight,
  Check,
  Moon,
  Sun,
  Monitor,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Download,
  Upload,
  Copy,
  Building2,
  Mail,
  Phone,
  Key,
  FileText,
  LayoutGrid,
  Box,
  Cpu,
  Variable,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
  MoreHorizontal,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    updates: true,
  });
  const [appearance, setAppearance] = useState({
    compactMode: false,
    animations: true,
    highContrast: false,
  });

  const tabs = [
    { id: "profile", label: "الملف الشخصي", icon: User },
    { id: "types", label: "الأنواع", icon: Layers },
    { id: "models", label: "النماذج", icon: Box },
    { id: "fields", label: "الحقول المخصصة", icon: Variable },
    { id: "appearance", label: "المظهر", icon: Palette },
    { id: "notifications", label: "الإشعارات", icon: Bell },
    { id: "security", label: "الأمان", icon: Shield },
    { id: "language", label: "اللغة والمنطقة", icon: Globe },
  ];

  const customTypes = [
    { id: 1, name: "مشروع", color: "#6366f1", items: 24, icon: FileText },
    { id: 2, name: "عميل", color: "#10b981", items: 156, icon: Building2 },
    { id: 3, name: "مهمة", color: "#f59e0b", items: 89, icon: CheckCircle2 },
    { id: 4, name: "فاتورة", color: "#ef4444", items: 45, icon: Database },
  ];

  const customModels = [
    { id: 1, name: "نموذج العقد الذكي", provider: "OpenAI", status: "active" },
    { id: 2, name: "محلل المشاعر", provider: "Anthropic", status: "active" },
    { id: 3, name: "مولد التقارير", provider: "Local", status: "draft" },
  ];

  const customFields = [
    { id: 1, name: "رقم الهاتف المخصص", type: "phone", entity: "عميل", required: true },
    { id: 2, name: "معرف العميل", type: "text", entity: "عميل", required: false },
    { id: 3, name: "الميزانية", type: "currency", entity: "مشروع", required: true },
    { id: 4, name: "تاريخ التسليم", type: "date", entity: "مشروع", required: true },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">معلومات الحساب</h3>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b7cf7] flex items-center justify-center text-white text-3xl font-bold">
                  م
                </div>
                <div>
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                    تغيير الصورة
                  </button>
                  <p className="text-sm text-gray-500 mt-2">PNG، JPG حتى 5MB</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      defaultValue="محمد الأحمد"
                      className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      defaultValue="mohammed@company.com"
                      className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      defaultValue="+966 50 123 4567"
                      className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الشركة</label>
                  <div className="relative">
                    <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      defaultValue="شركة التقنية المتقدمة"
                      className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="px-6 py-3 bg-[#6366f1] hover:bg-[#5a52d4] text-white rounded-xl font-medium transition-colors shadow-lg shadow-[#6366f1]/25">
                  حفظ التغييرات
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">تفضيلات الحساب</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">الوضع المظلم</p>
                    <p className="text-sm text-gray-500">تفعيل المظهر الداكن للتطبيق</p>
                  </div>
                  <button
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className={`w-14 h-8 rounded-full p-1 transition-colors ${theme === "dark" ? "bg-[#6366f1]" : "bg-gray-300"}`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center transition-transform ${theme === "dark" ? "translate-x-6" : ""}`}>
                      {theme === "dark" ? <Moon className="w-3 h-3 text-[#6366f1]" /> : <Sun className="w-3 h-3 text-gray-500" />}
                    </div>
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">الحساب نشط</p>
                    <p className="text-sm text-gray-500">استلام التحديثات والإشعارات</p>
                  </div>
                  <div className="w-14 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-white shadow-md translate-x-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "types":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">الأنواع المخصصة</h2>
                <p className="text-gray-500 mt-1">إدارة وتخصيص أنواع العناصر في نظامك</p>
              </div>
              <button className="flex items-center gap-2 px-5 py-3 bg-[#6366f1] hover:bg-[#5a52d4] text-white rounded-xl font-medium transition-all shadow-lg shadow-[#6366f1]/25">
                <Plus className="w-5 h-5" />
                إضافة نوع جديد
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customTypes.map((type) => (
                <div key={type.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#6366f1]/20 transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: type.color + "15" }}>
                        <type.icon className="w-6 h-6" style={{ color: type.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{type.name}</h3>
                        <p className="text-sm text-gray-500">{type.items} عنصر</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">كامل الوصول</span>
                    <span className="px-3 py-1 bg-[#6366f1]/10 text-[#6366f1] rounded-full text-sm">نشط</span>
                  </div>
                </div>
              ))}

              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-[#6366f1]/50 hover:bg-[#6366f1]/5 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-[#6366f1]/10 transition-colors">
                  <Plus className="w-6 h-6 text-gray-400 group-hover:text-[#6366f1]" />
                </div>
                <p className="font-medium text-gray-500 group-hover:text-[#6366f1]">إضافة نوع جديد</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات الأنواع الافتراضية</h3>
              <div className="space-y-3">
                {["مستخدم", "فريق", "إذن"].map((type, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Database className="w-5 h-5 text-gray-500" />
                      </div>
                      <span className="font-medium text-gray-700">{type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${i === 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {i === 0 ? "مفعّل" : "معطّل"}
                      </span>
                      <ToggleRight className={`w-8 h-8 ${i === 0 ? "text-green-500" : "text-gray-300"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "models":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">النماذج الذكية</h2>
                <p className="text-gray-500 mt-1">إدارة نماذج الذكاء الاصطناعي المتكاملة</p>
              </div>
              <button className="flex items-center gap-2 px-5 py-3 bg-[#6366f1] hover:bg-[#5a52d4] text-white rounded-xl font-medium transition-all shadow-lg shadow-[#6366f1]/25">
                <Plus className="w-5 h-5" />
                إضافة نموذج
              </button>
            </div>

            <div className="bg-gradient-to-br from-[#6366f1]/5 to-[#8b7cf7]/5 rounded-2xl p-6 border border-[#6366f1]/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b7cf7] flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">استخدام النماذج المتقدمة</h3>
                  <p className="text-sm text-gray-500">تمكين معالجة متقدمة مدعومة بالذكاء الاصطناعي</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-white rounded-lg p-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">الاستخدام الشهري</span>
                    <span className="font-medium">2,450 / 5,000</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-l from-[#6366f1] to-[#8b7cf7] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="البحث في النماذج..."
                    className="w-full pr-10 pl-