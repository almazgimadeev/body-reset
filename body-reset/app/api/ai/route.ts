import { NextRequest, NextResponse } from "next/server";
import { getMockCoachResponse, getRealCoachResponse, CoachContext } from "@/lib/ai/coach";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const ctx: CoachContext = {
    firstName: body.firstName || "",
    dayNumber: body.dayNumber ?? 1,
    weekNumber: body.weekNumber ?? 1,
    goal: body.goal || "выстроить систему питания и тренировок",
    knownDifficulties: body.knownDifficulties ?? [],
    todayNutritionDone: !!body.todayNutritionDone,
    todayWorkoutDone: !!body.todayWorkoutDone,
  };

  const apiKey = process.env.AI_API_KEY;

  try {
    const reply = apiKey
      ? await getRealCoachResponse(body.message, ctx, apiKey)
      : getMockCoachResponse(body.message, ctx);
    return NextResponse.json({ reply, mode: apiKey ? "live" : "mock" });
  } catch (err) {
    // Fall back to the mock coach if the real provider errors out, so the
    // chat never just dies mid-conversation.
    return NextResponse.json({ reply: getMockCoachResponse(body.message, ctx), mode: "mock_fallback" });
  }
}
