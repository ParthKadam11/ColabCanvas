"use client";
import { Input } from "@repo/ui";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import LoadingSpinner from "@/components/roomComponents/LoadingSpinner";
import Image from "next/image";

const HTTP_BACKEND = process.env.NEXT_PUBLIC_HTTP_BACKEND;

const fieldClass =
  "h-10 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setLoading(true);
    setError(null);
    const email = emailRef.current?.value ?? "";
    const password = passwordRef.current?.value ?? "";
    const name = nameRef.current?.value ?? "";
    const photoFile = photoRef.current?.files?.[0] ?? null;

    try {
      if (isSignin) {
        const response = await axios.post(`${HTTP_BACKEND}/signin`, { email, password });
        const token = response.data?.token;
        if (token) {
          window.localStorage.setItem("token", token);
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
      setError(
        isSignin
          ? "Could not sign in. Check your email and password."
          : "Could not create the account. Try a different email.",
      );
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-zinc-950 px-4 py-10 font-(family-name:--font-geist-sans) text-zinc-100">
      {loading ? (
        <LoadingSpinner message={isSignin ? "Signing in..." : "Creating your account..."} />
      ) : (
        <form
          className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm"
          onSubmit={handleSubmit}
        >
          <p className="text-sm font-medium text-zinc-400">ColabCanvas</p>
          <h1 className="mt-1 text-2xl font-semibold text-balance text-zinc-50">
            {isSignin ? "Sign in" : "Create an account"}
          </h1>
          <p className="mt-2 text-sm text-pretty text-zinc-400">
            {isSignin
              ? "Use the email and password for your account."
              : "Set up a profile, then open a shared board."}
          </p>

          {!isSignin && (
            <label htmlFor="profileImage" className="mt-6 flex cursor-pointer flex-col items-center gap-2">
              <div className="grid size-24 place-items-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-950">
                {profilePreviewUrl ? (
                  <Image
                    src={profilePreviewUrl}
                    alt=""
                    width={96}
                    height={96}
                    className="size-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-xs text-zinc-500">Photo</span>
                )}
              </div>
              <span className="text-xs text-zinc-400">Add a profile photo</span>
              <input
                id="profileImage"
                name="photo"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleProfileChange}
                ref={photoRef}
              />
            </label>
          )}

          <div className="mt-6 flex flex-col gap-4">
            {!isSignin && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-zinc-200">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  className={fieldClass}
                  ref={nameRef}
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-zinc-200">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                className={fieldClass}
                ref={emailRef}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-zinc-200">
                Password
              </label>
              <Input
                className={fieldClass}
                id="password"
                name="password"
                type="password"
                autoComplete={isSignin ? "current-password" : "new-password"}
                placeholder="At least 8 characters"
                ref={passwordRef}
                required
              />
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            className="mt-5 h-10 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {isSignin ? "Sign in" : "Create account"}
          </button>

          <p className="mt-4 text-center text-sm text-zinc-400">
            {isSignin ? (
              <Link href="/signup" className="font-medium text-zinc-200 underline underline-offset-4">
                Create an account
              </Link>
            ) : (
              <Link href="/signin" className="font-medium text-zinc-200 underline underline-offset-4">
                Already have an account? Sign in
              </Link>
            )}
          </p>
        </form>
      )}
    </div>
  );
}

export default AuthPage;
