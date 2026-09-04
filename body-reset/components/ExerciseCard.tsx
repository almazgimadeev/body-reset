import { Card } from "./ui/Card";
import { Exercise } from "@/types";

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
    </Card>
  );
}
