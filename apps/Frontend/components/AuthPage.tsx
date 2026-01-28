"use-client"

import { Input } from "@repo/ui"

export function AuthPage({isSignin}:{
    isSignin:boolean
}){
    return <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-black dark:via-zinc-900 dark:to-zinc-800 font-sans">
    <div className="p-10 m-2 rounded-2xl text-black bg-white">
    <div className="p-2">
        <div>Email:</div>
        <Input id="email" type="email" placeholder="name@example.com" className="focus:outline-none border-0"/>
    </div>         
    <div className="p-2">     
        <div>Password:</div>
        <Input className="focus:outline-none border-0" id="password" type="password" placeholder="eg.12345678"/>
    </div>              
    <div className="pt-2"><button className="w-full rounded-2xl p-2 bg-black text-white">{isSignin?"Sign In":"Sign Up"}</button></div>
    </div>
</div>
}