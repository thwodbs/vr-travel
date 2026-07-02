"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function GuideRegisterPage() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setChecking(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const { error } = await supabase.from("guides").insert({
      user_email: user.email,
      name: name,
      country: country,
      city: city,
      bio: bio,
    });

    setLoading(false);

    if (error) {
      setStatus("오류: " + error.message);
    } else {
      setStatus("가이드 등록이 접수되었습니다! 검토 후 연락드릴게요.");
      setName("");
      setCountry("");
      setCity("");
      setBio("");
    }
  };

  if (checking) {
    return null;
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-sm w-full bg-white p-8 rounded-xl shadow-md text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-3">
            로그인이 필요합니다
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            가이드 등록은 로그인 후 이용할 수 있어요.
          </p>
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            로그인하러 가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">가이드 등록</h1>
        <p className="text-sm text-gray-500 mb-6">{user.email}로 등록합니다</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">이름</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 유키"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">국가</label>
            <input
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 일본"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">도시</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 오사카"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              소개 / 경력
            </label>
            <textarea
              required
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="본인을 소개해주세요"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "등록 중..." : "가이드 등록하기"}
          </button>
        </form>

        {status && (
          <p className="mt-4 text-sm text-center text-gray-700">{status}</p>
        )}
      </div>
    </main>
  );
}