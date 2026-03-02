import React from "react";

export default function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-2"></div>
      {message && <div className="text-blue-600 text-sm mt-2">{message}</div>}
    </div>
  );
}
