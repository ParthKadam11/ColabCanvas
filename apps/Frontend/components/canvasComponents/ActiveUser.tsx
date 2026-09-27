"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

type ActiveUser = {
  id: string;
  name: string;
  photo?: string | null;
};

export function ActiveUser({
  roomId,
  token,
}: {
  roomId: string;
  token: string;
}) {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

  useEffect(() => {
    if (!roomId || !token) {
      return;
    }

    let isMounted = true;
    const fetchActiveUsers = async () => {
      try {
        if (!WS_URL) {
          return;
        }
        const apiBase = WS_URL.replace(/^ws/, "http");
        const response = await fetch(`${apiBase}/rooms/${roomId}/active-users`, {
          headers: { authorization: token },
        });
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (isMounted) {
          setActiveUsers(data.users ?? []);
        }
      } catch {
        if (isMounted) {
          setActiveUsers([]);
        }
      }
    };

    fetchActiveUsers();
    const interval = setInterval(fetchActiveUsers, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [roomId, token]);

  if (!roomId || !token || activeUsers.length === 0) {
    return null;
  }

  const maxVisible = 4;
  const visibleUsers = activeUsers.slice(0, maxVisible);
  const overflowCount = Math.max(0, activeUsers.length - maxVisible);

  return (
    <div className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex max-w-[92vw] items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-lg">
      <div className="flex items-center gap-2">
        {visibleUsers.map((user) => (
          <div
            key={user.id}
            title={user.name}
            className="grid size-9 place-items-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-800"
          >
            {user.photo ? (
              <Image
                src={user.photo}
                alt={user.name}
                width={36}
                height={36}
                className="size-full object-cover"
                unoptimized
              />
            ) : (
              <span className="text-xs font-medium text-zinc-200">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
        ))}
        {overflowCount > 0 && (
          <div className="grid size-9 place-items-center rounded-full border border-zinc-700 bg-zinc-800 text-xs font-medium text-zinc-200 tabular-nums">
            +{overflowCount}
          </div>
        )}
      </div>
      <p className="hidden text-sm text-zinc-300 sm:block">
        <span className="tabular-nums">{activeUsers.length}</span> active
      </p>
    </div>
  );
}
