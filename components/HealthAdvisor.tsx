import React, { useState } from 'react';
import { CowParameters, Nutrients } from '../types';
import { predictMetabolicHealth } from '../services/geminiService';
import { Brain, AlertCircle, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface HealthAdvisorProps {
  params: CowParameters;
  needs: Nutrients;
  supplied: Nutrients;
  concentrateAmount: number;
  forageAmount: number; // Rough estimate
}

const HealthAdvisor: React.FC<HealthAdvisorProps> = ({ params, needs, supplied, concentrateAmount, forageAmount }) => {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    const ratio = forageAmount > 0 ? forageAmount / concentrateAmount : 0;
    try {
        const result = await predictMetabolicHealth(params, needs, supplied, ratio);
        setPrediction(result);
    } catch (e) {
        setPrediction("حدث خطأ غير متوقع.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-100 shadow-sm text-center mb-8">
        <Brain className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-indigo-900 mb-2">المستشار الفني الذكي (بيطري/زراعي)</h2>
        <p className="text-indigo-700 mb-6">
          باستخدام الذكاء الاصطناعي (Gemini)، نقوم بتحليل التوازن الغذائي من وجهة نظر طبية وفنية (تغذية حيوان) للتنبؤ بمخاطر الأمراض الاستقلابية مثل حمى الحليب، الكيتوزيس، والحماض الكرشي.
        </p>
        
        <button
          onClick={handlePredict}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              جاري التحليل...
            </>
          ) : (
            'تحليل العليقة الآن'
          )}
        </button>
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