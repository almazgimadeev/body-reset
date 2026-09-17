import { FOOD_DB, FoodDbItem } from "@/content/foodDatabase";
import { DetectedFoodItem } from "@/types";

// System prompt adapted from the product brief (section 40): identify
// visible foods, estimate portions, never claim exact weight, return
// structured JSON only. Kept in English — vision models are generally most
// reliable at following structured-output instructions in English, even
// though the app's UI and the model's `notes` are Russian.
export const FOOD_SCAN_SYSTEM_PROMPT = `You are a food recognition assistant for a nutrition app.

Analyze the uploaded photo and identify visible food items.

For each item:
- identify the most likely food (a short, common name)
- estimate portion size in grams — this is always an ESTIMATE, never claim to know the exact weight
- provide a confidence level: "high", "medium", or "low"
- do not invent hidden/non-visible ingredients
- if you cannot identify any food in the image, return an empty items array

Respond with ONLY a JSON object, no other text, in this exact shape:
{"items": [{"name": "grilled chicken breast", "estimated_grams": 150, "confidence": "high", "notes": "estimated from visible portion"}]}

Write "name" and "notes" in Russian. If the image is too blurry or unclear to identify food, return {"items": [], "notes": "blurry"}. If there appear to be too many different items to identify reliably, return your best 1-3 guesses only.`;

interface RawDetectedItem {
  name: string;
  estimated_grams: number;
  confidence: "high" | "medium" | "low";
  notes?: string;
}

// Generic fallback macros (per 100g) for a food we couldn't match in our
// small nutrition database — clearly flagged to the user as a rough guess.
const FALLBACK_PER_100G = { kcal: 180, protein: 8, fat: 7, carbs: 20 };

function matchFoodDb(name: string): FoodDbItem | null {
  const lower = name.toLowerCase();
  // Try direct substring match either direction first.
  const direct = FOOD_DB.find((f) => f.name.toLowerCase().includes(lower) || lower.includes(f.name.toLowerCase()));
  if (direct) return direct;

  // Fall back to loose word-overlap match (e.g. "жареная курица" ~ "куриная грудка").
  const words = lower.split(/\s+/).filter((w) => w.length > 3);
  let best: { item: FoodDbItem; score: number } | null = null;
  for (const item of FOOD_DB) {
    const itemLower = item.name.toLowerCase();
    const score = words.filter((w) => itemLower.includes(w)).length;
    if (score > 0 && (!best || score > best.score)) best = { item, score };
  }
  return best?.item ?? null;
}

function enrichDetectedItems(raw: RawDetectedItem[]): DetectedFoodItem[] {
  return raw.map((r) => {
    const matched = matchFoodDb(r.name);
    return {
      name: r.name,
      estimatedGrams: Math.round(r.estimated_grams),
      confidence: r.confidence,
      notes: matched ? r.notes : `${r.notes ? r.notes + " — " : ""}нет точных данных в базе, грубая оценка`,
      matchedFoodId: matched?.id ?? null,
      kcalPer100g: matched?.kcal ?? FALLBACK_PER_100G.kcal,
      proteinPer100g: matched?.protein ?? FALLBACK_PER_100G.protein,
      fatPer100g: matched?.fat ?? FALLBACK_PER_100G.fat,
      carbsPer100g: matched?.carbs ?? FALLBACK_PER_100G.carbs,
    };
  });
}

// --- Mock mode (no AI_API_KEY configured) -----------------------------
// Returns a plausible, clearly-labeled demo result so the whole Food Scan
// flow — including editing portions and confirming — is fully clickable
// without any external key.
export function mockDetectFood(): DetectedFoodItem[] {
  return enrichDetectedItems([
    { name: "Куриная грудка", estimated_grams: 150, confidence: "high", notes: "демо-режим — реальный ИИ не подключён" },
    { name: "Рис белый варёный", estimated_grams: 150, confidence: "medium", notes: "демо-режим — реальный ИИ не подключён" },
    { name: "Овощи (смешанные)", estimated_grams: 100, confidence: "medium", notes: "демо-режим — реальный ИИ не подключён" },
  ]);
}

// --- Real mode (vision-capable model) -----------------------------------
export async function detectFoodFromImage(base64DataUrl: string, apiKey: string): Promise<DetectedFoodItem[]> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: FOOD_SCAN_SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: "Identify the food in this photo." },
            { type: "image_url", image_url: { url: base64DataUrl } },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) throw new Error(`Vision provider error: ${res.status}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content);
  const items: RawDetectedItem[] = Array.isArray(parsed.items) ? parsed.items : [];
  return enrichDetectedItems(items);
}
