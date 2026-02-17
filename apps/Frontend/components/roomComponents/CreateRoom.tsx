"use client";
import { Input } from "@repo/ui";
import axios from "axios";
import { useState } from "react";
import { HTTP_BACKEND } from "@/config";


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
      <div className="rounded-xl bg-white p-3 xs:p-4 sm:p-5 shadow-sm w-full max-w-md mx-auto">
        <h2 className="mb-2 xs:mb-3 text-base xs:text-lg font-medium">Create room</h2>
        <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
          <Input
            className="focus:outline-none border-0 text-sm xs:text-base"
            id="create-room"
            name="create-room"
            placeholder="room name"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
          />
          <button
            className="rounded-lg bg-slate-900 px-3 xs:px-4 py-2 text-white w-full xs:w-auto text-sm xs:text-base"
            onClick={handleCreate}>
            Create
          </button>
        </div>
        {error && <div className="mt-2 xs:mt-3 text-xs xs:text-sm text-red-600">{error}</div>}
      </div>
    </div>
  );
}
