"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { tours } from "../../../lib/toursData";
import { supabase } from "../../../lib/supabaseClient";

export default function TourDetailPage({ params }) {
  const [id, setId] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  const tour = tours.find((t) => t.id === id);

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setStatus("로그인 후 예약/문의가 가능합니다.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("bookings").insert({
      user_email: userData.user.email,
      tour_id: tour.id,
      tour_title: tour.title,
      message: message,
    });

    setLoading(false);

    if (error) {
      setStatus("오류: " + error.message);
    } else {
      setStatus("예약/문의가 접수되었습니다!");
      setMessage("");
    }
  };

  if (!id) {
    return null;
  }

  if (!tour) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">투어를 찾을 수 없습니다.</p>
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

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-gray-200 h-64 rounded-xl mb-6"></div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {tour.title}
        </h1>
        <p className="text-gray-500 mb-6">현지 가이드: {tour.guide}</p>

        <p className="text-gray-700 leading-relaxed mb-8">
          {tour.description}
        </p>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            예약 / 문의하기
          </h2>

          <form onSubmit={handleBooking} className="space-y-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              placeholder="희망 일정이나 궁금한 점을 남겨주세요"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "전송 중..." : "예약 / 문의하기"}
            </button>
          </form>

          {status && (
            <p className="mt-4 text-sm text-gray-700">{status}</p>
          )}
        </div>
      </div>
    </main>
  );
}