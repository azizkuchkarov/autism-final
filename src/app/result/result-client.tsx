"use client";

import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DonutRisk, RadarBlocks } from "@/components/Charts";
import { computeSummary } from "@/lib/scoring";
import DarkModeToggle from "@/components/DarkModeToggle";

type AiOut = {
  summary: string;
  strengths: string[];
  challenges: string[];
  why_possible: string[];
  why_not_sure: string[];
  specialists: string[];
  urgency: string;
  next_steps: string[];
  disclaimer: string;
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
    next_steps: toStringArray(data?.next_steps),
    disclaimer:
      typeof data?.disclaimer === "string"
        ? data.disclaimer
        : "Eslatma: Ushbu skrining tashxis emas. Tashxis faqat mutaxassis tomonidan yuzma-yuz baholash orqali qo‘yiladi.",
  };
}

function profileLabel(p: "A" | "B" | "C") {
  if (p === "A") return "Normaga yaqin";
  if (p === "B") return "Rivojlanish farqlari";
  return "ASDga yaqin bo‘lishi mumkin";
}

function profileChipStyle(p: "A" | "B" | "C") {
  if (p === "A") return "bg-emerald-100 text-emerald-800 ring-emerald-200";
  if (p === "B") return "bg-amber-100 text-amber-800 ring-amber-200";
  return "bg-rose-100 text-rose-800 ring-rose-200";
}

export default function ResultClient() {
  const [loadingAi, setLoadingAi] = React.useState(false);
  const [ai, setAi] = React.useState<AiOut | null>(null);
  const [summary, setSummary] = React.useState<ReturnType<typeof computeSummary> | null>(null);

  React.useEffect(() => {
    const rawA = sessionStorage.getItem("asds_answers");
    const rawAge = sessionStorage.getItem("asds_age");
    if (!rawA || !rawAge) return;

    const answers = JSON.parse(rawA);
    const age = Number(rawAge);
    setSummary(computeSummary(age, answers));
  }, []);

  async function generatePdf() {
    const el = document.getElementById("report");
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#ffffff" });
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
      const res = await fetch("/api/ai-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(summary),
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

  const chip = profileChipStyle(summary.profile);
  const radar = [
    { label: "Ijtimoiy", value: summary.blocks.social.score },
    { label: "Nutq", value: summary.blocks.speech.score },
    { label: "Takroriy", value: summary.blocks.repetitive.score },
    { label: "Sensor", value: summary.blocks.sensory.score },
    { label: "Emots.", value: summary.blocks.emotional.score },
  ];

  return (
    <div className="min-h-dvh bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 pb-16">
      {/* Dark Mode Toggle */}
      <div className="fixed top-4 right-4 z-50 animate-fadeIn">
        <DarkModeToggle />
      </div>
      <div className="mx-auto max-w-md px-4 pt-6">
        <div className="rounded-2xl glass dark:bg-slate-800/50 p-6 shadow-lg ring-1 ring-slate-200/50 dark:ring-slate-700/50 hover-lift animate-fadeIn" id="report">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">Skrining natijasi</h1>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                Yoshi: <span className="font-semibold text-indigo-700 dark:text-indigo-400">{summary.childAgeYears}</span> (band: {summary.ageBand})
              </p>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Eslatma: bu skrining — tashxis emas. Natija yo'naltirish uchun.
              </p>
            </div>
            <div className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold ring-1 shadow-sm ${chip}`}>
              {profileLabel(summary.profile)}
            </div>
          </div>

          <div className="mt-4 grid gap-4">
            <div className="rounded-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 p-5 ring-1 ring-slate-200/50 dark:ring-slate-700/50 shadow-sm hover-lift">
              <DonutRisk value={summary.levelScore} />
              <div className="mt-3 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                <span className="font-medium">Profil darajasi</span>
                <span className="font-bold text-indigo-700 dark:text-indigo-400">{summary.levelScore}%</span>
              </div>
              <div className="mt-3 rounded-xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-slate-800 p-4 text-xs text-slate-700 dark:text-slate-300 ring-1 ring-indigo-100 dark:ring-indigo-800/50 shadow-sm">
                <div className="font-bold text-indigo-900 dark:text-indigo-300">Tavsiya:</div>
                <div className="mt-1.5 font-medium">{summary.urgency}</div>
                <div className="mt-3 font-bold text-indigo-900 dark:text-indigo-300">Mutaxassislar:</div>
                <ul className="mt-1.5 space-y-1 pl-0">
                  {summary.suggestedSpecialists.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 p-5 ring-1 ring-slate-200/50 dark:ring-slate-700/50 shadow-sm hover-lift">
              <div className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Rivojlanish profili</div>
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">Yuqori qiymat — shu sohada yordam ehtiyoji ko'proq bo'lishi mumkin.</p>
              <RadarBlocks points={radar} />
            </div>

            <div className="rounded-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 p-5 ring-1 ring-slate-200/50 dark:ring-slate-700/50 shadow-sm hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-bold text-slate-900 dark:text-slate-100">AI xulosa</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Profilga mos, qat'iy qoidalar asosida</div>
                </div>
                <button
                  onClick={fetchAi}
                  disabled={loadingAi}
                  className="rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 dark:from-rose-600 dark:to-rose-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-500/25 dark:shadow-rose-500/40 transition-all hover:from-rose-600 hover:to-rose-700 dark:hover:from-rose-700 dark:hover:to-rose-800 hover:shadow-lg disabled:opacity-50"
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
                  <Section title="Mutaxassislar" items={ai.specialists} />
                  <Section title="Keyingi qadamlar" items={ai.next_steps} />
                  <p className="rounded-xl bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-slate-800 p-3.5 text-xs text-slate-700 dark:text-slate-300 ring-1 ring-amber-200/50 dark:ring-amber-800/50 shadow-sm">
                    {ai.disclaimer}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={generatePdf}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-md shadow-indigo-500/25 dark:shadow-indigo-500/40 transition-all hover:from-indigo-700 hover:to-indigo-600 dark:hover:from-indigo-600 dark:hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
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
    <div className="rounded-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 p-4 ring-1 ring-slate-200/50 dark:ring-slate-700/50 shadow-sm hover-lift">
      <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300">{title}</div>
      <ul className="mt-2.5 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
        {safeItems.map((t, i) => (
          <li key={i} className="flex items-start gap-2 leading-relaxed">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400 dark:bg-indigo-500" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
