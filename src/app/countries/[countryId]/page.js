import Link from "next/link";
import { countries, tours } from "../../../lib/toursData";

export default async function CountryPage({ params }) {
  const { countryId } = await params;
  const country = countries.find((c) => c.id === countryId);
  const cityTours = tours.filter((t) => t.countryId === countryId);
  if (!country) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">국가를 찾을 수 없습니다.</p>
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

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          {country.name} 투어
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cityTours.map((tour) => (
            <Link
              key={tour.id}
              href={`/tours/${tour.id}`}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition block"
            >
              <div className="bg-gray-200 h-40 rounded-lg mb-4"></div>
              <h3 className="font-semibold text-gray-900">{tour.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                현지 가이드: {tour.guide}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}