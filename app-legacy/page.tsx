import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50 p-4">
      <h1 className="text-4xl md:text-6xl font-bold text-red-600 mb-6 text-center">
        Create Your Valentine 💌
      </h1>
      <p className="text-lg text-gray-700 mb-8 max-w-md text-center">
        Design a custom letter, create a unique link, and send it to your special someone.
      </p>
      
      <Link 
        href="/create" 
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
      >
        Make a Letter
      </Link>
    </div>
  );
}