import { ReactNode } from "react";

export function IconButton({
  icon,
  onClick,
  activated,
  "aria-label": ariaLabel,
}: {
  icon: ReactNode;
  onClick: () => void;
  activated: boolean;
  "aria-label": string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={activated}
      onClick={onClick}
      className={`grid size-10 place-items-center rounded-xl border ${
        activated
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800"
      }`}
    >
      {icon}
    </button>
  );
}
