"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

const ADMIN_EMAILS = ["jpso4183@naver.com"];

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [guides, setGuides] = useState([]);
  const [linkInputs, setLinkInputs] = useState({});
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user || !ADMIN_EMAILS.includes(user.email)) return;
    fetchBookings();

    supabase
      .from("reviews")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => setReviews(data || []));

    supabase
      .from("guides")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => setGuides(data || []));
  }, [user]);

  const fetchBookings = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("id", { ascending: false });
    setBookings(data || []);
  };

  const handleSaveLink = async (bookingId) => {
    const link = linkInputs[bookingId];
    if (!link) return;

    setSavingId(bookingId);
    const { error } = await supabase
      .from("bookings")
      .update({ meeting_link: link })
      .eq("id", bookingId);
    setSavingId(null);

    if (!error) {
      fetchBookings();
    }
  };

  if (loading) {
    return null;
  }

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">접근 권한이 없습니다.</p>
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

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">관리자 페이지</h1>

        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            가이드 신청 목록 ({guides.length})
          </h2>
          <div className="space-y-3">
            {guides.length === 0 && (
              <p className="text-sm text-gray-500">아직 가이드 신청이 없습니다.</p>
            )}
            {guides.map((g) => (
              <div key={g.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span className="font-medium text-gray-900">{g.name}</span>
                  <span>{g.user_email}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {g.country} · {g.city}
                </p>
                <p className="text-gray-800 text-sm">{g.bio}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            예약 / 문의 목록 ({bookings.length})
          </h2>
          <div className="space-y-3">
            {bookings.length === 0 && (
              <p className="text-sm text-gray-500">아직 예약/문의가 없습니다.</p>
            )}
            {bookings.map((b) => (
              <div key={b.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>{b.user_email}</span>
                  <span>{b.tour_title}</span>
                </div>
                <p className="text-gray-800 text-sm mb-3">{b.message}</p>

                {b.meeting_link ? (
                  <p className="text-sm text-green-700 break-all">
                    ✅ 링크 등록됨: {b.meeting_link}
                  </p>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Zoom/Meet 링크 붙여넣기"
                      value={linkInputs[b.id] || ""}
                      onChange={(e) =>
                        setLinkInputs({ ...linkInputs, [b.id]: e.target.value })
                      }
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleSaveLink(b.id)}
                      disabled={savingId === b.id}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                      {savingId === b.id ? "저장 중..." : "링크 저장"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            리뷰 / 후기 목록 ({reviews.length})
          </h2>
          <div className="space-y-3">
            {reviews.length === 0 && (
              <p className="text-sm text-gray-500">아직 리뷰가 없습니다.</p>
            )}
            {reviews.map((r) => (
              <div key={r.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>{r.user_email}</span>
                  <span>{r.tour_id} · {"⭐".repeat(r.rating)}</span>
                </div>
                <p className="text-gray-800 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}