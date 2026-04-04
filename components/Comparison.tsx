import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Nutrients, RationItem, FeedIngredient } from '../types';
import { Coins, TrendingUp, Printer, XCircle, Scale, PieChart } from 'lucide-react';

interface ComparisonProps {
  needs: Nutrients;
  supplied: Nutrients;
  totalDM: number;
  totalCost: number;
  milkProduction: number;
  groupSize: number;
  rationStructure: { 
      concentrateDM: number; 
      forageDM: number; 
      concentratePercent: number; 
      foragePercent: number; 
  };
  concentrateMix: RationItem[];
  concentrateFedAmount: number;
  forages: RationItem[];
  ingredients: FeedIngredient[];
}

const Comparison: React.FC<ComparisonProps> = ({ 
    needs, supplied, totalDM, totalCost, milkProduction, groupSize, rationStructure,
    concentrateMix, concentrateFedAmount, forages, ingredients
}) => {
  
  // Safe access to properties with defaults to prevent crashes if state is initializing
  const data = [
    { name: 'الطاقة (Mcal)', required: needs?.me || 0, supplied: supplied?.me || 0, unit: 'Mcal' },
    { name: 'البروتين (g/10)', required: Math.round((needs?.cp || 0) / 10), supplied: Math.round((supplied?.cp || 0) / 10), unit: 'x10 g' },
    { name: 'Ca (g)', required: needs?.ca || 0, supplied: supplied?.ca || 0, unit: 'g' },
    { name: 'NDF (g/10)', required: Math.round((needs?.ndf || 0)/10), supplied: Math.round((supplied?.ndf || 0)/10), unit: 'x10 g' },
  ];

  const getStatusColor = (req: number, sup: number, isMaxLimit: boolean = false) => {
    // If it's a Max Limit (like Starch), exceeding it is bad (Red), being under is generally OK (Green/Yellow)
    if (isMaxLimit) {
        if (sup > req) return 'text-red-600 bg-red-50'; // Exceeded max
        return 'text-green-600 bg-green-50'; // Safe
    }
    if (req === 0) return 'text-slate-600 bg-slate-50';

    const diff = ((sup - req) / req) * 100;
    if (diff < -10) return 'text-red-600 bg-red-50';
    if (diff > 20) return 'text-yellow-600 bg-yellow-50'; // Warning overfeeding
    return 'text-green-600 bg-green-50';
  };

  const getStatusText = (req: number, sup: number, isMaxLimit: boolean = false) => {
      if (isMaxLimit) {
          if (sup > req) return `تجاوز الحد (${req > 0 ? Math.round(((sup - req)/req)*100) : '∞'}%)`;
          return 'آمن';
      }
      if (req === 0) return '-';

      const diff = ((sup - req) / req) * 100;
      if (diff < -10) return `نقص (${Math.abs(Math.round(diff))}%)`;
      if (diff > 20) return `زائد (${Math.round(diff)}%)`;
      return 'متوازن';
  };

  const costPerKgMilk = milkProduction > 0 ? totalCost / milkProduction : 0;
  const dmiPercent = needs.predictedDmi && needs.predictedDmi > 0 ? (totalDM / needs.predictedDmi) * 100 : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    if(window.confirm('هل تريد إعادة تعيين التطبيق والبدء من جديد؟')) {
        window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
        {/* Economic Analysis */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 rounded-xl shadow-lg print-break-inside-avoid">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Coins className="text-yellow-400" />
                التحليل الاقتصادي (يومياً)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <p className="text-slate-300 text-sm mb-1">تكلفة البقرة الواحدة</p>
                    <p className="text-2xl font-bold text-yellow-400">{totalCost.toFixed(2)} <span className="text-sm">$/يوم</span></p>
                </div>
                {groupSize > 1 && (
                    <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-emerald-500/30">
                        <p className="text-slate-300 text-sm mb-1">تكلفة المجموعة ({groupSize})</p>
                        <p className="text-2xl font-bold text-emerald-400">{(totalCost * groupSize).toFixed(2)} <span className="text-sm">$/يوم</span></p>
                    </div>
                )}
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <p className="text-slate-300 text-sm mb-1">تكلفة 1 كغ حليب</p>
                    <p className="text-2xl font-bold text-green-400">{costPerKgMilk.toFixed(2)} <span className="text-sm">$/كغ</span></p>
                </div>
                 <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <p className="text-slate-300 text-sm mb-1">كفاءة التحويل</p>
                    <p className="text-2xl font-bold text-blue-400">{(totalDM > 0 ? milkProduction / totalDM : 0).toFixed(2)}</p>
                </div>
            </div>
        </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="text-emerald-600" />
            مقارنة الاحتياجات مع المقدم
        </h2>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* DMI Alert */}
            <div className={`p-4 rounded-lg border flex items-center gap-4 ${Math.abs(dmiPercent - 100) < 10 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
                <div className="p-2 bg-white rounded-full shadow-sm">
                    <Scale className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <div className="font-bold text-lg">توازن الشهية (DMI)</div>
                    <div className="text-xs mt-1">
                         المخطط: <span className="font-bold">{totalDM.toFixed(1)}</span> / المتوقع: <span className="font-bold">{needs.predictedDmi}</span> كغ
                    </div>
                </div>
                <div className="font-bold text-xl ltr">
                    {dmiPercent.toFixed(0)}%
                </div>
            </div>

            {/* Ration Structure Ratio */}
             <div className="p-4 rounded-lg border bg-slate-50 border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                    <PieChart className="w-5 h-5 text-slate-600" />
                    <span className="font-bold text-slate-700">نسبة المالئ : المركز (أساس جاف)</span>
                </div>
                
                <div className="h-6 w-full bg-slate-200 rounded-full overflow-hidden flex text-xs font-bold text-white mb-2">
                    <div 
                        className="bg-emerald-500 flex items-center justify-center transition-all duration-500" 
                        style={{ width: `${rationStructure.foragePercent}%` }}
                    >
                       {rationStructure.foragePercent > 10 && `مالئ ${rationStructure.foragePercent}%`}
                    </div>
                    <div 
                        className="bg-yellow-500 flex items-center justify-center transition-all duration-500" 
                        style={{ width: `${rationStructure.concentratePercent}%` }}
                    >
                       {rationStructure.concentratePercent > 10 && `مركز ${rationStructure.concentratePercent}%`}
                    </div>
                </div>

                <div className="flex justify-between text-xs font-medium">
                     <span className={rationStructure.foragePercent < 40 ? 'text-red-600 font-bold' : 'text-slate-600'}>
                         {rationStructure.foragePercent < 40 ? 'تحذير: نقص ألياف!' : 'مستوى مالئ جيد'}
                     </span>
                     <span className={rationStructure.concentratePercent > 60 ? 'text-red-600 font-bold' : 'text-slate-600'}>
                         {rationStructure.concentratePercent > 60 ? 'خطر حماض!' : 'مستوى مركز آمن'}
                     </span>
                </div>
            </div>
         </div>
        
        {/* Table View */}
        <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm text-right text-slate-600">
                <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                    <tr>
                        <th className="px-6 py-3 rounded-r-lg">العنصر الغذائي</th>
                        <th className="px-6 py-3">الاحتياجات / الحدود</th>
                        <th className="px-6 py-3">المقدم في العليقة</th>
                        <th className="px-6 py-3">النسبة في العليقة (DM)</th>
                        <th className="px-6 py-3 rounded-l-lg">الحالة</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white border-b hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">الطاقة (ME)</td>
                        <td className="px-6 py-4">{needs?.me} Mcal</td>
                        <td className="px-6 py-4">{supplied?.me} Mcal</td>
                        <td className="px-6 py-4 ltr text-right">{(supplied?.me / totalDM).toFixed(2)} Mcal/kg</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(needs?.me, supplied?.me)}`}>
                                {getStatusText(needs?.me, supplied?.me)}
                            </span>
                        </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">البروتين الخام (CP)</td>
                        <td className="px-6 py-4">{needs?.cp} g</td>
                        <td className="px-6 py-4">{supplied?.cp} g</td>
                        <td className="px-6 py-4 ltr text-right">{(supplied?.cp / (totalDM * 10)).toFixed(1)} %</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(needs?.cp, supplied?.cp)}`}>
                                {getStatusText(needs?.cp, supplied?.cp)}
                            </span>
                        </td>
                    </tr>
                    <tr className="bg-blue-50/30 border-b hover:bg-blue-50/50">
                        <td className="px-6 py-4 font-medium text-blue-900 pr-10">• البروتين القابل للتفكك (RDP)</td>
                        <td className="px-6 py-4">{needs?.rdp} g</td>
                        <td className="px-6 py-4">{supplied?.rdp} g</td>
                        <td className="px-6 py-4 ltr text-right">{(supplied?.rdp / (totalDM * 10)).toFixed(1)} %</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(needs?.rdp, supplied?.rdp)}`}>
                                {getStatusText(needs?.rdp, supplied?.rdp)}
                            </span>
                        </td>
                    </tr>
                    <tr className="bg-blue-50/30 border-b hover:bg-blue-50/50">
                        <td className="px-6 py-4 font-medium text-blue-900 pr-10">• البروتين العابر (RUP)</td>
                        <td className="px-6 py-4">{needs?.rup} g</td>
                        <td className="px-6 py-4">{supplied?.rup} g</td>
                        <td className="px-6 py-4 ltr text-right">{(supplied?.rup / (totalDM * 10)).toFixed(1)} %</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(needs?.rup, supplied?.rup)}`}>
                                {getStatusText(needs?.rup, supplied?.rup)}
                            </span>
                        </td>
                    </tr>
                    <tr className="bg-purple-50/30 border-b hover:bg-purple-50/50">
                        <td className="px-6 py-4 font-medium text-purple-900 pr-10">• اللايسين الاستقلابي (Lys)</td>
                        <td className="px-6 py-4">{needs?.lysine} g</td>
                        <td className="px-6 py-4">{supplied?.lysine} g</td>
                        <td className="px-6 py-4 ltr text-right">{(supplied?.lysine / totalDM).toFixed(1)} g/kg</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(needs?.lysine, supplied?.lysine)}`}>
                                {getStatusText(needs?.lysine, supplied?.lysine)}
                            </span>
                        </td>
                    </tr>
                    <tr className="bg-purple-50/30 border-b hover:bg-purple-50/50">
                        <td className="px-6 py-4 font-medium text-purple-900 pr-10">• الميثيونين الاستقلابي (Met)</td>
                        <td className="px-6 py-4">{needs?.methionine} g</td>
                        <td className="px-6 py-4">{supplied?.methionine} g</td>
                        <td className="px-6 py-4 ltr text-right">{(supplied?.methionine / totalDM).toFixed(1)} g/kg</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(needs?.methionine, supplied?.methionine)}`}>
                                {getStatusText(needs?.methionine, supplied?.methionine)}
                            </span>
                        </td>
                    </tr>
                    {/* Fiber & Carbs */}
                    <tr className="bg-slate-50/50 border-b hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">NDF (ألياف متعادلة)</td>
                        <td className="px-6 py-4">Min {needs?.ndf} g</td>
                        <td className="px-6 py-4">{supplied?.ndf} g</td>
                        <td className="px-6 py-4 ltr text-right">{(supplied?.ndf / (totalDM * 10)).toFixed(1)} %</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${supplied?.ndf < needs?.ndf ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                {supplied?.ndf < needs?.ndf ? 'منخفض (خطر)' : 'جيد'}
                            </span>
                        </td>
                    </tr>
                     <tr className="bg-slate-50/50 border-b hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">ADF (ألياف حامضية)</td>
                        <td className="px-6 py-4">Min {needs?.adf} g</td>
                        <td className="px-6 py-4">{supplied?.adf} g</td>
                        <td className="px-6 py-4 ltr text-right">{(supplied?.adf / (totalDM * 10)).toFixed(1)} %</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${supplied?.adf < needs?.adf ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                {supplied?.adf < needs?.adf ? 'منخفض' : 'جيد'}
                            </span>
                        </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">النشاء (Starch)</td>
                        <td className="px-6 py-4">Max {needs?.starch} g</td>
                        <td className="px-6 py-4">{supplied?.starch} g</td>
                        <td className="px-6 py-4 ltr text-right">{(supplied?.starch / (totalDM * 10)).toFixed(1)} %</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(needs?.starch, supplied?.starch, true)}`}>
                                {getStatusText(needs?.starch, supplied?.starch, true)}
                            </span>
                        </td>
                    </tr>
                     <tr className="bg-white border-b hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">السكر (Sugar)</td>
                        <td className="px-6 py-4">~ {needs?.sugar} g</td>
                        <td className="px-6 py-4">{supplied?.sugar} g</td>
                        <td className="px-6 py-4 ltr text-right">{(supplied?.sugar / (totalDM * 10)).toFixed(1)} %</td>
                        <td className="px-6 py-4">
                            <span className="text-slate-400 text-xs">-</span>
                        </td>
                    </tr>

                     <tr className="bg-slate-50/50 border-b hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">الكالسيوم (Ca)</td>
                        <td className="px-6 py-4">{needs?.ca} g</td>
                        <td className="px-6 py-4">{supplied?.ca} g</td>
                        <td className="px-6 py-4 ltr text-right">{(supplied?.ca / (totalDM * 10)).toFixed(2)} %</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(needs?.ca, supplied?.ca)}`}>
                                {getStatusText(needs?.ca, supplied?.ca)}
                            </span>
                        </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">الفوسفور (P)</td>
                        <td className="px-6 py-4">{needs?.p} g</td>
                        <td className="px-6 py-4">{supplied?.p} g</td>
                        <td className="px-6 py-4 ltr text-right">{(supplied?.p / (totalDM * 10)).toFixed(2)} %</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(needs?.p, supplied?.p)}`}>
                                {getStatusText(needs?.p, supplied?.p)}
                            </span>
                        </td>
                    </tr>
                    <tr className="bg-yellow-50/30 border-b hover:bg-yellow-50/50">
                        <td className="px-6 py-4 font-medium text-yellow-900 pr-10">• توازن الكاتيونات والأنيونات (DCAD)</td>
                        <td className="px-6 py-4">{needs?.dcad} mEq</td>
                        <td className="px-6 py-4">{supplied?.dcad} mEq</td>
                        <td className="px-6 py-4 ltr text-right">---</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${Math.abs(needs?.dcad - supplied?.dcad) < 50 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {Math.abs(needs?.dcad - supplied?.dcad) < 50 ? 'متوازن' : 'تحتاج مراجعة'}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        {/* Chart View */}
        <div className="h-80 w-full mt-8 ltr" dir="ltr">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="required" fill="#94a3b8" name="المطلوب/الحد الأدنى" />
                <Bar dataKey="supplied" fill="#10b981" name="المقدم" />
                </BarChart>
            </ResponsiveContainer>
        </div>

        <div className="mt-6 bg-slate-50 p-4 rounded text-center text-slate-600">
            إجمالي المادة الجافة المتناولة (DMI): <span className="font-bold text-slate-900">{totalDM.toFixed(1)} كغ</span>
        </div>

        {/* Group Ration / TMR Report */}
        {groupSize > 1 && (
            <div className="mt-12 bg-white p-6 rounded-xl border-2 border-emerald-100 shadow-md print-break-inside-avoid">
                <h2 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-2 border-b-2 border-emerald-50 pb-3">
                    <Scale className="text-emerald-600" />
                    تقرير خلطة المجموعة (TMR) - لعدد {groupSize} بقرة
                </h2>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="bg-emerald-50 text-emerald-900">
                                <th className="px-4 py-3 rounded-r-lg">المادة العلفية</th>
                                <th className="px-4 py-3">الكمية للبقرة الواحدة (كغ كما هي)</th>
                                <th className="px-4 py-3 rounded-l-lg font-bold text-emerald-700">الكمية الكلية للمجموعة (كغ)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-50">
                            {/* Forages */}
                            {forages.map((item, idx) => {
                                const ing = ingredients.find(i => i.id === item.ingredientId);
                                return (
                                    <tr key={`forage-${idx}`} className="hover:bg-emerald-50/30">
                                        <td className="px-4 py-3 font-medium">{ing?.name}</td>
                                        <td className="px-4 py-3">{item.amount.toFixed(2)} كغ</td>
                                        <td className="px-4 py-3 font-bold text-emerald-600">{(item.amount * groupSize).toFixed(1)} كغ</td>
                                    </tr>
                                );
                            })}
                            
                            {/* Concentrate Mix */}
                            {concentrateMix.length > 0 && (
                                <tr className="bg-slate-50">
                                    <td colSpan={3} className="px-4 py-2 font-bold text-slate-700 text-sm">مكونات الخلطة المركزة:</td>
                                </tr>
                            )}
                            {concentrateMix.map((item, idx) => {
                                const ing = ingredients.find(i => i.id === item.ingredientId);
                                const totalMixWeight = concentrateMix.reduce((sum, i) => sum + i.amount, 0);
                                const ratio = totalMixWeight > 0 ? item.amount / totalMixWeight : 0;
                                const amountPerCow = ratio * concentrateFedAmount;
                                
                                return (
                                    <tr key={`conc-${idx}`} className="hover:bg-emerald-50/30">
                                        <td className="px-4 py-3 font-medium pr-8">• {ing?.name}</td>
                                        <td className="px-4 py-3">{amountPerCow.toFixed(2)} كغ</td>
                                        <td className="px-4 py-3 font-bold text-emerald-600">{(amountPerCow * groupSize).toFixed(1)} كغ</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="bg-emerald-700 text-white font-bold">
                                <td className="px-4 py-4 rounded-r-lg">إجمالي وزن الخلطة (TMR)</td>
                                <td className="px-4 py-4">{(totalDM / 0.5).toFixed(1)} كغ تقريباً</td> {/* Rough as-fed estimate */}
                                <td className="px-4 py-4 rounded-l-lg text-xl">
                                    {((forages.reduce((s, i) => s + i.amount, 0) + concentrateFedAmount) * groupSize).toFixed(1)} كغ
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <p className="mt-4 text-xs text-slate-400 italic">
                    * ملاحظة: الكميات محسوبة على أساس الوزن الطازج (كما هو) لسهولة الوزن عند التعبئة.
                </p>
            </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8 no-print">
            <button 
                onClick={handlePrint}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all font-bold"
            >
                <Printer className="w-5 h-5" />
                طباعة التقرير
            </button>
             <button 
                onClick={handleClose}
                className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-lg shadow-md transition-all font-bold"
            >
                <XCircle className="w-5 h-5" />
                إنهاء / إغلاق
            </button>
        </div>
      </div>
    </div>
  );
};

export default Comparison;