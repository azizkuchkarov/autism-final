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
      return NextResponse.json(normalize(parsed), { status: 200 });
    } catch {
      return NextResponse.json(fallbackAi("AI javobi JSON formatda kelmadi. Qayta bosing."), { status: 200 });
    }
  } catch {
    return NextResponse.json(fallbackAi("Server xatoligi. Qayta urinib ko‘ring."), { status: 200 });
  }
}
