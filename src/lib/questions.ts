// src/lib/questions.ts
export type BlockId = "social" | "speech" | "repetitive" | "sensory" | "play";
export type AgeBand = "2-3" | "4-5" | "6-7";
export type Direction = "positive" | "negative";

export type Question = {
  id: string;
  block: BlockId;
  text: string;
  example: string;
  explain: string;
  bands: AgeBand[];
  // ASD uchun “yadro” (core) red-flag bo‘lishi mumkin bo‘lgan savollar
  // (ayniqsa social + 1-2 ta boshqa blokdagi muhimlar)
  isCoreFlag?: boolean;
  // positive: ko‘nikma bor (Ko‘pincha = yaxshi)
  // negative: muammo belgisi (Ko‘pincha = yomon)
  direction: Direction;
};

export const BLOCKS: { id: BlockId; title: string; subtitle: string }[] = [
  { id: "social", title: "Ijtimoiy muloqot", subtitle: "Ko‘z kontakt, ismga javob, joint attention" },
  { id: "speech", title: "Nutq va muloqot", subtitle: "Tushunish, javob berish, prosodiya" },
  { id: "repetitive", title: "Takroriy harakatlar", subtitle: "Stereotipiya, rutina, qiziqishlar" },
  { id: "sensory", title: "Sensor sezgirlik", subtitle: "Tovush, teginish, yorug‘lik, hid" },
  { id: "play", title: "O‘yin va tasavvur", subtitle: "Rol o‘yinlari, syujet, ijtimoiy o‘yin" },
];

