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
  const nIntake = supplied.cp / 6.25;
  const nMilk = (params.milkProduction * 10 * params.proteinPercentage) / 6.38;
  const nEfficiency = nIntake > 0 ? (nMilk / nIntake) * 100 : 0;

  // 2. Methane Emission (CH4)
  const ch4Grams = supplied.methaneProduction || 0;
  const ch4PerKgMilk = params.milkProduction > 0 ? ch4Grams / params.milkProduction : 0;

  // 3. Manure Production (NASEM 2021)
  const manureKg = supplied.manureProduction || 0;

  // 4. Phosphorus Excretion
  const pExcretion = supplied.phosphorusExcretion || 0;

  // 5. Water Intake Prediction (NASEM 2021)
  const dietDMPercent = totalAsFed > 0 ? (totalDM / totalAsFed) * 100 : 0;
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
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Leaf className="w-32 h-32" />
        </div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Wind className="text-emerald-400" />
          المؤشرات البيئية والاستدامة (NASEM 2021)
        </h2>
        <p className="text-emerald-100 opacity-90 max-w-2xl">
          تقييم دقيق للأثر البيئي للعليقة الحالية بناءً على أحدث معادلات NASEM 2021 لتقدير الانبعاثات والمخلفات.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Manure Production Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex flex-col">
          <div className="flex items-center gap-3 mb-4 border-b pb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Droplets className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">إنتاج الروث (الرطب)</h3>
          </div>
          <div className="flex-grow flex flex-col justify-center items-center py-2">
            <div className="text-4xl font-black text-orange-600 mb-1 ltr">
              {manureKg.toFixed(1)} <span className="text-sm">كغ/يوم</span>
            </div>
            <div className="px-3 py-1 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700">
              {(manureKg / (params.milkProduction || 1)).toFixed(2)} كغ/كغ حليب
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
        </div>

        {/* Nitrogen Excretion Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex flex-col">
          <div className="flex items-center gap-3 mb-4 border-b pb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Droplets className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">إخراج النيتروجين</h3>
          </div>
          <div className="flex-grow flex flex-col justify-center items-center py-2">
            <div className="text-4xl font-black text-blue-600 mb-1 ltr">
              {supplied.nitrogenExcretion} <span className="text-sm">غ/يوم</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${nStatus.color}`}>
              كفاءة N: {nEfficiency.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Phosphorus Excretion Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex flex-col">
          <div className="flex items-center gap-3 mb-4 border-b pb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Droplets className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">إخراج الفوسفور</h3>
          </div>
          <div className="flex-grow flex flex-col justify-center items-center py-2">
            <div className="text-4xl font-black text-purple-600 mb-1 ltr">
              {pExcretion.toFixed(0)} <span className="text-sm">غ/يوم</span>
            </div>
            <div className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700">
              {((pExcretion / supplied.p) * 100).toFixed(0)}% من المتناول
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Water Intake Prediction */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <div className="flex items-center gap-3 mb-4 border-b pb-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Droplets className="w-5 h-5 text-cyan-600" />
            </div>
            <h3 className="font-bold text-slate-800">احتياجات مياه الشرب</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-5xl font-black text-cyan-600 ltr">
                {waterIntake.toFixed(0)} <span className="text-xl font-normal">لتر/يوم</span>
              </div>
              <p className="text-slate-500 text-sm mt-1">بناءً على الإنتاج والحرارة ({estimatedTemp}°م)</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-slate-700 ltr">{waterPerKgDM.toFixed(1)}</div>
              <div className="text-[10px] text-slate-400">لتر/كغ مادة جافة</div>
            </div>
          </div>
        </div>

        {/* Global Impact Summary */}
        <div className="bg-slate-800 text-white p-6 rounded-xl shadow-md">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-emerald-400" />
            ملخص الأثر السنوي (للبقرة الواحدة)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className="text-slate-400 text-[10px] mb-1">إجمالي الميثان</div>
              <div className="text-xl font-bold text-emerald-400 ltr">{(ch4Grams * 365 / 1000).toFixed(0)} كغ</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className="text-slate-400 text-[10px] mb-1">إجمالي الروث</div>
              <div className="text-xl font-bold text-orange-400 ltr">{(manureKg * 365 / 1000).toFixed(1)} طن</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className="text-slate-400 text-[10px] mb-1">إجمالي النيتروجين</div>
              <div className="text-xl font-bold text-blue-400 ltr">{(supplied.nitrogenExcretion * 365 / 1000).toFixed(0)} كغ</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className="text-slate-400 text-[10px] mb-1">إجمالي الفوسفور</div>
              <div className="text-xl font-bold text-purple-400 ltr">{(pExcretion * 365 / 1000).toFixed(1)} كغ</div>
            </div>
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
