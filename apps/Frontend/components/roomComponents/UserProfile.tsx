import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

type UserProfile = {
  name?: string;
  email?: string;
  avatarUrl?: string;
};

export function ProfileInfo() {
  const [token, setToken] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const userProfile = async (authToken: string) => {
    try {
      setProfileLoading(true);
      const response = await axios.get(`${HTTP_BACKEND}/profile`, {
        headers: { authorization: authToken },
      });
      const data = response.data?.user ?? response.data;
      setProfile({
        name: data?.name,
        email: data?.email,
        avatarUrl: data?.avatarUrl ?? data?.avatar,
      });
      setProfileError(null);
    } catch (e) {
      setProfileError("Failed to load profile");
      console.log(e);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("token");
    setToken(stored);
  }, []);

  useEffect(() => {
    if (!token) return;
    userProfile(token);
  }, [token]);

  return (
    <div className="w-40 h-auto bg-white m-2 rounded p-3">
      {profileLoading && (
        <div className="text-xs text-zinc-600">Loading...</div>
      )}
      {!profileLoading && profileError && (
        <div className="text-xs text-red-600">{profileError}</div>
      )}
      {!profileLoading && !profileError && (
        <div className="flex items-center gap-2">
          {profile?.avatarUrl ? (
            <Image
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover"
              src={profile.avatarUrl}
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-zinc-200" />
          )}
          <div className="min-w-0">
            <div className="text-xs font-semibold text-zinc-900 truncate">
              {profile?.name ?? "User"}
            </div>
            <div className="text-[10px] text-zinc-600 truncate">
              {profile?.email ?? ""}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
