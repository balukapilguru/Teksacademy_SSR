import Link from "next/link";

export default function GonePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="max-w-2xl text-center">

        <h1 className="text-8xl font-bold text-red-600">
          410
        </h1>

        <h2 className="text-3xl font-semibold mt-6">
          This page has been permanently removed
        </h2>

        <p className="text-gray-600 mt-4">
          The page you are looking for has been intentionally removed and is no
          longer available.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="bg-red-600 text-white px-6 py-3 rounded-lg"
          >
            Go Home
          </Link>

          <Link
            href="/course"
            className="border border-gray-300 px-6 py-3 rounded-lg"
          >
            Browse Courses
          </Link>
        </div>

      </div>
    </main>
  );
}