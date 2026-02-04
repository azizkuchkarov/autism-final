// src/lib/questions.ts
export type BlockId = "social" | "speech" | "repetitive" | "sensory" | "emotional";
export type AgeBand = "2-3" | "4-5" | "6-7";
export type Direction = "positive" | "negative";

export type Question = {
  id: string;
  block: BlockId;
  text: string;
  bands: AgeBand[];
  // ASD uchun “yadro” (core) red-flag bo‘lishi mumkin bo‘lgan savollar
  // (ayniqsa social + 1-2 ta boshqa blokdagi muhimlar)
  isCoreFlag?: boolean;
  // positive: ko‘nikma bor (Ko‘pincha = yaxshi)
  // negative: muammo belgisi (Ko‘pincha = yomon)
  direction: Direction;
};

export const BLOCKS: { id: BlockId; title: string; subtitle: string }[] = [
  { id: "social", title: "Ijtimoiy muloqot", subtitle: "Ko‘z kontakt, ismga javob, birga o‘ynash" },
  { id: "speech", title: "Nutq va muloqot", subtitle: "Tushunish, javob berish, echolalia" },
  { id: "repetitive", title: "Takroriy xatti-harakatlar", subtitle: "Rutina, stereotipiya, qiziqishlar" },
  { id: "sensory", title: "Sensor sezuvchanlik", subtitle: "Tovush, tekstura, yorug‘lik" },
  { id: "emotional", title: "Emotsional boshqarish", subtitle: "Meltdown, moslashuv, regulyatsiya" },
];

