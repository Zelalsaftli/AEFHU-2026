import React from 'react';
import { Beaker, ShieldCheck, Zap, Info } from 'lucide-react';
import { Nutrients, CowParameters } from '../types';

interface MicronutrientsProps {
  params: CowParameters;
  needs: Nutrients;
}

const Micronutrients: React.FC<MicronutrientsProps> = ({ params, needs }) => {
  const traceMinerals = [
    { id: 'cu', name: 'النحاس (Copper)', value: needs.cu, unit: 'ملغ', icon: Beaker, desc: 'ضروري للمناعة والخصوبة.' },
    { id: 'zn', name: 'الزنك (Zinc)', value: needs.zn, unit: 'ملغ', icon: ShieldCheck, desc: 'مهم لصحة الحوافر والجلد والمناعة.' },
    { id: 'mn', name: 'المنجنيز (Manganese)', value: needs.mn, unit: 'ملغ', icon: Zap, desc: 'حيوي للنمو والتمثيل الغذائي.' },
    { id: 'se', name: 'السيلينيوم (Selenium)', value: needs.se, unit: 'ملغ', icon: ShieldCheck, desc: 'مضاد أكسدة قوي، يمنع احتباس المشيمة.' },
    { id: 'i', name: 'اليود (Iodine)', value: needs.i, unit: 'ملغ', icon: Beaker, desc: 'ينظم هرمونات الغدة الدرقية والتمثيل الغذائي.' },
    { id: 'co', name: 'الكوبالت (Cobalt)', value: needs.co, unit: 'ملغ', icon: Beaker, desc: 'ضروري لتصنيع فيتامين B12 في الكرش.' },
    { id: 'fe', name: 'الحديد (Iron)', value: needs.fe, unit: 'ملغ', icon: Zap, desc: 'مكون أساسي للهيموجلوبين ونقل الأكسجين.' },
  ];

  const vitamins = [
    { id: 'vitA', name: 'فيتامين A', value: needs.vitA, unit: 'kIU', desc: 'للبصر، المناعة، وسلامة الأغشية المخاطية.' },
    { id: 'vitD', name: 'فيتامين D', value: needs.vitD, unit: 'kIU', desc: 'ضروري لامتصاص الكالسيوم وصحة العظام.' },
    { id: 'vitE', name: 'فيتامين E', value: needs.vitE, unit: 'IU', desc: 'مضاد أكسدة، يحسن جودة الحليب والمناعة.' },
  ];

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
          تقدير الاحتياجات اليومية من العناصر الصغرى والفيتامينات لضمان أعلى مستويات الصحة والإنتاجية.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trace Minerals Section */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 px-2">
            <Beaker className="text-indigo-600 w-5 h-5" />
            احتياجات المعادن الصغرى (Trace Minerals)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {traceMinerals.map((mineral) => (
              <div key={mineral.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                      <mineral.icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="font-bold text-slate-700">{mineral.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-indigo-700 ltr">{mineral.value}</span>
                    <span className="text-[10px] text-slate-400 block">{mineral.unit}/يوم</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {mineral.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Vitamins Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 px-2">
            <Zap className="text-orange-500 w-5 h-5" />
            احتياجات الفيتامينات
          </h3>
          <div className="space-y-4">
            {vitamins.map((vit) => (
              <div key={vit.id} className="bg-white p-6 rounded-xl shadow-md border-r-4 border-orange-400">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-800">{vit.name}</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-orange-600 ltr">{vit.value}</span>
                    <span className="text-[10px] text-slate-400 ml-1">{vit.unit}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 italic">
                  {vit.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Note Box */}
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-8">
            <h4 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              ملاحظة علمية:
            </h4>
            <p className="text-xs text-blue-800 leading-relaxed">
              هذه الأرقام تمثل الحد الأدنى المطلوب للصحة. في حالات الإجهاد الحراري أو الأمراض، قد يوصي الطبيب البيطري بزيادة مستويات فيتامين E والسيلينيوم لتعزيز الجهاز المناعي.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Micronutrients;
