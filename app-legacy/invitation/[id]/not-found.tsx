import Link from "next/link";

export default function InvitationNotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-rose-800 mb-2">
          Letter not found
        </h1>
        <p className="text-rose-600 mb-6">
          This link may be invalid or the letter was removed.
        </p>
        <Link
          href="/create"
          className="inline-block rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium py-3 px-6 shadow-lg shadow-rose-300/50 hover:from-rose-600 hover:to-pink-600 transition"
        >
          Create your own letter
        </Link>
      </div>
    </main>
  );
}
