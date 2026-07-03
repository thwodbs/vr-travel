"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function MyBookingsPage() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setChecking(false);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("bookings")
      .select("*")
      .eq("user_email", user.email)
      .order("id", { ascending: false })
      .then(({ data }) => setBookings(data || []));
  }, [user]);

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
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-6 py-4">
        <Link href="/" className="text-blue-600 font-bold text-xl">
          VR 트래블
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">내 예약 / 문의</h1>

        <div className="space-y-4">
          {bookings.length === 0 && (
            <p className="text-sm text-gray-500">아직 예약/문의 내역이 없습니다.</p>
          )}

          {bookings.map((b) => (
            <div key={b.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{b.tour_title}</h3>
              <p className="text-sm text-gray-600 mb-3">{b.message}</p>

              {b.meeting_link ? (
                <a
                  href={b.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                >
                  가이드와 화상 통화 접속하기
                </a>
              ) : (
                <p className="text-sm text-gray-400">
                  아직 미팅 링크가 등록되지 않았어요. 조금만 기다려주세요.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}