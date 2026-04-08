import React, { useMemo, useState } from 'react';
import { RationItem, Nutrients, FeedIngredient } from '../types';
import { Calculator, Settings, Plus, X, Save, RefreshCw } from 'lucide-react';
import DecimalInput from './DecimalInput';

interface FeedFormProps {
  concentrateMix: RationItem[];
  setConcentrateMix: (items: RationItem[]) => void;
  concentrateFedAmount: number;
  setConcentrateFedAmount: (n: number) => void;
  forages: RationItem[];
  setForages: (items: RationItem[]) => void;
  mixAnalysis: Nutrients;
  ingredients: FeedIngredient[];
  setIngredients: (items: FeedIngredient[]) => void;
}

const FeedForm: React.FC<FeedFormProps> = ({
  concentrateMix,
  setConcentrateMix,
  concentrateFedAmount,
  setConcentrateFedAmount,
  forages,
  setForages,
  mixAnalysis,
  ingredients,
  setIngredients
}) => {

  const [editingIngredient, setEditingIngredient] = useState<FeedIngredient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const concentrateOptions = ingredients.filter(f => f.type === 'concentrate');
  const forageOptions = ingredients.filter(f => f.type === 'forage');

  const updateMixItem = (id: string, amount: number) => {
    const existing = concentrateMix.find(i => i.ingredientId === id);
    if (existing) {
      if (amount <= 0) {
        setConcentrateMix(concentrateMix.filter(i => i.ingredientId !== id));
      } else {
        setConcentrateMix(concentrateMix.map(i => i.ingredientId === id ? { ...i, amount } : i));
      }
    } else if (amount > 0) {
      setConcentrateMix([...concentrateMix, { ingredientId: id, amount }]);
    }
  };

  const updateForageItem = (id: string, amount: number) => {
    const existing = forages.find(i => i.ingredientId === id);
    if (existing) {
       if (amount <= 0) {
        setForages(forages.filter(i => i.ingredientId !== id));
      } else {
        setForages(forages.map(i => i.ingredientId === id ? { ...i, amount } : i));
      }
    } else if (amount > 0) {
      setForages([...forages, { ingredientId: id, amount }]);
    }
  };

  const handleNormalizeMix = () => {
    const total = concentrateMix.reduce((sum, item) => sum + item.amount, 0);
    if (total === 0) return;
    
    // Normalize to 100%
    const normalized = concentrateMix.map(item => ({
      ...item,
      amount: parseFloat(((item.amount / total) * 100).toFixed(2))
    }));
    setConcentrateMix(normalized);
  };

  const totalMixPercentage = useMemo(() => 
    concentrateMix.reduce((acc, curr) => acc + curr.amount, 0), [concentrateMix]);

  // Calculate Mix Price
  const mixPricePerKg = useMemo(() => {
    if (totalMixPercentage === 0) return 0;
    const totalCost = concentrateMix.reduce((acc, item) => {
        const ing = ingredients.find(i => i.id === item.ingredientId);
        return acc + (item.amount * (ing?.defaultPrice || 0));
    }, 0);
    return totalCost / totalMixPercentage;
  }, [concentrateMix, ingredients, totalMixPercentage]);

  // -- Ingredient Management --

  const openEditModal = (ingredient: FeedIngredient) => {
    setEditingIngredient({ ...ingredient });
    setIsModalOpen(true);
  };

  const openNewModal = (type: 'concentrate' | 'forage') => {
    setEditingIngredient({
        id: `custom_${Date.now()}`,
        name: 'مادة جديدة',
        type: type,
        dm: 90,
        me: 2.0,
        cp: 10,
        rdp: 65,
        rup: 35,
        lysine: 4.0,
        methionine: 1.5,
        ca: 0.1,
        p: 0.1,
        na: 0.05,
        k: 0.5,
        cl: 0.1,
        s: 0.1,
        peFactor: 0.5,
        starch: 0,
        sugar: 0,
        ndf: 10,
        uNDF240: 5,
        adf: 5,
        defaultPrice: 0
    });
    setIsModalOpen(true);
  };

  const saveIngredient = () => {
      if (!editingIngredient) return;
      
      const exists = ingredients.find(i => i.id === editingIngredient.id);
      if (exists) {
          setIngredients(ingredients.map(i => i.id === editingIngredient.id ? editingIngredient : i));
      } else {
          setIngredients([...ingredients, editingIngredient]);
      }
      setIsModalOpen(false);
      setEditingIngredient(null);
  };

  const handleModalChange = (field: keyof FeedIngredient, value: string | number) => {
      if (!editingIngredient) return;
      setEditingIngredient({
          ...editingIngredient,
          [field]: typeof value === 'number' ? value : value
      });
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Concentrate Mix Definition */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
           <div>
            <h2 className="text-xl font-bold text-blue-800">1. تركيب الخلطة المركزة</h2>
            <p className="text-sm text-blue-600">حدد النسب المئوية للمكونات</p>
           </div>
           <div className="bg-white px-3 py-1 rounded text-blue-800 text-sm font-bold shadow-sm flex items-center gap-1">
             <span>سعر 1 كغ خلطة:</span>
             <span className="ltr text-base">{mixPricePerKg.toFixed(0)} ل.س</span>
           </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 mb-2 px-2 border-b pb-2">
            <div className="col-span-5 md:col-span-4">المادة العلفية</div>
            <div className="col-span-5 md:col-span-4 text-center">النسبة %</div>
            <div className="col-span-2 md:col-span-4 text-center">تعديل</div>
          </div>
          <div className="space-y-3 mt-3">
          {concentrateOptions.map(feed => {
            const currentVal = concentrateMix.find(i => i.ingredientId === feed.id)?.amount || '';
            return (
              <div key={feed.id} className="grid grid-cols-12 gap-4 items-center">
                 <label className="col-span-5 md:col-span-4 text-sm font-medium text-slate-700 flex flex-col">
                    <span>{feed.name}</span>
                    <span className="text-xs text-slate-400 font-normal ltr text-right">{feed.defaultPrice} ل.س/كغ</span>
                 </label>
                 
                 <div className="col-span-5 md:col-span-4 relative">
                    {/* RTL Input: Text Right, Icon Left */}
                    <DecimalInput 
                      value={typeof currentVal === 'number' ? currentVal : 0}
                      onChange={(val) => updateMixItem(feed.id, val)}
                      className="w-full p-2 pl-8 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-right bg-slate-50"
                      placeholder="0"
                      dir="ltr"
                    />
                    <span className="absolute left-3 top-2 text-slate-400 text-xs font-bold">%</span>
                 </div>

                 <div className="col-span-2 md:col-span-4 text-center">
                    <button 
                        onClick={() => openEditModal(feed)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="تعديل خصائص المادة"
                    >
                        <Settings className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            );
          })}
          </div>
          <button 
            onClick={() => openNewModal('concentrate')}
            className="mt-6 w-full py-2 border-2 border-dashed border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" /> إضافة مادة مركزة جديدة
          </button>
        </div>
        <div className="bg-slate-50 px-6 py-3 border-t flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">المجموع الحالي للنسب:</span>
                <span className={`font-bold px-3 py-1 rounded ltr ${Math.abs(totalMixPercentage - 100) < 0.1 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {totalMixPercentage.toFixed(1)}%
                </span>
            </div>
             <button 
                onClick={handleNormalizeMix}
                className="flex items-center gap-2 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors text-sm font-bold border border-blue-200"
                title="إعادة حساب النسب لتصبح 100%"
            >
                <RefreshCw className="w-4 h-4" />
                تسوية النسب لـ 100%
            </button>
        </div>
      </div>

      {/* Mix Analysis Result */}
      <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg relative overflow-hidden print-break-inside-avoid">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-800"></div>
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            محتوى الخلطة المركزة (لكل 1 كغ علف):
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 text-center">
              <div>
                  <div className="text-xl font-bold">{mixAnalysis.me}</div>
                  <div className="text-[10px] opacity-80">Mcal/kg</div>
              </div>
              <div>
                  <div className="text-xl font-bold ltr">{(mixAnalysis.cp / 10).toFixed(1)}%</div>
                  <div className="text-[10px] opacity-80">بروتين</div>
              </div>
              <div>
                  <div className="text-xl font-bold ltr">{(mixAnalysis.ca / 10).toFixed(2)}%</div>
                  <div className="text-[10px] opacity-80">كالسيوم</div>
              </div>
               <div>
                  <div className="text-xl font-bold ltr">{(mixAnalysis.p / 10).toFixed(2)}%</div>
                  <div className="text-[10px] opacity-80">فوسفور</div>
              </div>
              {/* New Nutrients */}
              <div>
                  <div className="text-xl font-bold ltr">{(mixAnalysis.starch / 10).toFixed(1)}%</div>
                  <div className="text-[10px] opacity-80">نشاء</div>
              </div>
               <div>
                  <div className="text-xl font-bold ltr">{(mixAnalysis.sugar / 10).toFixed(1)}%</div>
                  <div className="text-[10px] opacity-80">سكر</div>
              </div>
               <div>
                  <div className="text-xl font-bold ltr">{(mixAnalysis.ndf / 10).toFixed(1)}%</div>
                  <div className="text-[10px] opacity-80">NDF</div>
              </div>
               <div>
                  <div className="text-xl font-bold ltr">{(mixAnalysis.adf / 10).toFixed(1)}%</div>
                  <div className="text-[10px] opacity-80">ADF</div>
              </div>
              <div className="col-span-2 md:col-span-1 border-t border-blue-400 pt-1">
                  <div className="text-xs font-bold ltr">{mixAnalysis.lysine.toFixed(1)}g</div>
                  <div className="text-[8px] opacity-80">Lysine</div>
              </div>
              <div className="col-span-2 md:col-span-1 border-t border-blue-400 pt-1">
                  <div className="text-xs font-bold ltr">{mixAnalysis.methionine.toFixed(1)}g</div>
                  <div className="text-[8px] opacity-80">Methionine</div>
              </div>
              <div className="col-span-2 md:col-span-1 border-t border-blue-400 pt-1">
                  <div className="text-xs font-bold ltr">{mixAnalysis.dcad.toFixed(0)}</div>
                  <div className="text-[8px] opacity-80">DCAD (mEq)</div>
              </div>
              <div className="col-span-2 md:col-span-1 border-t border-blue-400 pt-1">
                  <div className="text-xs font-bold ltr">{mixAnalysis.peNDF.toFixed(0)}g</div>
                  <div className="text-[8px] opacity-80">peNDF</div>
              </div>
          </div>
      </div>

      {/* 2. Amount Fed */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
         <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">2. كميات العلف المقدمة للبقرة (يومياً)</h2>
         
         <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <label className="block text-lg font-medium text-blue-900 mb-2">كمية العلف المركز (من الخلطة السابقة)</label>
            <div className="flex items-center gap-4">
                <div className="relative max-w-xs flex-1">
                    <DecimalInput 
                        value={concentrateFedAmount}
                        onChange={(val) => setConcentrateFedAmount(val)}
                        className="w-full p-3 pl-12 border-2 border-blue-200 rounded-lg text-lg focus:border-blue-500 focus:outline-none text-right"
                        dir="ltr"
                    />
                    <span className="absolute left-4 top-4 font-bold text-slate-400">كغ</span>
                </div>
                <div className="text-blue-700 font-bold text-sm ltr">
                    التكلفة: {(concentrateFedAmount * mixPricePerKg).toFixed(0)} ل.س
                </div>
            </div>
         </div>

         <div className="space-y-4">
             <div className="col-span-full font-medium text-emerald-700 border-b pb-2">الأعلاف المالئة (خشنة):</div>
             <div className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-500 px-2 border-b pb-2">
                 <div className="col-span-5 md:col-span-4">المادة</div>
                 <div className="col-span-5 md:col-span-4 text-center">الكمية (كغ)</div>
                 <div className="col-span-2 md:col-span-4 text-center">تعديل</div>
             </div>
             {forageOptions.map(feed => {
                 const currentVal = forages.find(i => i.ingredientId === feed.id)?.amount || '';
                 return (
                    <div key={feed.id} className="grid grid-cols-12 gap-4 items-center p-2 hover:bg-slate-50 rounded transition-colors">
                        <label className="col-span-5 md:col-span-4 text-sm font-medium text-slate-700 flex flex-col">
                            <span>{feed.name}</span>
                            <span className="text-xs text-slate-400 font-normal ltr text-right">{feed.defaultPrice} ل.س/كغ</span>
                        </label>
                        
                        <div className="col-span-5 md:col-span-4 relative">
                            <DecimalInput 
                            value={typeof currentVal === 'number' ? currentVal : 0}
                            onChange={(val) => updateForageItem(feed.id, val)}
                            className="w-full p-2 pl-10 border rounded focus:ring-2 focus:ring-emerald-500 outline-none bg-emerald-50/30 text-right"
                            placeholder="0"
                            dir="ltr"
                            />
                            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">كغ</span>
                        </div>

                         <div className="col-span-2 md:col-span-4 text-center">
                            <button 
                                onClick={() => openEditModal(feed)}
                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                title="تعديل خصائص المادة"
                            >
                                <Settings className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                 );
             })}
             <button 
                onClick={() => openNewModal('forage')}
                className="mt-6 w-full py-2 border-2 border-dashed border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-50 hover:border-emerald-400 transition-all flex items-center justify-center gap-2 font-medium"
            >
                <Plus className="w-4 h-4" /> إضافة مادة مالئة جديدة
            </button>
         </div>
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && editingIngredient && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
                  <div className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center">
                      <h3 className="font-bold text-lg">
                          {editingIngredient.id.startsWith('custom') ? 'إضافة مادة جديدة' : 'تعديل خصائص المادة'}
                      </h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">اسم المادة العلفية</label>
                          <input 
                              type="text" 
                              value={editingIngredient.name} 
                              onChange={(e) => handleModalChange('name', e.target.value)}
                              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">السعر (لكل كغ) ل.س</label>
                              <DecimalInput 
                                  value={editingIngredient.defaultPrice} 
                                  onChange={(val) => handleModalChange('defaultPrice', val)}
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none ltr"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">المادة الجافة (DM %)</label>
                              <DecimalInput 
                                  value={editingIngredient.dm} 
                                  onChange={(val) => handleModalChange('dm', val)}
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none ltr"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">الطاقة (ME Mcal/kg DM)</label>
                              <DecimalInput 
                                  value={editingIngredient.me} 
                                  onChange={(val) => handleModalChange('me', val)}
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none ltr"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">البروتين الخام (CP % DM)</label>
                              <DecimalInput 
                                  value={editingIngredient.cp} 
                                  onChange={(val) => handleModalChange('cp', val)}
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none ltr"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">RDP (% من البروتين)</label>
                              <DecimalInput 
                                  value={editingIngredient.rdp} 
                                  onChange={(val) => handleModalChange('rdp', val)}
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50/30 ltr"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">RUP (% من البروتين)</label>
                              <DecimalInput 
                                  value={editingIngredient.rup} 
                                  onChange={(val) => handleModalChange('rup', val)}
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50/30 ltr"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">اللايسين (% من البروتين)</label>
                              <DecimalInput 
                                  value={editingIngredient.lysine} 
                                  onChange={(val) => handleModalChange('lysine', val)}
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-purple-50/30 ltr"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">الميثيونين (% من البروتين)</label>
                              <DecimalInput 
                                  value={editingIngredient.methionine} 
                                  onChange={(val) => handleModalChange('methionine', val)}
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-purple-50/30 ltr"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">الكالسيوم (Ca % DM)</label>
                              <DecimalInput 
                                  value={editingIngredient.ca} 
                                  onChange={(val) => handleModalChange('ca', val)}
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none ltr"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">الفوسفور (P % DM)</label>
                              <DecimalInput 
                                  value={editingIngredient.p} 
                                  onChange={(val) => handleModalChange('p', val)}
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none ltr"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">الصوديوم (Na % DM)</label>
                              <DecimalInput 
                                  value={editingIngredient.na} 
                                  onChange={(val) => handleModalChange('na', val)}
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-yellow-50/30 ltr"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">البوتاسيوم (K % DM)</label>
                              <DecimalInput 
                                  value={editingIngredient.k} 
                                  onChange={(val) => handleModalChange('k', val)}
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-yellow-50/30 ltr"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">الكلور (Cl % DM)</label>
                              <DecimalInput 
                                  value={editingIngredient.cl} 
                                  onChange={(val) => handleModalChange('cl', val)}
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-yellow-50/30 ltr"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">الكبريت (S % DM)</label>
                              <DecimalInput 
                                  value={editingIngredient.s} 
                                  onChange={(val) => handleModalChange('s', val)}
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-yellow-50/30 ltr"
                              />
                          </div>
                          {/* New Inputs */}
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">النشاء (Starch % DM)</label>
                              <DecimalInput 
                                  value={editingIngredient.starch} 
                                  onChange={(val) => handleModalChange('starch', val)}
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50/50 ltr"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">السكر (Sugar % DM)</label>
                              <DecimalInput 
                                  value={editingIngredient.sugar} 
                                  onChange={(val) => handleModalChange('sugar', val)}
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50/50 ltr"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">ألياف NDF (% DM)</label>
                              <DecimalInput 
                                  value={editingIngredient.ndf} 
                                  onChange={(val) => handleModalChange('ndf', val)}
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-emerald-50/50 ltr"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">معامل الفعالية الفيزيائية (peFactor 0-1)</label>
                              <DecimalInput 
                                  value={editingIngredient.peFactor} 
                                  onChange={(val) => handleModalChange('peFactor', val)}
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-green-50/30 ltr"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">ألياف ADF (% DM)</label>
                              <DecimalInput 
                                  value={editingIngredient.adf} 
                                  onChange={(val) => handleModalChange('adf', val)}
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-emerald-50/50 ltr"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">ألياف uNDF240 (% DM)</label>
                              <DecimalInput 
                                  value={editingIngredient.uNDF240} 
                                  onChange={(val) => handleModalChange('uNDF240', val)}
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-red-50/30 ltr"
                              />
                          </div>
                      </div>
                      <div className="text-xs text-slate-400 bg-slate-50 p-2 rounded">
                          ملاحظة: القيم الغذائية يجب أن تكون على أساس المادة الجافة (DM Basis).
                      </div>
                  </div>
                  <div className="p-4 border-t flex justify-end gap-2 bg-slate-50">
                      <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded transition-colors"
                      >
                          إلغاء
                      </button>
                      <button 
                        onClick={saveIngredient}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                          <Save className="w-4 h-4" /> حفظ التغييرات
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default FeedForm;