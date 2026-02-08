import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ValentineActions from "./ValentineActions";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

function getSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

const THEME_STYLES: Record<string, { gradient: string; card: string; accent: string }> = {
  red: {
    gradient: "from-rose-100 via-red-50 to-rose-200",
    card: "border-rose-200 bg-gradient-to-br from-rose-50 to-red-50",
    accent: "text-rose-700",
  },
  pink: {
    gradient: "from-pink-100 via-rose-50 to-pink-200",
    card: "border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50",
    accent: "text-pink-700",
  },
  purple: {
    gradient: "from-purple-100 via-violet-50 to-purple-200",
    card: "border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50",
    accent: "text-purple-700",
  },
};

type PageProps = { params: Promise<{ id: string }> };

export default async function InvitationPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = getSupabase();

  const { data: letter, error } = await supabase
    .from("letters")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !letter) {
    notFound();
  }

  const theme = THEME_STYLES[letter.theme_color] ?? THEME_STYLES.pink;

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${theme.gradient} flex flex-col items-center justify-center p-4 py-12`}
    >
      <article
        className={`w-full max-w-lg rounded-3xl border-2 ${theme.card} shadow-xl shadow-black/5 overflow-hidden`}
      >
        <div className="p-6 sm:p-8">
          <p className={`text-sm font-medium ${theme.accent} mb-1`}>
            To: {letter.recipient_name}
          </p>
          <div className="prose prose-lg max-w-none mt-4">
            <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {letter.message}
            </p>
          </div>
          <p className={`mt-8 text-right text-sm font-medium ${theme.accent}`}>
            From: {letter.sender_name}
          </p>
        </div>
      </article>

      <ValentineActions />
    </main>
  );
}
