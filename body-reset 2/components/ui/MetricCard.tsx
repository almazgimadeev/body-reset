import { ReactNode } from "react";
import { Card } from "./Card";

export function MetricCard({
  label,
  value,
  delta,
  icon,
}: {
  label: string;
  value: string;
  delta?: string;
  icon?: ReactNode;
}) {
  return (
    <Card className="flex flex-1 flex-col gap-1">
      <div className="flex items-center gap-2 text-secondary">
        {icon}
        <span className="text-[13px]">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-primary">{value}</span>
        {delta && <span className="text-[13px] text-success">{delta}</span>}
      </div>
    </Card>
  );
}
