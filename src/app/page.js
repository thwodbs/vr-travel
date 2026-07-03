"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { countries } from "../lib/toursData";
export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 현재 로그인 상태 확인
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // 로그인/로그아웃 될 때마다 자동으로 감지
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <main className="min-h-screen bg-white">
      {/* 상단 네비게이션 */}
      <header className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
  <span className="text-xl font-bold text-blue-600">VR 트래블</span>

  <div className="space-x-4 flex items-center">
    {loading ? null : user ? (
      <>
        {user.email === "jpso4183@naver.com" && (
          <Link
            href="/admin"
            className="text-gray-700 hover:text-blue-600 text-sm font-medium"
          >
            관리자
          </Link>
        )}
        <Link
          href="/my-bookings"
          className="text-gray-700 hover:text-blue-600 text-sm"
        >
          내 예약
        </Link>
        <Link
          href="/guide-register"
          className="text-gray-700 hover:text-blue-600 text-sm"
        >
          가이드 등록
        </Link>
        <span className="text-gray-700 text-sm">{user.email}</span>
        <button
          onClick={handleLogout}
          className="text-gray-700 hover:text-blue-600"
        >
          로그아웃
        </button>
      </>
    ) : (
      <>
        <Link href="/login" className="text-gray-700 hover:text-blue-600">
          로그인
        </Link>
        <Link
          href="/signup"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          회원가입
        </Link>
      </>
    )}
  </div>
</header>

      {/* 히어로 섹션 */}
      <section className="text-center py-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          집에서 떠나는 세계 여행
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          현지인 가이드와 함께하는 VR 여행 체험, 전세계 어디서든 접속하세요
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700">
          투어 둘러보기
        </button>
      </section>

      {/* 투어 목록 미리보기 */}
      <section className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">인기 투어</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {countries.map((country) => (
    <Link
      key={country.id}
      href={`/countries/${country.id}`}
      className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition block"
    >
      <div className="bg-gray-200 h-40 rounded-lg mb-4"></div>
      <h3 className="font-semibold text-gray-900">{country.name}</h3>
    </Link>
  ))}
        </div>
      </section>
    </main>
  );
}