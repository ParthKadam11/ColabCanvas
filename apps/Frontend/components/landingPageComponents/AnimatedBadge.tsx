

import React from "react";

const animatedGradient = {
   backgroundImage: "linear-gradient(270deg, #FFD600, #FF0080, #00FFD0, #ffd500)",
   backgroundSize: "600% 600%",
   backgroundPosition: "0% 50%",
  animation: "moveGradient 7s ease-in-out infinite"
};

export default function AnimatedBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className=" inline-flex items-center gap-2 rounded-full px-6 py-2 text-base font-semibold text-zinc-900 dark:text-white shadow-lg border border-white/40 dark:border-zinc-700/40"
      style={animatedGradient}
    >
      {children}
    </span>
  );
}

if (typeof window !== "undefined") {
  const styleId = "animated-badge-gradient-keyframes";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      @keyframes moveGradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);
  }
}
