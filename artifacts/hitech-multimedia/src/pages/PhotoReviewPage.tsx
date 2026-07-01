import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { CheckCircle, ImageOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useBusinessSettings } from "@/hooks/use-business-settings";

type Session = {
  id: number;
  bookingId: number;
  bookingName: string;
  status: string;
  photoUrls: string[];
  customerNote: string | null;
  createdAt: string;
};

export default function PhotoReviewPage() {
  const { token } = useParams<{ token: string }>();
  const settings = useBusinessSettings();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/photo-reviews/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data: Session) => {
        setSession(data);
        setNote(data.customerNote ?? "");
        setConfirmed(data.status === "confirmed");
      })
      .catch(() => setError("This review link is invalid or has expired."))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleConfirm() {
    if (!token) return;
    setConfirming(true);
    try {
      const res = await fetch(`/api/photo-reviews/${token}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerNote: note }),
      });
      if (!res.ok) throw new Error();
      const data: Session = await res.json();
      setSession(data);
      setConfirmed(true);
    } catch {
      setError("Failed to submit your confirmation. Please try again.");
    } finally {
      setConfirming(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center px-4">
        <ImageOff className="w-10 h-10 text-zinc-600 mb-4" />
        <p className="text-zinc-400">{error || "Review link not found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 py-6 px-4 text-center">
        <h1 className="font-serif text-2xl text-[#D4AF37]">{settings.business_name}</h1>
        <p className="text-zinc-500 text-sm mt-1">Photo Selection Review</p>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-semibold text-white">Hi {session.bookingName.split(" ")[0]}, here are your selected photos</h2>
          <p className="text-zinc-500 text-sm mt-1">
            {session.photoUrls.length} photo{session.photoUrls.length !== 1 ? "s" : ""} selected for your event
          </p>
        </div>

        {session.photoUrls.length === 0 ? (
          <div className="text-center text-zinc-500 py-16">No photos have been added to this review yet. Please check back soon.</div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4 mb-10">
            {session.photoUrls.map((url, i) => (
              <div key={i} className="break-inside-avoid rounded-lg overflow-hidden border border-zinc-800">
                <img src={url} alt={`Selected photo ${i + 1}`} className="w-full h-auto object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="max-w-xl mx-auto bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          {confirmed ? (
            <div className="flex flex-col items-center text-center gap-2 py-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <p className="text-white font-medium">Thank you! Your selection has been confirmed.</p>
              <p className="text-zinc-500 text-sm">We'll be in touch about the next steps.</p>
            </div>
          ) : (
            <>
              <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">
                Notes or requested changes (optional)
              </label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Let us know if you'd like any changes to this selection..."
                className="bg-zinc-950 border-zinc-700 resize-none mb-4"
                rows={3}
              />
              <Button
                onClick={handleConfirm}
                disabled={confirming}
                className="w-full bg-[#D4AF37] text-zinc-950 font-semibold hover:bg-[#C9A227]"
              >
                {confirming ? "Submitting..." : "Confirm My Selection"}
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
