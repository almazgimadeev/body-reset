import { MealItem } from "@/types";

// Meal codes match the schedule in content/days.ts (B = breakfast, L = lunch,
// D = dinner, S = snack). Portions use the "visual portion guide" from the
// nutrition guide (palm / fist), never calorie numbers — see PlateMethod component.

export const MEALS: Record<string, MealItem> = {
  B1: {
    code: "B1",
    type: "breakfast",
    title: "Овсянка с ягодами и йогуртом",
    ingredients: ["овсяные хлопья", "молоко или растительный напиток", "ягоды (свежие или замороженные)", "натуральный йогурт"],
    portionHint: "крупы — размер кулака, йогурт — половина ладони, ягод — сколько хочется",
    instructions: "Сварите овсянку на молоке или воде 5–7 минут. Выложите в тарелку, добавьте ложку йогурта и ягоды сверху.",
  },
  B2: {
    code: "B2",
    type: "breakfast",
    title: "2 яйца, цельнозерновой хлеб и овощи",
    ingredients: ["яйца", "цельнозерновой хлеб", "свежие овощи (огурец, помидор, зелень)"],
    portionHint: "белок — размер ладони (2 яйца), хлеб — 1–2 кусочка, овощей — 1–2 кулака",
    instructions: "Отварите яйца или сделайте омлет. Нарежьте овощи. Подавайте с тостом из цельнозернового хлеба.",
  },
  B3: {
    code: "B3",
    type: "breakfast",
    title: "Творог с ягодами и орехами",
    ingredients: ["творог", "ягоды", "орехи (миндаль, грецкий)"],
    portionHint: "творог — размер ладони, орехов — небольшая горсть",
    instructions: "Выложите творог в миску, добавьте ягоды и присыпьте измельчёнными орехами.",
  },
  B4: {
    code: "B4",
    type: "breakfast",
    title: "Греческий йогурт с ягодами и овсянкой",
    ingredients: ["греческий йогурт", "ягоды", "овсяные хлопья или гранола без сахара"],
    portionHint: "йогурт — размер ладони, овсянки — 2–3 ст. ложки",
    instructions: "Смешайте йогурт с сухой овсянкой, дайте постоять 5 минут, добавьте ягоды перед подачей.",
  },
  B5: {
    code: "B5",
    type: "breakfast",
    title: "Омлет с овощами и хлебом",
    ingredients: ["яйца", "овощи по вкусу (перец, шпинат, помидор)", "цельнозерновой хлеб"],
    portionHint: "яиц — 2 шт., овощей — 1 кулак, хлеб — 1 кусочек",
    instructions: "Взбейте яйца, добавьте нарезанные овощи, готовьте на среднем огне 4–5 минут под крышкой.",
  },

  L1: {
    code: "L1",
    type: "lunch",
    title: "Курица с рисом и овощами",
    ingredients: ["куриное филе или бедро", "рис", "сезонные овощи"],
    portionHint: "белок — ладонь, рис — кулак, овощи — 1–2 кулака",
    instructions: "Отварите рис. Обжарьте или запеките курицу с приправами. Овощи потушите или подайте свежими.",
  },
  L2: {
    code: "L2",
    type: "lunch",
    title: "Индейка с гречкой и овощами",
    ingredients: ["филе индейки", "гречка", "овощи"],
    portionHint: "белок — ладонь, гречка — кулак, овощи — 1–2 кулака",
    instructions: "Отварите гречку. Индейку обжарьте на сковороде или запеките. Подавайте с овощами.",
  },
  L3: {
    code: "L3",
    type: "lunch",
    title: "Лосось с картофелем и салатом",
    ingredients: ["филе лосося", "картофель", "листовой салат", "оливковое масло"],
    portionHint: "рыба — ладонь, картофель — кулак, салата — 1–2 кулака",
    instructions: "Запеките лосось в духовке 15 минут при 200°C. Отварите или запеките картофель. Заправьте салат маслом.",
  },
  L4: {
    code: "L4",
    type: "lunch",
    title: "Говядина с булгуром и овощами",
    ingredients: ["говядина (нежирная часть)", "булгур", "овощи"],
    portionHint: "белок — ладонь, булгур — кулак, овощи — 1–2 кулака",
    instructions: "Отварите булгур. Говядину нарежьте и обжарьте до готовности. Подавайте с тушёными овощами.",
  },
  L5: {
    code: "L5",
    type: "lunch",
    title: "Паста с курицей и овощами",
    ingredients: ["паста из твёрдых сортов пшеницы", "куриное филе", "овощи", "немного оливкового масла"],
    portionHint: "паста — кулак, курица — ладонь, овощи — 1 кулак",
    instructions: "Отварите пасту. Курицу обжарьте кубиками, добавьте овощи, смешайте всё вместе.",
  },
  L6: {
    code: "L6",
    type: "lunch",
    title: "Тунец с картофелем и салатом",
    ingredients: ["тунец (консервированный в собственном соку или стейк)", "картофель", "листовой салат"],
    portionHint: "тунец — ладонь, картофель — кулак, салата — 1–2 кулака",
    instructions: "Отварите картофель. Смешайте тунец с салатом, заправьте маслом и лимоном.",
  },
  L7: {
    code: "L7",
    type: "lunch",
    title: "Чечевица с рисом и овощами",
    ingredients: ["чечевица", "рис", "овощи"],
    portionHint: "чечевица — кулак, рис — половина кулака, овощи — 1–2 кулака",
    instructions: "Отварите чечевицу и рис отдельно. Подавайте вместе со свежими или тушёными овощами.",
  },

  D1: {
    code: "D1",
    type: "dinner",
    title: "Курица с овощами",
    ingredients: ["куриное филе", "овощи на выбор"],
    portionHint: "белок — ладонь, овощи — 1–2 кулака",
    instructions: "Запеките или обжарьте курицу, подавайте с тушёными или свежими овощами.",
  },
  D2: {
    code: "D2",
    type: "dinner",
    title: "Рыба с овощами и картофелем",
    ingredients: ["белая рыба", "овощи", "картофель"],
    portionHint: "рыба — ладонь, картофель — половина кулака, овощи — 1–2 кулака",
    instructions: "Запеките рыбу с лимоном 15–20 минут. Подавайте с отварным картофелем и овощами.",
  },
  D3: {
    code: "D3",
    type: "dinner",
    title: "Индейка с салатом и крупой",
    ingredients: ["филе индейки", "листовой салат", "крупа на выбор (небольшая порция)"],
    portionHint: "белок — ладонь, крупы — половина кулака, салата — 1–2 кулака",
    instructions: "Обжарьте или отварите индейку, смешайте с салатом и небольшой порцией крупы.",
  },
  D4: {
    code: "D4",
    type: "dinner",
    title: "Омлет с овощами и хлебом",
    ingredients: ["яйца", "овощи", "цельнозерновой хлеб"],
    portionHint: "яиц — 2 шт., хлеб — 1 кусочек, овощей — 1 кулак",
    instructions: "Приготовьте омлет с овощами, подавайте с ломтиком хлеба.",
  },
  D5: {
    code: "D5",
    type: "dinner",
    title: "Творог с ягодами и орехами",
    ingredients: ["творог", "ягоды", "орехи"],
    portionHint: "творог — ладонь, орехов — небольшая горсть",
    instructions: "Смешайте творог с ягодами, добавьте немного орехов сверху.",
  },
  D6: {
    code: "D6",
    type: "dinner",
    title: "Говядина с овощами",
    ingredients: ["говядина (нежирная часть)", "овощи"],
    portionHint: "белок — ладонь, овощи — 1–2 кулака",
    instructions: "Обжарьте или запеките говядину, подавайте с большим количеством овощей.",
  },

  S1: {
    code: "S1",
    type: "snack",
    title: "Яблоко с йогуртом",
    ingredients: ["яблоко", "натуральный йогурт"],
    portionHint: "1 фрукт + половина ладони йогурта",
    instructions: "Нарежьте яблоко, подавайте с йогуртом для перекуса.",
  },
  S2: {
    code: "S2",
    type: "snack",
    title: "Банан с орехами",
    ingredients: ["банан", "орехи"],
    portionHint: "1 фрукт + небольшая горсть орехов",
    instructions: "Готовый перекус без приготовления — банан и горсть орехов.",
  },
  S3: {
    code: "S3",
    type: "snack",
    title: "Творог с ягодами",
    ingredients: ["творог", "ягоды"],
    portionHint: "половина ладони творога + горсть ягод",
    instructions: "Смешайте творог с ягодами.",
  },
  S4: {
    code: "S4",
    type: "snack",
    title: "Йогурт с фруктом",
    ingredients: ["натуральный йогурт", "фрукт на выбор"],
    portionHint: "половина ладони йогурта + 1 фрукт",
    instructions: "Нарежьте фрукт и смешайте с йогуртом.",
  },
  S5: {
    code: "S5",
    type: "snack",
    title: "Фрукт с сыром",
    ingredients: ["фрукт на выбор", "лёгкий сыр"],
    portionHint: "1 фрукт + 2–3 небольших кусочка сыра",
    instructions: "Нарежьте фрукт и сыр, готово к перекусу.",
  },
};

