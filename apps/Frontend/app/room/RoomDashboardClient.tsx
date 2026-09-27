"use client";
import CreateRoom from "@/components/roomComponents/CreateRoom";
import JoinRoom from "@/components/roomComponents/JoinRoom";
import ProfileInfo from "@/components/roomComponents/UserProfile";
import YourRoom from "@/components/roomComponents/YourRoom";
import { useState } from "react";

export default function RoomDashboardClient() {
  const [roomsRefreshKey, setRoomsRefreshKey] = useState(0);

  return (
    <div className="min-h-dvh bg-zinc-950 font-(family-name:--font-geist-sans) text-zinc-100">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-400">ColabCanvas</p>
            <h1 className="mt-1 text-2xl font-semibold text-balance text-zinc-50">
              Your rooms
            </h1>
            <p className="mt-2 max-w-md text-sm text-pretty text-zinc-400">
              Create a board, join one by name, or reopen a room you already belong to.
            </p>
          </div>
          <ProfileInfo />
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <CreateRoom onCreated={() => setRoomsRefreshKey((prev) => prev + 1)} />
          <JoinRoom />
        </div>
        <YourRoom refreshKey={roomsRefreshKey} />
      </div>
    </div>
  );
}
