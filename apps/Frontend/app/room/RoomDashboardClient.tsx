"use client";
import CreateRoom from "@/components/roomComponents/CreateRoom";
import JoinRoom from "@/components/roomComponents/JoinRoom";
import ProfileInfo from "@/components/roomComponents/UserProfile";
import YourRoom from "@/components/roomComponents/YourRoom";
import { useState } from "react";

export default function RoomDashboardClient() {
  const [roomsRefreshKey, setRoomsRefreshKey] = useState(0);

  return (
    <div className="relative min-h-screen bg-black text-white font-sans">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 flex flex-col items-center">
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 mt-2">
          <div className="flex flex-col items-start">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg mb-2">Your Rooms</h1>
            <p className="text-sm md:text-base text-zinc-200 max-w-md">Create, join, or manage your rooms. Collaborate in real-time with a beautiful, modern interface.</p>
          </div>
          <div className="flex justify-end md:justify-center items-center">
            <ProfileInfo />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 w-full text-white">
            <CreateRoom onCreated={() => setRoomsRefreshKey((prev) => prev + 1)}/>
            <JoinRoom />
        </div>
          <YourRoom refreshKey={roomsRefreshKey} />
      </div>
    </div>
  );
}