export function getMeal(code: string): MealItem {
  const meal = MEALS[code];
  if (!meal) throw new Error(`Unknown meal code: ${code}`);
  return meal;
}

// Section 19 — "СПИСОК ПОКУПОК": groups every ingredient across a set of
// meal codes into simple categories for a shopping-list view.
const CATEGORY_KEYWORDS: { category: string; keywords: string[] }[] = [
  {
    category: "Белки",
    keywords: ["курин", "индей", "лосос", "говядин", "тунец", "рыба", "яйц", "чечевиц"],
  },
  {
    category: "Молочное",
    keywords: ["творог", "йогурт", "сыр"],
  },
  {
    category: "Углеводы",
    keywords: ["рис", "гречк", "картофел", "булгур", "паст", "овсян", "хлеб", "гранол"],
  },
  {
    category: "Овощи и зелень",
    keywords: ["овощ", "салат", "перец", "шпинат", "помидор", "огурец"],
  },
  {
    category: "Фрукты и ягоды",
    keywords: ["ягод", "яблок", "банан", "фрукт", "лимон"],
  },
  {
    category: "Другое",
    keywords: ["орех", "масло", "молоко"],
  },
];

function categorize(ingredient: string): string {
  const lower = ingredient.toLowerCase();
  const found = CATEGORY_KEYWORDS.find((c) => c.keywords.some((k) => lower.includes(k)));
  return found?.category ?? "Другое";
}

