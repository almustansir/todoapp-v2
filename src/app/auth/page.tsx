"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

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
