"use client";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  if (loading || !user)
    return <div className="p-20 text-center">Loading...</div>;

  return (
    <main className="max-w-md mx-auto mt-10 space-y-6">
      <div className="glass p-8 rounded-3xl text-center">
        <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
          {user.displayName?.[0] || user.email?.[0]}
        </div>
        <h1 className="text-2xl font-bold capitalize">
          {user.displayName || "User"}
        </h1>
        <p className="text-gray-400 text-sm mb-6">{user.email}</p>

        <div className="text-left space-y-4 border-t border-white/5 pt-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Joined</span>
            <span>
              {user.metadata.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>

        <button
          onClick={() => signOut(auth)}
          className="w-full mt-8 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold hover:bg-red-500 hover:text-white transition"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
