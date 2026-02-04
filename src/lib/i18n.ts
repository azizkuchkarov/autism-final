// src/lib/i18n.ts
import type { BlockId } from "./questions";

export type Lang = "uz" | "ru";

export const I18N = {
  uz: {
    app: {
      loading: "Iltimos, bir lahza...",
      sectionStart: "Boshlanmoqda...",
      continue: "Davom etish",
    },
    blocks: {
      social: {
        title: "Ijtimoiy muloqot",
        desc:
          "Bu bo‘limda bola odamlar bilan muloqoti tekshiriladi: ko‘z kontakt, ismiga javob, birgalikdagi e’tibor va ijtimoiy yaqinlik.",
        focus: ["Ismiga javob", "Ko‘z kontakt", "Joint attention", "Birga o‘ynash", "Hissiy bo‘lishish"],
      },
      speech: {
        title: "Nutq va muloqot",
        desc:
          "Bu bo‘limda nutq va tushunish tekshiriladi: yoshga mos nutq, savol-javob, prosodiya va muloqot tashabbusi.",
        focus: ["Yoshga mos nutq", "Savol-javob", "Prosodiya", "Tashabbus", "Imo-ishora"],
      },
      repetitive: {
        title: "Takroriy xatti-harakatlar",
        desc:
          "Bu bo‘limda takroriy harakatlar va rutinalar tekshiriladi: stereotipiya, rigidlik, bir xil qiziqishlar.",
        focus: ["Stereotipiya", "Rigidlik", "Tor qiziqish", "Takroriy harakat", "Echopraksiya"],
      },
      sensory: {
        title: "Sensor sezgirlik",
        desc:
          "Bu bo‘limda sezgirlik tekshiriladi: tovush, kiyim, ovqat teksturasi, yorug‘lik, hid va teginishga munosabat.",
        focus: ["Tovush", "Kiyim", "Ovqat teksturasi", "Yorug‘lik", "Hid/tegish"],
      },
      play: {
        title: "O‘yin va tasavvur",
        desc:
          "Bu bo‘limda rol o‘yinlari, syujet, o‘yin tashabbusi va ijtimoiy o‘yin tekshiriladi.",
        focus: ["Rol o‘yinlari", "Syujet", "Pretend play", "Ijtimoiy o‘yin", "Qoidalar"],
      },
    } as Record<BlockId, { title: string; desc: string; focus: string[] }>,
  },

  ru: {
    app: {
      loading: "Пожалуйста, подождите...",
      sectionStart: "Начинаем...",
      continue: "Продолжить",
    },
    blocks: {
      social: {
        title: "Социальное взаимодействие",
        desc:
          "В этом блоке оценивается общение ребёнка с людьми: зрительный контакт, отклик на имя, совместное внимание и социальная близость.",
        focus: ["Отклик на имя", "Зрительный контакт", "Joint attention", "Совместная игра", "Разделение эмоций"],
      },
      speech: {
        title: "Речь и коммуникация",
        desc:
          "В этом блоке оцениваются речь и понимание: возрастная речь, вопросы-ответы, просодия и инициирование общения.",
        focus: ["Возрастная речь", "Вопрос-ответ", "Просодия", "Инициатива", "Жесты"],
      },
      repetitive: {
        title: "Повторяющееся поведение",
        desc:
          "В этом блоке оцениваются повторяющиеся действия и рутины: стереотипии, ригидность, узкие интересы.",
        focus: ["Стереотипии", "Ригидность", "Узкие интересы", "Повторы", "Эхопраксия"],
      },
      sensory: {
        title: "Сенсорная чувствительность",
        desc:
          "В этом блоке оценивается чувствительность: звуки, одежда, текстуры еды, свет, запахи и реакции на прикосновения.",
        focus: ["Звуки", "Одежда", "Текстуры еды", "Свет", "Запахи/касания"],
      },
      play: {
        title: "Игра и воображение",
        desc:
          "В этом блоке оцениваются ролевые игры, сюжет, инициирование игры и социальная игра.",
        focus: ["Ролевые игры", "Сюжет", "Pretend play", "Социальная игра", "Правила"],
      },
    } as Record<BlockId, { title: string; desc: string; focus: string[] }>,
  },
} as const;

export function tBlock(lang: Lang, blockId: BlockId) {
  return I18N[lang].blocks[blockId];
}
