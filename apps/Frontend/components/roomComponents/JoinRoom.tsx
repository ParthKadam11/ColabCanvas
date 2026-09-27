"use client";
import { Input } from "@repo/ui";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const HTTP_BACKEND = process.env.NEXT_PUBLIC_HTTP_BACKEND;

export default function JoinRoom() {
  const [joinName, setJoinName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleJoin = async () => {
    if (!joinName.trim()) return;
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : "";
      const response = await axios.post(
        `${HTTP_BACKEND}/room/join`,
        { roomname: joinName.trim() },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      const roomId = response.data?.roomId;
      if (roomId) {
        router.push(`/canvas/${roomId}`);
      }
      setError(null);
    } catch (e) {
      setError("Could not join that room. Check the name and try again.");
      console.log(e);
    }
  };

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
      <h2 className="text-base font-medium text-balance text-zinc-50">Join a room</h2>
      <p className="mt-1 text-sm text-pretty text-zinc-400">
        Enter the exact room name to open a shared board.
      </p>
      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          handleJoin();
        }}
      >
        <Input
          className="h-10 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500"
          id="join-room"
          name="join-room"
          placeholder="Room name"
          value={joinName}
          onChange={(e) => setJoinName(e.target.value)}
        />
        <button
          type="submit"
          className="h-10 shrink-0 rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-sm font-semibold text-zinc-100 hover:bg-zinc-800 disabled:opacity-50"
          disabled={!joinName.trim()}
        >
          Join
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </section>
  );
}
