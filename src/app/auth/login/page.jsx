"use client";

import { useState } from "react";

export default function LoginPage() {
  const [data, setData] = useState({ email: "", password: "" });

  const handleSubmit = async () => {
    // call API
    console.log(data);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl border">
        <h1 className="text-2xl font-semibold mb-6">Login</h1>

        <input
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border rounded-lg"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          Login
        </button>
      </div>
    </main>
  );
}