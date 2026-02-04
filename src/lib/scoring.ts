// src/lib/scoring.ts
import { BlockId, Direction, QUESTIONS, ageToBand } from "./questions";

export type AnswerValue = 0 | 1 | 2;
export type AnswersMap = Record<string, AnswerValue>;

export type BlockScore = {
  score: number; // 0..20 (risk)
  status: "Normal" | "O‘rtacha" | "Yuqori";
  topFlags: string[];
};

export type Profile = "A" | "B" | "C";
// A: normaga yaqin
// B: rivojlanish farqlari (ASD emasligi mumkin) – aniq yo‘naltirish
// C: ASDga yaqin bo‘lishi mumkin – nevrolog/developmental pediatrician + ABA

export type Summary = {
  childAgeYears: number;
  ageBand: "2-3" | "4-5" | "6-7";
  answeredCount: number;
  totalCount: number;

  blocks: Record<BlockId, BlockScore>;

  // “daraja” – ASD ehtimoli foizi emas!
  levelScore: number; // 0..100 (profil intensivligi)
  profile: Profile;

  // ijtimoiy “core red flags” soni – gate uchun
  socialCoreRedFlags: number;

  // UI/AI uchun tayyor yo‘naltirish
  suggestedSpecialists: string[];
  urgency: "Oddiy tavsiya" | "Mutaxassis bilan maslahat" | "Yaqin kunlarda baholash tavsiya etiladi";
};

const BLOCK_WEIGHTS: Record<BlockId, number> = {
  social: 0.32,
  speech: 0.24,
  repetitive: 0.20,
  sensory: 0.14,
  emotional: 0.10,
};

function toRiskValue(direction: Direction, v: AnswerValue): AnswerValue {
  // negative: Ko‘pincha = ko‘proq risk
  // positive: Ko‘pincha = kam risk (teskari)
  return direction === "negative" ? v : ((2 - v) as AnswerValue);
}

