"use client";

import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "An unknown error occurred";

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have access to this resource.",
    Verification: "The verification link has expired or was already used.",
    Default: "An unexpected error occurred.",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
      <div className="w-full max-w-md p-8 bg-[#161b22] rounded-lg border border-[#30363d] text-center">
        <h1 className="text-2xl font-bold text-[#f85149] mb-4">Authentication Error</h1>
        <p className="text-[#8b949e]">{errorMessages[error] || error}</p>
        <a
          href="/login"
          className="inline-block mt-6 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded font-medium transition-colors"
        >
          Back to login
        </a>
      </div>
    </div>
  );
}
