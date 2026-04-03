import React from 'react';
import { Leaf, GraduationCap, Users, BookOpen, ChevronRight, Activity } from 'lucide-react';
import { Page } from '../types';

interface HomeProps {
  setPage: (p: Page) => void;
}

const Home: React.FC<HomeProps> = ({ setPage }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center p-4 bg-emerald-100 rounded-full mb-4">
          <Leaf className="w-12 h-12 text-emerald-700" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          برنامج صياغة علائق الأبقار الحلوب الذكي
          <span className="block text-emerald-600 text-2xl mt-2">(Feed 2026)</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          نظام متكامل لحساب الاحتياجات الغذائية للأبقار الحلوب وفق أحدث المعايير العالمية، مع تحليل دقيق للعليقة وتنبؤات صحية مدعومة بالذكاء الاصطناعي.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <button 
            onClick={() => setPage(Page.NEEDS)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 group"
          >
            ابدأ الآن
            <ChevronRight className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform" />
          </button>
        </div>
      </div>

      {/* Credits Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-800 p-6 text-white text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <GraduationCap className="text-emerald-400" />
            مشروع التخرج
          </h2>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-emerald-600 font-bold border-b pb-2">
              <Users className="w-6 h-6" />
              <span className="text-lg">تقديم الطلاب</span>
            </div>
            <ul className="space-y-3 text-slate-700 text-xl font-medium">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                وفاء خلف طهماز
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                ميس حمود الداود
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-emerald-600 font-bold border-b pb-2">
              <Users className="w-6 h-6" />
              <span className="text-lg">إشراف</span>
            </div>
            <ul className="space-y-3 text-slate-700 text-xl font-medium">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                د. ظلال الصافتلي
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                م. بتول المير سليمان
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
          <p className="text-slate-600 font-bold text-lg">
            قسم الإنتاج الحيواني - كلية الهندسة الزراعية - جامعة حماه
          </p>
          <p className="text-slate-400 text-sm mt-1">2026</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">معايير Feed 2026</h3>
          <p className="text-sm text-slate-500">استخدام أحدث المعادلات العالمية لحساب احتياجات الطاقة، البروتين، والألياف.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
            <Leaf className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">تحليل العليقة</h3>
          <p className="text-sm text-slate-500">مقارنة دقيقة بين ما تحتاجه البقرة وما يتم تقديمه فعلياً في العليقة.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">تنبؤات صحية</h3>
          <p className="text-sm text-slate-500">استخدام الذكاء الاصطناعي للتنبؤ بمخاطر الأمراض الاستقلابية بناءً على العليقة.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
