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
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full mx-auto flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-blue-500/20">
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

// "use client";
// import { useAuth } from "@/context/AuthContext";
// import { auth, db } from "@/lib/firebase/config";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import { updateProfile, updatePassword, signOut } from "firebase/auth";
// import { doc, setDoc, updateDoc } from "firebase/firestore";

// export default function ProfilePage() {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   // Toggle State
//   const [isEditing, setIsEditing] = useState(false);

//   // Form States
//   const [newUsername, setNewUsername] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });

//   useEffect(() => {
//     if (!loading && !user) router.push("/");
//   }, [user, loading, router]);

//   if (loading || !user)
//     return <div className="p-20 text-center">Loading...</div>;

//   const handleUpdateProfile = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsUpdating(true);
//     setMessage({ type: "", text: "" });

//     try {
//       // 1. Update Username if provided
//       if (newUsername.trim()) {
//         await updateProfile(user, { displayName: newUsername });
//         await setDoc(doc(db, "users", user.uid), {
//           username: newUsername,
//           email: user.email
//         }, { merge: true });
//       }

//       // 2. Update Password if provided
//       if (newPassword) {
//         if (newPassword !== confirmPassword) throw new Error("Passwords do not match");
//         if (newPassword.length < 6) throw new Error("Password too short");
//         await updatePassword(user, newPassword);
//       }

//       setMessage({ type: "success", text: "Profile updated successfully!" });
//       setIsEditing(false); // Switch back to view mode
//       setNewPassword("");
//       setConfirmPassword("");
//     } catch (err: any) {
//       const errorMsg = err.code === 'auth/requires-recent-login'
//         ? "Please re-login to change security settings."
//         : err.message;
//       setMessage({ type: "error", text: errorMsg });
//     } finally {
//       setIsUpdating(false);
//     }
//   };

// //   // Update Username (Auth + Firestore)
// //   const handleUpdateUsername = async () => {
// //     if (!user || !newUsername.trim()) return;
// //     setIsUpdating(true);
// //     try {
// //       // 1. Update Firebase Auth Profile (for the Navbar)
// //       await updateProfile(user, { displayName: newUsername });

// //       // 2. Update/Create Firestore document
// //       const userRef = doc(db, "users", user.uid);
// //       await setDoc(
// //         userRef,
// //         {
// //           username: newUsername,
// //           email: user.email,
// //         },
// //         { merge: true },
// //       );

// //       setMessage({ type: "success", text: "Username updated successfully!" });
// //       setNewUsername("");
// //     } catch (err: any) {
// //       setMessage({ type: "error", text: err.message });
// //     } finally {
// //       setIsUpdating(false);
// //     }
// //   };

// //   // Update Password
// //   const handleUpdatePassword = async () => {
// //     if (!user) return;

// //     // 1. Basic Length Check
// //     if (newPassword.length < 6) {
// //       setMessage({
// //         type: "error",
// //         text: "Password must be at least 6 characters",
// //       });
// //       return;
// //     }

// //     // 2. Match Validation
// //     if (newPassword !== confirmPassword) {
// //       setMessage({ type: "error", text: "Passwords do not match" });
// //       return;
// //     }

