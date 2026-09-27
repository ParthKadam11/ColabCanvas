export default function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="size-10 animate-spin rounded-full border-2 border-zinc-700 border-t-blue-500" />
      {message && <p className="mt-3 text-sm text-pretty text-zinc-300">{message}</p>}
    </div>
  );
}
