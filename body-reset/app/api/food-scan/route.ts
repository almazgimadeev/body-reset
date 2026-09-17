import { NextRequest, NextResponse } from "next/server";
import { mockDetectFood, detectFoodFromImage } from "@/lib/ai/foodScan";

export const runtime = "nodejs";

const MAX_DATA_URL_LENGTH = 8_000_000; // ~6MB image, base64-inflated

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const image = typeof body?.image === "string" ? body.image : "";

  if (!image.startsWith("data:image/")) {
    return NextResponse.json({ error: "invalid_image" }, { status: 400 });
  }
  if (image.length > MAX_DATA_URL_LENGTH) {
    return NextResponse.json({ error: "image_too_large" }, { status: 413 });
  }

  const apiKey = process.env.AI_API_KEY;

  try {
    const items = apiKey ? await detectFoodFromImage(image, apiKey) : mockDetectFood();

    if (!items.length) {
      return NextResponse.json({ error: "food_not_detected" }, { status: 422 });
    }

    return NextResponse.json({ items, mode: apiKey ? "live" : "mock" });
  } catch (error) {
    console.error("Food scan failed", error);
    // If the real provider fails mid-flight, fall back to the mock result
    // rather than leaving the user with a dead end.
    return NextResponse.json({ items: mockDetectFood(), mode: "mock_fallback" });
  }
}
