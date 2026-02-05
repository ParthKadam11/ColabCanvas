import { ReactNode } from "react";

export function IconButton({icon,onClick,activated}:{
    icon: ReactNode,
    onClick: () => void,
    activated:boolean
})  {
    return <div className={`rounded-3xl border-2 border-white p-2 ${activated ? "text-red-400" : "text-white"}`} onClick={onClick}>
        {icon}
    </div>
}