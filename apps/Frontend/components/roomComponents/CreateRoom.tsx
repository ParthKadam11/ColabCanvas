"use client";
import { Input } from "@repo/ui";
import axios from "axios";
import { useState } from "react";

const HTTP_BACKEND = process.env.NEXT_PUBLIC_HTTP_BACKEND;

type CreateRoomProps = {
  onCreated?: () => void;
};

export default function CreateRoom({ onCreated }: CreateRoomProps) {
  const [createName, setCreateName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!createName.trim()) return;
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : "";
      await axios.post(
        `${HTTP_BACKEND}/room`,
        { roomname: createName.trim() },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      setCreateName("");
      setError(null);
      onCreated?.();
    } catch (e) {
      setError("Could not create that room. Try a different name.");
      console.log(e);
    }
  };

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
      <h2 className="text-base font-medium text-balance text-zinc-50">Create a room</h2>
      <p className="mt-1 text-sm text-pretty text-zinc-400">
        Name a new board. Anyone with the name can join it.
      </p>
      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          handleCreate();
        }}
      >
        <Input
          className="h-10 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500"
          id="create-room"
          name="create-room"
          placeholder="Room name"
          value={createName}
          onChange={(e) => setCreateName(e.target.value)}
        />
        <button
          type="submit"
          className="h-10 shrink-0 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={!createName.trim()}
        >
          Create
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </section>
  );
}
