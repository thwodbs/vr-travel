"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    setLoading(false);

    if (error) {
      setMessage("오류: " + error.message);
    } else {
      setMessage("회원가입 성공! 이메일을 확인해서 인증해주세요.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-sm w-full bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          회원가입
        </h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">이메일</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">비밀번호</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="6자 이상 입력하세요"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "처리 중..." : "회원가입"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
        )}
      </div>
    </main>
  );
}