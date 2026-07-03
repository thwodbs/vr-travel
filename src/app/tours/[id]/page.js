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

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("tour_id", id)
      .order("id", { ascending: false });
    setReviews(data || []);
  };

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

  const handleReview = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewStatus("");

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setReviewStatus("로그인 후 후기를 작성할 수 있습니다.");
      setReviewLoading(false);
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      user_email: userData.user.email,
      tour_id: tour.id,
      rating: rating,
      comment: comment,
    });

    setReviewLoading(false);

    if (error) {
      setReviewStatus("오류: " + error.message);
    } else {
      setReviewStatus("후기가 등록되었습니다!");
      setComment("");
      setRating(5);
      fetchReviews();
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
<div className="mb-8">
  <Link
    href={`/checkout/${tour.id}`}
    className="block text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
  >
    {tour.price.toLocaleString()}원 결제하고 예약하기
  </Link>
</div>
        <div className="border-t border-gray-200 pt-6 mb-10">
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

          {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            리뷰 / 후기 ({reviews.length})
          </h2>

          <form onSubmit={handleReview} className="space-y-4 mb-8">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                별점
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                <option value={4}>⭐⭐⭐⭐ (4)</option>
                <option value={3}>⭐⭐⭐ (3)</option>
                <option value={2}>⭐⭐ (2)</option>
                <option value={1}>⭐ (1)</option>
              </select>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={3}
              placeholder="투어는 어떠셨나요?"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={reviewLoading}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {reviewLoading ? "등록 중..." : "후기 등록하기"}
            </button>
          </form>

          {reviewStatus && (
            <p className="mb-6 text-sm text-gray-700">{reviewStatus}</p>
          )}

          <div className="space-y-4">
            {reviews.length === 0 && (
              <p className="text-sm text-gray-500">
                아직 등록된 후기가 없습니다.
              </p>
            )}

            {reviews.map((review) => (
              <div
                key={review.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {"⭐".repeat(review.rating)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {review.user_email}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}