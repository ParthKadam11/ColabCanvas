"use client";
import { Input } from "@repo/ui";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HTTP_BACKEND } from "@/config";

type JoinRoomProps = {
  token: string | null;
};

export function JoinRoom({ token }: JoinRoomProps) {
  const [joinName, setJoinName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleJoin = async () => {
    if (!token || !joinName.trim()) return;
    try {
      const response = await axios.post(
        `${HTTP_BACKEND}/room/join`,
        { roomname: joinName.trim() },
        { headers: { authorization: token } },
      );
      const roomId = response.data?.roomId;
      if (roomId) {
        router.push(`/canvas/${roomId}?token=${token}`);
      }
      setError(null);
    } catch (e) {
      setError("Failed to join room");
      console.log(e);
    }
  };

  return (
    <div className="rounded-xl bg-white p-3 xs:p-4 sm:p-5 shadow-sm w-full max-w-md mx-auto">
      <h2 className="mb-2 xs:mb-3 text-base xs:text-lg font-medium">Join room</h2>
      <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
        <Input
          className="focus:outline-none border-0 text-sm xs:text-base"
          id="join-room"
          name="join-room"
          placeholder="room name"
          value={joinName}
          onChange={(e) => setJoinName(e.target.value)}
        />
        <button
          className="rounded-lg bg-slate-900 px-3 xs:px-4 py-2 text-white w-full xs:w-auto text-sm xs:text-base"
          onClick={handleJoin}
        >
          Join
        </button>
      </div>
      {error && <div className="mt-2 xs:mt-3 text-xs xs:text-sm text-red-600">{error}</div>}
    </div>
  );
}
