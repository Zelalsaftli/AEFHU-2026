import React from 'react';
import { Leaf, Wind, Droplets, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { Nutrients, CowParameters } from '../types';

interface EnvironmentProps {
  params: CowParameters;
  supplied: Nutrients;
  totalDM: number;
  totalAsFed: number;
}

const Environment: React.FC<EnvironmentProps> = ({ params, supplied, totalDM, totalAsFed }) => {
  // 1. Nitrogen Efficiency Calculation
  // N Intake (g) = CP (g) / 6.25
  const nIntake = supplied.cp / 6.25;
  
  // N in Milk (g) = (Milk (kg) * 1000 * Milk Protein (%) / 100) / 6.38
  const nMilk = (params.milkProduction * 10 * params.proteinPercentage) / 6.38;
  
  const nEfficiency = nIntake > 0 ? (nMilk / nIntake) * 100 : 0;

  // 2. Methane Emission (CH4) Calculation
  // Ellis et al. (2007) model for dairy cows:
  // CH4 (MJ/day) = 3.23 + 0.81 * DMI (kg)
  // Energy content of CH4 is 55.65 MJ/kg
  const ch4EnergyMJ = 3.23 + 0.81 * totalDM;
  const ch4Grams = (ch4EnergyMJ / 0.05565);
  const ch4PerKgMilk = params.milkProduction > 0 ? ch4Grams / params.milkProduction : 0;

  // 3. Water Intake Prediction (NASEM 2021)
  // Formula: Water (L/d) = -14.1 + 1.25 * Milk (kg) + 2.15 * DMI (kg) + 0.44 * Diet_DM% + 0.42 * Tmax
  const dietDMPercent = totalAsFed > 0 ? (totalDM / totalAsFed) * 100 : 0;
  
  // Map environment to estimated Tmax
  const tempMap = {
    'neutral': 20,
    'heat_mild': 30,
    'heat_severe': 40,
    'cold': 10
  };
  const estimatedTemp = tempMap[params.environment] || 20;
  
  const waterIntake = -14.1 + (1.25 * params.milkProduction) + (2.15 * totalDM) + (0.44 * dietDMPercent) + (0.42 * estimatedTemp);
  const waterPerKgDM = totalDM > 0 ? waterIntake / totalDM : 0;

  // Status Helpers
  const getNEfficiencyStatus = (eff: number) => {
    if (eff < 25) return { label: 'منخفضة (هدر عالي)', color: 'text-red-600 bg-red-50', icon: AlertTriangle };
    if (eff < 32) return { label: 'جيدة', color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle };
    return { label: 'ممتازة (كفاءة عالية)', color: 'text-blue-600 bg-blue-50', icon: Leaf };
  };

  const getMethaneStatus = (gramsPerKg: number) => {
    if (gramsPerKg > 25) return { label: 'مرتفع', color: 'text-red-600 bg-red-50' };
    if (gramsPerKg > 18) return { label: 'متوسط', color: 'text-yellow-600 bg-yellow-50' };
    return { label: 'منخفض (صديق للبيئة)', color: 'text-emerald-600 bg-emerald-50' };
  };

  const nStatus = getNEfficiencyStatus(nEfficiency);
  const mStatus = getMethaneStatus(ch4PerKgMilk);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Leaf className="w-32 h-32" />
        </div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Wind className="text-emerald-400" />
          المؤشرات البيئية والاستدامة
        </h2>
        <p className="text-emerald-100 opacity-90 max-w-2xl">
          تقييم الأثر البيئي للعليقة الحالية من خلال حساب كفاءة استخدام النيتروجين، تقدير انبعاثات الميثان، وإدارة احتياجات المياه.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Nitrogen Efficiency Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex flex-col">
          <div className="flex items-center gap-3 mb-4 border-b pb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Droplets className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">كفاءة النيتروجين</h3>
          </div>

          <div className="flex-grow flex flex-col justify-center items-center py-2">
            <div className="text-4xl font-black text-blue-600 mb-1 ltr">
              {nEfficiency.toFixed(1)}%
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${nStatus.color}`}>
              <nStatus.icon className="w-3 h-3" />
              {nStatus.label}
            </div>
          </div>

          <div className="mt-4 space-y-2 pt-3 border-t border-slate-100 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">N المتناول:</span>
              <span className="font-bold text-slate-700">{nIntake.toFixed(0)} غ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">N الحليب:</span>
              <span className="font-bold text-slate-700">{nMilk.toFixed(0)} غ</span>
            </div>
          </div>
        </div>

        {/* Methane Emission Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex flex-col">
          <div className="flex items-center gap-3 mb-4 border-b pb-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Wind className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">انبعاثات الميثان</h3>
          </div>

          <div className="flex-grow flex flex-col justify-center items-center py-2">
            <div className="text-4xl font-black text-emerald-600 mb-1 ltr">
              {ch4Grams.toFixed(0)} <span className="text-sm">غ/يوم</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${mStatus.color}`}>
              {ch4PerKgMilk.toFixed(1)} غ/كغ حليب
            </div>
          </div>

          <div className="mt-4 space-y-2 pt-3 border-t border-slate-100 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">الطاقة المفقودة:</span>
              <span className="font-bold text-slate-700">{ch4EnergyMJ.toFixed(1)} MJ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">الإنتاج السنوي:</span>
              <span className="font-bold text-slate-700">{(ch4Grams * 365 / 1000).toFixed(0)} كغ</span>
            </div>
          </div>
        </div>

        {/* Water Intake Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex flex-col">
          <div className="flex items-center gap-3 mb-4 border-b pb-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Droplets className="w-5 h-5 text-cyan-600" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">احتياجات المياه</h3>
          </div>

          <div className="flex-grow flex flex-col justify-center items-center py-2">
            <div className="text-4xl font-black text-cyan-600 mb-1 ltr">
              {waterIntake.toFixed(0)} <span className="text-sm">لتر/يوم</span>
            </div>
            <div className="px-3 py-1 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700">
              {waterPerKgDM.toFixed(1)} لتر/كغ مادة جافة
            </div>
          </div>

          <div className="mt-4 space-y-2 pt-3 border-t border-slate-100 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">الحرارة المقدرة:</span>
              <span className="font-bold text-slate-700">{estimatedTemp} °م</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">المادة الجافة للعليقة:</span>
              <span className="font-bold text-slate-700">{dietDMPercent.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Water Management Details */}
      <div className="bg-cyan-50 p-6 rounded-xl border border-cyan-100">
        <h4 className="font-bold text-cyan-900 mb-4 flex items-center gap-2">
          <Droplets className="w-5 h-5" />
          توصيات إدارة المياه:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h5 className="font-bold text-cyan-800 text-sm">العوامل المؤثرة:</h5>
            <ul className="text-xs text-cyan-700 space-y-2">
              <li className="flex gap-2">
                <div className="w-1 h-1 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>كل زيادة 1 كغ في إنتاج الحليب تتطلب حوالي 1.25 لتر ماء إضافي.</span>
              </li>
              <li className="flex gap-2">
                <div className="w-1 h-1 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>درجة الحرارة العالية تزيد الاحتياجات بشكل كبير لتبريد جسم الحيوان.</span>
              </li>
              <li className="flex gap-2">
                <div className="w-1 h-1 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>الأعلاف الجافة (التبن، القش) تزيد من حاجة الحيوان لشرب الماء مقارنة بالأعلاف الخضراء.</span>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="font-bold text-cyan-800 text-sm">نصائح عملية:</h5>
            <ul className="text-xs text-cyan-700 space-y-2">
              <li className="flex gap-2">
                <div className="w-1 h-1 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>توفير مياه نظيفة وعذبة أمام الأبقار على مدار 24 ساعة.</span>
              </li>
              <li className="flex gap-2">
                <div className="w-1 h-1 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>تنظيف أحواض الشرب بانتظام لمنع نمو الطحالب والبكتيريا.</span>
              </li>
              <li className="flex gap-2">
                <div className="w-1 h-1 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>توفير مساحة كافية على أحواض الشرب (حوالي 10 سم لكل بقرة).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Advice Section */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5" />
          نصائح لتحسين الأداء البيئي:
        </h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <li className="flex gap-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
            <span>موازنة الأحماض الأمينية تسمح بتقليل البروتين الخام الكلي وبالتالي زيادة كفاءة النيتروجين.</span>
          </li>
          <li className="flex gap-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
            <span>استخدام أعلاف مالئة عالية الجودة يقلل من إنتاج الميثان لكل وحدة إنتاج.</span>
          </li>
          <li className="flex gap-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
            <span>إضافة بعض الزيوت أو الإضافات العلفية المتخصصة يمكن أن يثبط نشاط بكتيريا الميثان.</span>
          </li>
          <li className="flex gap-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
            <span>تحسين الصحة العامة وزيادة الإنتاج يقلل من "بصمة الكربون" لكل كغ حليب.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Environment;
