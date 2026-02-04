"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TestWizard from "@/components/TestWizard";
import type { Lang } from "@/lib/i18n";
import type { AnswersMap } from "@/lib/scoring";
import DarkModeToggle from "@/components/DarkModeToggle";

type ParentType = "mother" | "father" | "other";
type FamilyHistory = "yes" | "no" | "unknown";

export default function TestClient() {
  const router = useRouter();

  const [lang, setLang] = React.useState<Lang>("uz");
  const [age, setAge] = React.useState<number>(4);
  const [phone, setPhone] = React.useState<string>("+998");
  const [parentType, setParentType] = React.useState<ParentType | "">("");
  const [familyHistory, setFamilyHistory] = React.useState<FamilyHistory | "">("");
  const [started, setStarted] = React.useState(false);

  const [errors, setErrors] = React.useState<{
    age?: string;
    phone?: string;
    parent?: string;
    family?: string;
  }>({});
  const ages = React.useMemo(() => [2, 3, 4, 5, 6, 7], []);
  const agePickerRef = React.useRef<HTMLDivElement | null>(null);

  // ✅ Har gal /test ga kirganda eski natijani tozalaymiz
  React.useEffect(() => {
    try {
      sessionStorage.removeItem("asds_answers");
      sessionStorage.removeItem("asds_age");
      sessionStorage.removeItem("asds_lang");
      sessionStorage.removeItem("asds_parent");
      sessionStorage.removeItem("asds_family_history");
    } catch {}
  }, []);

  React.useEffect(() => {
    const idx = ages.indexOf(age);
    if (agePickerRef.current && idx >= 0) {
      agePickerRef.current.scrollTop = idx * 48;
    }
    // Only run on mount for initial alignment
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function validateForm() {
    const newErrors: typeof errors = {};

    if (!age || age < 2 || age > 7) {
      newErrors.age = lang === "ru" ? "Возраст должен быть от 2 до 7 лет." : "Yosh 2 dan 7 gacha bo'lishi kerak.";
    }

    const cleaned = phone.replace(/\s+/g, "");
    const phoneOk = /^\+998\d{9}$/.test(cleaned);
    if (!phoneOk) {
      newErrors.phone =
        lang === "ru"
          ? "Введите номер в формате +998XXXXXXXXX."
          : "Telefon raqami +998XXXXXXXXX formatida bo'lishi kerak.";
    }

    if (!parentType) {
      newErrors.parent = lang === "ru" ? "Пожалуйста, укажите, кто заполняет тест." : "Iltimos, testni kim to'ldirmoqda ekanligini belgilang.";
    }

    if (!familyHistory) {
      newErrors.family = lang === "ru" ? "Пожалуйста, ответьте на вопрос о семейной истории." : "Iltimos, oila tarixi haqidagi savolga javob bering.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function startTest() {
    if (!validateForm()) {
      return;
    }

    try {
      sessionStorage.setItem("asds_age", String(age));
      sessionStorage.setItem("asds_lang", lang);
      sessionStorage.setItem("asds_phone", phone.replace(/\s+/g, ""));
      sessionStorage.setItem("asds_parent", parentType);
      sessionStorage.setItem("asds_family_history", familyHistory);
    } catch {}

    setStarted(true);
  }

  function onComplete(answers: AnswersMap) {
    try {
      sessionStorage.setItem("asds_answers", JSON.stringify(answers));
    } catch {}

    router.push("/result");
  }

  if (started) {
    return <TestWizard childAgeYears={age} lang={lang} onComplete={onComplete} />;
  }

  const labels =
    lang === "ru"
      ? {
          title: "Скрининг 2–7 лет",
          subtitle: "Пожалуйста, заполните форму ниже. Это не диагноз — результат поможет понять, на что обратить внимание.",
          ageLabel: "Возраст ребёнка (лет)",
          phoneLabel: "Номер телефона (Узбекистан)",
          parentLabel: "Кто заполняет тест?",
          parentOptions: {
            mother: "Мама",
            father: "Папа",
            other: "Другой родственник/опекун",
          },
          familyLabel: "Есть ли в семье люди с расстройством аутистического спектра (РАС)?",
          familyOptions: {
            yes: "Да",
            no: "Нет",
            unknown: "Не знаю / Не уверен",
          },
          start: "Начать тест",
          tipTitle: "Как отвечать?",
          tipText: "Оценивайте по поведению за последние 2–4 недели. Если сомневаетесь — выбирайте «Иногда».",
        }
      : {
          title: "2–7 yosh skrining",
          subtitle: "Iltimos, quyidagi formani to'ldiring. Bu tashxis emas — natija sizga nimaga e'tibor berishni ko'rsatadi.",
          ageLabel: "Bolaning yoshi (yil)",
          phoneLabel: "Telefon raqami (O‘zbekiston)",
          parentLabel: "Testni kim to'ldirmoqda?",
          parentOptions: {
            mother: "Ona",
            father: "Ota",
            other: "Boshqa qarindosh / Vasiy",
          },
          familyLabel: "Oilada Autizm spektr buzilishi (ASD) bilan kasallanganlar bormi?",
          familyOptions: {
            yes: "Ha",
            no: "Yo'q",
            unknown: "Bilmayman / Aniq emas",
          },
          start: "Testni boshlash",
          tipTitle: "Qanday javob berish?",
          tipText: "Oxirgi 2–4 hafta kuzatuvingiz bo'yicha belgilang. Ikki o'rtada bo'lsa — «Ba'zan» ni tanlang.",
        };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 px-4 pt-10 pb-10">
      {/* Dark Mode Toggle */}
      <div className="fixed top-4 right-4 z-50 animate-fadeIn">
        <DarkModeToggle />
      </div>
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl glass dark:bg-slate-800/50 p-6 md:p-8 shadow-lg ring-1 ring-slate-200/50 dark:ring-slate-700/50 hover-lift animate-fadeIn">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-100 dark:ring-indigo-800">
                {labels.title}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{labels.subtitle}</p>
            </div>

            {/* Lang switch */}
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setLang("uz")}
                className={`rounded-xl px-4 py-2 text-xs font-bold ring-1 transition-all ${
                  lang === "uz"
                    ? "bg-indigo-600 dark:bg-indigo-500 text-white ring-indigo-200 dark:ring-indigo-700 shadow-md"
                    : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 ring-slate-200 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600"
                }`}
              >
                UZ
              </button>
              <button
                type="button"
                onClick={() => setLang("ru")}
                className={`rounded-xl px-4 py-2 text-xs font-bold ring-1 transition-all ${
                  lang === "ru"
                    ? "bg-indigo-600 dark:bg-indigo-500 text-white ring-indigo-200 dark:ring-indigo-700 shadow-md"
                    : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 ring-slate-200 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600"
                }`}
              >
                RU
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Age input */}
            <div className="rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 p-5 ring-1 ring-slate-200/50 dark:ring-slate-600/50 shadow-sm">
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                {labels.ageLabel}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/90 via-white/10 to-white/90 dark:from-slate-900/70 dark:via-slate-800/10 dark:to-slate-900/70" />
                <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 h-12 rounded-xl border border-indigo-200/70 dark:border-indigo-500/30 bg-white/60 dark:bg-slate-900/40 shadow-inner" />
                <div
                  ref={agePickerRef}
                  onScroll={(e) => {
                    const top = e.currentTarget.scrollTop;
                    const idx = Math.round(top / 48);
                    const nextAge = ages[idx];
                    if (nextAge && nextAge !== age) {
                      setAge(nextAge);
                      setErrors((prev) => ({ ...prev, age: undefined }));
                    }
                  }}
                  className="relative h-40 overflow-y-auto snap-y snap-mandatory rounded-2xl bg-white/70 dark:bg-slate-900/40 ring-1 ring-slate-200/60 dark:ring-slate-600/50 shadow-sm"
                >
                  <div className="py-6">
                    {ages.map((n) => {
                      const active = n === age;
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => {
                            setAge(n);
                            setErrors((prev) => ({ ...prev, age: undefined }));
                            if (agePickerRef.current) agePickerRef.current.scrollTop = ages.indexOf(n) * 48;
                          }}
                          className={`mx-auto flex h-12 w-full items-center justify-center snap-center text-lg font-semibold transition-all ${
                            active
                              ? "text-indigo-700 dark:text-indigo-300"
                              : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              {errors.age && <div className="mt-2 text-xs font-semibold text-red-600 dark:text-red-400">{errors.age}</div>}
            </div>

            {/* Phone input */}
            <div className="rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 p-5 ring-1 ring-slate-200/50 dark:ring-slate-600/50 shadow-sm">
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                {labels.phoneLabel}
              </label>
              <input
                type="tel"
                inputMode="tel"
                placeholder="+998901234567"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                className="w-full rounded-xl bg-white dark:bg-slate-700 px-4 py-3 text-base font-semibold text-slate-900 dark:text-slate-100 ring-1 ring-slate-300 dark:ring-slate-600 outline-none transition-all focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-1"
              />
              {errors.phone && <div className="mt-2 text-xs font-semibold text-red-600 dark:text-red-400">{errors.phone}</div>}
            </div>

            {/* Parent type */}
            <div className="rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 p-5 ring-1 ring-slate-200/50 dark:ring-slate-600/50 shadow-sm">
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                {labels.parentLabel}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(["mother", "father", "other"] as ParentType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setParentType(type);
                      setErrors((prev) => ({ ...prev, parent: undefined }));
                    }}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold ring-1 transition-all hover-lift ${
                      parentType === type
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-600 text-white ring-indigo-200/80 dark:ring-indigo-700/80 shadow-lg shadow-indigo-500/30"
                        : "bg-white/80 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 ring-slate-300/80 dark:ring-slate-600/70 hover:ring-indigo-300/70 dark:hover:ring-indigo-500/70"
                    }`}
                  >
                    {labels.parentOptions[type]}
                  </button>
                ))}
              </div>
              {errors.parent && <div className="mt-2 text-xs font-semibold text-red-600 dark:text-red-400">{errors.parent}</div>}
            </div>

            {/* Family history */}
            <div className="rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 p-5 ring-1 ring-slate-200/50 dark:ring-slate-600/50 shadow-sm">
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                {labels.familyLabel}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(["yes", "no", "unknown"] as FamilyHistory[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setFamilyHistory(type);
                      setErrors((prev) => ({ ...prev, family: undefined }));
                    }}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold ring-1 transition-all hover-lift ${
                      familyHistory === type
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-600 text-white ring-indigo-200/80 dark:ring-indigo-700/80 shadow-lg shadow-indigo-500/30"
                        : "bg-white/80 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 ring-slate-300/80 dark:ring-slate-600/70 hover:ring-indigo-300/70 dark:hover:ring-indigo-500/70"
                    }`}
                  >
                    {labels.familyOptions[type]}
                  </button>
                ))}
              </div>
              {errors.family && <div className="mt-2 text-xs font-semibold text-red-600 dark:text-red-400">{errors.family}</div>}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 rounded-xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-slate-800 p-4 ring-1 ring-indigo-100 dark:ring-indigo-800/50 shadow-sm">
            <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300">{labels.tipTitle}</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{labels.tipText}</p>
          </div>

          {/* Start button */}
          <button
            type="button"
            onClick={startTest}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 dark:from-indigo-500 dark:via-indigo-400 dark:to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-indigo-500/30 dark:shadow-indigo-500/40 transition-all hover:from-indigo-700 hover:via-indigo-600 hover:to-indigo-700 dark:hover:from-indigo-600 dark:hover:via-indigo-500 dark:hover:to-indigo-700 hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            {labels.start}
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
            {lang === "ru"
              ? "Примечание: этот скрининг не заменяет консультацию специалиста."
              : "Eslatma: bu skrining mutaxassis konsultatsiyasini almashtirmaydi."}
          </p>
        </div>
      </div>
    </div>
  );
}
