import React from 'react';
import { Beaker, ShieldCheck, Zap, Info } from 'lucide-react';
import { Nutrients, CowParameters } from '../types';

interface MicronutrientsProps {
  params: CowParameters;
  needs: Nutrients;
  supplied: Nutrients;
}

const Micronutrients: React.FC<MicronutrientsProps> = ({ params, needs, supplied }) => {
  const traceMinerals = [
    { id: 'cu', name: 'النحاس (Copper)', req: needs.cu, sup: supplied.cu || 0, unit: 'ملغ', icon: Beaker, desc: 'ضروري للمناعة والخصوبة.' },
    { id: 'zn', name: 'الزنك (Zinc)', req: needs.zn, sup: supplied.zn || 0, unit: 'ملغ', icon: ShieldCheck, desc: 'مهم لصحة الحوافر والجلد والمناعة.' },
    { id: 'mn', name: 'المنجنيز (Manganese)', req: needs.mn, sup: supplied.mn || 0, unit: 'ملغ', icon: Zap, desc: 'حيوي للنمو والتمثيل الغذائي.' },
    { id: 'se', name: 'السيلينيوم (Selenium)', req: needs.se, sup: supplied.se || 0, unit: 'ملغ', icon: ShieldCheck, desc: 'مضاد أكسدة قوي، يمنع احتباس المشيمة.' },
    { id: 'i', name: 'اليود (Iodine)', req: needs.i, sup: supplied.i || 0, unit: 'ملغ', icon: Beaker, desc: 'ينظم هرمونات الغدة الدرقية والتمثيل الغذائي.' },
    { id: 'co', name: 'الكوبالت (Cobalt)', req: needs.co, sup: supplied.co || 0, unit: 'ملغ', icon: Beaker, desc: 'ضروري لتصنيع فيتامين B12 في الكرش.' },
    { id: 'fe', name: 'الحديد (Iron)', req: needs.fe, sup: supplied.fe || 0, unit: 'ملغ', icon: Zap, desc: 'مكون أساسي للهيموجلوبين ونقل الأكسجين.' },
  ];

  const vitamins = [
    { id: 'vitA', name: 'فيتامين A', req: needs.vitA, sup: supplied.vitA || 0, unit: 'kIU', desc: 'للبصر، المناعة، وسلامة الأغشية المخاطية.' },
    { id: 'vitD', name: 'فيتامين D', req: needs.vitD, sup: supplied.vitD || 0, unit: 'kIU', desc: 'ضروري لامتصاص الكالسيوم وصحة العظام.' },
    { id: 'vitE', name: 'فيتامين E', req: needs.vitE, sup: supplied.vitE || 0, unit: 'IU', desc: 'مضاد أكسدة، يحسن جودة الحليب والمناعة.' },
  ];

  const getPercent = (sup: number, req: number) => {
      if (req === 0) return 0;
      return Math.min(Math.round((sup / req) * 100), 150);
  };

  const getBarColor = (percent: number) => {
      if (percent < 90) return 'bg-red-500';
      if (percent > 120) return 'bg-yellow-500';
      return 'bg-green-500';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-800 to-indigo-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Beaker className="w-32 h-32" />
        </div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <ShieldCheck className="text-indigo-400" />
          المعادن الدقيقة والفيتامينات (NASEM 2021)
        </h2>
        <p className="text-indigo-100 opacity-90 max-w-2xl">
          تحليل التوازن بين الاحتياجات اليومية وما تقدمه العليقة الحالية من عناصر صغرى وفيتامينات.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trace Minerals Section */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 px-2">
            <Beaker className="text-indigo-600 w-5 h-5" />
            توازن المعادن الصغرى (Trace Minerals)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {traceMinerals.map((mineral) => {
              const percent = getPercent(mineral.sup, mineral.req);
              return (
                <div key={mineral.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                        <mineral.icon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="font-bold text-slate-700">{mineral.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-1 justify-end">
                        <span className="text-xl font-black text-indigo-700 ltr">{mineral.sup}</span>
                        <span className="text-[10px] text-slate-400">/ {mineral.req}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">{mineral.unit}/يوم</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                      <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-slate-500">نسبة التغطية</span>
                          <span className={`font-bold ${percent < 90 ? 'text-red-600' : percent > 120 ? 'text-yellow-600' : 'text-green-600'}`}>{percent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${getBarColor(percent)}`}
                            style={{ width: `${percent}%` }}
                          />
                      </div>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-relaxed opacity-80">
                    {mineral.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vitamins Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 px-2">
            <Zap className="text-orange-500 w-5 h-5" />
            توازن الفيتامينات
          </h3>
          <div className="space-y-4">
            {vitamins.map((vit) => {
              const percent = getPercent(vit.sup, vit.req);
              return (
                <div key={vit.id} className="bg-white p-6 rounded-xl shadow-md border-r-4 border-orange-400">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-slate-800">{vit.name}</span>
                    <div className="text-right">
                      <div className="flex items-baseline gap-1 justify-end">
                        <span className="text-xl font-black text-orange-600 ltr">{vit.sup}</span>
                        <span className="text-[10px] text-slate-400">/ {vit.req}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 ml-1">{vit.unit}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${getBarColor(percent)}`}
                            style={{ width: `${percent}%` }}
                          />
                      </div>
                      <div className="text-[10px] mt-1 text-right font-bold text-slate-500">
                          تغطية: {percent}%
                      </div>
                  </div>

                  <p className="text-[10px] text-slate-500 italic opacity-80">
                    {vit.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Note Box */}
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-8">
            <h4 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              ملاحظة فنية:
            </h4>
            <p className="text-xs text-blue-800 leading-relaxed">
              إذا كانت نسبة التغطية منخفضة (باللون الأحمر)، يُنصح بإضافة **"بريمكس معادن وفيتامينات"** إلى الخلطة المركزة لضمان سد الفجوة الغذائية.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Micronutrients;
