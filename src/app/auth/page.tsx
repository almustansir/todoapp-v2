"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function AuthPage() {
  // const [isLogin, setIsLogin] = useState(true);
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  // const router = useRouter();
  // const getFriendlyErrorMessage = (errorCode: string) => {
  //   switch (errorCode) {
  //     case "Firebase: Error (auth/invalid-credential).":
  //       return "Incorrect email or password. Please try again.";
  //     case "auth/email-already-in-use":
  //       return "An account with this email already exists.";
  //     case "auth/weak-password":
  //       return "Password should be at least 6 characters.";
  //     default:
  //       return "Something went wrong. Please try again.";
  //   }
  // };

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // STEP 1: Clear previous errors immediately
  //   setError("");
  //   try {
  //     if (isLogin) {
  //       await signInWithEmailAndPassword(auth, email, password);
  //     } else {
  //       await createUserWithEmailAndPassword(auth, email, password);
  //     }
  //     // If successful, the redirect happens and the page unmounts
  //     router.push("/dashboard");
  //   } catch (err: any) {
  //     // STEP 2: Only set the error if the Firebase request fails
  //     setError(getFriendlyErrorMessage(err.message));
  //     // setError(err.message);
  //   }
  // };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Faster "Upsert" (Update or Insert) logic
      const userRef = doc(db, "users", user.uid);

      // Using setDoc with { merge: true } is faster than checking getDoc first
      await setDoc(
        userRef,
        {
          username: user.displayName || user.email?.split("@")[0] || "User",
          email: user.email,
          lastLogin: new Date().toISOString(),
          // We don't overwrite createdAt if it already exists
        },
        { merge: true },
      );

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Google Sign-In Error:", error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { username, email, password, confirmPassword } = formData;

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Validation
        if (!username.trim()) throw new Error("Username is required");
        if (password !== confirmPassword)
          throw new Error("Passwords do not match");
        if (password.length < 6)
          throw new Error("Password must be at least 6 characters");

        // 1. Create User
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = userCredential.user;

        // 2. Update Auth Profile
        await updateProfile(user, { displayName: username });

        // 3. Save to Firestore
        await setDoc(doc(db, "users", user.uid), {
          username,
          email,
          createdAt: serverTimestamp(),
        });
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    // <div className="max-w-md mx-auto mt-20 p-8 glass rounded-3xl">
    //   <h1 className="text-3xl font-bold mb-6">{isLogin ? "Login" : "Join Us"}</h1>
    //   <form onSubmit={handleSubmit} className="space-y-4">
    //     {!isLogin && (
    //       <input
    //         placeholder="Username"
    //         className="w-full bg-white/5 border border-white/10 p-3 rounded-xl"
    //         onChange={(e) => setFormData({...formData, username: e.target.value})}
    //       />
    //     )}
    //     <input
    //       type="email"
    //       placeholder="Email"
    //       className="w-full bg-white/5 border border-white/10 p-3 rounded-xl"
    //       onChange={(e) => setFormData({...formData, email: e.target.value})}
    //     />
    //     <input
    //       type="password"
    //       placeholder="Password"
    //       className="w-full bg-white/5 border border-white/10 p-3 rounded-xl"
    //       onChange={(e) => setFormData({...formData, password: e.target.value})}
    //     />
    //     {!isLogin && (
    //       <input
    //         type="password"
    //         placeholder="Confirm Password"
    //         className="w-full bg-white/5 border border-white/10 p-3 rounded-xl"
    //         onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
    //       />
    //     )}
    //     {error && <p className="text-red-500 text-sm">{error}</p>}
    //     <button className="w-full bg-blue-600 py-3 rounded-xl font-bold">
    //       {isLogin ? "Sign In" : "Create Account"}
    //     </button>
    //   </form>
    //   <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-4 text-sm text-gray-400">
    //     {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
    //   </button>
    // </div>
    <div className="max-w-md mx-auto mt-20 p-8 glass rounded-3xl">
      <h1 className="text-3xl font-bold mb-6">
        {isLogin ? "Login" : "Join Us"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input
            placeholder="Username"
            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full bg-white/5 border border-white/10 p-3 rounded-xl"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full bg-white/5 border border-white/10 p-3 rounded-xl"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl"
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
        )}
        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full mt-4 flex items-center justify-center gap-3 glass py-3 rounded-xl font-bold text-sm hover:bg-white/10 active:scale-95 transition-all border border-white/10"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="w-full bg-blue-600 py-3 rounded-xl font-bold cursor-pointer">
          {isLogin ? "Sign In" : "Create Account"}
        </button>
      </form>
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="w-full mt-4 text-sm text-gray-400 cursor-pointer"
      >
        {isLogin
          ? "Need an account? Sign up"
          : "Already have an account? Login"}
      </button>
    </div>
  );
}
