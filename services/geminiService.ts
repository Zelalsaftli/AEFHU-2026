import { GoogleGenAI } from "@google/genai";
import { Nutrients, CowParameters } from "../types";

export const predictMetabolicHealth = async (
  cowParams: CowParameters,
  needs: Nutrients,
  supplied: Nutrients,
  forageToConcRatio: number,
  modelName: string = "gemini-3-flash-preview",
  userApiKey?: string
): Promise<string> => {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY || process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey.trim() === "") {
    console.error("خطأ: مفتاح API غير موجود.");
    return "عذراً، مفتاح الـ API غير موجود. يرجى إدخال مفتاحك الخاص أو التأكد من إعدادات النظام.";
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = modelName;

  const energyBalance = supplied.me - needs.me;
  const cpBalance = supplied.cp - needs.cp;
  const rumenFillPercent = (supplied.uNDF240 / needs.uNDF240) * 100;

  const prompt = `
    أنت طبيب بيطري أو مهندس زراعي مختص في تغذية الحيوان، وخبير في صياغة علائق الأبقار الحلوب وفق معايير NRC 2021 و NASEM 2021 و Feed 2026. قم بتحليل هذه العليقة وتوقع الأمراض الاستقلابية المحتملة وقدم نصائح فنية دقيقة بناءً على هذه المراجع العلمية الموثوقة.
    
    بيانات البقرة التفصيلية:
    - الوزن: ${cowParams.weight} كغ، السلالة: ${cowParams.breed}
    - الإنتاج: ${cowParams.milkProduction} كغ (دهن ${cowParams.fatPercentage}%، بروتين ${cowParams.proteinPercentage}%)
    - أيام الحليب (DIM): ${cowParams.daysInMilk} يوم، مرحلة الحليب: ${cowParams.lactationStage}
    - حالة الجسم (BCS): ${cowParams.currentBcs} / 5
    - رقم الموسم: ${cowParams.lactationNumber}
    - البيئة: ${cowParams.environment}، الرعي: ${cowParams.grazing}
    - العوامل المتقدمة: درجة الحرارة ${cowParams.ambientTemperature || 'غير محدد'} م، الرطوبة ${cowParams.relativeHumidity || 'غير محدد'}%، مسافة المشي ${cowParams.walkingDistance || 0} كم.
    
    التحليل الغذائي (Feed 2026 & NASEM 2021):
    - الطاقة الاستقلابية (ME): المقدم ${supplied.me} / المطلوب ${needs.me} Mcal (التوازن: ${energyBalance.toFixed(2)} Mcal)
    - البروتين الخام (CP): المقدم ${supplied.cp} / المطلوب ${needs.cp} g (التوازن: ${cpBalance.toFixed(0)} g)
    - البروتين القابل للتفكك (RDP): المقدم ${supplied.rdp} / المطلوب ${needs.rdp} g
    - البروتين العابر (RUP): المقدم ${supplied.rup} / المطلوب ${needs.rup} g
    - اللايسين الاستقلابي (Lys): المقدم ${supplied.lysine} / المطلوب ${needs.lysine} g
    - الميثيونين الاستقلابي (Met): المقدم ${supplied.methionine} / المطلوب ${needs.methionine} g
    - الألياف (NDF): المقدم ${supplied.ndf} / الحد الأدنى ${needs.ndf} g
    - الألياف الفعالة (peNDF): المقدم ${supplied.peNDF} / الحد الأدنى ${needs.peNDF} g
    - الألياف غير المهضومة (uNDF240): المقدم ${supplied.uNDF240} / الحد الأقصى (سعة الكرش) ${needs.uNDF240} g (نسبة الامتلاء: ${rumenFillPercent.toFixed(1)}%)
    - النشاء (Starch): المقدم ${supplied.starch} / الحد الأقصى ${needs.starch} g
    - الكالسيوم (Ca): المقدم ${supplied.ca} / المطلوب ${needs.ca} g
    - الفوسفور (P): المقدم ${supplied.p} / المطلوب ${needs.p} g
    - توازن الكاتيونات والأنيونات (DCAD): المقدم ${supplied.dcad} / المطلوب ${needs.dcad} mEq/kg DM
    
    المطلوب:
    1. تقييم خطر الحماض الكرشي (Acidosis) بناءً على النشاء، الألياف (NDF)، والألياف الفعالة فيزيائياً (peNDF).
    2. تقييم سعة الكرش والامتلاء الفيزيائي (uNDF240): إذا كانت نسبة الامتلاء قريبة من 100% أو تتجاوزها، حذر المربي من أن البقرة لن تستطيع إكمال الوجبة.
    3. تقييم خطر الكيتوزيس (Ketosis) بناءً على توازن الطاقة، BCS، ومرحلة الحليب.
    4. تقييم توازن البروتين والأحماض الأمينية وجودتها.
    5. تقييم خطر حمى الحليب (Milk Fever) ومؤشر DCAD.
    6. تحليل تأثير الإجهاد الحراري (THI) والنشاط البدني (المشي) على الاحتياجات.
    7. تقديم نصائح فنية وعلاجية وقائية دقيقة، مع مراعاة ما يلي:
        - في حال الحاجة لخفض DCAD (فترة التجفيف)، انصح بخلط الأملاح الأنيونية مع العلف المركز لإخفاء طعمها المر وضمان استهلاكها.
        - في حال التغذية المنفصلة (غير TMR)، أكد على ضرورة تقديم العلف المالئ أولاً (لتكوين سجادة الألياف) ثم العلف المركز بمدة لا تقل عن 30 دقيقة لتجنب الحماض.
        - عند وجود خطورة حماض كرش (Acidosis) أو نقص peNDF، شدد على أهمية أطوال جسيمات العلف المالئ (Physically Effective NDF) لتحفيز الاجترار وإفراز اللعاب (الذي يعمل كمنظم طبيعي للحموضة).
        - إضافة الأحماض الأمينية المحمية، الخميرة لتحسين الهضم، أو بيكربونات الصوديوم لرفع DCAD في الصيف.
    8. تقديم إنذار مبكر للمربي حول أي خلل في التوازن الغذائي قد يؤدي لخسائر اقتصادية أو مشاكل تناسلية.
    
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
