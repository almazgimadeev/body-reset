import clsx from "clsx";
import { AIChatMessage } from "@/types";

export function AIMessage({ message }: { message: AIChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={clsx("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed",
          isUser ? "bg-primary text-white" : "bg-card border border-border text-primary"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
