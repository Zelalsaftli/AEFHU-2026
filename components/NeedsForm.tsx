import React from 'react';
import { CowParameters, Nutrients } from '../types';
import { Info, AlertCircle, Leaf } from 'lucide-react';
import DecimalInput from './DecimalInput';

interface NeedsFormProps {
  params: CowParameters;
  setParams: (p: CowParameters) => void;
  calculatedNeeds: Nutrients;
}

const NeedsForm: React.FC<NeedsFormProps> = ({ params, setParams, calculatedNeeds }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParams({
      ...params,
      [name]: (name === 'lactationStage' || name === 'environment' || name === 'grazing' || name === 'breed') 
        ? value 
        : parseFloat(value) || 0,
    });
  };

  const handleDecimalChange = (name: keyof CowParameters, val: number) => {
    setParams({
      ...params,
      [name]: val
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-2">بيانات البقرة والعوامل البيئية (Feed 2026)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* New Factors */}
          <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">السلالة</label>
            <select
              name="breed"
              value={params.breed}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="holstein">هولشتاين (Holstein)</option>
              <option value="jersey">جيرسي (Jersey)</option>
              <option value="other">أخرى / هجين</option>
            </select>
            <p className="text-[10px] text-slate-400 mt-1">يؤثر على طاقة الحافظة</p>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">رقم موسم الحليب (Parity)</label>
            <select
              name="lactationNumber"
              value={params.lactationNumber}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="1">الموسم الأول (بكيرة - Primiparous)</option>
              <option value="2">الموسم الثاني</option>
              <option value="3">الموسم الثالث فأكثر (Mature)</option>
            </select>
            <p className="text-[10px] text-slate-400 mt-1">يؤثر على النمو والشهية</p>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">الوزن الحي (كغ)</label>
            <DecimalInput
              value={params.weight}
              onChange={(val) => handleDecimalChange('weight', val)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">إنتاج الحليب اليومي (كغ)</label>
            <DecimalInput
              value={params.milkProduction}
              onChange={(val) => handleDecimalChange('milkProduction', val)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">نسبة الدهن (%)</label>
            <DecimalInput
              value={params.fatPercentage}
              onChange={(val) => handleDecimalChange('fatPercentage', val)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

           <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">نسبة البروتين (%)</label>
            <DecimalInput
              value={params.proteinPercentage}
              onChange={(val) => handleDecimalChange('proteinPercentage', val)}
              placeholder="مثال: 3.2"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

           <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">أيام الحليب (DIM)</label>
            <DecimalInput
              value={params.daysInMilk}
              onChange={(val) => handleDecimalChange('daysInMilk', val)}
              placeholder="عدد الأيام بعد الولادة"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">شهر الحمل (0-9)</label>
            <DecimalInput
              value={params.pregnancyMonth}
              onChange={(val) => handleDecimalChange('pregnancyMonth', val)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">معدل النمو (كغ/يوم)</label>
            <DecimalInput
              value={params.growthRate}
              onChange={(val) => handleDecimalChange('growthRate', val)}
              placeholder={params.lactationNumber < 3 ? "يتم حسابه تلقائياً إذا كان 0" : "0"}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            {params.lactationNumber < 3 && params.growthRate === 0 && (
                <p className="text-[10px] text-green-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    سيتم إضافة نمو تقديري للأبكار
                </p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">حالة الجسم الحالية (BCS 1-5)</label>
            <DecimalInput
              value={params.currentBcs}
              onChange={(val) => handleDecimalChange('currentBcs', val)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
             <p className="text-[10px] text-slate-400 mt-1">
                مقياس من 1 (هزيلة جداً) إلى 5 (سمينة جداً). المثالي 3.0-3.5.
            </p>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">تغير الوزن اليومي (كغ/يوم)</label>
            <DecimalInput
              value={params.bcsChange}
              onChange={(val) => handleDecimalChange('bcsChange', val)}
              placeholder="مثال: 0.5 زيادة أو -0.2 نقصان"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
             <p className="text-[10px] text-slate-400 mt-1">
                لتحسين شرط الجسم (BCS): اعلم أن كل 1 درجة BCS تعادل تقريباً 50 كغ وزن حي.
            </p>
          </div>

          {/* New Environment Inputs */}
          <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">عدد الأبقار في المجموعة</label>
            <DecimalInput
              value={params.groupSize}
              onChange={(val) => handleDecimalChange('groupSize', val)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
             <p className="text-[10px] text-slate-400 mt-1">
                لحساب الكميات الكلية لعربة الخلط (TMR).
            </p>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">مرحلة موسم الحليب</label>
            <select
              name="lactationStage"
              value={params.lactationStage}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="early">بداية الموسم (Early - قمة الإنتاج)</option>
              <option value="mid">منتصف الموسم (Mid)</option>
              <option value="late">نهاية الموسم (Late)</option>
              <option value="dry">فترة التجفيف (Dry Period)</option>
            </select>
            <p className="text-[10px] text-slate-400 mt-1">تؤثر على توازن الطاقة والاحتياجات</p>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">الظروف البيئية (الإجهاد الحراري)</label>
            <select
              name="environment"
              value={params.environment}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="neutral">طبيعي (5 - 25 مئوية)</option>
              <option value="heat_mild">إجهاد حراري خفيف (25-30 مئوية)</option>
              <option value="heat_severe">إجهاد حراري شديد (&gt; 30 مئوية)</option>
              <option value="cold">إجهاد برد (&lt; 0 مئوية)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-slate-700 mb-2">نظام الإيواء والرعي</label>
            <select
              name="grazing"
              value={params.grazing}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="none">حظائر مغلقة (بدون رعي)</option>
              <option value="flat">رعي في أرض سهلة</option>
              <option value="hilly">رعي في أرض جبلية/وعرة</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calculated Requirements Display */}
      <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200 shadow-sm">
        <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
            <span>الاحتياجات الغذائية اليومية المقدرة (Feed 2026)</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col justify-center relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-1">
                   <Info className="w-4 h-4 text-slate-300" />
                 </div>
                <p className="text-sm text-slate-500 mb-1">القدرة على استهلاك العلف (DMI)</p>
                <div className="text-2xl font-bold text-slate-700">{calculatedNeeds.predictedDmi} <span className="text-sm font-normal text-slate-400">kg</span></div>
                <div className="text-[10px] text-slate-400 mt-1">المادة الجافة المتوقعة</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col justify-center">
                <p className="text-sm text-slate-500 mb-1">الطاقة الاستقلابية (ME)</p>
                <div className="text-2xl font-bold text-emerald-600">{calculatedNeeds.me} <span className="text-sm font-normal text-slate-400">Mcal</span></div>
                <div className="mt-1 pt-1 border-t border-slate-100">
                    <span className="text-lg font-bold text-emerald-500">{(calculatedNeeds.me * 4.184).toFixed(1)}</span>
                    <span className="text-xs text-slate-400 mr-1">MJ</span>
                </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col justify-center">
                <p className="text-sm text-slate-500 mb-1">البروتين الخام (CP)</p>
                <p className="text-2xl font-bold text-blue-600">{calculatedNeeds.cp}</p>
                <div className="flex flex-col gap-1 mt-1 pt-1 border-t border-slate-50">
                    <div className="flex justify-center gap-2">
                        <div className="text-[10px] text-slate-400">RDP: <span className="text-slate-600 font-medium">{calculatedNeeds.rdp}</span></div>
                        <div className="text-[10px] text-slate-400">RUP: <span className="text-slate-600 font-medium">{calculatedNeeds.rup}</span></div>
                    </div>
                    <div className="flex justify-center gap-2">
                        <div className="text-[9px] text-purple-400">Lys: <span className="text-purple-600 font-medium">{calculatedNeeds.lysine}</span></div>
                        <div className="text-[9px] text-purple-400">Met: <span className="text-purple-600 font-medium">{calculatedNeeds.methionine}</span></div>
                    </div>
                </div>
                <p className="text-[10px] text-slate-400">g/day</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col justify-center">
                <p className="text-sm text-slate-500 mb-1">الكالسيوم (Ca)</p>
                <p className="text-2xl font-bold text-orange-600">{calculatedNeeds.ca}</p>
                <p className="text-xs text-slate-400">g/day</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col justify-center">
                <p className="text-sm text-slate-500 mb-1">الفوسفور (P)</p>
                <p className="text-2xl font-bold text-purple-600">{calculatedNeeds.p}</p>
                <p className="text-xs text-slate-400">g/day</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NeedsForm;