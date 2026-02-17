"use client"
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { HTTP_BACKEND } from "@/config";

type UserProfile = {
  id?: string;
  name?: string;
  email?: string;
  photo?: string;
};

type ProfileInfoProps = {
  token: string | null;
};

export function ProfileInfo({ token }: ProfileInfoProps) {

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const loadProfile = async () => {
      try {
        setProfileLoading(true);
        const response = await axios.get(`${HTTP_BACKEND}/profile`, {
          headers: { authorization: token },
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
        setProfileError("Failed to load profile");
        console.log(e);
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    };

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const photoUrl = profile?.photo
    ? `${HTTP_BACKEND}/uploads/${profile.photo}`
    : null;

  return (
    <div className="w-full max-w-xs sm:max-w-sm h-auto bg-white m-2 sm:m-3 rounded-xl p-3 sm:p-4 flex flex-col justify-center">
      {profileLoading && (
        <div className="text-xs text-zinc-600">Loading...</div>
      )}
      {!profileLoading && profileError && (
        <div className="text-xs text-red-600">{profileError}</div>
      )}
      {!profileLoading && !profileError && (
        <div className="flex items-center gap-2 sm:gap-3">
          {photoUrl ? (
            <Image
              alt="Profile"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl object-cover"
              height={40}
              width={40}
              src={photoUrl}
              unoptimized
            />
          ) : (
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-zinc-200" />
          )}
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-semibold text-zinc-900 truncate">
              {profile?.name ?? "User"}
            </div>
            <div className="text-[10px] sm:text-xs text-zinc-600 truncate">
              {profile?.email ?? ""}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
