export interface QuizData {
  stage1: { number: string };
  stage2: {
    word: string;
    wordColorHex: string;
    answer: string;
    options: string[];
  };
  stage3: {
    payAmount: number;
    price: number;
    itemName: string;
    answer: number;
    options: number[];
  };
}

const COLOR_MAP: Record<string, string> = {
  빨강: '#E53E3E',
  파랑: '#3182CE',
  노랑: '#F6C90E',
  초록: '#38A169',
  보라: '#805AD5',
};
const COLOR_KEYS = Object.keys(COLOR_MAP);

const ITEMS = [
  '사탕', '과자', '음료수', '우유', '빵', '라면', '아이스크림', '커피',
  '주스', '쿠키', '요구르트', '귤', '바나나', '사과', '달걀',
];

function seededRNG(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(1664525, s) + 1013904223;
    return (s >>> 0) / 4294967296;
  };
}

function getDateSeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateQuizData(seed?: number): QuizData {
  const rng = seededRNG(seed ?? Math.floor(Math.random() * 0xffffffff));

  // Stage 1: 5~6자리 숫자
  const digitCount = rng() < 0.5 ? 5 : 6;
  let num = String(Math.floor(rng() * 9) + 1); // 첫 자리 1~9
  for (let i = 1; i < digitCount; i++) {
    num += String(Math.floor(rng() * 10));
  }

  // Stage 2: 스트룹 테스트 - 글자 내용 ≠ 글자 색상
  const wordIdx = Math.floor(rng() * COLOR_KEYS.length);
  let colorIdx = Math.floor(rng() * (COLOR_KEYS.length - 1));
  if (colorIdx >= wordIdx) colorIdx++;
  const word = COLOR_KEYS[wordIdx];
  const answerKey = COLOR_KEYS[colorIdx];

  const optionSet = new Set<string>([answerKey]);
  while (optionSet.size < 4) {
    optionSet.add(COLOR_KEYS[Math.floor(rng() * COLOR_KEYS.length)]);
  }
  const options = shuffle([...optionSet], rng);

  // Stage 3: 잔돈 계산
  const payAmount = rng() < 0.5 ? 5000 : 10000;
  const maxUnits = payAmount / 100 - 1; // 예: 49 or 99
  const priceUnits = Math.floor(rng() * (maxUnits - 4)) + 5; // 최소 500원
  const price = priceUnits * 100;
  const answer = payAmount - price;
  const itemName = ITEMS[Math.floor(rng() * ITEMS.length)];

  const changeSet = new Set<number>([answer]);
  const candidates = [
    answer + 500, answer - 500, answer + 1000, answer - 1000,
    answer + 200, answer - 200, answer + 300, answer - 300,
  ];
  for (const c of candidates) {
    if (changeSet.size >= 4) break;
    if (c > 0 && c < payAmount && c !== answer) changeSet.add(c);
  }
  while (changeSet.size < 4) {
    const c = (Math.floor(rng() * (maxUnits - 1)) + 1) * 100;
    if (!changeSet.has(c)) changeSet.add(c);
  }

  return {
    stage1: { number: num },
    stage2: {
      word,
      wordColorHex: COLOR_MAP[answerKey],
      answer: answerKey,
      options,
    },
    stage3: {
      payAmount,
      price,
      itemName,
      answer,
      options: shuffle([...changeSet], rng),
    },
  };
}