// 50 savol
export const QUESTIONS: Question[] = [
  // SOCIAL (10)
  {
    id: "S1",
    block: "social",
    text: "Bola ko‘z bilan aloqa qiladimi?",
    example:
      "Gapirayotganingizda bola yuzingizga qaraydi, sizni tinglayotgandek ko‘z bilan aloqani ushlab turadi. Yoki aksincha, chaqirsangiz ham ko‘zini olib qochadi, boshqa tomonga qaraydi.",
    explain:
      "Ko‘z bilan aloqa — ijtimoiy bog‘lanishning asosiy belgilaridan biridir. Autizm spektrida bo‘lgan bolalarda ko‘z bilan aloqa ko‘pincha zaif yoki juda qisqa bo‘ladi. Bu uyatchanlik emas, balki ijtimoiy aloqani boshqacha qabul qilish bilan bog‘liq.",
    bands: ["2-3", "4-5", "6-7"],
    isCoreFlag: true,
    direction: "positive",
  },
  {
    id: "S2",
    block: "social",
    text: "Ismi aytilganda tez javob beradimi?",
    example:
      "“Ali!” deb chaqirganingizda qaraydi, ovoz chiqaradi yoki reaksiya bildiradi. Ba’zi holatlarda esa bir necha marta chaqirilsa ham javob bermaydi.",
    explain:
      "Bu savol eshitish qobiliyatini emas, balki ijtimoiy chaqiriqqa javobni baholaydi. Autizmda bola ismini eshitsa ham, unga ijtimoiy ahamiyat bermasligi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    isCoreFlag: true,
    direction: "positive",
  },
  {
    id: "S3",
    block: "social",
    text: "Siz ko‘rsatgan narsaga qaraydimi?",
    example:
      "“Qarang, qush!” deb ko‘rsatganingizda bola siz ko‘rsatgan tomonga qaraydi yoki qarashni siz bilan bo‘lishadi.",
    explain:
      "Bu holat “birgalikdagi e’tibor (joint attention)” deb ataladi. Bu ko‘nikma autizmni skrining qilishda eng muhim belgilaridan biridir. Autizmda bu ko‘nikma sust rivojlangan bo‘lishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    isCoreFlag: true,
    direction: "positive",
  },
  {
    id: "S4",
    block: "social",
    text: "Siz bilan quvonchini bo‘lishadimi?",
    example:
      "Yangi o‘yinchoqni ko‘rsatib kuladi yoki nimadandir xursand bo‘lib sizga qaraydi.",
    explain:
      "Sog‘lom ijtimoiy rivojlanishda bola hissiyotlarini boshqalar bilan bo‘lishishga intiladi. Autizmda esa quvonchni “yolg‘iz” his qilish holatlari ko‘proq uchraydi.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "positive",
  },
  {
    id: "S5",
    block: "social",
    text: "Boshqa bolalarga qiziqish bildiradimi?",
    example:
      "Bolalar o‘ynayotgan joyga qaraydi, yaqinlashadi yoki ularni kuzatadi. Yoki umuman e’tibor bermaydi.",
    explain:
      "Tengdoshlar bilan qiziqish ijtimoiy rivojlanishning muhim ko‘rsatkichidir. Autizmda bola boshqa bolalarni “muhim” deb qabul qilmasligi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "positive",
  },
  {
    id: "S6",
    block: "social",
    text: "Yangi odamlarni sezmaydigandek tutadimi?",
    example:
      "Uyga mehmon keladi, bola esa umuman e’tibor bermaydi yoki reaktsiyasiz qoladi.",
    explain:
      "Bu ijtimoiy muhitga befarqlik belgisi bo‘lishi mumkin. Autizmda yangi odamlar bolaning e’tiborini tortmasligi ehtimoli bor.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "S7",
    block: "social",
    text: "Sizning mimika va ovoz ohangingizga mos reaksiya qiladimi?",
    example:
      "Siz xafa bo‘lib gapirsangiz bola jiddiylashadi, quvnoq bo‘lsangiz kuladi.",
    explain:
      "Bu empatiya va hissiy signallarni tushunish qobiliyatini baholaydi. Autizmda yuz ifodasi va ohangni tushunish qiyin bo‘lishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "positive",
  },
  {
    id: "S8",
    block: "social",
    text: "Biror narsa so‘rash uchun imo-ishora ishlatadimi?",
    example:
      "Suvni ko‘rsatadi, qo‘lingizdan ushlab kerakli joyga olib boradi.",
    explain:
      "Imo-ishora — nutq bo‘lmasa ham muloqot qilish usulidir. Autizmda bu ehtiyoj kamaygan bo‘lishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "positive",
  },
  {
    id: "S9",
    block: "social",
    text: "Siz bilan o‘yin davomida aloqa saqlaydimi?",
    example:
      "O‘yin paytida sizga qaraydi, navbat kutadi yoki javob reaksiyasini kutadi.",
    explain:
      "O‘yin davomida aloqani ushlab turish ijtimoiy bog‘lanishning muhim qismidir.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "positive",
  },
  {
    id: "S10",
    block: "social",
    text: "Yuzingizga qarab kayfiyatingizni sezadimi?",
    example:
      "Siz kulganda bola ham quvonadi, jiddiy bo‘lsangiz tinchlanadi.",
    explain:
      "Autizmda boshqalarning hissiyotini tushunish qiyin bo‘lishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "positive",
  },

  // SPEECH (10)
  {
    id: "P1",
    block: "speech",
    text: "Bola yoshiga mos gapira oladimi?",
    example:
      "3 yoshli bola oddiy gaplar tuza oladi (“Suv ber”, “O‘yinchoq qani?”). Yoki bola tengdoshlariga qaraganda juda kam gapiradi yoki umuman gapirmaydi.",
    explain:
      "Nutqning yoshga mos rivojlanishi muhim ko‘rsatkichdir. Autizmda nutq kechikishi tez-tez uchraydi. Bu faqat “kech gapirish” emas, balki muloqot uchun nutqdan kam foydalanish bilan bog‘liq bo‘lishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "positive",
  },
  {
    id: "P2",
    block: "speech",
    text: "So‘zlarni muloqot uchun ishlatadimi?",
    example:
      "Bola chanqaganda “suv” deydi yoki yordam kerak bo‘lsa so‘z bilan bildiradi. Yoki so‘zlarni aytadi, lekin hech narsa so‘rash uchun ishlatmaydi.",
    explain:
      "Bu savol bolaning so‘zlarni ehtiyoj va muloqot uchun ishlatayotganini baholaydi. Autizmda bola so‘zlarni bilsa ham, ularni aloqa vositasi sifatida ishlatmasligi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "positive",
  },
  {
    id: "P3",
    block: "speech",
    text: "Savollarga mos javob beradimi?",
    example:
      "“Qayerda?” deganda ko‘rsatadi, “Nima yeding?” deganda javob beradi. Yoki savolga aloqasiz javob beradi.",
    explain:
      "Bu bolaning savolni tushunishi va mantiqiy javob bera olish qobiliyatini ko‘rsatadi. Autizmda savol-javob muloqoti qiyin kechishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "positive",
  },
  {
    id: "P4",
    block: "speech",
    text: "So‘zlarni yoki gaplarni takrorlaydimi (echolaliya)?",
    example:
      "“Suv ichasanmi?” deb so‘rasangiz, bola “ichasanmi” deb takrorlaydi. Yoki multfilm gaplarini o‘zi-o‘ziga qayta aytadi.",
    explain:
      "Echolaliya — eshitilgan so‘z yoki gaplarni tushunmasdan takrorlash. Bu autizmda tez-tez uchraydi va nutq rivojlanishining o‘ziga xos bosqichi bo‘lishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "P5",
    block: "speech",
    text: "O‘z tashabbusi bilan gap boshlaydimi?",
    example:
      "Bola o‘zi kelib nimanidir aytadi yoki savol beradi. Yoki faqat so‘ralganda gapiradi.",
    explain:
      "Muloqotni o‘z tashabbusi bilan boshlash ijtimoiy rivojlanish belgisi. Autizmda bola muloqotni kamdan-kam hollarda o‘zi boshlaydi.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "positive",
  },
  {
    id: "P6",
    block: "speech",
    text: "“Ha” yoki “yo‘q” savollariga to‘g‘ri javob beradimi?",
    example:
      "“Xohlaysanmi?” deganda “ha” yoki boshini qimirlatadi. Yoki savolga aloqasiz javob beradi.",
    explain:
      "Oddiy savollarga mos javob berish bolaning tushunish va muloqot qobiliyatini ko‘rsatadi. Autizmda bu ko‘nikma sust bo‘lishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "positive",
  },
  {
    id: "P7",
    block: "speech",
    text: "Gapirish ohangi g‘alati yoki robotga o‘xshashmi?",
    example:
      "Bola bir xil ohangda, hissiyotsiz gapiradi yoki juda baland/past ovozda gapiradi.",
    explain:
      "Nutq ohangi va urg‘u prosodiya deb ataladi. Autizmda prosodiya buzilishi tez-tez uchraydi — nutq tabiiy emasdek tuyulishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "P8",
    block: "speech",
    text: "Bir xil gaplarni qayta-qayta aytadimi?",
    example:
      "Bir so‘zni yoki gapni kun davomida ko‘p marotaba aytaveradi, vaziyatga mos kelmasa ham.",
    explain:
      "Bu takroriy nutq hisoblanadi. Autizmda bu o‘zini tinchlantirish yoki qiziqish bilan bog‘liq bo‘lishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "P9",
    block: "speech",
    text: "Gapirayotganda sizni tinglayaptimi?",
    example:
      "Siz gapirsangiz to‘xtab eshitadi yoki yuzingizga qaraydi. Yoki gapingizga umuman e’tibor bermaydi.",
    explain:
      "Bu savol o‘zaro muloqot mavjudligini baholaydi. Autizmda bola ko‘pincha faqat o‘zi gapirib, boshqani tinglamasligi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "positive",
  },
  {
    id: "P10",
    block: "speech",
    text: "Imo-ishora va nutqni birga ishlatadimi?",
    example:
      "Gapirib turib qo‘li bilan ko‘rsatadi yoki boshini qimirlatadi. Yoki faqat so‘z, yoki faqat ishora ishlatadi.",
    explain:
      "Nutq va imo-ishoraning birgalikda ishlatilishi sog‘lom muloqot belgisi. Autizmda bu uyg‘unlik buzilgan bo‘lishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "positive",
  },

  // REPETITIVE (10)
  {
    id: "R1",
    block: "repetitive",
    text: "Bola qo‘l silkitish, aylanish yoki sakrash kabi harakatlarni tez-tez qiladimi?",
    example:
      "Bola xursand bo‘lganda yoki bezovta bo‘lganda qo‘llarini silkitadi, aylanadi yoki joyida sakraydi.",
    explain:
      "Bu takroriy harakatlar (stereotipiya) deyiladi. Autizmda bunday harakatlar tez-tez uchraydi va ko‘pincha bolaning ichki holatini ifodalaydi.",
    bands: ["2-3", "4-5", "6-7"],
    isCoreFlag: true,
    direction: "negative",
  },
  {
    id: "R2",
    block: "repetitive",
    text: "Bir xil harakatni uzoq vaqt davomida takrorlaydimi?",
    example:
      "Bola bir joyda aylana-aylana yuradi yoki bir harakatni to‘xtamasdan uzoq qiladi.",
    explain:
      "Bu holat bolaning moslashuvchanligi past ekanini ko‘rsatishi mumkin. Autizmda bola bir xatti-harakatga “yopishib” qolishi ehtimoli yuqori.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "R3",
    block: "repetitive",
    text: "Buyumlarni aylantirishni (g‘ildirak, qopqoq) juda yoqtiradimi?",
    example:
      "Mashinaning o‘zini o‘ynashdan ko‘ra, faqat g‘ildiragini aylantirib o‘tiradi.",
    explain:
      "Bu sensor va takroriy xulq bilan bog‘liq. Bola harakatdan yoki ko‘rinishdan maxsus qoniqish olishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "R4",
    block: "repetitive",
    text: "O‘yinchoqlarni qator qilib teradimi yoki tartib bilan joylashtiradimi?",
    example:
      "Mashinalarni faqat bir chiziqqa terib chiqadi, ularni yurdirib o‘ynamaydi.",
    explain:
      "Bu no-funksional o‘yin hisoblanadi. Autizmda o‘yin ko‘proq tartib va takroriylikka asoslanishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "R5",
    block: "repetitive",
    text: "Har kuni bir xil tartibni talab qiladimi?",
    example:
      "Uyga kelish yo‘li o‘zgarsa yoki jadval buzilsa, bola jahl qiladi yoki yig‘laydi.",
    explain:
      "Autizmda o‘zgarishga qarshilik kuchli bo‘lishi mumkin. Bola uchun barqarorlik juda muhim.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "R6",
    block: "repetitive",
    text: "Kichik o‘zgarishlarda ham kuchli reaksiya qiladimi?",
    example:
      "Ovqat boshqa idishda berilsa yoki o‘yin vaqti o‘zgarsa, bola bezovta bo‘ladi.",
    explain:
      "Bu rigid (qattiq) xulq-atvor belgisi. Autizmda moslashish qiyin kechadi.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "R7",
    block: "repetitive",
    text: "Aylanadigan narsalarga (ventilyator, kir yuvish mashinasi) kuchli qiziqish bildiradimi?",
    example:
      "Ventilyatorni uzoq vaqt tomosha qiladi, ko‘zini uzmaydi.",
    explain:
      "Bu sensor stimulyatsiya ehtiyoji bilan bog‘liq bo‘lishi mumkin. Bola harakatni kuzatish orqali o‘zini tinchlantiradi.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "R8",
    block: "repetitive",
    text: "Bir mavzu yoki narsaga haddan tashqari bog‘lanib qoladimi?",
    example:
      "Faqat bitta multfilm, bitta o‘yinchoq yoki mavzu haqida gapiradi.",
    explain:
      "Bu cheklangan qiziqishlar deyiladi. Autizmda qiziqish doirasi tor bo‘lishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "R9",
    block: "repetitive",
    text: "Takroriy harakatlar bolani tinchlantirayotgandek ko‘rinadimi?",
    example:
      "Bezovta bo‘lganda aylana boshlaydi va shundan keyin tinchlanadi.",
    explain:
      "Bunday harakatlar bolaning o‘zini o‘zi regulyatsiya qilish usuli bo‘lishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "R10",
    block: "repetitive",
    text: "Boshqa odamlarning harakatlarini ko‘pincha nusxalaydimi?",
    example:
      "Kimdir qo‘lini ko‘tarsa, bola ham darhol shuni qiladi.",
    explain:
      "Bu holat echopraksiya deb ataladi. Autizmda ba’zan ijtimoiy tushunish o‘rniga ko‘r-ko‘rona takrorlash kuzatiladi.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },

  // SENSORY (10)
  {
    id: "N1",
    block: "sensory",
    text: "Kuchli tovushlardan haddan tashqari qo‘rqadimi?",
    example:
      "Changyutgich, fen yoki baland musiqa yoqilganda quloqlarini yopadi, yig‘lab yuboradi yoki xonadan chiqib ketishga harakat qiladi.",
    explain:
      "Bu sensor gipersezgirlik belgisi bo‘lishi mumkin. Gipersezgirlik — bola tovushlarni haddan tashqari kuchli qabul qiladi, oddiy ovoz ham unga yoqimsiz tuyuladi.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "N2",
    block: "sensory",
    text: "Ba’zi kiyimlarni kiyishni rad etadimi?",
    example:
      "Kiyimning etiketkasi, choklari yoki matosi bolani bezovta qiladi, u kiyimni yechib tashlashga urinadi.",
    explain:
      "Bu taktil (teginish) gipersezgirlik bilan bog‘liq. Bola uchun oddiy teginish ham noqulay yoki “og‘riqli” bo‘lib sezilishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "N3",
    block: "sensory",
    text: "Ovqatni juda tanlab yeydimi (tekstura sabab)?",
    example:
      "Faqat yumshoq yoki faqat qattiq ovqat yeydi, yangi ovqatni og‘ziga ham olmaydi.",
    explain:
      "Bu ta’m va og‘iz sezgilari gipersezgirligi bo‘lishi mumkin. Bu injiqlik emas — bola ovqatning tuzilishini (teksturasini) og‘ir qabul qiladi.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "N4",
    block: "sensory",
    text: "Og‘riqqa sezgirligi g‘alati ko‘rinadimi?",
    example:
      "Bola yiqilib tushsa ham yig‘lamaydi yoki aksincha, juda kichik zarbada kuchli yig‘lab yuboradi.",
    explain:
      "Bu holat giposezgirlik (og‘riqni kamroq his qilish) yoki gipersezgirlik (og‘riqni haddan tashqari kuchli his qilish) bilan bog‘liq bo‘lishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "N5",
    block: "sensory",
    text: "Yorug‘likka salbiy reaksiya qiladimi?",
    example:
      "Quyoshda ko‘zini qisadi, yorug‘ xonada bezovta bo‘ladi yoki ekranga uzoq qaray olmaydi.",
    explain:
      "Bu vizual gipersezgirlik bo‘lishi mumkin. Yorug‘lik bola uchun juda kuchli seziladi.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "N6",
    block: "sensory",
    text: "Hidga keskin reaksiya bildiradimi?",
    example:
      "Atir, sovun yoki ovqat hididan bezovta bo‘ladi, burnini berkitadi.",
    explain:
      "Bu hid sezgisi gipersezgirligi bilan bog‘liq. Oddiy hidlar bola uchun yoqimsiz yoki bezovta qiluvchi bo‘lishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "N7",
    block: "sensory",
    text: "Tegishga (quchoqlash, silash) yoqtirmaydimi?",
    example:
      "Quchoqlaganda chekinadi, silashni yoqtirmaydi yoki jahl qiladi.",
    explain:
      "Bu taktil gipersezgirlik belgisi bo‘lishi mumkin. Bola yaqin jismoniy aloqani noqulay deb his qiladi.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "N8",
    block: "sensory",
    text: "Aylanib yurishni, sakrashni juda yaxshi ko‘radimi?",
    example:
      "Ko‘p aylanadi, sakraydi, baland joydan sakrashni yoqtiradi.",
    explain:
      "Bu ko‘pincha sensor giposezgirlik bilan bog‘liq. Giposezgirlik — bola sezgini kamroq his qiladi va uni harakat orqali “to‘ldirishga” harakat qiladi.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "N9",
    block: "sensory",
    text: "Ba’zi tovushlarni o‘zi chiqarishni yoqtiradimi?",
    example:
      "Baland ovoz chiqaradi, qichqiradi, g‘alati tovushlarni takrorlaydi.",
    explain:
      "Bu sensor stimulyatsiya bo‘lishi mumkin. Bola o‘z sezgi ehtiyojini shu tarzda qondiradi.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "N10",
    block: "sensory",
    text: "Sensor yuklama bo‘lganda o‘zini yo‘qotib qo‘yadimi?",
    example:
      "To‘y, savdo markazi yoki mehmonlikda birdan yig‘lab yuboradi, qichqiradi, o‘zini tuta olmaydi.",
    explain:
      "Bu holat sensor meltdown deb ataladi. Meltdown — bu erkalik emas, balki sezgi tizimi ortiqcha yuklanganda bolaning o‘zini boshqara olmasligi.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },

  // PLAY (10)
  {
    id: "L1",
    block: "play",
    text: "Bola rol o‘yinlarini o‘ynaydimi?",
    example:
      "Bola qo‘g‘irchoqni ovqatlantirayotgandek qiladi, mashinani haydayotgandek o‘ynaydi yoki telefon bilan gaplashayotgandek tasavvur qiladi.",
    explain:
      "Rol o‘yinlari (tasavvurli o‘yin) bolaning tasavvur va ijtimoiy fikrlash qobiliyatini ko‘rsatadi. Autizmda bunday o‘yinlar kam yoki umuman bo‘lmasligi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "positive",
  },
  {
    id: "L2",
    block: "play",
    text: "O‘yinchoqlarni maqsadiga mos ishlatadimi?",
    example:
      "Mashina bilan yurdirib o‘ynaydi, koptokni uloqtiradi. Yoki mashinani faqat aylantirib o‘tiradi.",
    explain:
      "Bu funksional o‘yin deyiladi. Autizmda bola o‘yinchoqni maqsadiga mos ishlatmasligi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "positive",
  },
  {
    id: "L3",
    block: "play",
    text: "O‘yin davomida syujet (hikoya) yarata oladimi?",
    example:
      "“O‘yinchoq uxlab qoldi”, “Mashina uyga ketdi” kabi kichik hikoya bilan o‘ynaydi.",
    explain:
      "Syujetli o‘yin tasavvur va mantiqiy fikrlash bilan bog‘liq. Autizmda o‘yin ko‘pincha syujetsiz bo‘ladi.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "positive",
  },
  {
    id: "L4",
    block: "play",
    text: "Bir xil o‘yinni qayta-qayta o‘ynaydimi?",
    example:
      "Har kuni faqat bitta o‘yinni o‘ynaydi, boshqasini qabul qilmaydi.",
    explain:
      "Bu moslashuvchanlik pastligi belgisi bo‘lishi mumkin. Autizmda bola yangilikka qiyin moslashadi.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "L5",
    block: "play",
    text: "O‘yinda boshqa bolalarni yoki kattalarni qo‘shadimi?",
    example:
      "“O‘ynaylik” deb chaqiradi yoki navbat bilan o‘ynaydi. Yoki yolg‘iz o‘ynashni afzal ko‘radi.",
    explain:
      "Ijtimoiy o‘yin — muloqot va hamkorlikni ko‘rsatadi. Autizmda o‘yin ko‘pincha yakka holda bo‘ladi.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "positive",
  },
  {
    id: "L6",
    block: "play",
    text: "O‘yinchoqlarni faqat aylantirish yoki qator qilish uchun ishlatadimi?",
    example:
      "Mashinaning g‘ildiragini aylantiradi, o‘yinchoqlarni qator qilib teradi.",
    explain:
      "Bu no-funksional o‘yin hisoblanadi. Autizmda o‘yin ko‘proq takroriy harakatlarga asoslanadi.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "negative",
  },
  {
    id: "L7",
    block: "play",
    text: "“Go‘yoki” harakatlar qiladimi (pretend play)?",
    example:
      "Bo‘sh stakandan ichayotgandek qiladi yoki telefon bilan gaplashayotgandek o‘ynaydi.",
    explain:
      "Pretend play — bolaning tasavvur bilan o‘ynashi. Autizmda bu qobiliyat cheklangan bo‘lishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "positive",
  },
  {
    id: "L8",
    block: "play",
    text: "O‘yin davomida hissiyot ifodalaydimi?",
    example:
      "O‘yinchoq yiqilsa “voy” deydi, quvonsa kuladi.",
    explain:
      "O‘yinda hissiyot ifodalash — emotsional integratsiya belgisi. Autizmda hissiyotlar o‘yinda kam namoyon bo‘lishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "positive",
  },
  {
    id: "L9",
    block: "play",
    text: "O‘yinni mustaqil boshlay oladimi?",
    example:
      "O‘zi o‘yin tanlaydi va boshlaydi. Yoki faqat kattalar boshlasa o‘ynaydi.",
    explain:
      "Tashabbus ko‘rsatish kognitiv va ijtimoiy rivojlanish belgisi. Autizmda tashabbus past bo‘lishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "positive",
  },
  {
    id: "L10",
    block: "play",
    text: "O‘yin vaqtida oddiy qoidalarni tushunadimi?",
    example:
      "Navbat kutadi, “endi sen, keyin men” qoidalariga amal qiladi.",
    explain:
      "Qoidalarni tushunish va rioya qilish kognitiv moslashuv bilan bog‘liq. Autizmda bu qiyin kechishi mumkin.",
    bands: ["2-3", "4-5", "6-7"],
    direction: "positive",
  },
];

export function ageToBand(ageYears: number): AgeBand {
  if (ageYears <= 3) return "2-3";
  if (ageYears <= 5) return "4-5";
  return "6-7";
}
