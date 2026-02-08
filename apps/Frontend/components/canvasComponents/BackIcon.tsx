import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";


export function BackIcon(){
  const router = useRouter();

return <div className="group fixed top-0 left-0 m-4 p-2 bg-white text-slate-900 rounded-full flex items-center gap-2 hover:text-blue-400" onClick={() => router.push("/room")}>
        <ArrowLeft className="h-6 w-6"/>
        <span className="text-sm leading-none hidden group-hover:block transition-transform duration-800">Back</span>
      </div>
}