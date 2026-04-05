import React, { useState, useEffect } from 'react';
import { CowParameters, Nutrients } from '../types';
import { predictMetabolicHealth } from '../services/geminiService';
import { Brain, AlertCircle, RefreshCw, Key, ShieldCheck, Lock } from 'lucide-react';

interface HealthAdvisorProps {
  params: CowParameters;
  needs: Nutrients;
  supplied: Nutrients;
  concentrateAmount: number;
  forageAmount: number; // Rough estimate
}

const DAILY_LIMIT = 10;

const HealthAdvisor: React.FC<HealthAdvisorProps> = ({ params, needs, supplied, concentrateAmount, forageAmount }) => {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("gemini-3-flash-preview");
  const [personalKey, setPersonalKey] = useState<string>(localStorage.getItem('personal_gemini_key') || '');
  const [dailyUsage, setDailyUsage] = useState<number>(0);
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('ai_usage_date');
    const usage = parseInt(localStorage.getItem('ai_usage_count') || '0');

    if (lastDate !== today) {
      localStorage.setItem('ai_usage_date', today);
      localStorage.setItem('ai_usage_count', '0');
      setDailyUsage(0);
    } else {
      setDailyUsage(usage);
    }
  }, []);

  const handlePredict = async () => {
    if (!personalKey && dailyUsage >= DAILY_LIMIT) {
        alert(`لقد وصلت للحد اليومي المجاني (${DAILY_LIMIT} مرات). يرجى العودة غداً أو إدخال مفتاح API خاص بك للمتابعة.`);
        setShowKeyInput(true);
        return;
    }

    setLoading(true);
    const ratio = forageAmount > 0 ? forageAmount / concentrateAmount : 0;
    try {
        const result = await predictMetabolicHealth(params, needs, supplied, ratio, selectedModel, personalKey);
        setPrediction(result);
        
        if (!personalKey) {
            const newUsage = dailyUsage + 1;
            setDailyUsage(newUsage);
            localStorage.setItem('ai_usage_count', newUsage.toString());
        }
    } catch (e) {
        setPrediction("حدث خطأ غير متوقع.");
    } finally {
        setLoading(false);
    }
  };

  const savePersonalKey = (key: string) => {
    setPersonalKey(key);
    localStorage.setItem('personal_gemini_key', key);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-100 shadow-sm mb-8">
        <div className="text-center mb-6">
            <Brain className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-indigo-900 mb-2">المستشار الفني الذكي (بيطري/زراعي)</h2>
            <p className="text-indigo-700">
            باستخدام الذكاء الاصطناعي (Gemini)، نقوم بتحليل التوازن الغذائي من وجهة نظر طبية وفنية للتنبؤ بمخاطر الأمراض الاستقلابية.
            </p>
        </div>

        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-indigo-400 font-bold mr-2">نموذج الذكاء الاصطناعي:</label>
                    <select 
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-white border border-indigo-200 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 shadow-sm"
                    >
                        <option value="gemini-3-flash-preview">Gemini 3 Flash (سريع ومجاني)</option>
                        <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (أكثر دقة)</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs text-indigo-400 font-bold mr-2">حالة الاستخدام المجاني:</label>
                    <div className="bg-white border border-indigo-200 p-2.5 rounded-lg flex items-center justify-between">
                        <span className="text-sm text-indigo-900">
                            {personalKey ? 'مفتاح خاص مفعل (غير محدود)' : `متبقي ${DAILY_LIMIT - dailyUsage} من ${DAILY_LIMIT} اليوم`}
                        </span>
                        <button 
                            onClick={() => setShowKeyInput(!showKeyInput)}
                            className="text-indigo-600 hover:text-indigo-800"
                            title="إعدادات المفتاح"
                        >
                            <Key className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {showKeyInput && (
                <div className="bg-white p-4 rounded-xl border border-indigo-200 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 mb-2 text-indigo-900 font-bold text-sm">
                        <Lock className="w-4 h-4" />
                        إعدادات مفتاح API الخاص (اختياري)
                    </div>
                    <p className="text-xs text-slate-500 mb-3">
                        إذا كنت تمتلك مفتاح API من Google AI Studio، يمكنك إدخاله هنا لتجاوز الحدود اليومية. يتم حفظ المفتاح محلياً في متصفحك فقط.
                    </p>
                    <div className="flex gap-2">
                        <input 
                            type="password"
                            placeholder="أدخل مفتاح API هنا..."
                            value={personalKey}
                            onChange={(e) => savePersonalKey(e.target.value)}
                            className="flex-grow bg-slate-50 border border-slate-200 text-sm rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {personalKey && (
                            <button 
                                onClick={() => savePersonalKey('')}
                                className="text-xs text-red-600 hover:underline"
                            >
                                حذف
                            </button>
                        )}
                    </div>
                </div>
            )}

            <button
                onClick={handlePredict}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
                {loading ? (
                    <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        جاري التحليل...
                    </>
                ) : (
                    <>
                        <ShieldCheck className="w-5 h-5" />
                        تحليل العليقة الآن
                    </>
                )}
            </button>
        </div>
      </div>

      {prediction && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in">
            <div className="bg-slate-800 text-white px-6 py-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-bold">تقرير التحليل الصحي</h3>
            </div>
            <div className="p-8 prose prose-lg prose-indigo max-w-none text-right" dir="rtl">
                 {/* Rendering simple text with possible formatting from AI */}
                 <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                    {prediction}
                 </div>
            </div>
            <div className="bg-yellow-50 p-4 text-xs text-yellow-800 border-t border-yellow-100 text-center">
                تنويه: هذه النتائج استرشادية وتعتمد على دقة المدخلات. يرجى استشارة الطبيب البيطري أو المهندس الزراعي المختص دائماً.
            </div>
        </div>
      )}
    </div>
  );
};

export default HealthAdvisor;