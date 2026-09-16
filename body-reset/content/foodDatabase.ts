export interface FoodDbItem {
  id: string;
  name: string;
  kcal: number; // per 100g, prepared/cooked state (matches how people usually log food)
  protein: number;
  fat: number;
  carbs: number;
}

// A working set of common foods (values are standard public nutrition
// reference figures, cooked/prepared state unless noted). Not exhaustive —
// extend freely, the food log UI does a simple name search against this
// list plus whatever the user has logged before.
export const FOOD_DB: FoodDbItem[] = [
  { id: "buckwheat", name: "Гречка варёная", kcal: 110, protein: 4, fat: 1.1, carbs: 21 },
  { id: "rice_white", name: "Рис белый варёный", kcal: 130, protein: 2.4, fat: 0.3, carbs: 28 },
  { id: "rice_brown", name: "Рис бурый варёный", kcal: 111, protein: 2.6, fat: 0.9, carbs: 23 },
  { id: "potato_boiled", name: "Картофель варёный", kcal: 82, protein: 2, fat: 0.1, carbs: 17 },
  { id: "potato_baked", name: "Картофель запечённый", kcal: 93, protein: 2.5, fat: 0.1, carbs: 21 },
  { id: "bulgur", name: "Булгур варёный", kcal: 83, protein: 3.1, fat: 0.2, carbs: 18.6 },
  { id: "oats", name: "Овсянка на воде", kcal: 68, protein: 2.4, fat: 1.4, carbs: 12 },
  { id: "pasta", name: "Паста варёная", kcal: 131, protein: 5, fat: 1.1, carbs: 25 },
  { id: "lentils", name: "Чечевица варёная", kcal: 116, protein: 9, fat: 0.4, carbs: 20 },
  { id: "chicken_breast", name: "Куриная грудка", kcal: 165, protein: 31, fat: 3.6, carbs: 0 },
  { id: "chicken_thigh", name: "Куриное бедро без кожи", kcal: 209, protein: 26, fat: 10.9, carbs: 0 },
  { id: "turkey", name: "Индейка филе", kcal: 157, protein: 29, fat: 3.6, carbs: 0 },
  { id: "beef", name: "Говядина нежирная", kcal: 217, protein: 26, fat: 12, carbs: 0 },
  { id: "salmon", name: "Лосось запечённый", kcal: 208, protein: 20, fat: 13, carbs: 0 },
  { id: "tuna_canned", name: "Тунец консервированный", kcal: 116, protein: 26, fat: 0.8, carbs: 0 },
  { id: "white_fish", name: "Белая рыба (треска)", kcal: 105, protein: 23, fat: 0.9, carbs: 0 },
  { id: "egg", name: "Яйцо варёное", kcal: 155, protein: 13, fat: 11, carbs: 1.1 },
  { id: "cottage_cheese_5", name: "Творог 5%", kcal: 121, protein: 17, fat: 5, carbs: 1.8 },
  { id: "cottage_cheese_0", name: "Творог обезжиренный", kcal: 71, protein: 16, fat: 0.6, carbs: 1.5 },
  { id: "yogurt", name: "Йогурт натуральный", kcal: 66, protein: 3.5, fat: 3.2, carbs: 4.7 },
  { id: "greek_yogurt", name: "Греческий йогурт", kcal: 97, protein: 9, fat: 5, carbs: 4 },
  { id: "cheese", name: "Сыр твёрдый", kcal: 350, protein: 25, fat: 27, carbs: 1.5 },
  { id: "vegetables_mixed", name: "Овощи (смешанные)", kcal: 35, protein: 2, fat: 0.3, carbs: 6 },
  { id: "salad_greens", name: "Листовой салат", kcal: 15, protein: 1.4, fat: 0.2, carbs: 2.9 },
  { id: "tomato", name: "Помидор", kcal: 18, protein: 0.9, fat: 0.2, carbs: 3.9 },
  { id: "cucumber", name: "Огурец", kcal: 15, protein: 0.7, fat: 0.1, carbs: 3.6 },
  { id: "banana", name: "Банан", kcal: 89, protein: 1.1, fat: 0.3, carbs: 23 },
  { id: "apple", name: "Яблоко", kcal: 52, protein: 0.3, fat: 0.2, carbs: 14 },
  { id: "berries", name: "Ягоды", kcal: 50, protein: 0.8, fat: 0.4, carbs: 12 },
  { id: "nuts", name: "Орехи", kcal: 600, protein: 18, fat: 52, carbs: 20 },
  { id: "wholegrain_bread", name: "Хлеб цельнозерновой", kcal: 250, protein: 9, fat: 3.5, carbs: 45 },
  { id: "olive_oil", name: "Масло оливковое", kcal: 884, protein: 0, fat: 100, carbs: 0 },
];

export function searchFoodDb(query: string): FoodDbItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return FOOD_DB.filter((f) => f.name.toLowerCase().includes(q)).slice(0, 8);
}

export function getFoodById(id: string): FoodDbItem | undefined {
  return FOOD_DB.find((f) => f.id === id);
}
