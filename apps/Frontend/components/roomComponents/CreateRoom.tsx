"use client";
import { HTTP_BACKEND } from "@/config";
import { Input } from "@repo/ui";
import axios from "axios";
import { useState } from "react";

type CreateRoomProps = {
  token: string | null;
  onCreated?: () => void;
};

export function CreateRoom({ token, onCreated }: CreateRoomProps) {
  const [createName, setCreateName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!token || !createName.trim()) return;
    try {
      await axios.post(
        `${HTTP_BACKEND}/room`,
        { roomname: createName.trim() },
        { headers: { authorization: token } },
      );
      setCreateName("");
      setError(null);
      onCreated?.();
    } catch (e) {
      setError("Failed to create room");
      console.log(e);
    }
  };

  return (
    <div>
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-medium">Create room</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            className="focus:outline-none border-0"
            id="create-room"
            name="create-room"
            placeholder="room name"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
          />
          <button
            className="rounded-lg bg-slate-900 px-4 py-2 text-white w-full sm:w-auto "
            onClick={handleCreate}>
            Create
          </button>
        </div>
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      </div>
    </div>
  );
}
