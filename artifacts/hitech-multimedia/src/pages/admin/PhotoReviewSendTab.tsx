import { useState, useEffect } from "react";
import { useListBookings, useListGallery } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Copy, Send, Trash2, ImageIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ReviewSession = {
  id: number;
  bookingId: number;
  bookingName: string;
  token: string;
  status: string;
  photoUrls: string[];
  customerNote: string | null;
  createdAt: string;
};

async function fetchSessions(): Promise<ReviewSession[]> {
  const res = await fetch("/api/admin/photo-reviews");
  if (!res.ok) throw new Error("Failed to load review sessions");
  return res.json();
}

async function createSession(body: { bookingId: number; bookingName: string; photoUrls: string[] }) {
  const res = await fetch("/api/admin/photo-reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to create review session");
  return res.json();
}

async function deleteSession(id: number) {
  const res = await fetch(`/api/admin/photo-reviews/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw new Error("Failed to delete session");
}

function buildReviewUrl(token: string) {
  return `${window.location.origin}/review/${token}`;
}

export default function PhotoReviewSendTab() {
  const { data: bookings, isLoading: bookingsLoading } = useListBookings();
  const { data: gallery, isLoading: galleryLoading } = useListGallery();
  const [sessions, setSessions] = useState<ReviewSession[] | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  function refresh() {
    fetchSessions().then(setSessions).catch(() => toast({ title: "Failed to load review sessions", variant: "destructive" }));
  }

  useEffect(() => { refresh(); }, []);

  function togglePhoto(url: string) {
    setSelectedPhotos((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  }

  async function handleCreate() {
    const booking = bookings?.find((b) => String(b.id) === selectedBookingId);
    if (!booking) {
      toast({ title: "Select a booking first", variant: "destructive" });
      return;
    }
    if (selectedPhotos.size === 0) {
      toast({ title: "Select at least one photo", variant: "destructive" });
      return;
    }
    setCreating(true);
    try {
      await createSession({
        bookingId: booking.id,
        bookingName: booking.name,
        photoUrls: Array.from(selectedPhotos),
      });
      setSelectedPhotos(new Set());
      setSelectedBookingId("");
      refresh();
      toast({ title: "Review link created" });
    } catch {
      toast({ title: "Failed to create review link", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  }

  function handleCopy(token: string) {
    navigator.clipboard.writeText(buildReviewUrl(token));
    toast({ title: "Link copied to clipboard" });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this review session? The link will stop working.")) return;
    try {
      await deleteSession(id);
      refresh();
      toast({ title: "Review session deleted" });
    } catch {
      toast({ title: "Failed to delete session", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Send Photos for Review</h2>
        <p className="text-zinc-500 text-sm">
          Pick a booking, select the photos you want the customer to review, and generate a link they can use to view and confirm their selection.
        </p>
      </div>

      {/* Create new session */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-5">
        <div>
          <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-1.5">Booking</label>
          {bookingsLoading ? (
            <Skeleton className="h-10 w-full max-w-sm" />
          ) : (
            <Select value={selectedBookingId} onValueChange={setSelectedBookingId}>
              <SelectTrigger className="w-full max-w-sm bg-zinc-950 border-zinc-700">
                <SelectValue placeholder="Select a booking" />
              </SelectTrigger>
              <SelectContent>
                {bookings?.map((b) => (
                  <SelectItem key={b.id} value={String(b.id)}>
                    {b.name} — {b.eventType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div>
          <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">
            Select Photos ({selectedPhotos.size} selected)
          </label>
          {galleryLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-md" />)}
            </div>
          ) : !gallery || gallery.length === 0 ? (
            <div className="flex flex-col items-center text-zinc-500 py-10 border border-dashed border-zinc-800 rounded-lg">
              <ImageIcon className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">No photos in your gallery yet. Add some in the Photo Selection tab first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-96 overflow-y-auto pr-1">
              {gallery.map((photo) => {
                const isSelected = selectedPhotos.has(photo.imageUrl);
                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => togglePhoto(photo.imageUrl)}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                      isSelected ? "border-[#D4AF37]" : "border-transparent hover:border-zinc-700"
                    }`}
                  >
                    <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-[#D4AF37]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <Button onClick={handleCreate} disabled={creating} className="bg-[#D4AF37] text-zinc-950 font-semibold hover:bg-[#C9A227]">
          <Send className="h-4 w-4 mr-2" />
          {creating ? "Creating..." : "Create Review Link"}
        </Button>
      </div>

      {/* Existing sessions */}
      <div>
        <h3 className="text-white font-semibold mb-3">Sent Review Links</h3>
        {!sessions ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-zinc-500 text-sm py-6">No review links created yet.</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => (
              <div key={s.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium text-sm">{s.bookingName}</p>
                    <Badge
                      variant="outline"
                      className={`text-xs font-normal ${
                        s.status === "confirmed" ? "border-green-700 text-green-400 bg-green-950/30" : "border-zinc-700 text-zinc-400 bg-zinc-950"
                      }`}
                    >
                      {s.status}
                    </Badge>
                  </div>
                  <p className="text-zinc-500 text-xs mt-1">{s.photoUrls.length} photos · created {new Date(s.createdAt).toLocaleDateString()}</p>
                  {s.customerNote && <p className="text-zinc-400 text-xs mt-1 italic">Note: "{s.customerNote}"</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline" className="h-8 text-xs border-zinc-700 bg-zinc-950 hover:bg-zinc-800" onClick={() => handleCopy(s.token)}>
                    <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Link
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-red-400/10" onClick={() => handleDelete(s.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
