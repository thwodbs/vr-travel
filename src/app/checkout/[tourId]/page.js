"use client";

import { useEffect, useRef, useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { tours } from "../../../lib/toursData";
import { supabase } from "../../../lib/supabaseClient";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

export default function CheckoutPage({ params }) {
  const [tourId, setTourId] = useState(null);
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [widgets, setWidgets] = useState(null);
  const paymentMethodRef = useRef(null);

  useEffect(() => {
    params.then((p) => setTourId(p.tourId));
  }, [params]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setChecking(false);
    });
  }, []);

  const tour = tours.find((t) => t.id === tourId);

  useEffect(() => {
    if (!tour || !user) return;

    async function initWidgets() {
      const tossPayments = await loadTossPayments(clientKey);
      const widgetsInstance = tossPayments.widgets({
        customerKey: user.id,
      });

      await widgetsInstance.setAmount({
        currency: "KRW",
        value: tour.price,
      });

      await widgetsInstance.renderPaymentMethods({
        selector: "#payment-method",
      });

      setWidgets(widgetsInstance);
    }

    initWidgets();
  }, [tour, user]);

  const handlePayment = async () => {
    if (!widgets) return;

    const orderId = `order_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    await supabase.from("bookings").insert({
      user_email: user.email,
      tour_id: tour.id,
      tour_title: tour.title,
      message: "(결제 진행 중)",
      price: tour.price,
      payment_status: "pending",
      order_id: orderId,
    });

    await widgets.requestPayment({
      orderId: orderId,
      orderName: tour.title,
      successUrl: `${window.location.origin}/checkout/success`,
      failUrl: `${window.location.origin}/checkout/fail`,
      customerEmail: user.email,
    });
  };

  if (checking || !tourId) {
    return null;
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">로그인 후 이용해주세요.</p>
      </main>
    );
  }

  if (!tour) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">투어를 찾을 수 없습니다.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-xl font-bold text-gray-900 mb-1">{tour.title}</h1>
        <p className="text-gray-500 mb-6">
          {tour.price.toLocaleString()}원
        </p>

        <div id="payment-method" ref={paymentMethodRef} className="mb-6" />

        <button
          onClick={handlePayment}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          {tour.price.toLocaleString()}원 결제하기
        </button>
      </div>
    </main>
  );
}