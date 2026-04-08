import React from 'react';
import { Leaf, Activity, BarChart3, Printer, RotateCcw, Home as HomeIcon, Coins, Wind, Beaker } from 'lucide-react';
import { Page } from '../types';

interface LayoutProps {
  activePage: Page;
  setPage: (p: Page) => void;
  onReset: () => void;
  onSave: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activePage, setPage, onReset, onSave, children }) => {
  const navItems = [
    { id: Page.HOME, label: 'الرئيسية', icon: HomeIcon },
    { id: Page.NEEDS, label: 'الاحتياجات', icon: Activity },
    { id: Page.FEED, label: 'تركيب العليقة', icon: Leaf },
    { id: Page.COMPARE, label: 'التحليل والمقارنة', icon: BarChart3 },
    { id: Page.ECONOMICS, label: 'المؤشرات الاقتصادية (IOFC)', icon: Coins },
    { id: Page.ENVIRONMENT, label: 'المؤشرات البيئية', icon: Wind },
    { id: Page.MICRONUTRIENTS, label: 'المعادن والفيتامينات', icon: Beaker },
    { id: Page.HEALTH, label: 'المستشار الفني (بيطري/زراعي)', icon: Activity },
  ];

  const handlePrint = () => {
    if (window.confirm('هل تريد حفظ العليقة الحالية قبل الطباعة؟')) {
      onSave();
      // Allow download to start
      setTimeout(() => {
        window.print();
      }, 500);
    } else {
      window.print();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-emerald-700 text-white shadow-lg sticky top-0 z-50 no-print">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full">
               <Leaf className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold">برنامج صياغة علائق الأبقار الحلوب الذكي</h1>
              <p className="text-xs text-emerald-100 opacity-80">نظام ذكي لتركيب العلائق</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
                onClick={handlePrint}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-sm transition-colors"
            >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">طباعة</span>
            </button>
            <button 
                onClick={onReset}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                title="إعادة تعيين / جديد"
            >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">جديد</span>
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white shadow-sm border-b sticky top-[76px] z-40 overflow-x-auto no-print">
         <nav className="container mx-auto flex md:justify-center px-4 min-w-max">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex items-center gap-2 px-6 py-4 transition-colors border-b-2 whitespace-nowrap ${
                  activePage === item.id
                    ? 'border-emerald-600 text-emerald-700 bg-emerald-50 font-bold'
                    : 'border-transparent text-slate-500 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
         </nav>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-slate-800 text-slate-300 py-10 text-center mt-auto no-print border-t border-slate-700">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                    <p className="text-emerald-400 font-bold text-lg mb-2">تقديم الطلاب</p>
                    <p className="text-white text-lg">وفاء خلف طهماز & ميس حمود الداود</p>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-lg mb-2">إشراف</p>
                    <p className="text-white text-lg">د. ظلال الصافتلي & م. بتول المير سليمان</p>
                    <div className="mt-2 text-sm opacity-80">
                        <p>Dr. Zelal Alsaftli: zelal.alsaftli@hama-univ.edu.sy</p>
                        <p>Whatsapp: +963 946 656 403</p>
                    </div>
                    <p className="mt-1 text-sm opacity-80">جامعة حماه - كلية الهندسة الزراعية</p>
                </div>
            </div>
            
            <div className="max-w-2xl mx-auto mb-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700 text-[10px] leading-relaxed opacity-60">
                <p className="font-bold mb-1 text-slate-400 uppercase">إخلاء مسؤولية قانوني:</p>
                هذا البرنامج هو أداة استشارية تعليمية مبنية على نماذج رياضية (NASEM 2021). النتائج هي تقديرات تقريبية لمساعدة المربي والمهندس الزراعي في اتخاذ القرار، ولا تغني عن الاستشارة الميدانية للطبيب البيطري أو خبير التغذية المتخصص. المطورون غير مسؤولين عن أي سوء استخدام أو نتائج غير متوقعة ناتجة عن إدخال بيانات غير دقيقة.
            </div>

            <div className="text-sm border-t border-slate-700 pt-6 opacity-80">
                <p className="text-base mb-2">قسم الإنتاج الحيواني - كلية الهندسة الزراعية - جامعة حماه</p>
                <p className="font-mono">2026 © جميع الحقوق محفوظة</p>
            </div>
        </div>
      </footer>

      {/* Printable Footer Credits */}
      <div className="hidden print:block border-t-2 border-emerald-700 mt-12 pt-6 text-center">
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <p className="font-bold text-emerald-800">تقديم الطلاب</p>
                <p>وفاء خلف طهماز & ميس حمود الداود</p>
            </div>
            <div>
                <p className="font-bold text-emerald-800">إشراف</p>
                <p>د. ظلال الصافتلي & م. بتول المير سليمان</p>
                <p className="text-[10px]">Contact (Dr. Zelal): zelal.alsaftli@hama-univ.edu.sy</p>
            </div>
        </div>
        <p className="text-sm font-bold">قسم الإنتاج الحيواني - كلية الهندسة الزراعية - جامعة حماه</p>
        <p className="text-[10px] mt-4 opacity-50 italic">تم استخراج هذا التقرير بواسطة نظام إدارة علائق الأبقار الذكي - 2026</p>
      </div>
    </div>
  );
};

export default Layout;