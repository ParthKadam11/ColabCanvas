"use client";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";

const HTTP_BACKEND = process.env.NEXT_PUBLIC_HTTP_BACKEND;

type UserProfile = {
  id?: string;
  name?: string;
  email?: string;
  photo?: string;
};

function initials(name?: string) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ProfileInfo() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadProfile = async () => {
      try {
        setProfileLoading(true);
        const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : "";
        const response = await axios.get(`${HTTP_BACKEND}/profile`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (cancelled) return;
        const data = response.data?.user ?? response.data;
        setProfile({
          id: data?.id,
          name: data?.name,
          email: data?.email,
          photo: data?.photo,
        });
        setProfileError(null);
      } catch (e) {
        if (cancelled) return;
        setProfileError("Could not load profile");
        console.log(e);
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    };
    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const photoUrl = profile?.photo ? profile.photo : null;

  return (
    <div className="flex w-full max-w-xs items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 sm:w-auto">
      {profileLoading && <div className="h-10 flex-1 rounded-lg bg-zinc-800" />}
      {!profileLoading && profileError && (
        <p className="text-sm text-red-400">{profileError}</p>
      )}
      {!profileLoading && !profileError && (
        <>
          {photoUrl ? (
            <Image
              alt=""
              className="size-10 rounded-full object-cover"
              height={40}
              width={40}
              src={photoUrl}
              unoptimized
            />
          ) : (
            <div className="grid size-10 place-items-center rounded-full bg-zinc-800 text-xs font-medium text-zinc-200">
              {initials(profile?.name)}
            </div>
          )}
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-zinc-50">
              {profile?.name ?? "User"}
            </div>
            <div className="truncate text-xs text-zinc-400">{profile?.email ?? ""}</div>
          </div>
        </>
      )}
    </div>
  );
}
