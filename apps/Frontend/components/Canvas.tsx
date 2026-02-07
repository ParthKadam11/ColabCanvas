"use client";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil,RectangleHorizontal, Ruler } from "lucide-react";
import { Draw } from "@/draw/draw";
import { HTTP_BACKEND, PRESENCE_URL } from "@/config";
import Image from "next/image";

type Shape = "circle" | "rect" | "penline" | "pencil";

export function Canvas({
  roomId,
  socket,
  token,
}: {
  roomId: string;
  socket: WebSocket;
  token: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Shape>("rect");
  const [draw, setDraw] = useState<Draw>();
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

  useEffect(() => {
    if (!roomId || !token) {
      return;
    }

    let isMounted = true;
    const fetchActiveUsers = async () => {
      try {
        const response = await fetch(
          `${PRESENCE_URL}/rooms/${roomId}/active-users`,
          {
            headers: { authorization: token },
          }
        );
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (isMounted) {
          setActiveUsers(data.users ?? []);
        }
      } catch (e) {
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

  useEffect(() => {
    draw?.setSelectedTool(selectedTool);
  }, [selectedTool, draw]);

  useEffect(() => {
    if (canvasRef.current) {
      const drawing = new Draw(canvasRef.current, roomId, socket);
      drawing.initMouseHandler();
      setDraw(drawing);
      return () => {
        drawing.destroy();
      };
    }
  }, [roomId, socket, canvasRef]);

  const visibleActiveUsers = roomId && token ? activeUsers : [];

  return (
    <div className="overflow:hidden">
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
      <Topbar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        activeUsers={visibleActiveUsers}
      />
    </div>
  );
}

type ActiveUser = {
  id: string;
  name: string;
  photo?: string | null;
};

function Topbar({
  selectedTool,
  setSelectedTool,
  activeUsers,
}: {
  selectedTool: Shape;
  setSelectedTool: (s: Shape) => void;
  activeUsers: ActiveUser[];
}) {
  const maxVisible = 4;
  const visibleUsers = activeUsers.slice(0, maxVisible);
  const overflowCount = Math.max(0, activeUsers.length - maxVisible);

  return (
    <div>
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-white w-60 h-15 rounded-3xl text-white pointer-events-none">
      <div className="pointer-events-auto">
        <div className="flex items-center gap-2">
          {visibleUsers.map((user) => (
            <div
              key={user.id}
              title={user.name}
              className="h-9 w-9 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center"
            >
              {user.photo ? (
                <Image
                  src={`${HTTP_BACKEND}/uploads/${user.photo}`}
                  alt={user.name}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <span className="h-5 w-5 rounded-full bg-slate-100 border border-slate-300" />
              )}
            </div>
          ))}
          {overflowCount > 0 && (
            <div className="h-9 w-9 rounded-full bg-slate-200 border border-slate-300 text-slate-700 flex items-center justify-center text-xs font-semibold">
              +{overflowCount}
            </div>
          )}
        </div>
      </div>
    </div>
    <div className="fixed top-2 left-1/2 -translate-x-1/2 flex gap-2 p-2 text-white pointer-events-none">
      <div className="pointer-events-auto">
        <IconButton activated={selectedTool === "penline"} icon={<Ruler />} onClick={()=>{setSelectedTool("penline")}}/>
      </div>
      <div className="pointer-events-auto">
        <IconButton activated={selectedTool === "rect"} icon={<RectangleHorizontal/>} onClick={()=>{setSelectedTool("rect")}}/>
      </div>
      <div className="pointer-events-auto">
        <IconButton activated={selectedTool === "circle"} icon={<Circle />} onClick={()=>{setSelectedTool("circle")}}/>
      </div>
      <div className="pointer-events-auto">
        <IconButton activated={selectedTool === "pencil"} icon={<Pencil />} onClick={()=>{setSelectedTool("pencil")}}/>
      </div>
    </div>
  </div>
  );
}