//     setIsUpdating(true);
//     try {
//       await updatePassword(user, newPassword);
//       setMessage({ type: "success", text: "Password updated successfully!" });
//       setNewPassword("");
//       setConfirmPassword("");
//     } catch (err: any) {
//       // Handling the "Recent Login" security requirement
//       if (err.code === "auth/requires-recent-login") {
//         setMessage({
//           type: "error",
//           text: "Please log out and log back in to change your password.",
//         });
//       } else {
//         setMessage({ type: "error", text: err.message });
//       }
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   useEffect(() => {
//     if (!loading && !user) router.push("/");
//   }, [user, loading, router]);

//   if (loading || !user)
//     return <div className="p-20 text-center">Loading...</div>;

//   return (
//     // <main className="max-w-md mx-auto mt-10 space-y-6">
//     //   <div className="glass p-8 rounded-3xl text-center">
//     //     <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
//     //       {user.displayName?.[0] || user.email?.[0]}
//     //     </div>
//     //     <h1 className="text-2xl font-bold capitalize">
//     //       {user.displayName || "User"}
//     //     </h1>
//     //     <p className="text-gray-400 text-sm mb-6">{user.email}</p>

//     //     <div className="text-left space-y-4 border-t border-white/5 pt-6">
//     //       <div className="flex justify-between text-sm">
//     //         <span className="text-gray-500">Joined</span>
//     //         <span>
//     //           {user.metadata.creationTime
//     //             ? new Date(user.metadata.creationTime).toLocaleDateString()
//     //             : "N/A"}
//     //         </span>
//     //       </div>
//     //     </div>

//     //     <button
//     //       onClick={() => signOut(auth)}
//     //       className="w-full mt-8 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold hover:bg-red-500 hover:text-white transition"
//     //     >
//     //       Logout
//     //     </button>
//     //   </div>
//     // </main>
//     <main className="max-w-md mx-auto mt-10 pb-20 px-4">
//       <div className="glass p-8 rounded-3xl space-y-8">
//         <h1 className="text-2xl font-bold">Account Settings</h1>

//         {message.text && (
//           <div
//             className={`p-3 rounded-xl text-xs font-medium ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
//           >
//             {message.text}
//           </div>
//         )}

//         {/* Username Section */}
//         <div className="space-y-3">
//           <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//             Update Username
//           </label>
//           <div className="flex gap-2">
//             <input
//               value={newUsername}
//               onChange={(e) => setNewUsername(e.target.value)}
//               placeholder="New username"
//               className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-blue-500"
//             />
//             <button
//               onClick={handleUpdateUsername}
//               disabled={isUpdating}
//               className="bg-blue-600 px-4 rounded-xl font-bold text-sm active:scale-95 transition-transform disabled:opacity-50"
//             >
//               Update
//             </button>
//           </div>
//         </div>

//         {/* Password Section */}
//         <div className="space-y-3 pt-4 border-t border-white/5">
//           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
//             Security Settings
//           </label>

//           <div className="flex flex-col gap-3">
//             <input
//               type="password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               placeholder="New password"
//               className="bg-white/5 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
//             />

//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="Confirm new password"
//               className={`bg-white/5 border p-3 rounded-xl focus:outline-none transition-colors ${
//                 confirmPassword && newPassword !== confirmPassword
//                   ? "border-red-500/50"
//                   : "border-white/10 focus:border-blue-500"
//               }`}
//             />

//             <button
//               onClick={handleUpdatePassword}
//               disabled={isUpdating || !newPassword || !confirmPassword}
//               className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
//             >
//               {isUpdating ? "Updating..." : "Update Password"}
//             </button>
//           </div>
//         </div>

//         <button
//           onClick={() => signOut(auth)}
//           className="w-full pt-4 text-sm text-red-500/60 hover:text-red-500 underline"
//         >
//           Sign Out of Account
//         </button>
//       </div>
//     </main>
//   );

// return (
//     <main className="max-w-md mx-auto mt-10 pb-20 px-4">
//       <div className="glass p-8 rounded-3xl overflow-hidden">

//         {/* VIEW MODE */}
//         {!isEditing ? (
//           <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full mx-auto flex items-center justify-center text-4xl font-bold shadow-xl shadow-blue-500/20">
//               {user.displayName?.[0] || user.email?.[0]}
//             </div>

//             <div>
//               <h1 className="text-2xl font-bold capitalize">{user.displayName || "User"}</h1>
//               <p className="text-gray-400 text-sm">{user.email}</p>
//             </div>

//             <div className="bg-white/5 rounded-2xl p-4 text-left space-y-3">
//               <div className="flex justify-between text-xs">
//                 <span className="text-gray-500">Account Created</span>
//                 <span className="font-medium text-gray-300">
//                   {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A"}
//                 </span>
//               </div>
//             </div>

//             <div className="flex flex-col gap-3 pt-4">
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="w-full bg-blue-600 py-3 rounded-xl font-bold active:scale-95 transition-all"
//               >
//                 Edit Profile
//               </button>
//               <button
//                 onClick={() => signOut(auth)}
//                 className="text-sm text-red-400 hover:text-red-300 transition-colors"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         ) : (
//           /* EDIT MODE */
//           <form onSubmit={handleUpdateProfile} className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
//             <h2 className="text-xl font-bold">Edit Information</h2>

//             {message.text && (
//               <p className={`text-xs p-3 rounded-lg ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
//                 {message.text}
//               </p>
//             )}

//             <div className="space-y-2">
//               <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">New Username</label>
//               <input
//                 defaultValue={user.displayName || ""}
//                 onChange={(e) => setNewUsername(e.target.value)}
//                 className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:border-blue-500 outline-none transition-all"
//                 placeholder="Enter username"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Change Password</label>
//               <input
//                 type="password"
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:border-blue-500 outline-none transition-all"
//                 placeholder="New password (leave blank to keep)"
//               />
//               <input
//                 type="password"
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:border-blue-500 outline-none transition-all"
//                 placeholder="Confirm new password"
//               />
//             </div>

//             <div className="flex gap-3 pt-4">
//               <button
//                 type="button"
//                 onClick={() => setIsEditing(false)}
//                 className="flex-1 glass py-3 rounded-xl font-bold text-sm active:scale-95 transition-all"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={isUpdating}
//                 className="flex-1 bg-white text-black py-3 rounded-xl font-bold text-sm active:scale-95 transition-all disabled:opacity-50"
//               >
//                 {isUpdating ? "Saving..." : "Save Changes"}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </main>
//   );
// }
