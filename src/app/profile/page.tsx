"use client";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { updateProfile, updatePassword, signOut } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  // Update Username (Auth + Firestore)
  const handleUpdateUsername = async () => {
    if (!user || !newUsername.trim()) return;
    setIsUpdating(true);
    try {
      // 1. Update Firebase Auth Profile (for the Navbar)
      await updateProfile(user, { displayName: newUsername });

      // 2. Update/Create Firestore document
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          username: newUsername,
          email: user.email,
        },
        { merge: true },
      );

      setMessage({ type: "success", text: "Username updated successfully!" });
      setNewUsername("");
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsUpdating(false);
    }
  };

  // Update Password
  const handleUpdatePassword = async () => {
    if (!user) return;

    // 1. Basic Length Check
    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    // 2. Match Validation
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setIsUpdating(true);
    try {
      await updatePassword(user, newPassword);
      setMessage({ type: "success", text: "Password updated successfully!" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      // Handling the "Recent Login" security requirement
      if (err.code === "auth/requires-recent-login") {
        setMessage({
          type: "error",
          text: "Please log out and log back in to change your password.",
        });
      } else {
        setMessage({ type: "error", text: err.message });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  if (loading || !user)
    return <div className="p-20 text-center">Loading...</div>;

  return (
    // <main className="max-w-md mx-auto mt-10 space-y-6">
    //   <div className="glass p-8 rounded-3xl text-center">
    //     <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
    //       {user.displayName?.[0] || user.email?.[0]}
    //     </div>
    //     <h1 className="text-2xl font-bold capitalize">
    //       {user.displayName || "User"}
    //     </h1>
    //     <p className="text-gray-400 text-sm mb-6">{user.email}</p>

    //     <div className="text-left space-y-4 border-t border-white/5 pt-6">
    //       <div className="flex justify-between text-sm">
    //         <span className="text-gray-500">Joined</span>
    //         <span>
    //           {user.metadata.creationTime
    //             ? new Date(user.metadata.creationTime).toLocaleDateString()
    //             : "N/A"}
    //         </span>
    //       </div>
    //     </div>

    //     <button
    //       onClick={() => signOut(auth)}
    //       className="w-full mt-8 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold hover:bg-red-500 hover:text-white transition"
    //     >
    //       Logout
    //     </button>
    //   </div>
    // </main>
    <main className="max-w-md mx-auto mt-10 pb-20 px-4">
      <div className="glass p-8 rounded-3xl space-y-8">
        <h1 className="text-2xl font-bold">Account Settings</h1>

        {message.text && (
          <div
            className={`p-3 rounded-xl text-xs font-medium ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
          >
            {message.text}
          </div>
        )}

        {/* Username Section */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Update Username
          </label>
          <div className="flex gap-2">
            <input
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="New username"
              className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleUpdateUsername}
              disabled={isUpdating}
              className="bg-blue-600 px-4 rounded-xl font-bold text-sm active:scale-95 transition-transform disabled:opacity-50"
            >
              Update
            </button>
          </div>
        </div>

        {/* Password Section */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Security Settings
          </label>

          <div className="flex flex-col gap-3">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="bg-white/5 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
            />

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className={`bg-white/5 border p-3 rounded-xl focus:outline-none transition-colors ${
                confirmPassword && newPassword !== confirmPassword
                  ? "border-red-500/50"
                  : "border-white/10 focus:border-blue-500"
              }`}
            />

            <button
              onClick={handleUpdatePassword}
              disabled={isUpdating || !newPassword || !confirmPassword}
              className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              {isUpdating ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>

        <button
          onClick={() => signOut(auth)}
          className="w-full pt-4 text-sm text-red-500/60 hover:text-red-500 underline"
        >
          Sign Out of Account
        </button>
      </div>
    </main>
  );
}
