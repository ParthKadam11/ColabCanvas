import { ReactNode } from "react";

export function IconButton({icon,onClick,activated}:{
    icon: ReactNode,
    onClick: () => void,
    activated:boolean
})  {
    return <div className={`rounded-3xl border-2 border-black p-2 hover:text-blue-400 ${activated ? "text-blue-400" : "text-black"}`} onClick={onClick}>
    {icon}
    </div>
}