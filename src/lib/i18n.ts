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
          "Bu bo‘limda bola odamlar bilan muloqoti tekshiriladi: ismiga javob berishi, ko‘z kontakt, bo‘lishish, birga o‘ynash va tengdoshga qiziqish.",
        focus: ["Ismiga javob", "Ko‘z kontakt", "Birga o‘ynash", "Bo‘lishish", "Tengdoshga qiziqish"],
      },
      speech: {
        title: "Nutq va muloqot",
        desc:
          "Bu bo‘limda nutq va tushunish tekshiriladi: ko‘rsatmalarni bajarish, ehtiyojni aytish, savol-javob, imo-ishora va muloqot boshlash.",
        focus: ["Ko‘rsatmalar", "Ehtiyojni aytish", "Savol-javob", "Imo-ishora", "Suhbat boshlash"],
      },
      repetitive: {
        title: "Takroriy xatti-harakatlar",
        desc:
          "Bu bo‘limda takroriy harakatlar va rutinalar tekshiriladi: rutina o‘zgarsa bezovtalik, bir xil o‘yin, tartiblash, tor qiziqishlar.",
        focus: ["Rutina", "Takroriy harakat", "Bir xil o‘yin", "Tartiblash", "Tor qiziqish"],
      },
      sensory: {
        title: "Sensor sezuvchanlik",
        desc:
          "Bu bo‘limda sezuvchanlik tekshiriladi: tovush, kiyim, ovqat teksturasi, yorug‘lik, hid va gigiyena jarayonlariga munosabat.",
        focus: ["Tovush", "Kiyim", "Ovqat teksturasi", "Yorug‘lik/Hid", "Soch/tirnoq"],
      },
      emotional: {
        title: "Emotsional va xulq",
        desc:
          "Bu bo‘limda emotsional boshqaruv tekshiriladi: jahl, meltdown, o‘zini tinchlantirish, moslashuv, uyqu va xavotir belgilari.",
        focus: ["Meltdown", "Tinchlanish qiyin", "Moslashuv", "Uyqu", "Xavotir"],
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
          "В этом блоке оценивается общение ребёнка с людьми: отклик на имя, зрительный контакт, совместная игра, интерес к сверстникам и разделение эмоций.",
        focus: ["Отклик на имя", "Зрительный контакт", "Совместная игра", "Разделение", "Интерес к сверстникам"],
      },
      speech: {
        title: "Речь и коммуникация",
        desc:
          "В этом блоке оцениваются речь и понимание: выполнение инструкций, выражение потребностей, вопросы-ответы, жесты и инициирование общения.",
        focus: ["Инструкции", "Потребности", "Вопрос-ответ", "Жесты", "Инициирование общения"],
      },
      repetitive: {
        title: "Повторяющееся поведение",
        desc:
          "В этом блоке оцениваются повторяющиеся действия и рутины: стресс при изменениях, однотипные игры, выстраивание предметов и узкие интересы.",
        focus: ["Рутина", "Повторы", "Однотипная игра", "Выстраивание", "Узкие интересы"],
      },
      sensory: {
        title: "Сенсорная чувствительность",
        desc:
          "В этом блоке оценивается чувствительность: звуки, одежда, текстуры еды, свет, запахи и реакции на гигиенические процедуры.",
        focus: ["Звуки", "Одежда", "Текстуры еды", "Свет/запахи", "Стрижка/ногти"],
      },
      emotional: {
        title: "Эмоции и поведение",
        desc:
          "В этом блоке оценивается эмоциональная регуляция: вспышки, meltdown, способность успокаиваться, адаптация, сон и тревожность.",
        focus: ["Вспышки/meltdown", "Трудно успокоить", "Адаптация", "Сон", "Тревожность"],
      },
    } as Record<BlockId, { title: string; desc: string; focus: string[] }>,
  },
} as const;

export function tBlock(lang: Lang, blockId: BlockId) {
  return I18N[lang].blocks[blockId];
}
