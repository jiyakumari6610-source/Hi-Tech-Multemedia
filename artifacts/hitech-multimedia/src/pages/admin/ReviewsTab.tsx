import { useState, useEffect } from "react";
import { Plus, Trash2, Star, Quote } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

type Testimonial = {
  id: number;
  name: string;
  event: string;
  text: string;
  rating: number;
  active: boolean;
  createdAt: string;
};

const EMPTY_FORM = { name: "", event: "", text: "", rating: 5 };

async function fetchTestimonials(): Promise<Testimonial[]> {
  const res = await fetch("/api/admin/testimonials");
  if (!res.ok) throw new Error("Failed to load reviews");
  return res.json();
}

async function createTestimonial(body: typeof EMPTY_FORM) {
  const res = await fetch("/api/admin/testimonials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to add review");
  return res.json();
}

async function toggleActive(id: number, active: boolean) {
  const res = await fetch(`/api/admin/testimonials/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ active }),
  });
  if (!res.ok) throw new Error("Failed to update review");
  return res.json();
}

async function deleteTestimonial(id: number) {
  const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw new Error("Failed to delete review");
}

function AddReviewDialog({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTestimonial(form);
      setOpen(false);
      setForm(EMPTY_FORM);
      onAdded();
      toast({ title: "Review added" });
    } catch {
      toast({ title: "Failed to add review", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Add Review
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Customer Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-400">Customer Name</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-zinc-900 border-zinc-800" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event" className="text-zinc-400">Event</Label>
            <Input id="event" required placeholder="e.g. Wedding" value={form.event} onChange={(e) => setForm({ ...form, event: e.target.value })} className="bg-zinc-900 border-zinc-800" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="text" className="text-zinc-400">Review Text</Label>
            <Textarea id="text" required value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className="bg-zinc-900 border-zinc-800 resize-none" rows={4} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rating" className="text-zinc-400">Rating (1-5)</Label>
            <Input id="rating" type="number" min={1} max={5} required value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="bg-zinc-900 border-zinc-800" />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Adding..." : "Add Review"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<Testimonial[] | null>(null);
  const { toast } = useToast();

  function refresh() {
    fetchTestimonials().then(setReviews).catch(() => toast({ title: "Failed to load reviews", variant: "destructive" }));
  }

  useEffect(() => { refresh(); }, []);

  async function handleToggle(id: number, active: boolean) {
    try {
      await toggleActive(id, !active);
      refresh();
    } catch {
      toast({ title: "Failed to update review", variant: "destructive" });
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteTestimonial(id);
      refresh();
      toast({ title: "Review deleted" });
    } catch {
      toast({ title: "Failed to delete review", variant: "destructive" });
    }
  }

  if (!reviews) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">Customer Reviews</h2>
          <p className="text-zinc-500 text-sm">Manage testimonials shown on the public website. Inactive reviews are hidden from visitors.</p>
        </div>
        <AddReviewDialog onAdded={refresh} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((r) => (
          <div key={r.id} className={`bg-zinc-900 border rounded-lg p-5 relative ${r.active ? "border-zinc-800" : "border-zinc-800 opacity-50"}`}>
            <Quote className="w-6 h-6 text-[#D4AF37]/30 absolute top-4 right-4" />
            <div className="flex gap-1 mb-2">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
              ))}
            </div>
            <p className="text-zinc-300 text-sm italic mb-3 leading-relaxed">"{r.text}"</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium text-sm">{r.name}</p>
                <p className="text-zinc-500 text-xs uppercase tracking-wider">{r.event}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs border-zinc-700 bg-zinc-950 hover:bg-zinc-800"
                  onClick={() => handleToggle(r.id, r.active)}
                >
                  {r.active ? "Hide" : "Show"}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-zinc-400 hover:text-red-400 hover:bg-red-400/10"
                  onClick={() => handleDelete(r.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="col-span-full py-16 text-center text-zinc-500">No reviews yet. Add your first one.</div>
        )}
      </div>
    </div>
  );
}