export function buildShoppingList(mealCodes: string[]): Record<string, string[]> {
  const list: Record<string, Set<string>> = {};
  const uniqueCodes = Array.from(new Set(mealCodes));
  for (const code of uniqueCodes) {
    const meal = MEALS[code];
    if (!meal) continue;
    for (const ingredient of meal.ingredients) {
      const category = categorize(ingredient);
      if (!list[category]) list[category] = new Set();
      list[category].add(ingredient);
    }
  }
  const result: Record<string, string[]> = {};
  for (const [category, items] of Object.entries(list)) {
    result[category] = Array.from(items).sort();
  }
  return result;
}

// Simple substitution map — section 17 of the spec ("ЗАМЕНЫ").
// Keyed by a loose ingredient tag rather than by meal code, so the UI can
// suggest swaps regardless of which recipe an ingredient appears in.
export const SUBSTITUTIONS: Record<string, string[]> = {
  "куриное филе": ["индейка", "рыба", "нежирная говядина", "тофу", "яйца"],
  "говядина": ["индейка", "курица", "рыба", "чечевица"],
  "рис": ["гречка", "булгур", "картофель", "паста", "овсянка"],
  "гречка": ["рис", "булгур", "киноа"],
  "творог": ["греческий йогурт", "яйца"],
  "рыба": ["курица", "индейка", "тунец консервированный"],
};
