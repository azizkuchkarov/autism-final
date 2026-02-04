// src/app/api/ai-explain/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type AiNormalized = {
  summary: string;
  strengths: string[];
  challenges: string[];
  why_possible: string[];
  why_not_sure: string[];
  next_steps: string[];
  specialists: string[];
  urgency: string;
  disclaimer: string;
};

function toArr(x: any): string[] {
  if (Array.isArray(x)) return x.map(String).filter(Boolean);
  if (typeof x === "string") {
    return x.split(/\n|•|- /g).map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function fallbackAi(message?: string): AiNormalized {
  return {
    summary: message ?? "AI xulosasi hozircha tayyor bo‘lmadi. Keyinroq qayta urinib ko‘ring.",
    strengths: [],
    challenges: [],
    why_possible: [],
    why_not_sure: [],
    next_steps: [
      "48 soat: boladagi 2–3 asosiy holatni (ko‘z kontakt, ismga javob, rutina) kuzating va qayd qiling.",
      "1–2 hafta: pediatr yoki mos mutaxassisga uchrashuv belgilang.",
      "1–3 oy: tavsiya qilingan reja asosida uy mashqlari va terapiya yo‘nalishlarini yo‘lga qo‘ying.",
    ],
    specialists: [],
    urgency: "Mutaxassis bilan maslahat",
    disclaimer: "Eslatma: Ushbu skrining tashxis emas. Tashxis faqat mutaxassis tomonidan yuzma-yuz baholash orqali qo‘yiladi.",
  };
}

function normalize(parsed: any): AiNormalized {
  const out: AiNormalized = {
    summary: typeof parsed?.summary === "string" ? parsed.summary : "AI xulosasi tayyor.",
    strengths: toArr(parsed?.strengths),
    challenges: toArr(parsed?.challenges),
    why_possible: toArr(parsed?.why_possible),
    why_not_sure: toArr(parsed?.why_not_sure),
    next_steps: toArr(parsed?.next_steps).slice(0, 3),
    specialists: toArr(parsed?.specialists),
    urgency: typeof parsed?.urgency === "string" ? parsed.urgency : "Mutaxassis bilan maslahat",
    disclaimer:
      typeof parsed?.disclaimer === "string"
        ? parsed.disclaimer
        : "Eslatma: Ushbu skrining tashxis emas. Tashxis faqat mutaxassis tomonidan yuzma-yuz baholash orqali qo‘yiladi.",
  };

  if (out.next_steps.length === 0) out.next_steps = fallbackAi().next_steps;
  return out;
}

function flattenRiskItems(aiSignals: any): string[] {
  const risk = aiSignals?.riskItemsByBlock;
  if (!risk || typeof risk !== "object") return [];
  const all: string[] = [];
  for (const key of Object.keys(risk)) {
    const items = risk[key];
    if (Array.isArray(items)) {
      for (const item of items) {
        if (typeof item === "string" && item.trim()) all.push(item.trim());
      }
    }
  }
  return all;
}

function applySignalsFilters(out: AiNormalized, summary: any): AiNormalized {
  const aiSignals = summary?.aiSignals;
  if (!aiSignals || typeof aiSignals !== "object") return out;

  const strengths = Array.isArray(aiSignals.strengthItems)
    ? aiSignals.strengthItems.map(String).filter(Boolean)
    : [];
  const riskItems = flattenRiskItems(aiSignals);

  return {
    ...out,
    strengths,
    challenges: riskItems.slice(0, 5),
    why_possible: riskItems.slice(0, 3),
    why_not_sure: strengths.slice(0, 3),
  };
}

function blockLabel(id: string, lang: "uz" | "ru") {
  const labels = {
    uz: {
      social: "Ijtimoiy",
      speech: "Nutq",
      repetitive: "Takroriy",
      sensory: "Sensor",
      emotional: "Emotsional",
    },
    ru: {
      social: "Социальные",
      speech: "Речь",
      repetitive: "Повторяющиеся",
      sensory: "Сенсорные",
      emotional: "Эмоциональные",
    },
  };
  return (labels as any)[lang]?.[id] ?? id;
}

function statusLabel(status: string, lang: "uz" | "ru") {
  const isMedium = status === "O‘rtacha";
  if (lang === "ru") {
    if (status === "Normal") return "Норма";
    if (isMedium) return "Средний риск";
    return "Высокий риск";
  }
  if (isMedium) return "O'rtacha";
  return status;
}

function buildStrictSummary(summary: any): string | null {
  if (!summary || typeof summary !== "object") return null;
  const lang: "uz" | "ru" = summary.lang === "ru" ? "ru" : "uz";
  const profile: "A" | "B" | "C" | undefined = summary.profile;
  const age = summary.childAgeYears;
  const blocks = summary.blocks ?? {};

  const blockLines: string[] = [];
  for (const key of ["social", "speech", "repetitive", "sensory", "emotional"]) {
    const b = blocks?.[key];
    if (!b || !b.status) continue;
    if (b.status !== "Normal") {
      blockLines.push(`${blockLabel(key, lang)}: ${statusLabel(b.status, lang)}`);
    }
  }

  const areasText = blockLines.length > 0 ? blockLines.join(", ") : null;

  if (profile === "A") {
    return lang === "ru"
      ? `Результаты скрининга указывают на показатели, близкие к возрастной норме${age ? ` (возраст: ${age})` : ""}. Явных зон риска не выявлено. Наблюдение в динамике остаётся полезным.`
      : `Skrining natijalari yosh me'yoriga yaqin ko'rsatkichlarni ko'rsatadi${age ? ` (yoshi: ${age})` : ""}. Yaqqol xavotirli yo'nalishlar aniqlanmadi. Dinamik kuzatuv foydali.`;
  }

  if (profile === "B") {
    return lang === "ru"
      ? `Скрининг показывает отдельные зоны, требующие внимания${areasText ? `: ${areasText}` : ""}. Это не диагноз, но имеет смысл обсудить результаты со специалистом.`
      : `Skriningda ayrim yo'nalishlarda e'tibor talab qilinadi${areasText ? `: ${areasText}` : ""}. Bu tashxis emas, natijalarni mutaxassis bilan muhokama qilish foydali.`;
  }

  if (profile === "C") {
    return lang === "ru"
      ? `Сочетание ответов показывает признаки, которые могут быть ближе к аутистическому спектру${areasText ? `: ${areasText}` : ""}. Это не диагноз, необходима очная оценка специалиста.`
      : `Javoblar kombinatsiyasi autizm spektriga yaqin bo'lishi mumkin bo'lgan belgilarni ko'rsatadi${areasText ? `: ${areasText}` : ""}. Bu tashxis emas, mutaxassisning yuzma-yuz baholashi zarur.`;
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json(fallbackAi("OPENAI_API_KEY topilmadi (.env.local)."), { status: 200 });

    const summary = await req.json();

    const system = `
Sen 2–7 yoshdagi bolalar uchun skrining natijalarini ota-onaga tushuntiruvchi yordamchisan.
SEN TASHXIS QO‘YMAYSAN. Faqat yo‘naltiruvchi, mas’uliyatli xulosa berasan.

Skrining SUMMARY ichida "profile" maydoni bor:
- "A": normaga yaqin
- "B": rivojlanish farqlari (ASD bo‘lmasligi ham mumkin) – aniq yo‘naltirish
- "C": autizm spektriga yaqin bo‘lishi mumkin – yaqin kunlarda baholash tavsiya etiladi

QAT’IY QOIDALAR:
1) Agar profile="A" bo‘lsa:
   - "autizm", "ASD", "spektr" kabi iboralarni ishlatma.
   - Mutaxassis shart emas, faqat umumiy tavsiyalar yoz.

2) Agar profile="B" bo‘lsa:
   - "ASDga yaqin" demagin.
   - Muammo qaysi bloklarda ekanini yumshoq tushuntir.
   - ANIQ mutaxassis ko‘rsat: nutq bo‘lsa logoped, emotsional bo‘lsa psixolog, sensor bo‘lsa OT.

3) Agar profile="C" bo‘lsa:
   - "ASD BOR" deb aytma.
   - Faqat: "autizm spektriga yaqin bo‘lishi mumkin bo‘lgan belgilar kombinatsiyasi" deb yoz.
   - Mutaxassisni aniq yoz: bolalar nevrologi yoki rivojlanish pediatri, qo‘shimcha ABA, logoped, psixolog.

4) why_possible va why_not_sure mantiqi:
   - why_possible: faqat riskni oshiradigan dalillar (social core red flags + repetitiv + echolalia + rigidlik + meltdown).
   - why_not_sure: faqat riskni kamaytiradigan dalillar (social kuchli, ismga javob bor, ko‘z kontakt bor, joint attention bor).
   - Ularni ARALASHTIRMA.

5) SUMMARY ichidagi ma'lumotlardan foydalan:
   - blocks.*.status va blocks.*.topFlags asosida 2–3 ta aniq dalil yoz.
   - agar "aiSignals" kelsa, uni ishonchli kalit signal sifatida ishlat.
   - summary.levelScore va summary.socialCoreRedFlags ga mos tavsiya ber.
   - aiSignals.riskItemsByBlock va aiSignals.strengthItems bo'lsa, ulardan MISOL keltir.

6) QAT'IY FILTR:
   - strengths va why_not_sure faqat aiSignals.strengthItems ichidan bo'lsin.
   - challenges va why_possible faqat aiSignals.riskItemsByBlock ichidan bo'lsin.
   - agar aiSignals bo'lsa, u yerdan tashqaridagi savollarni yozma.

OUTPUT: faqat quyidagi JSON formatda qaytar:
{
  "summary":"string",
  "strengths":["..."],
  "challenges":["..."],
  "why_possible":["..."],
  "why_not_sure":["..."],
  "specialists":["..."],
  "urgency":"string",
  "next_steps":["48 soat ...","1–2 hafta ...","1–3 oy ..."],
  "disclaimer":"string"
}

Talablar:
- summary 3–5 gap.
- next_steps aynan 3 ta bo‘lsin.
- specialists: 2–5 ta.
- disclaimer doim: "Skrining tashxis emas..."
`.trim();

    const user = `Skrining summary (JSON): ${JSON.stringify(summary)}`;

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.25,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      return NextResponse.json(fallbackAi(`AI xatolik: ${resp.status}. Keyinroq qayta urinib ko‘ring.`), { status: 200 });
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content || typeof content !== "string") {
      return NextResponse.json(fallbackAi("AI javobi bo‘sh keldi."), { status: 200 });
    }

    try {
      const parsed = JSON.parse(content);
      const normalized = normalize(parsed);
      const filtered = applySignalsFilters(normalized, summary);
      const strictSummary = buildStrictSummary(summary);
      return NextResponse.json(
        {
          ...filtered,
          summary: strictSummary ?? filtered.summary,
        },
        { status: 200 }
      );
    } catch {
      return NextResponse.json(fallbackAi("AI javobi JSON formatda kelmadi. Qayta bosing."), { status: 200 });
    }
  } catch {
    return NextResponse.json(fallbackAi("Server xatoligi. Qayta urinib ko‘ring."), { status: 200 });
  }
}
