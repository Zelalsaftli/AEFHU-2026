import React from 'react';
import { DollarSign, TrendingUp, ShoppingCart, Calculator, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { FeedIngredient, RationItem } from '../types';

interface EconomicsProps {
  milkProduction: number;
  milkPrice: number;
  setMilkPrice: (price: number) => void;
  totalCost: number;
  concentrateMix: RationItem[];
  concentrateFedAmount: number;
  forages: RationItem[];
  ingredients: FeedIngredient[];
  groupSize: number;
}

const Economics: React.FC<EconomicsProps> = ({
  milkProduction,
  milkPrice,
  setMilkPrice,
  totalCost,
  concentrateMix,
  concentrateFedAmount,
  forages,
  ingredients,
  groupSize
}) => {
  const dailyIncome = milkProduction * milkPrice;
  const iofc = dailyIncome - totalCost;
  const marginPercentage = dailyIncome > 0 ? (iofc / dailyIncome) * 100 : 0;
  
  // Group calculations
  const groupDailyCost = totalCost * groupSize;
  const groupDailyIncome = dailyIncome * groupSize;
  const groupDailyIofc = iofc * groupSize;

  const getIofcStatus = () => {
    if (iofc > 30000) return { text: 'ممتاز', color: 'text-green-600', bg: 'bg-green-50' };
    if (iofc > 15000) return { text: 'جيد', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (iofc > 0) return { text: 'مقبول', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { text: 'خسارة', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const status = getIofcStatus();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <DollarSign className="w-6 h-6 text-emerald-700" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">المؤشرات الاقتصادية وعائد الحليب (IOFC)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Milk Price Input */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <label className="block text-sm font-medium text-slate-600 mb-2">سعر كغ الحليب الحالي</label>
            <div className="relative">
              <input 
                type="number" 
                value={milkPrice || ''} 
                onChange={(e) => setMilkPrice(parseFloat(e.target.value) || 0)}
                className="w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-bold ltr"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-slate-400 font-bold">ل.س</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
              <Info className="w-3 h-3" />
              أدخل السعر الحالي في السوق للحصول على نتائج دقيقة
            </p>
          </div>

          {/* Daily Income Card */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-blue-700">إجمالي الدخل اليومي (للبقرة)</span>
              <ArrowUpRight className="w-5 h-5 text-blue-500" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold text-blue-900 ltr">{dailyIncome.toLocaleString()}</span>
              <span className="text-sm text-blue-600 mr-1">ل.س</span>
            </div>
          </div>

          {/* Daily Cost Card */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-red-700">تكلفة العليقة اليومية (للبقرة)</span>
              <ArrowDownRight className="w-5 h-5 text-red-500" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold text-red-900 ltr">{totalCost.toLocaleString()}</span>
              <span className="text-sm text-red-600 mr-1">ل.س</span>
            </div>
          </div>
        </div>
      </div>

      {/* IOFC Main Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <Calculator className="w-5 h-5" />
              <span className="text-sm font-medium">عائد الحليب فوق تكلفة العلف (IOFC)</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-5xl font-black ltr">{iofc.toLocaleString()}</h3>
              <span className="text-xl opacity-80">ل.س / يوم</span>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <p className="text-xs opacity-70 mb-1">هامش الربح من الدخل</p>
                <p className="text-xl font-bold">{marginPercentage.toFixed(1)}%</p>
              </div>
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <p className="text-xs opacity-70 mb-1">حالة الربحية</p>
                <p className="text-xl font-bold">{status.text}</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <TrendingUp className="w-64 h-64" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-slate-400" />
            تحليل القطيع (عدد الرؤوس: {groupSize})
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600">إجمالي تكلفة العلف للقطيع</span>
              <span className="font-bold text-slate-900 ltr">{groupDailyCost.toLocaleString()} ل.س</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600">إجمالي دخل الحليب للقطيع</span>
              <span className="font-bold text-slate-900 ltr">{groupDailyIncome.toLocaleString()} ل.س</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <span className="text-emerald-800 font-bold">صافي العائد اليومي للقطيع</span>
              <span className="font-black text-emerald-700 text-xl ltr">{groupDailyIofc.toLocaleString()} ل.س</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
        <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5" />
          نصائح لتحسين العائد الاقتصادي (IOFC)
        </h4>
        <ul className="text-sm text-amber-900 space-y-2 list-disc pr-5">
          <li>زيادة إنتاج الحليب (حتى مع زيادة تكلفة العلف) غالباً ما تؤدي لزيادة IOFC لأن التكاليف الثابتة تتوزع على كمية أكبر.</li>
          <li>استبدال المكونات الغالية بمكونات أرخص (مثل استخدام كسبة القطن بدلاً من الصويا جزئياً) بشرط الحفاظ على توازن الأحماض الأمينية.</li>
          <li>تقليل الهدر في المعالف يمكن أن يحسن الربحية بنسبة تصل إلى 5-10%.</li>
          <li>مراقبة سعر الحليب يومياً وتعديل العليقة بناءً عليه يضمن لك البقاء في منطقة الربح.</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default Economics;
