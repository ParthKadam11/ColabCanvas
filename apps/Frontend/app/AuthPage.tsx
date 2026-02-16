"use client";
import { HTTP_BACKEND } from "@/config";
import { Input } from "@repo/ui";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Image from "next/image";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string>("");

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setProfilePreviewUrl("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setProfilePreviewUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = emailRef.current?.value ?? "";
    const password = passwordRef.current?.value ?? "";
    const name = nameRef.current?.value ?? "";
    const photoFile = photoRef.current?.files?.[0] ?? null;

    try {
      if (isSignin) {
        const response = await axios.post(`${HTTP_BACKEND}/signin`, {
          email,
          password,
        });
        const token = response.data?.token;
        if (token) {
          if (typeof window !== "undefined") {
            localStorage.setItem("token", token);
          }
        }
        router.push("/room");
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if (photoFile) {
          formData.append("photo", photoFile);
        }
        await axios.post(`${HTTP_BACKEND}/signup`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        router.push("/signin");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-black dark:via-zinc-900 dark:to-zinc-800 font-sans flex items-center justify-center">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 flex flex-col items-center">
        <form
          className="w-full min-w-md rounded-2xl text-black bg-white shadow-md p-6 flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <div className="w-full text-center mb-2">
            <h2 className="text-2xl font-bold text-black dark:text-black">
              {isSignin ? "Login To Account" : "Create Account"}
            </h2>
          </div>
          {!isSignin && (
            <label htmlFor="profileImage" className="flex flex-col items-center gap-2 cursor-pointer">
              <div className="flex bg-slate-300 w-24 h-24 sm:w-28 sm:h-28 border-2 border-stone-300 rounded-4xl overflow-hidden items-center justify-center">
                {profilePreviewUrl ? (
                  <Image
                    src={profilePreviewUrl}
                    alt="Selected profile"
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="flex h-24 w-24 sm:h-28 sm:w-28 flex-col items-center justify-start pt-3 sm:pt-4">
                    <span className="h-10 w-10 sm:h-13 sm:w-12 rounded-full bg-slate-100 border border-slate-300" />
                    <span className="h-10 w-16 sm:h-13 sm:w-20 rounded-t-full bg-slate-100 border border-slate-300" />
                  </span>
                )}
              </div>
              <div className="flex justify-center text-xs text-zinc-500 pb-2">Select Profile Picture</div>
              <input
                id="profileImage"
                name="photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileChange}
                ref={photoRef}
              />
            </label>
          )}

          {!isSignin && (
            <div className="mb-3 pl-2">
              <div className="text-sm font-semibold">Name:</div>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="john doe"
                className="focus:outline-none border-0"
                ref={nameRef}
              />
            </div>
          )}

          <div className="mb-3 pl-2">
            <div className="text-sm font-semibold">Email:</div>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              className="focus:outline-none border-0"
              ref={emailRef}
            />
          </div>

          <div className="mb-3 pl-2">
            <div className="text-sm font-semibold mb-1">Password:</div>
            <Input
              className="focus:outline-none border-0"
              id="password"
              name="password"
              type="password"
              autoComplete={isSignin ? "current-password" : "new-password"}
              placeholder="eg.12345678"
              ref={passwordRef}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl p-2 bg-blue-600 text-white font-bold shadow-md mt-2 hover:scale-105 transition-transform"
          >
            {isSignin ? "Sign In" : "Sign Up"}
          </button>
          <div className="w-full text-center ">
            {isSignin ? (
              <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => router.push('/signup')}>
                New to ColabCanvas? 
              </span>
            ) : (
              <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => router.push('/signin')}>
                Already have an account?
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
