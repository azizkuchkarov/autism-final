"use client";

import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DonutRisk, RadarBlocks } from "@/components/Charts";
import { computeSummary, type AnswerValue, type AnswersMap, type Summary } from "@/lib/scoring";
import { QUESTIONS, type BlockId, type Direction } from "@/lib/questions";
import DarkModeToggle from "@/components/DarkModeToggle";

type AiOut = {
  summary: string;
  strengths: string[];
  challenges: string[];
  why_possible: string[];
  why_not_sure: string[];
  specialists: string[];
  urgency: string;
  home_tips: string[];
  next_steps: string[];
  disclaimer: string;
};

type ParentConclusion = {
  summaryText: string;
  strengths: string[];
  concerns: string[];
};

function toStringArray(x: unknown): string[] {
  if (Array.isArray(x)) return x.filter(Boolean).map(String);
  if (typeof x === "string") {
    return x.split(/\n|•|- /g).map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function normalizeAi(data: any): AiOut {
  return {
    summary: typeof data?.summary === "string" ? data.summary : "AI javobi noto‘g‘ri formatda keldi.",
    strengths: toStringArray(data?.strengths),
    challenges: toStringArray(data?.challenges),
    why_possible: toStringArray(data?.why_possible),
    why_not_sure: toStringArray(data?.why_not_sure),
    specialists: toStringArray(data?.specialists),
    urgency: typeof data?.urgency === "string" ? data.urgency : "Mutaxassis bilan maslahat",
    home_tips: toStringArray(data?.home_tips).slice(0, 5),
    next_steps: toStringArray(data?.next_steps),
    disclaimer:
      typeof data?.disclaimer === "string"
        ? data.disclaimer
        : "Eslatma: Ushbu skrining tashxis emas. Tashxis faqat mutaxassis tomonidan yuzma-yuz baholash orqali qo‘yiladi.",
  };
}

function blockLabel(id: keyof Summary["blocks"], lang: "uz" | "ru") {
  const labels = {
    uz: {
      social: "Ijtimoiy",
      speech: "Nutq",
      repetitive: "Takroriy",
      sensory: "Sensor",
      play: "O‘yin",
    },
    ru: {
      social: "Социальные",
      speech: "Речь",
      repetitive: "Повторяющиеся",
      sensory: "Сенсорные",
      play: "Игра",
    },
  };
  return labels[lang][id];
}

function statusLabel(status: Summary["blocks"][keyof Summary["blocks"]]["status"], lang: "uz" | "ru") {
  const isMedium = status === "O‘rtacha";
  if (lang === "ru") {
    if (status === "Normal") return "Норма";
    if (isMedium) return "Средний риск";
    return "Высокий риск";
  }
  if (isMedium) return "O'rtacha";
  return status;
}

function answerLabel(value: AnswerValue, lang: "uz" | "ru") {
  const map = {
    uz: {
      2: "Ha / ko'pincha",
      1: "Ba'zan",
      0: "Yo'q / kam",
    },
    ru: {
      2: "Да / часто",
      1: "Иногда",
      0: "Нет / редко",
    },
  };
  return map[lang][value];
}

function cleanQuestionText(text: string) {
  return text.trim().replace(/[.\s]+$/, "");
}

function toRiskValue(direction: Direction, value: AnswerValue): AnswerValue {
  return direction === "negative" ? value : ((2 - value) as AnswerValue);
}

function buildParentConclusion(summary: Summary, answers: AnswersMap | null, lang: "uz" | "ru"): ParentConclusion {
  const strengths: string[] = [];
  const concerns: string[] = [];

  if (!answers) {
    return {
      summaryText:
        lang === "ru"
          ? "Данные ответов не найдены. Пожалуйста, пройдите тест заново."
          : "Javoblar topilmadi. Iltimos, testni qayta to'ldiring.",
      strengths: [],
      concerns: [],
    };
  }

  const testAnswerSuffix = lang === "ru" ? "Ответ теста" : "Testdan javob";

  for (const [blockId, block] of Object.entries(summary.blocks) as [
    keyof Summary["blocks"],
    Summary["blocks"][keyof Summary["blocks"]]
  ][]) {
    const label = blockLabel(blockId, lang);
    const status = statusLabel(block.status, lang);

    const blockQuestions = QUESTIONS.filter(
      (q) => q.block === blockId && q.bands.includes(summary.ageBand)
    );

    const riskItems = blockQuestions
      .map((q) => {
        const v = answers[q.id];
        if (v === undefined) return null;
        const risk = toRiskValue(q.direction, v);
        if (risk < 1) return null;
        return {
          text: cleanQuestionText(q.text),
          answer: `${answerLabel(v, lang)} (${testAnswerSuffix})`,
          risk,
          isCore: Boolean(q.isCoreFlag),
        };
      })
      .filter(Boolean) as { text: string; answer: string; risk: number; isCore: boolean }[];

    riskItems.sort((a, b) => (b.isCore ? 10 : 0) + b.risk - ((a.isCore ? 10 : 0) + a.risk));

    const strengthItems = blockQuestions
      .map((q) => {
        const v = answers[q.id];
        if (v === undefined) return null;
        const isStrength = q.direction === "positive" ? v === 2 : v === 0;
        if (!isStrength) return null;
        return {
          text: cleanQuestionText(q.text),
          answer: `${answerLabel(v, lang)} (${testAnswerSuffix})`,
          isCore: Boolean(q.isCoreFlag),
        };
      })
      .filter(Boolean) as { text: string; answer: string; isCore: boolean }[];

    strengthItems.sort((a, b) => (b.isCore ? 10 : 0) - (a.isCore ? 10 : 0));

    if (block.status === "Normal") {
      const topStrengths = strengthItems.slice(0, 2).map((i) => `${i.text}. ${i.answer}`);
      if (topStrengths.length > 0) strengths.push(...topStrengths);
      else
        strengths.push(
          lang === "ru"
            ? `${label}: выраженных рисков не отмечено.`
            : `${label}: aniq xavotirli belgilar kuzatilmadi.`
        );
    } else {
      const topRisks = riskItems.slice(0, 2).map((i) => `${i.text}. ${i.answer}`);
      const flagsText = topRisks.length
        ? lang === "ru"
          ? ` Наблюдаемые признаки: ${topRisks.join("; ")}.`
          : ` Kuzatilgan belgilar: ${topRisks.join("; ")}.`
        : lang === "ru"
        ? " Наблюдаемые признаки не указаны."
        : " Kuzatilgan belgilar topilmadi.";
      concerns.push(`${label}: ${status}.${flagsText}`);
    }
  }

  if (strengths.length === 0) {
    strengths.push(
      lang === "ru"
        ? "Выраженных сильных сторон по ответам не выделено."
        : "Javoblarga ko'ra aniq kuchli tomonlar ajralmadi."
    );
  }
  if (concerns.length === 0) {
    concerns.push(
      lang === "ru"
        ? "Явных зон риска не выявлено."
        : "Hozircha yaqqol xavotirli yo'nalishlar ko'rinmadi."
    );
  }

  let summaryText = "";
  if (summary.riskLabel === "Autizm ehtimoli past") {
    summaryText =
      lang === "ru"
        ? "Результаты близки к возрастной норме. Риск низкий, но наблюдение полезно."
        : "Natijalar yosh me'yoriga yaqin. Risk past, ammo kuzatuv foydali.";
  } else if (summary.riskLabel === "Kuzatish tavsiya etiladi") {
    summaryText =
      lang === "ru"
        ? "Есть отдельные области, где требуется внимание. Это не диагноз, но наблюдение и поддержка важны."
        : "Ba'zi yo'nalishlarda e'tibor kerak. Bu tashxis emas, kuzatuv va qo‘llab-quvvatlash muhim.";
  } else if (summary.riskLabel === "Yuqori xavf") {
    summaryText =
      lang === "ru"
        ? "Есть выраженные признаки, требующие оценки специалиста. Это не диагноз."
        : "Mutaxassis bahosini talab qiladigan belgilarga ishora bor. Bu tashxis emas.";
  } else {
    summaryText =
      lang === "ru"
        ? "Риск очень высокий — нужна очная оценка специалиста. Это не диагноз."
        : "Risk juda yuqori — mutaxassisning yuzma-yuz baholashi zarur. Bu tashxis emas.";
  }

  return { summaryText, strengths, concerns };
}

function riskChipStyle(label: Summary["riskLabel"]) {
  if (label === "Autizm ehtimoli past") return "bg-emerald-100 text-emerald-800 ring-emerald-200";
  if (label === "Kuzatish tavsiya etiladi") return "bg-amber-100 text-amber-800 ring-amber-200";
  if (label === "Yuqori xavf") return "bg-rose-100 text-rose-800 ring-rose-200";
  return "bg-rose-200 text-rose-900 ring-rose-300";
}

export default function ResultClient() {
  const [loadingAi, setLoadingAi] = React.useState(false);
  const [ai, setAi] = React.useState<AiOut | null>(null);
  const [summary, setSummary] = React.useState<ReturnType<typeof computeSummary> | null>(null);
  const [lang, setLang] = React.useState<"uz" | "ru">("uz");
  const [answers, setAnswers] = React.useState<AnswersMap | null>(null);
  const [reportId, setReportId] = React.useState<string>("");
  const [reportDate, setReportDate] = React.useState<string>("");

  React.useEffect(() => {
    const rawA = sessionStorage.getItem("asds_answers");
    const rawAge = sessionStorage.getItem("asds_age");
    const rawLang = sessionStorage.getItem("asds_lang");
    if (!rawA || !rawAge) return;

    const answers = JSON.parse(rawA) as AnswersMap;
    const age = Number(rawAge);
    if (rawLang === "ru" || rawLang === "uz") setLang(rawLang);
    setAnswers(answers);
    setSummary(computeSummary(age, answers));

    const now = new Date();
    const dateLabel =
      rawLang === "ru"
        ? now.toLocaleString("ru-RU")
        : now.toLocaleString("uz-UZ");
    setReportDate(dateLabel);
    setReportId(`ASDS-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
      now.getDate()
    ).padStart(2, "0")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
  }, []);

  async function generatePdf() {
    const el = document.getElementById("report");
    if (!el) return;
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: "#ffffff",
      onclone: (doc) => {
        const cloned = doc.getElementById("report");
        if (cloned) {
          cloned.classList.add("pdf-safe");
          const all = cloned.querySelectorAll("*");
          all.forEach((node) => {
            const el = node as HTMLElement;
            el.style.color = "#0f172a";
            el.style.backgroundColor = "#ffffff";
            el.style.borderColor = "#e2e8f0";
            el.style.boxShadow = "none";
            el.style.textShadow = "none";
            el.style.backgroundImage = "none";
            if (el instanceof doc.defaultView!.SVGElement) {
              el.style.fill = "#0f172a";
              el.style.stroke = "#0f172a";
            }
          });
        }
      },
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;
    let remaining = imgHeight;

    while (remaining > 0) {
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      remaining -= pageHeight;
      position -= pageHeight;
      if (remaining > 0) pdf.addPage();
    }

    pdf.save("autism-screening-report.pdf");
  }

  async function fetchAi() {
    if (!summary) return;
    setLoadingAi(true);
    try {
      const aiSignals =
        answers && summary
          ? (() => {
              const riskItemsByBlock: Record<BlockId, string[]> = {
                social: [],
                speech: [],
                repetitive: [],
                sensory: [],
                play: [],
              };
              const strengthItems: string[] = [];

              for (const q of QUESTIONS.filter((x) => x.bands.includes(summary.ageBand))) {
                const v = answers[q.id];
                if (v === undefined) continue;
                const itemText = `${cleanQuestionText(q.text)}. ${answerLabel(v, lang)} (${
                  lang === "ru" ? "Ответ теста" : "Testdan javob"
                })`;
                const risk = toRiskValue(q.direction, v);
                if (risk >= 1) riskItemsByBlock[q.block].push(itemText);
                const isStrength = q.direction === "positive" ? v === 2 : v === 0;
                if (isStrength) strengthItems.push(itemText);
              }

              return {
                ars: summary.ars,
                arsPercent: summary.arsPercent,
                riskLabel: summary.riskLabel,
                blockStatuses: {
                  social: summary.blocks.social.status,
                  speech: summary.blocks.speech.status,
                  repetitive: summary.blocks.repetitive.status,
                  sensory: summary.blocks.sensory.status,
                  play: summary.blocks.play.status,
                },
                riskItemsByBlock: {
                  social: riskItemsByBlock.social.slice(0, 3),
                  speech: riskItemsByBlock.speech.slice(0, 3),
                  repetitive: riskItemsByBlock.repetitive.slice(0, 3),
                  sensory: riskItemsByBlock.sensory.slice(0, 3),
                  play: riskItemsByBlock.play?.slice(0, 3) ?? [],
                },
                strengthItems: strengthItems.slice(0, 5),
                qa: QUESTIONS.filter((x) => x.bands.includes(summary.ageBand)).map((q) => {
                  const v = answers[q.id];
                  return {
                    id: q.id,
                    block: q.block,
                    question: cleanQuestionText(q.text),
                    answerValue: v ?? 0,
                    answerLabel: answerLabel((v ?? 0) as AnswerValue, lang),
                  };
                }),
              };
            })()
          : {
              ars: summary.ars,
              arsPercent: summary.arsPercent,
              riskLabel: summary.riskLabel,
              blockStatuses: {
                social: summary.blocks.social.status,
                speech: summary.blocks.speech.status,
                repetitive: summary.blocks.repetitive.status,
                sensory: summary.blocks.sensory.status,
                play: summary.blocks.play.status,
              },
                qa: [],
            };
      const res = await fetch("/api/ai-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...summary, aiSignals, lang }),
      });
      const data = await res.json();
      setAi(normalizeAi(data));
    } finally {
      setLoadingAi(false);
    }
  }

  if (!summary) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 p-6">
        <div className="fixed top-4 right-4 z-50 animate-fadeIn">
          <DarkModeToggle />
        </div>
        <div className="mx-auto max-w-md rounded-2xl glass dark:bg-slate-800/50 p-6 shadow-lg ring-1 ring-slate-200/50 dark:ring-slate-700/50">
          <div className="text-sm text-slate-700 dark:text-slate-300">Natija topilmadi. Testdan o'ting.</div>
        </div>
      </div>
    );
  }

  const chip = riskChipStyle(summary.riskLabel);
  const parentConclusion = buildParentConclusion(summary, answers, lang);
  const radar = [
    { label: "Ijtimoiy", value: summary.blocks.social.raw },
    { label: "Nutq", value: summary.blocks.speech.raw },
    { label: "Takroriy", value: summary.blocks.repetitive.raw },
    { label: "Sensor", value: summary.blocks.sensory.raw },
    { label: "O‘yin", value: summary.blocks.play.raw },
  ];

  return (
    <div className="min-h-dvh bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300 pb-16">
      {/* Dark Mode Toggle */}
      <div className="fixed top-4 right-4 z-50 animate-fadeIn">
        <DarkModeToggle />
      </div>
      <div className="mx-auto max-w-md px-4 pt-6">
        <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl p-6 shadow-xl ring-1 ring-slate-200/60 dark:ring-slate-700/60 hover-lift animate-fadeIn" id="report">
          <div className="pointer-events-none absolute -right-12 top-10 rotate-12 text-5xl font-bold tracking-widest text-indigo-200/40 dark:text-indigo-400/20">
            PREMIUM
          </div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50/80 dark:bg-indigo-900/30 px-3 py-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-100/70 dark:ring-indigo-800/60">
                Premium hisobot
              </div>
              <h1 className="mt-2 text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">Skrining natijasi</h1>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                Yoshi: <span className="font-semibold text-indigo-700 dark:text-indigo-400">{summary.childAgeYears}</span> (band: {summary.ageBand})
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Report ID: <span className="font-semibold text-slate-600 dark:text-slate-300">{reportId}</span>
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {lang === "ru" ? "Сформировано:" : "Yaratilgan:"}{" "}
                <span className="font-semibold text-slate-600 dark:text-slate-300">{reportDate}</span>
              </p>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Eslatma: bu skrining — tashxis emas. Natija yo'naltirish uchun.
              </p>
            </div>
            <div className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold ring-1 shadow-sm ${chip}`}>
              {summary.riskLabel}
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-white to-slate-50/60 dark:from-slate-900/70 dark:to-slate-800/60 p-5 ring-1 ring-slate-200/60 dark:ring-slate-700/60 shadow-md hover-lift">
              <DonutRisk value={summary.arsPercent} />
              <div className="mt-3 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                <span className="font-medium">Umumiy risk (ARS)</span>
                <span className="font-bold text-indigo-700 dark:text-indigo-400">{summary.arsPercent}%</span>
              </div>
              <div className="mt-3 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-white dark:from-indigo-900/20 dark:to-slate-900/40 p-4 text-xs text-slate-700 dark:text-slate-300 ring-1 ring-indigo-100/70 dark:ring-indigo-800/50 shadow-sm">
                <div className="font-bold text-indigo-900 dark:text-indigo-300">Natija:</div>
                <div className="mt-1.5 font-medium">{summary.riskLabel}</div>
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  ARS: {summary.ars.toFixed(2)} / {summary.arsMax}
                </div>
                {summary.highlights.length > 0 && (
                  <>
                    <div className="mt-3 font-bold text-indigo-900 dark:text-indigo-300">Ogohlantirishlar:</div>
                    <ul className="mt-1.5 space-y-1 pl-0">
                      {summary.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-white to-slate-50/60 dark:from-slate-900/70 dark:to-slate-800/60 p-5 ring-1 ring-slate-200/60 dark:ring-slate-700/60 shadow-md hover-lift">
              <div className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Rivojlanish profili</div>
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">Yuqori qiymat — shu sohada yordam ehtiyoji ko'proq bo'lishi mumkin.</p>
              <RadarBlocks points={radar} />
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-white to-slate-50/60 dark:from-slate-900/70 dark:to-slate-800/60 p-5 ring-1 ring-slate-200/60 dark:ring-slate-700/60 shadow-md hover-lift">
              <div className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                {lang === "ru" ? "Вывод по ответам родителей" : "Ota-ona javoblari bo'yicha xulosa"}
              </div>
              <Section
                title={lang === "ru" ? "Общий вывод" : "Umumiy xulosa"}
                items={[parentConclusion.summaryText]}
              />
              <Section
                title={lang === "ru" ? "Сильные стороны" : "Kuchli tomonlar"}
                items={parentConclusion.strengths}
              />
              <Section
                title={lang === "ru" ? "Зоны внимания" : "E'tibor talab qiladigan yo'nalishlar"}
                items={parentConclusion.concerns}
              />
              <p className="mt-3 rounded-2xl bg-gradient-to-br from-amber-50/80 to-white dark:from-amber-900/20 dark:to-slate-900/40 p-3.5 text-xs text-slate-700 dark:text-slate-300 ring-1 ring-amber-200/60 dark:ring-amber-800/50 shadow-sm">
                {lang === "ru"
                  ? "Примечание: это скрининг, не диагноз. Итоговая оценка возможна только при очной консультации."
                  : "Eslatma: bu skrining, tashxis emas. Yakuniy baho faqat yuzma-yuz konsultatsiyada beriladi."}
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-white to-slate-50/60 dark:from-slate-900/70 dark:to-slate-800/60 p-5 ring-1 ring-slate-200/60 dark:ring-slate-700/60 shadow-md hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-bold text-slate-900 dark:text-slate-100">AI xulosa</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Profilga mos, qat'iy qoidalar asosida</div>
                </div>
                <button
                  onClick={fetchAi}
                  disabled={loadingAi}
                  className="rounded-2xl bg-gradient-to-r from-rose-500 via-rose-500 to-rose-600 dark:from-rose-600 dark:via-rose-500 dark:to-rose-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-500/30 dark:shadow-rose-500/40 transition-all hover:from-rose-600 hover:via-rose-600 hover:to-rose-700 dark:hover:from-rose-700 dark:hover:via-rose-600 dark:hover:to-rose-700 hover:shadow-xl disabled:opacity-50"
                >
                  {loadingAi ? "Yuklanmoqda..." : ai ? "Qayta yaratish" : "AI xulosa"}
                </button>
              </div>

              {!ai ? (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">"AI xulosa" tugmasini bosing.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  <Section title="Umumiy xulosa" items={[ai.summary]} />
                  <Section title="Kuchli tomonlar" items={ai.strengths} />
                  <Section title="Qiyinchiliklar" items={ai.challenges} />
                  <Section title="Nega ASDga yaqin bo‘lishi mumkin?" items={ai.why_possible} />
                  <Section title="Nega ASD bo‘lmasligi ham mumkin?" items={ai.why_not_sure} />
                  <Section title="Uyda qisqa tavsiyalar" items={ai.home_tips} />
                  <Section title="Mutaxassislar" items={ai.specialists} />
                  <Section title="Keyingi qadamlar" items={ai.next_steps} />
                  <p className="rounded-2xl bg-gradient-to-br from-amber-50/80 to-white dark:from-amber-900/20 dark:to-slate-900/40 p-3.5 text-xs text-slate-700 dark:text-slate-300 ring-1 ring-amber-200/60 dark:ring-amber-800/50 shadow-sm">
                    {ai.disclaimer}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={generatePdf}
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 dark:from-indigo-500 dark:via-indigo-400 dark:to-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-500/30 dark:shadow-indigo-500/40 transition-all hover:from-indigo-700 hover:via-indigo-600 hover:to-indigo-700 dark:hover:from-indigo-600 dark:hover:via-indigo-500 dark:hover:to-indigo-700 hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              PDF yuklab olish
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  const safeItems = Array.isArray(items) ? items : [];
  return (
    <div className="rounded-2xl bg-gradient-to-br from-white to-slate-50/60 dark:from-slate-900/70 dark:to-slate-800/60 p-4 ring-1 ring-slate-200/60 dark:ring-slate-700/60 shadow-sm hover-lift">
      <div className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">{title}</div>
      <ul className="mt-2.5 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
        {safeItems.map((t, i) => (
          <li key={i} className="flex items-start gap-2 leading-relaxed">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500/80 dark:bg-indigo-400" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
