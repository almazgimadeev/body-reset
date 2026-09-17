import { Card } from "./ui/Card";
import { Exercise } from "@/types";
import { PlayCircle } from "lucide-react";

// We link out to a YouTube search rather than embedding one hand-picked video
// per exercise: with ~20+ distinct exercises across 6 workouts, a search
// link is something we can guarantee is accurate and always resolves,
// instead of risking a dead/unrelated embedded video. If you later want
// specific curated videos embedded in-app, add a `videoUrl` field to
// Exercise (content/workouts.ts) and swap the <a> below for an <iframe>.
function videoSearchUrl(exerciseName: string): string {
  const query = `${exerciseName} техника выполнения`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export function ExerciseCard({ exercise, index }: { exercise: Exercise; index: number }) {
  return (
    <Card className="mb-2.5 flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg text-[13px] font-medium text-secondary">
        {index}
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-medium text-primary">{exercise.name}</p>
        <p className="text-[12.5px] text-secondary">
          {exercise.sets} × {exercise.reps} {exercise.rest !== "—" ? `· отдых ${exercise.rest}` : ""}
        </p>
      </div>
      <a
        href={videoSearchUrl(exercise.name)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-bg px-2.5 py-1.5 text-[11px] font-medium text-primary active:opacity-70"
        aria-label={`Видео техники: ${exercise.name}`}
      >
        <PlayCircle size={14} />
        Видео
      </a>
    </Card>
  );
}
