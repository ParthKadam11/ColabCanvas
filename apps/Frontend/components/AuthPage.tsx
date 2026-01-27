"use-client"

import { Input } from "@repo/ui"

export function AuthPage({isSignin}:{
    isSignin:boolean
}){
    return <div className="w-screen h-screen flex justify-center items-center">
    <div className="p-10 m-2 rounded-2xl bg-white text-black">
    <div className="p-2">
        <div>Email:</div>
        <Input className="focus:outline-none" id="email" type="email" placeholder="name@example.com"/>
    </div>         
    <div className="p-2">     
        <div>Password:</div>
        <Input className="focus:outline-none" id="password" type="password" placeholder="eg.12345678"/>
    </div>              
    <div className="pt-2"><button className="w-full rounded-2xl p-2 bg-black text-white">{isSignin?"Sign In":"Sign Up"}</button></div>
    </div>
</div>
}