```jsx
import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Search,
  Bell,
  Settings,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Calendar,
  Target,
  Zap,
  Award,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('هذا الشهر');
  const [activeTab, setActiveTab] = useState('الكل');

  const stats = [
    {
      title: 'إجمالي المشاريع',
      value: '١٢٤',
      change: '+١٢%',
      trend: 'up',
      icon: FolderKanban,
      color: 'bg-violet-500',
    },
    {
      title: 'المشاريع النشطة',
      value: '٤٧',
      change: '+٨%',
      trend: 'up',
      icon: Activity,
      color: 'bg-emerald-500',
    },
    {
      title: 'الفريق',
      value: '٨٦',
      change: '+٣',
      trend: 'up',
      icon: Users,
      color: 'bg-amber-500',
    },
    {
      title: 'الميزانية المستخدمة',
      value: '٧٥٪',
      change: '-٥٪',
      trend: 'down',
      icon: DollarSign,
      color: 'bg-rose-500',
    },
  ];

  const projects = [
    {
      id: 1,
      name: 'تطوير تطبيق الهاتف',
      client: 'شركة التقنية المتقدمة',
      progress: ٧٥,
      status: 'في التنفيذ',
      dueDate: '١٥ أغسطس ٢٠٢٦',
      budget: '١٥٠,٠٠٠',
      team: ['أحمد', 'سارة', 'خالد'],
    },
    {
      id: 2,
      name: 'تصميم واجهة المستخدم',
      client: 'متجر الرقمي',
      progress: ٩٠,
      status: 'قريب من الانتهاء',
      dueDate: '٢٠ أغسطس ٢٠٢٦',
      budget: '٤٥,٠٠٠',
      team: ['نورة', 'فاطمة'],
    },
    {
      id: 3,
      name: 'بناء نظام إدارة المحتوى',
      client: 'مؤسسة الأمانة',
      progress: ٤٥,
      status: 'في التنفيذ',
      dueDate: '١ سبتمبر ٢٠٢٦',
      budget: '٢٠٠,٠٠٠',
      team: ['محمد', 'عبدالله', 'سارة', 'نورة'],
    },
    {
      id: 4,
      name: 'تطبيق الشحن والتوصيل',
      client: 'شركة السرعة',
      progress: ٢٠,
      status: 'بدأ حديثاً',
      dueDate: '١٥ سبتمبر ٢٠٢٦',
      budget: '١٨٠,٠٠٠',
      team: ['خالد', 'أحمد'],
    },
    {
      id: 5,
      name: 'منصة التعليم الإلكتروني',
      client: 'أكاديمية المستقبل',
      progress: ٦٠,
      status: 'في التنفيذ',
      dueDate: '١ أكتوبر ٢٠٢٦',
      budget: '١٢٠,٠٠٠',
      team: ['سارة', 'نورة', 'فاطمة', 'أحمد'],
    },
  ];

  const activities = [
    {
      id: 1,
      user: 'أحمد محمد',
      action: 'أنجز مهمة',
      task: 'تصميم الشاشات الرئيسية',
      time: 'منذ ٥ دقائق',
      avatar: 'أ',
    },
    {
      id: 2,
      user: 'سارة علي',
      action: 'رفع ملف',
      task: 'تقرير المشروع الأسبوعي',
      time: 'منذ ١٥ دقيقة',
      avatar: 'س',
    },
    {
      id: 3,
      user: 'خالد عمر',
      action: 'علق على',
      task: 'مراجعة التصميمات الجديدة',
      time: 'منذ ساعة',
      avatar: 'خ',
    },
    {
      id: 4,
      user: 'نورة أحمد',
      action: 'أنشأ مشروع',
      task: 'تطبيق التوصيل السريع',
      time: 'منذ ساعتين',
      avatar: 'ن',
    },
    {
      id: 5,
      user: 'عبدالله سالم',
      action: 'أكمل',
      task: 'اختبار النظام الجديد',
      time: 'منذ ٣ ساعات',
      avatar: 'ع',
    },
  ];

  const chartData = [
    { month: 'يناير', value: ٤٥ },
    { month: 'فبراير', value: ٥٢ },
    { month: 'مارس', value: ٤٨ },
    { month: 'أبريل', value: ٦١ },
    { month: 'مايو', value: ٥٥ },
    { month: 'يونيو', value: ٦٧ },
    { month: 'يوليو', value: ٧٢ },
    { month: 'أغسطس', value: ٧٨ },
  ];

  const maxValue = Math.max(...chartData.map((d) => d.value));

  const getStatusColor = (status) => {
    switch (status) {
      case 'قريب من الانتهاء':
        return 'bg-emerald-100 text-emerald-700';
      case 'في التنفيذ':
        return 'bg-violet-100 text-violet-700';
      case 'بدأ حديثاً':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/60">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">لوحة التحكم</h1>
                <p className="text-sm text-slate-500">مرحباً بك في منصتك</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="بحث..."
                  className="w-64 pl-4 pr-10 py-2.5 rounded-xl bg-slate-100 border border-transparent focus:bg-white focus:border-violet-300 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all duration-300 text-sm placeholder:text-slate-400"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Settings */}
              <button className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                <Settings className="w-5 h-5 text-slate-600" />
              </button>

              {/* User */}
              <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-800">محمد العلي</p>
                  <p className="text-xs text-slate-500">مدير المشاريع</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/25">
                  م
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-l from-violet-600 via-violet-500 to-violet-400 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4