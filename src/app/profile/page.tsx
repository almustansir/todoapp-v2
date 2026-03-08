"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase/config";
import { updateProfile, updatePassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Toggle State
  const [isEditing, setIsEditing] = useState(false);

  // Form States
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Auth Protection: Redirect to landing if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: "", text: "" });

    try {
      // 1. Update Username if provided
      if (newUsername.trim() && newUsername !== user.displayName) {
        await updateProfile(user, { displayName: newUsername });

        // Sync with Firestore for the "users" collection
        await setDoc(
          doc(db, "users", user.uid),
          {
            username: newUsername,
            email: user.email,
            updatedAt: new Date().toISOString(),
          },
          { merge: true },
        );
      }

      // 2. Update Password if provided
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (newPassword.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        await updatePassword(user, newPassword);
      }

      setMessage({ type: "success", text: "Profile updated successfully!" });

      // Reset states and toggle back to view mode
      setIsEditing(false);
      setNewPassword("");
      setConfirmPassword("");
      setNewUsername("");
    } catch (err: any) {
      // Handle the Firebase "Recent Login" security constraint
      const errorMsg =
        err.code === "auth/requires-recent-login"
          ? "Security: Please log out and back in to change your password."
          : err.message;
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-10 pb-20 px-4">
      <div className="glass p-8 rounded-3xl overflow-hidden shadow-2xl border border-white/5">
        {/* VIEW MODE */}
        {!isEditing ? (
          <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Avatar Circle */}
            <div className="w-24 h-24 bg-linear-to-tr from-blue-600 to-blue-400 rounded-full mx-auto flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-blue-500/20">
              {user.displayName?.[0]?.toUpperCase() ||
                user.email?.[0]?.toUpperCase()}
            </div>

            <div>
              <h1 className="text-2xl font-bold capitalize text-white">
                {user.displayName || user.email?.split("@")[0]}
              </h1>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>

            {/* Account Info Stats */}
            <div className="bg-white/5 rounded-2xl p-5 text-left space-y-3 border border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">
                  Account Status
                </span>
                <span className="text-green-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Verified
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3">
                <span className="text-gray-500 font-medium">Member Since</span>
                <span className="text-gray-300">
                  {user.metadata.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-600 hover:bg-blue-500 py-3.5 rounded-xl font-bold text-white active:scale-95 transition-all shadow-lg shadow-blue-600/10"
              >
                Edit Profile
              </button>
              <button
                onClick={() => signOut(auth)}
                className="text-sm font-semibold text-red-400/80 hover:text-red-400 transition-colors py-2"
              >
                Logout from Device
              </button>
            </div>
          </div>
        ) : (
          /* EDIT MODE */
          <form
            onSubmit={handleUpdateProfile}
            className="space-y-5 animate-in fade-in zoom-in-95 duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {message.text && (
              <div
                className={`text-xs p-4 rounded-xl font-medium ${
                  message.type === "success"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">
                Display Name
              </label>
              <input
                defaultValue={user.displayName || ""}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl focus:border-blue-500 focus:bg-white/10 outline-none transition-all text-sm text-white"
                placeholder="New username"
              />
            </div>

            {/* Password Inputs */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">
                Security Update
              </label>
              <input
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl focus:border-blue-500 focus:bg-white/10 outline-none transition-all text-sm text-white"
                placeholder="New password"
              />
              <input
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full bg-white/5 border p-3.5 rounded-xl focus:bg-white/10 outline-none transition-all text-sm text-white ${
                  confirmPassword && newPassword !== confirmPassword
                    ? "border-red-500/50"
                    : "border-white/10 focus:border-blue-500"
                }`}
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setMessage({ type: "", text: "" });
                }}
                className="flex-1 glass py-3.5 rounded-xl font-bold text-sm text-gray-300 hover:bg-white/5 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 bg-white text-black py-3.5 rounded-xl font-bold text-sm hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
