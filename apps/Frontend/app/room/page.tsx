"use client";
import { CreateRoom } from "@/components/roomComponents/CreateRoom";
import { JoinRoom } from "@/components/roomComponents/JoinRoom";
import { ProfileInfo } from "@/components/roomComponents/UserProfile";
import { YourRoom } from "@/components/roomComponents/YourRoom";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function RoomDashboard() {
  const [token , setToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );
  const [roomsRefreshKey, setRoomsRefreshKey] = useState(0);
  const router = useRouter();

  if (!token) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-black dark:via-zinc-900 dark:to-zinc-800">
        <div className="min-w-md h-50 rounded-2xl bg-white text-black flex flex-col justify-center items-center gap-3 p-6">
          <div className="text-center">
            Please sign in to access your rooms.
          </div>
          <div className="w-40 rounded-2xl p-2 bg-black text-white flex items-center justify-center">
            <button onClick={() => router.push("/signin")}>Signin</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-black dark:via-zinc-900 dark:to-zinc-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex items-center justify-between pb-4">
          <div className="m-2">
            <h1 className="text-2xl font-semibold text-white">Rooms</h1>
            <p className="text-sm text-white">
              Create, join, or manage your rooms.
            </p>
          </div>
          <ProfileInfo token={token} />
        </div>
        <div className="grid gap-6 md:grid-cols-2 text-black">
          <CreateRoom
            token={token}
            onCreated={() => setRoomsRefreshKey((prev) => prev + 1)}
          />
          <JoinRoom token={token} />
        </div>

        <YourRoom token={token} refreshKey={roomsRefreshKey} />
      </div>
    </div>
  );
}
