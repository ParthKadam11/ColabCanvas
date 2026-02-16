"use client";
import { CreateRoom } from "@/components/roomComponents/CreateRoom";
import { JoinRoom } from "@/components/roomComponents/JoinRoom";
import { ProfileInfo } from "@/components/roomComponents/UserProfile";
import { YourRoom } from "@/components/roomComponents/YourRoom";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToken } from "../utils";

export default function RoomDashboard() {
  const token = useToken();
  const [roomsRefreshKey, setRoomsRefreshKey] = useState(0);
  const router = useRouter();

  if (token === null) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-black dark:via-zinc-900 dark:to-zinc-800">
        <div className="text-center text-black bg-white rounded-2xl p-6 shadow-md">Loading...</div>
      </div>
    );
  }

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
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-black dark:via-zinc-900 dark:to-zinc-800 font-sans">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 flex flex-col items-center">
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 mt-2">
          <div className="flex flex-col items-start">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg mb-2">Your Rooms</h1>
            <p className="text-sm md:text-base text-zinc-200 max-w-md">Create, join, or manage your rooms. Collaborate in real-time with a beautiful, modern interface.</p>
          </div>
          <div className="flex justify-end md:justify-center items-center">
            <ProfileInfo token={token} />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 w-full text-black">
            <CreateRoom token={token} onCreated={() => setRoomsRefreshKey((prev) => prev + 1)}/>

            <JoinRoom token={token} />
        </div>
          <YourRoom token={token} refreshKey={roomsRefreshKey} />
      </div>
    </div>
  );
}
