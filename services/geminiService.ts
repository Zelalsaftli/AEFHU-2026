import { GoogleGenAI } from "@google/genai";
import { Nutrients, CowParameters } from "../types";

export const predictMetabolicHealth = async (
  cowParams: CowParameters,
  needs: Nutrients,
  supplied: Nutrients,
  forageToConcRatio: number
): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined") {
    console.error("خطأ: مفتاح API غير موجود. يرجى إضافته في إعدادات البيئة (Environment Variables).");
    return "عذراً، مفتاح الـ API الخاص بالذكاء الاصطناعي غير مهيأ. يرجى التأكد من إضافته في إعدادات Vercel.";
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";

  const energyBalance = supplied.me - needs.me;
  const cpBalance = supplied.cp - needs.cp;

  const prompt = `
    أنت طبيب بيطري أو مهندس زراعي مختص في تغذية الحيوان، وخبير في صياغة علائق الأبقار الحلوب وفق معايير NRC 2021 و NASEM 2021 و Feed 2026. قم بتحليل هذه العليقة وتوقع الأمراض الاستقلابية المحتملة وقدم نصائح فنية دقيقة بناءً على هذه المراجع العلمية الموثوقة.
    
    بيانات البقرة التفصيلية:
    - الوزن: ${cowParams.weight} كغ، السلالة: ${cowParams.breed}
    - الإنتاج: ${cowParams.milkProduction} كغ (دهن ${cowParams.fatPercentage}%، بروتين ${cowParams.proteinPercentage}%)
    - أيام الحليب (DIM): ${cowParams.daysInMilk} يوم، مرحلة الحليب: ${cowParams.lactationStage}
    - حالة الجسم (BCS): ${cowParams.currentBcs} / 5
    - رقم الموسم: ${cowParams.lactationNumber}
    - البيئة: ${cowParams.environment}، الرعي: ${cowParams.grazing}
    
    التحليل الغذائي (Feed 2026):
    - الطاقة الاستقلابية (ME): المقدم ${supplied.me} / المطلوب ${needs.me} Mcal (التوازن: ${energyBalance.toFixed(2)} Mcal)
    - البروتين الخام (CP): المقدم ${supplied.cp} / المطلوب ${needs.cp} g (التوازن: ${cpBalance.toFixed(0)} g)
    - البروتين القابل للتفكك (RDP): المقدم ${supplied.rdp} / المطلوب ${needs.rdp} g
    - البروتين العابر (RUP): المقدم ${supplied.rup} / المطلوب ${needs.rup} g
    - اللايسين الاستقلابي (Lys): المقدم ${supplied.lysine} / المطلوب ${needs.lysine} g
    - الميثيونين الاستقلابي (Met): المقدم ${supplied.methionine} / المطلوب ${needs.methionine} g
    - الألياف (NDF): المقدم ${supplied.ndf} / الحد الأدنى ${needs.ndf} g
    - النشاء (Starch): المقدم ${supplied.starch} / الحد الأقصى ${needs.starch} g
    - الكالسيوم (Ca): المقدم ${supplied.ca} / المطلوب ${needs.ca} g
    - الفوسفور (P): المقدم ${supplied.p} / المطلوب ${needs.p} g
    - توازن الكاتيونات والأنيونات (DCAD): المقدم ${supplied.dcad} / المطلوب ${needs.dcad} mEq/kg DM
    
    نسبة العلف المالئ للمركز (على أساس المادة الجافة): ${forageToConcRatio.toFixed(2)}
    
    المطلوب:
    1. تقييم خطر الحماض الكرشي (Acidosis) بناءً على النشاء والألياف ونسبة المركز.
    2. تقييم خطر الكيتوزيس (Ketosis) بناءً على توازن الطاقة، BCS، ومرحلة الحليب (خاصة في بداية الموسم أو فترة التجفيف).
    3. تقييم توازن البروتين والأحماض الأمينية (CP, RDP, RUP, Lys, Met): هل جودة البروتين كافية لإنتاج الحليب المستهدف؟ هل هناك نقص في الأحماض الأمينية المحددة (اللايسين والميثيونين)؟
    4. تقييم خطر حمى الحليب (Milk Fever) ونقص الكالسيوم، مع التركيز على فترة الانتقال (Transition period) ومؤشر DCAD (خاصة إذا كان إيجابياً جداً في فترة التجفيف القريبة).
    5. تحليل تأثير الإجهاد الحراري (إن وجد) على الشهية والاحتياجات الغذائية، ودور DCAD الإيجابي في تخفيف آثار الإجهاد الحراري للأبقار الحلوب.
    6. تقديم نصائح فنية وعلاجية وقائية دقيقة، مع مراعاة ما يلي:
        - في حال الحاجة لخفض DCAD (فترة التجفيف)، انصح بخلط الأملاح الأنيونية مع العلف المركز لإخفاء طعمها المر وضمان استهلاكها.
        - في حال التغذية المنفصلة (غير TMR)، أكد على ضرورة تقديم العلف المالئ أولاً (لتكوين سجادة الألياف) ثم العلف المركز بمدة لا تقل عن 30 دقيقة لتجنب الحماض.
        - عند وجود خطورة حماض كرش (Acidosis)، شدد على أهمية أطوال جسيمات العلف المالئ (Physically Effective NDF) لتحفيز الاجترار وإفراز اللعاب (الذي يعمل كمنظم طبيعي للحموضة).
        - إضافة الأحماض الأمينية المحمية، الخميرة لتحسين الهضم، أو بيكربونات الصوديوم لرفع DCAD في الصيف.
    7. تقديم إنذار مبكر للمربي حول أي خلل في التوازن الغذائي قد يؤدي لخسائر اقتصادية أو مشاكل تناسلية.
    
    أجب باللغة العربية بأسلوب علمي رصين ومختصر. استخدم نقاط واضحة ومباشرة.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text || "لم يتمكن النظام من توليد تحليل حالياً.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "عذراً، حدث خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي.";
  }
};