function blockStatus(score0to20: number): BlockScore["status"] {
  if (score0to20 <= 6) return "Normal";
  if (score0to20 <= 12) return "O‘rtacha";
  return "Yuqori";
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

// Core social red flags: positive savollarda Yo‘q/Ba’zan = risk (>=1)
// bu yerda faqat isCoreFlag bo‘lgan social savollar hisoblanadi
function countSocialCoreRedFlags(ageBand: Summary["ageBand"], answers: AnswersMap): number {
  const socialCore = QUESTIONS.filter((q) => q.block === "social" && q.isCoreFlag && q.bands.includes(ageBand));
  let c = 0;
  for (const q of socialCore) {
    const raw = answers[q.id] ?? 0;
    const riskV = toRiskValue(q.direction, raw);
    if (riskV >= 1) c += 1;
  }
  return c;
}

function computeLevelScore(blocks: Summary["blocks"]): number {
  const weighted0to20 =
    blocks.social.score * BLOCK_WEIGHTS.social +
    blocks.speech.score * BLOCK_WEIGHTS.speech +
    blocks.repetitive.score * BLOCK_WEIGHTS.repetitive +
    blocks.sensory.score * BLOCK_WEIGHTS.sensory +
    blocks.emotional.score * BLOCK_WEIGHTS.emotional;

  return Math.round((weighted0to20 / 20) * 100);
}

function pickSpecialists(profile: Profile, blocks: Summary["blocks"]): string[] {
  if (profile === "C") {
    return [
      "Bolalar nevrologi",
      "Rivojlanish pediatri (Developmental pediatrician)",
      "ABA mutaxassisi",
      "Logoped (Speech therapist)",
      "Bolalar psixologi",
    ];
  }

  // B – yo‘nalish bloklarga qarab
  const out: string[] = [];
  if (blocks.speech.status !== "Normal") out.push("Logoped (Speech therapist)");
  if (blocks.sensory.status === "Yuqori") out.push("Sensor integratsiya bo‘yicha mutaxassis (Occupational therapist)");
  if (blocks.emotional.status !== "Normal") out.push("Bolalar psixologi");
  // agar repetitiv yuqori bo‘lsa, rivojlanish pediatri foydali bo‘lishi mumkin
  if (blocks.repetitive.status === "Yuqori") out.push("Rivojlanish pediatri (Developmental pediatrician)");
  if (out.length === 0) out.push("Pediatr (umumiy maslahat)");

  // unique
  return Array.from(new Set(out));
}

function computeProfile(ageYears: number, socialCoreRedFlags: number, blocks: Summary["blocks"], levelScore: number): Profile {
  // Gate logic:
  // - “C” faqat social core >=2 bo‘lsa (yadro belgilar),
  //   va kamida 2 boshqa blok “Yuqori/O‘rtacha” bo‘lsa.
  const otherHighish =
    (blocks.speech.status !== "Normal" ? 1 : 0) +
    (blocks.repetitive.status !== "Normal" ? 1 : 0) +
    (blocks.sensory.status !== "Normal" ? 1 : 0) +
    (blocks.emotional.status !== "Normal" ? 1 : 0);

  const hasStrongRepetitiveOrSpeech = blocks.repetitive.status === "Yuqori" || blocks.speech.status === "Yuqori";

  if (ageYears >= 3 && socialCoreRedFlags >= 2 && otherHighish >= 2 && hasStrongRepetitiveOrSpeech) return "C";

  // “A” – hammasi normalga yaqin
  const allNormal =
    blocks.social.status === "Normal" &&
    blocks.speech.status === "Normal" &&
    blocks.repetitive.status === "Normal" &&
    blocks.sensory.status === "Normal" &&
    blocks.emotional.status === "Normal";

  if (allNormal && levelScore < 25) return "A";

  // qolgan hammasi “B”
  return "B";
}

function computeUrgency(profile: Profile, blocks: Summary["blocks"]): Summary["urgency"] {
  if (profile === "C") return "Yaqin kunlarda baholash tavsiya etiladi";
  if (profile === "B") {
    // agar nutq yoki emotsional yuqori bo‘lsa, maslahatni kuchaytiramiz
    if (blocks.speech.status === "Yuqori" || blocks.emotional.status === "Yuqori") return "Mutaxassis bilan maslahat";
    return "Mutaxassis bilan maslahat";
  }
  return "Oddiy tavsiya";
}

export function computeSummary(childAgeYears: number, answers: AnswersMap): Summary {
  const ageBand = ageToBand(childAgeYears);
  const totalCount = QUESTIONS.length;

  let answeredCount = 0;
  for (const q of QUESTIONS) if (answers[q.id] !== undefined) answeredCount += 1;

  const blocks: Summary["blocks"] = {
    social: { score: 0, status: "Normal", topFlags: [] },
    speech: { score: 0, status: "Normal", topFlags: [] },
    repetitive: { score: 0, status: "Normal", topFlags: [] },
    sensory: { score: 0, status: "Normal", topFlags: [] },
    emotional: { score: 0, status: "Normal", topFlags: [] },
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

    blocks[b] = {
      score: clamp(sumRisk, 0, 20),
      status: blockStatus(sumRisk),
      topFlags: flags.slice(0, 3).map((f) => f.text),
    };
  }

  const socialCoreRedFlags = countSocialCoreRedFlags(ageBand, answers);
  const levelScore = computeLevelScore(blocks);
  const profile = computeProfile(childAgeYears, socialCoreRedFlags, blocks, levelScore);
  const suggestedSpecialists = pickSpecialists(profile, blocks);
  const urgency = computeUrgency(profile, blocks);

  return {
    childAgeYears,
    ageBand,
    answeredCount,
    totalCount,
    blocks,
    levelScore,
    profile,
    socialCoreRedFlags,
    suggestedSpecialists,
    urgency,
  };
}
