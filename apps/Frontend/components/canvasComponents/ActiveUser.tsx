"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const HTTP_BACKEND =process.env.HTTP_BACKEND
const PRESENCE_URL=process.env.PRESENCE_URL

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

	if (!roomId || !token) {
		return null;
	}

	const maxVisible = 4;
	const visibleUsers = activeUsers.slice(0, maxVisible);
	const overflowCount = Math.max(0, activeUsers.length - maxVisible);

	return (
		<div className="fixed bottom-2 left-1/2 -translate-x-1/2 flex flex-wrap items-center gap-3 p-2 m-2 bg-white max-w-[92vw] rounded-3xl text-white pointer-events-none">
			<div className="flex justify-center items-center pointer-events-auto">
				<div className="flex flex-wrap items-center gap-2">
					{visibleUsers.map((user) => (
						<div key={user.id} title={user.name} className="h-9 w-9 rounded-full bg-slate-200 border border-slate-900 overflow-hidden flex items-center justify-center">
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
						<div className="h-9 w-9 rounded-full bg-slate-200 border border-slate-300 text-slate-700 flex items-center justify-center text-xs font-semibold">+{overflowCount}
						</div>
					)}
				</div>
			</div>
			<div className="hidden sm:flex text-sm justify-center items-center text-black gap-1">
				Active Users
			</div>
		</div>
	);
}
