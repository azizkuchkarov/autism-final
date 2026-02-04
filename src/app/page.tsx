import Link from "next/link";
import HeroPreviewCharts from "@/components/HeroPreviewCharts";
import DarkModeToggle from "@/components/DarkModeToggle";
import { BLOCKS } from "@/lib/questions";

export default function Home() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <main className="mx-auto max-w-4xl px-4 pb-16 pt-8">
        {/* Dark Mode Toggle */}
        <div className="fixed top-4 right-4 z-50 animate-fadeIn">
          <DarkModeToggle />
        </div>

        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl glass dark:bg-slate-800/50 p-8 md:p-12 shadow-xl ring-1 ring-indigo-100/50 dark:ring-slate-700/50 hover-lift animate-fadeIn mb-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-200/30 dark:bg-indigo-900/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-emerald-200/30 dark:bg-emerald-900/20 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-100 dark:ring-indigo-800">
              2–7 yosh • 5 blok • 50 savol
              <span className="ml-1 rounded-full bg-white dark:bg-slate-700 px-2.5 py-1 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-200 dark:ring-indigo-700">
                Premium
              </span>
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
              Bola rivojlanishi bo'yicha{" "}
              <span className="text-indigo-600 dark:text-indigo-400">zamonaviy</span> skrining
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              Bu test <b>tashxis emas</b>. Maqsad — ota-onaga erta kuzatish asosida{" "}
              <b>tushunarli yo'l xarita</b> berish: grafik profil, AI izoh va PDF hisobot.
            </p>

            <div className="mt-8">
              <Link
                href="/test"
                className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/25 dark:shadow-indigo-500/40 transition-all hover:from-indigo-700 hover:to-indigo-600 dark:hover:from-indigo-600 dark:hover:to-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 dark:hover:shadow-indigo-500/50 hover:-translate-y-1 active:translate-y-0 animate-scaleIn"
              >
                Testni boshlash
                <svg className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* AUTISM INFORMATION */}
        <section className="mb-8">
          <Card title="Autizm spektr buzilishi (ASD) nima?">
            <div className="mt-4 space-y-4 text-slate-700 dark:text-slate-300">
              <p className="text-base leading-relaxed">
                <b>Autizm spektr buzilishi (ASD)</b> — bu rivojlanishning nevrologik holati bo'lib, 
                bolaning ijtimoiy muloqot, nutq va xatti-harakatlarida farqlar kuzatiladi.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-slate-800 p-4 ring-1 ring-indigo-100 dark:ring-indigo-800/50">
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2">Belgilar:</h4>
                  <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                    <li>• Ko'z bilan aloqa qilishda qiyinchilik</li>
                    <li>• Ismga javob bermaslik</li>
                    <li>• Nutqning kechikishi</li>
                    <li>• Takroriy harakatlar</li>
                    <li>• Sensor sezuvchanlik</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-800 p-4 ring-1 ring-emerald-100 dark:ring-emerald-800/50">
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-300 mb-2">Muhim:</h4>
                  <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                    <li>• Har bir bola individual</li>
                    <li>• Ertaniqlash muhim</li>
                    <li>• Yordam va qo'llab-quvvatlash mavjud</li>
                    <li>• Rivojlanish davom etadi</li>
                    <li>• Ijobiy natijalar mumkin</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* EARLY DETECTION */}
        <section className="mb-8">
          <Card title="Nega erta aniqlash muhim?">
            <div className="mt-4 space-y-4">
              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                Tadqiqotlar ko'rsatadiki, <b>erta aniqlash va yordam</b> bolaning rivojlanishiga 
                sezilarli ta'sir ko'rsatadi. 2-7 yosh — bu muhim davr, chunki:
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <FeatureCard
                  icon="🧠"
                  title="Miya rivojlanishi"
                  text="Bu yoshda miya eng faol rivojlanadi va o'zgarishlarga moslashadi"
                />
                <FeatureCard
                  icon="💬"
                  title="Nutq rivojlanishi"
                  text="Nutq va muloqot ko'nikmalarini shakllantirish uchun eng yaxshi davr"
                />
                <FeatureCard
                  icon="🤝"
                  title="Ijtimoiy ko'nikmalar"
                  text="Ijtimoiy muloqot va munosabatlarni o'rnatish uchun muhim vaqt"
                />
              </div>
              <div className="mt-6 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-5 ring-1 ring-amber-200 dark:ring-amber-800/50">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                  💡 Eslatma: Ertaniqlash va yordam olish — bu bola va oila uchun eng yaxshi qadam.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* TEST INFORMATION */}
        <section className="mb-8">
          <Card title="Test haqida ma'lumot">
            <div className="mt-4 space-y-4 text-slate-700 dark:text-slate-300">
              <p className="text-base leading-relaxed">
                Bu skrining testi <b>50 ta savol</b>dan iborat bo'lib, <b>5 ta asosiy blok</b>ga bo'lingan. 
                Har bir blok bolaning rivojlanishining muayyan sohasini baholaydi.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 ring-1 ring-slate-200/50 dark:ring-slate-700/50">
                  <div className="text-2xl">⏱️</div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">Vaqt</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Testni yakunlash uchun taxminan 15-20 daqiqa kerak bo'ladi</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 ring-1 ring-slate-200/50 dark:ring-slate-700/50">
                  <div className="text-2xl">📊</div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">Natija</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Testdan so'ng siz grafik profil, AI tushuntirishi va PDF hisobot olasiz</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 ring-1 ring-slate-200/50 dark:ring-slate-700/50">
                  <div className="text-2xl">🔒</div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">Maxfiylik</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Barcha ma'lumotlar maxfiy saqlanadi va faqat sizga ko'rsatiladi</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* TEST BLOCKS */}
        <section className="mb-8">
          <Card title="Test bloklari haqida">
            <p className="mt-4 text-base text-slate-700 dark:text-slate-300">
              Test quyidagi <b>5 ta asosiy blok</b>dan iborat. Har bir blok bolaning rivojlanishining 
              muayyan sohasini baholaydi:
            </p>
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {BLOCKS.map((block, index) => (
                <BlockCard key={block.id} block={block} index={index + 1} />
              ))}
            </div>
          </Card>
        </section>

        {/* PREVIEW CHARTS */}
        <section className="mb-8">
          <HeroPreviewCharts />
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <Card title="Tez-tez so'raladigan savollar">
            <FAQ />
          </Card>
        </section>

        {/* CTA */}
        <section className="mb-8">
          <div className="rounded-3xl glass dark:bg-slate-800/50 p-8 md:p-12 text-center shadow-xl ring-1 ring-indigo-100/50 dark:ring-slate-700/50">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Tayyormisiz?
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
              Testni boshlash va bolaning rivojlanishini baholash uchun quyidagi tugmani bosing
            </p>
            <Link
              href="/test"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/25 dark:shadow-indigo-500/40 transition-all hover:from-indigo-700 hover:to-indigo-600 dark:hover:from-indigo-600 dark:hover:to-indigo-700 hover:shadow-xl hover:-translate-y-1"
            >
              Testni boshlash
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Bu platforma skrining uchun. Tashxis faqat mutaxassis ko'rigi asosida qo'yiladi.
        </p>
      </main>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl glass dark:bg-slate-800/50 p-6 md:p-8 shadow-lg ring-1 ring-slate-200/50 dark:ring-slate-700/50 hover-lift animate-fadeIn">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
      {children}
    </div>
  );
}

function FeatureCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 p-4 ring-1 ring-slate-200/50 dark:ring-slate-700/50 hover-lift">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{title}</div>
      <div className="text-sm text-slate-600 dark:text-slate-400">{text}</div>
    </div>
  );
}

function BlockCard({ block, index }: { block: typeof BLOCKS[0]; index: number }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-slate-800 p-5 ring-1 ring-indigo-100 dark:ring-indigo-800/50 hover-lift">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
          {index}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{block.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">{block.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function FAQ() {
  const items = [
    {
      q: "Bu tashxismi?",
      a: "Yo'q. Bu skrining. Tashxis faqat mutaxassis ko'rigi asosida qo'yiladi.",
    },
    {
      q: "AI xulosa nimani beradi?",
      a: "AI natijani tushuntiradi: \"Nega mumkin / mumkin emas\" deb izohlaydi va yumshoq tavsiya beradi.",
    },
    {
      q: "Natija nega o'zgarishi mumkin?",
      a: "Bola rivojlanadi, sharoit o'zgaradi. 1–3 oyda qayta skrining dinamikani ko'rsatadi.",
    },
    {
      q: "Qaysi holatda mutaxassisga murojaat qilamiz?",
      a: "Agar bir nechta belgilar muntazam davom etsa yoki kundalik hayotga ta'sir qilsa — maslahat foydali bo'ladi.",
    },
  ];

  return (
    <div className="mt-4 space-y-3">
      {items.map((x) => (
        <details key={x.q} className="group rounded-xl bg-white dark:bg-slate-800 p-4 ring-1 ring-slate-200/50 dark:ring-slate-700/50 shadow-sm transition-all hover:shadow-md hover-lift">
          <summary className="cursor-pointer text-base font-bold text-slate-900 dark:text-slate-100 transition-colors hover:text-indigo-700 dark:hover:text-indigo-400">
            {x.q}
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{x.a}</p>
        </details>
      ))}
    </div>
  );
}
