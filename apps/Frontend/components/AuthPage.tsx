"use client"
import { HTTP_BACKEND } from "@/config"
import { Input } from "@repo/ui"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useRef } from "react"

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = emailRef.current?.value ?? ""
    const password = passwordRef.current?.value ?? ""
    const name = nameRef.current?.value ?? ""

    try {
      if (isSignin) {
        const response = await axios.post(`${HTTP_BACKEND}/signin`, { email, password })
        const token = response.data?.token
        if (token) {
          localStorage.setItem("token", token)
        }
        router.push("/room")
      } else {
        await axios.post(`${HTTP_BACKEND}/signup`, { email, password, name })
        router.push("/signin")
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-black dark:via-zinc-900 dark:to-zinc-800 font-sans">
      <form className="p-10 m-2 rounded-2xl text-black bg-white" onSubmit={handleSubmit}>
        <div className="p-2">
          <div>Email:</div>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="name@example.com" className="focus:outline-none border-0" ref={emailRef}/>
        </div>

        {!isSignin && (
          <div className="p-2">
            <div>Name:</div>
            <Input id="name" name="name" type="text" autoComplete="name" placeholder="john doe" className="focus:outline-none border-0" ref={nameRef}/>
          </div>
        )}

        <div className="p-2">
          <div>Password:</div>
          <Input className="focus:outline-none border-0" id="password" name="password" type="password" autoComplete={isSignin ? "current-password" : "new-password"} placeholder="eg.12345678" ref={passwordRef}
          />
        </div>

        <div className="pt-2">
          <button type="submit" className="w-full rounded-2xl p-2 bg-black text-white">
            {isSignin ? "Sign In" : "Sign Up"}
          </button>
        </div>
        
      </form>
    </div>
  )
}