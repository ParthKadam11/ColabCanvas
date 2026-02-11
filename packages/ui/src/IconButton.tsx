import { ReactNode } from "react";

export function IconButton({icon,onClick,activated}:{
    icon: ReactNode,
    onClick: () => void,
    activated:boolean
})  {
    const activeStyles = activated
        ? { color: "#3b82f6", borderColor: "#3b82f6", backgroundColor: "#eff6ff" }
        : {}

    return <div
        className={`rounded-3xl border-2 p-2 cursor-pointer transition-colors ${activated ? "" : "text-black border-black hover:text-blue-400"}`}
        style={activeStyles}
        onClick={onClick}
        aria-pressed={activated}
    >
    {icon}
    </div>
}