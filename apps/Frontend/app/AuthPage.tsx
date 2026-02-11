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
    <div className="min-h-screen w-screen flex justify-center items-center px-4 py-6 bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-black dark:via-zinc-900 dark:to-zinc-800 font-sans">
      <form
        className="w-full max-w-md sm:max-w-lg p-6 sm:p-10 m-2 rounded-2xl text-black bg-white"
        onSubmit={handleSubmit}
        >
        <div className="flex justify-center p-2">
          {!isSignin && (
            <label
              htmlFor="profileImage"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
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
                    <span className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-slate-100 border border-slate-300" />
                    <span className="h-10 w-16 sm:h-11 sm:w-20 rounded-t-full bg-slate-100 border border-slate-300" />
                  </span>
                )}
              </div>
              <div className="flex justify-center">{"Profile Picture"}</div>
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
        </div>

        {!isSignin && (
          <div className="p-2">
            <div>Name:</div>
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

        <div className="p-2">
          <div>Email:</div>
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

        <div className="p-2">
          <div>Password:</div>
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

        <div className="pt-4">
          <button
            type="submit"
            className="w-full rounded-2xl p-2 bg-black text-white"
          >
            {isSignin ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
}