// 50 savol
export const QUESTIONS: Question[] = [
  // SOCIAL (10) – POSITIVE (Yo‘q = red flag)
  { id: "S1", block: "social", text: "Bola ismiga chaqirilganda odatda javob beradi.", bands: ["2-3","4-5","6-7"], isCoreFlag: true, direction: "positive" },
  { id: "S2", block: "social", text: "Bola ko‘z bilan aloqani (ko‘zga qarashni) tabiiy qiladi.", bands: ["2-3","4-5","6-7"], isCoreFlag: true, direction: "positive" },
  { id: "S3", block: "social", text: "Bola qiziqqan narsasini sizga ko‘rsatadi (barmog‘i bilan ko‘rsatish yoki olib kelish).", bands: ["2-3","4-5","6-7"], isCoreFlag: true, direction: "positive" },
  { id: "S4", block: "social", text: "Bola “birga o‘ynash”ga harakat qiladi (o‘yinga sizni qo‘shadi).", bands: ["2-3","4-5","6-7"], isCoreFlag: true, direction: "positive" },
  { id: "S5", block: "social", text: "Bola tengdosh bolalarga qiziqadi (yoniga boradi, kuzatadi, o‘ynashga urinadi).", bands: ["4-5","6-7"], isCoreFlag: true, direction: "positive" },
  { id: "S6", block: "social", text: "Bola his-tuyg‘uni bo‘lishadi (kulsa sizga qaraydi, hayron bo‘lsa sizni chaqiradi).", bands: ["2-3","4-5","6-7"], direction: "positive" },
  { id: "S7", block: "social", text: "Bola yordam so‘ray oladi (imo, so‘z, yoki sizni yetaklab).", bands: ["2-3","4-5","6-7"], direction: "positive" },
  { id: "S8", block: "social", text: "Bola taskin izlaydi (xafa bo‘lsa yoningizga keladi).", bands: ["2-3","4-5","6-7"], direction: "positive" },
  { id: "S9", block: "social", text: "Bola oddiy navbat kutishga moslashib boradi.", bands: ["4-5","6-7"], direction: "positive" },
  { id: "S10", block: "social", text: "Bola yuz ifodalarini sezadi (xursand/ranjiganini farqlaydi).", bands: ["4-5","6-7"], direction: "positive" },

  // SPEECH (10) – MIXED
  { id: "P1", block: "speech", text: "Bola siz aytgan oddiy ko‘rsatmalarni bajaradi (kel, ol, ber).", bands: ["2-3","4-5","6-7"], isCoreFlag: true, direction: "positive" },
  { id: "P2", block: "speech", text: "Bola ehtiyojini bildiradi (so‘z/imo bilan: suv, ovqat, hojat).", bands: ["2-3","4-5","6-7"], isCoreFlag: true, direction: "positive" },
  { id: "P3", block: "speech", text: "Bola so‘zlarni ma’noli ishlatadi (faqat takrorlash emas).", bands: ["2-3","4-5","6-7"], isCoreFlag: true, direction: "positive" },
  { id: "P4", block: "speech", text: "Bola savolga mos javob berishga urinadi.", bands: ["4-5","6-7"], isCoreFlag: true, direction: "positive" },
  { id: "P5", block: "speech", text: "Bola imo-ishoradan foydalanadi (ko‘rsatish, bosh irg‘ash).", bands: ["2-3","4-5"], isCoreFlag: true, direction: "positive" },

  { id: "P6", block: "speech", text: "Bola so‘zlarni ko‘p takrorlaydi (echolalia) yoki gapni aynan qaytaradi.", bands: ["2-3","4-5","6-7"], isCoreFlag: true, direction: "negative" },
  { id: "P7", block: "speech", text: "Bola suhbatni boshlay oladi (savol beradi yoki o‘zi gap ochadi).", bands: ["4-5","6-7"], direction: "positive" },
  { id: "P8", block: "speech", text: "Bola “men/sen” olmoshlarini tez-tez adashtiradi.", bands: ["2-3","4-5"], direction: "negative" },
  { id: "P9", block: "speech", text: "Bolaning nutqi juda monoton yoki noodatiy ohangda bo‘lishi kuzatiladi.", bands: ["4-5","6-7"], direction: "negative" },
  { id: "P10", block: "speech", text: "Bola qisqa hikoya qilib bera oladi (nima qildi, nimani ko‘rdi).", bands: ["6-7"], direction: "positive" },

  // REPETITIVE (10) – NEGATIVE
  { id: "R1", block: "repetitive", text: "Bola tebranib turish/aylanish/qo‘l silkitish kabi takroriy harakatlarni qiladi.", bands: ["2-3","4-5","6-7"], isCoreFlag: true, direction: "negative" },
  { id: "R2", block: "repetitive", text: "Bola buyumlarni tartib bilan terishni yoqtiradi, buzilsa bezovta bo‘ladi.", bands: ["2-3","4-5","6-7"], direction: "negative" },
  { id: "R3", block: "repetitive", text: "Bola juda bir xil o‘yin bilan uzoq band bo‘lib qoladi.", bands: ["2-3","4-5","6-7"], direction: "negative" },
  { id: "R4", block: "repetitive", text: "Rutina o‘zgarsa juda qiyin qabul qiladi.", bands: ["4-5","6-7"], isCoreFlag: true, direction: "negative" },
  { id: "R5", block: "repetitive", text: "Bola g‘ayrioddiy qiziqishga qattiq berilib ketadi (harf/raqam, ventilyator).", bands: ["4-5","6-7"], direction: "negative" },
  { id: "R6", block: "repetitive", text: "Bola buyumni aylantirish/ochib-yopish bilan ko‘p shug‘ullanadi.", bands: ["2-3","4-5","6-7"], direction: "negative" },
  { id: "R7", block: "repetitive", text: "Bola bir mavzuda qayta-qayta gapiradi yoki savol beradi.", bands: ["4-5","6-7"], direction: "negative" },
  { id: "R8", block: "repetitive", text: "Bola o‘yinchoqni maqsadiga mos o‘ynashdan ko‘ra, detallariga qotib qoladi.", bands: ["2-3","4-5"], direction: "negative" },
  { id: "R9", block: "repetitive", text: "Bola bir xil ovqat/kiyimni qat’iy tanlaydi, yangisini sinash qiyin.", bands: ["4-5","6-7"], direction: "negative" },
  { id: "R10", block: "repetitive", text: "Bola bir narsani juda ko‘p marta qaytaradi (bir xil video/ssenariy).", bands: ["2-3","4-5","6-7"], direction: "negative" },

  // SENSORY (10) – NEGATIVE
  { id: "N1", block: "sensory", text: "Bola baland tovushlardan kuchli bezovta bo‘ladi.", bands: ["2-3","4-5","6-7"], isCoreFlag: true, direction: "negative" },
  { id: "N2", block: "sensory", text: "Bola shovqinda quloqlarini yopadi yoki qochadi.", bands: ["2-3","4-5","6-7"], direction: "negative" },
  { id: "N3", block: "sensory", text: "Kiyim tegishi (etiketka, jun, tor kiyim) bezovta qiladi.", bands: ["2-3","4-5","6-7"], direction: "negative" },
  { id: "N4", block: "sensory", text: "Bola ovqat teksturasiga juda sezgir (ba’zi teksturani yemaydi).", bands: ["2-3","4-5","6-7"], isCoreFlag: true, direction: "negative" },
  { id: "N5", block: "sensory", text: "Bola yorug‘likka sezgir (ko‘zni qisadi yoki qochadi).", bands: ["4-5","6-7"], direction: "negative" },
  { id: "N6", block: "sensory", text: "Soch oldirish / tirnoq olish juda qiyin kechadi.", bands: ["2-3","4-5","6-7"], direction: "negative" },
  { id: "N7", block: "sensory", text: "Bola og‘riqqa noodatiy munosabat bildiradi (juda befarq yoki haddan tashqari).", bands: ["2-3","4-5","6-7"], direction: "negative" },
  { id: "N8", block: "sensory", text: "Bola ma’lum hidlardan kuchli bezovta bo‘ladi.", bands: ["4-5","6-7"], direction: "negative" },
  { id: "N9", block: "sensory", text: "Bola qum/loy/bo‘yoqqa qo‘l tekkizishni yoqtirmaydi.", bands: ["2-3","4-5"], direction: "negative" },
  { id: "N10", block: "sensory", text: "Bola sensor izlash qiladi (sakrash, bosim istash, ishqalash).", bands: ["4-5","6-7"], direction: "negative" },

  // EMOTIONAL (10) – NEGATIVE
  { id: "E1", block: "emotional", text: "O‘zgarish/cheklov bo‘lsa juda kuchli yig‘laydi yoki jahl qiladi (meltdown).", bands: ["2-3","4-5","6-7"], isCoreFlag: true, direction: "negative" },
  { id: "E2", block: "emotional", text: "Bola o‘zini tinchlantirishi qiyin (uzoq vaqt tinchimaydi).", bands: ["2-3","4-5","6-7"], direction: "negative" },
  { id: "E3", block: "emotional", text: "Bola stressda qotib qoladi yoki vaziyatdan “uzilib” qoladi.", bands: ["4-5","6-7"], direction: "negative" },
  { id: "E4", block: "emotional", text: "Bola o‘ziga zarar yetkazishi mumkin (urish, bosh urish, tishlash).", bands: ["2-3","4-5","6-7"], direction: "negative" },
  { id: "E5", block: "emotional", text: "Bola yangi joy yoki yangi odamga moslashishi qiyin.", bands: ["2-3","4-5","6-7"], direction: "negative" },
  { id: "E6", block: "emotional", text: "Bola ko‘p qo‘rquvli yoki xavotir kuchli.", bands: ["4-5","6-7"], direction: "negative" },
  { id: "E7", block: "emotional", text: "Bola uyqu bilan muammoga ega (uxlash qiyin, tez uyg‘onadi).", bands: ["2-3","4-5","6-7"], direction: "negative" },
  { id: "E8", block: "emotional", text: "Bola diqqatni ushlash qiyin (tez chalg‘iydi, juda faol).", bands: ["2-3","4-5","6-7"], direction: "negative" },
  { id: "E9", block: "emotional", text: "Bola qoidaga bo‘ysunish/kelishuvni qiyin qabul qiladi (qarshilik).", bands: ["4-5","6-7"], direction: "negative" },
  { id: "E10", block: "emotional", text: "Jamoat joyida hissiy portlashlar tez-tez bo‘ladi.", bands: ["4-5","6-7"], direction: "negative" },
];

export function ageToBand(ageYears: number): AgeBand {
  if (ageYears <= 3) return "2-3";
  if (ageYears <= 5) return "4-5";
  return "6-7";
}
