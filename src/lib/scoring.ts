// src/lib/scoring.ts
import { BlockId, Direction, QUESTIONS, ageToBand } from "./questions";

export type AnswerValue = 0 | 1 | 2;
export type AnswersMap = Record<string, AnswerValue>;

export type BlockScore = {
  raw: number; // 0..20
  normalized: number; // 0..1
  weighted: number; // 0..weight
  status: "Normal" | "O‘rtacha" | "Yuqori";
  topFlags: string[];
};

export type Summary = {
  childAgeYears: number;
  ageBand: "2-3" | "4-5" | "6-7";
  answeredCount: number;
  totalCount: number;

  blocks: Record<BlockId, BlockScore>;
  ars: number; // 0..7.6
  arsMax: number;
  arsPercent: number; // 0..100
  riskLabel: "Autizm ehtimoli past" | "Kuzatish tavsiya etiladi" | "Yuqori xavf" | "Juda yuqori xavf – mutaxassisga murojaat qiling";
  urgency: "Oddiy tavsiya" | "Mutaxassis bilan maslahat" | "Yaqin kunlarda baholash tavsiya etiladi";
  highlights: string[];
};

const BLOCK_WEIGHTS: Record<BlockId, number> = {
  social: 2.0,
  speech: 1.7,
  repetitive: 1.4,
  sensory: 1.2,
  play: 1.3,
};
const ARS_MAX = 7.6;

function toRiskValue(direction: Direction, v: AnswerValue): AnswerValue {
  // negative: Ko‘pincha = ko‘proq risk
  // positive: Ko‘pincha = kam risk (teskari)
  return direction === "negative" ? v : ((2 - v) as AnswerValue);
}

function blockStatus(normalized: number): BlockScore["status"] {
  if (normalized < 0.3) return "Normal";
  if (normalized < 0.6) return "O‘rtacha";
  return "Yuqori";
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

// Core social red flags: positive savollarda Yo‘q/Ba’zan = risk (>=1)
// bu yerda faqat isCoreFlag bo‘lgan social savollar hisoblanadi
function computeRiskLabel(ars: number): Summary["riskLabel"] {
  if (ars < 2.0) return "Autizm ehtimoli past";
  if (ars < 3.5) return "Kuzatish tavsiya etiladi";
  if (ars < 5.0) return "Yuqori xavf";
  return "Juda yuqori xavf – mutaxassisga murojaat qiling";
}

function computeUrgency(riskLabel: Summary["riskLabel"]): Summary["urgency"] {
  if (riskLabel === "Autizm ehtimoli past") return "Oddiy tavsiya";
  if (riskLabel === "Kuzatish tavsiya etiladi") return "Mutaxassis bilan maslahat";
  return "Yaqin kunlarda baholash tavsiya etiladi";
}

export function computeSummary(childAgeYears: number, answers: AnswersMap): Summary {
  const ageBand = ageToBand(childAgeYears);
  const totalCount = QUESTIONS.length;

  let answeredCount = 0;
  for (const q of QUESTIONS) if (answers[q.id] !== undefined) answeredCount += 1;

  const blocks: Summary["blocks"] = {
    social: { raw: 0, normalized: 0, weighted: 0, status: "Normal", topFlags: [] },
    speech: { raw: 0, normalized: 0, weighted: 0, status: "Normal", topFlags: [] },
    repetitive: { raw: 0, normalized: 0, weighted: 0, status: "Normal", topFlags: [] },
    sensory: { raw: 0, normalized: 0, weighted: 0, status: "Normal", topFlags: [] },
    play: { raw: 0, normalized: 0, weighted: 0, status: "Normal", topFlags: [] },
  };

  for (const b of Object.keys(blocks) as BlockId[]) {
    const qs = QUESTIONS.filter((q) => q.block === b && q.bands.includes(ageBand));
    let sumRisk = 0;

    const flags: { text: string; value: number; isCore: boolean }[] = [];

    for (const q of qs) {
      const raw = answers[q.id] ?? 0;
      const riskV = toRiskValue(q.direction, raw);
      sumRisk += riskV;

      const isCore = q.isCoreFlag === true && q.bands.includes(ageBand);
      if (riskV >= 1) flags.push({ text: q.text, value: riskV, isCore });
    }

    flags.sort(
      (a, b) => (b.isCore ? 10 : 0) + b.value - ((a.isCore ? 10 : 0) + a.value)
    );

    const rawScore = clamp(sumRisk, 0, 20);
    const normalized = rawScore / 20;
    const weighted = normalized * BLOCK_WEIGHTS[b];
    blocks[b] = {
      raw: rawScore,
      normalized,
      weighted,
      status: blockStatus(normalized),
      topFlags: flags.slice(0, 3).map((f) => f.text),
    };
  }

  const ars =
    blocks.social.weighted +
    blocks.speech.weighted +
    blocks.repetitive.weighted +
    blocks.sensory.weighted +
    blocks.play.weighted;
  const arsPercent = Math.round((ars / ARS_MAX) * 100);
  const riskLabel = computeRiskLabel(ars);
  const urgency = computeUrgency(riskLabel);

  const highlights: string[] = [];
  if (blocks.social.normalized >= 0.6) {
    highlights.push("Ijtimoiy muloqot sohasida qiyinchiliklar");
  }
  if (blocks.social.normalized >= 0.6 && blocks.play.normalized >= 0.6) {
    highlights.push("Ijtimoiy va tasavvurli o‘yin sohasida qiyinchiliklar");
  }
  if (blocks.speech.normalized >= 0.6 && blocks.social.normalized >= 0.6) {
    highlights.push("Nutq va ijtimoiy muloqot birga ta’sirlangan");
  }

  return {
    childAgeYears,
    ageBand,
    answeredCount,
    totalCount,
    blocks,
    ars,
    arsMax: ARS_MAX,
    arsPercent,
    riskLabel,
    urgency,
    highlights,
  };
}
