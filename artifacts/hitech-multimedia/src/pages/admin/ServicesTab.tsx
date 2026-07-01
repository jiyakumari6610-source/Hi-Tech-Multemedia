import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Check, Wrench, Loader2 } from "lucide-react";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string | null;
}

const CATEGORIES = ["Wedding", "Portrait", "Videography", "Events", "Album", "Drone", "Other"];

const emptyForm = { name: "", description: "", price: "", category: "Wedding", imageUrl: "" };

export default function ServicesTab() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: () => fetch("/api/services").then((r) => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (body: Omit<Service, "id">) =>
      fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => r.json()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["services"] }); resetForm(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...body }: Service) =>
      fetch(`/api/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => r.json()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["services"] }); resetForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/services/${id}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["services"] }); setDeleteId(null); },
  });

  function resetForm() { setForm(emptyForm); setShowForm(false); setEditId(null); }

  function startEdit(s: Service) {
    setEditId(s.id);
    setForm({ name: s.name, description: s.description, price: String(s.price), category: s.category, imageUrl: s.imageUrl ?? "" });
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { name: form.name, description: form.description, price: parseFloat(form.price), category: form.category, imageUrl: form.imageUrl || null };
    if (editId !== null) {
      updateMutation.mutate({ id: editId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Service Catalogue</h2>
          <p className="text-zinc-500 text-sm">{services.length} service{services.length !== 1 ? "s" : ""} listed</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-zinc-950 font-semibold text-sm rounded-md hover:bg-[#C9A227] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-zinc-900 border border-[#D4AF37]/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-medium">{editId !== null ? "Edit Service" : "New Service"}</h3>
            <button onClick={resetForm} className="text-zinc-500 hover:text-zinc-300">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-1.5">Service Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-sm focus:outline-none focus:border-[#D4AF37]/50" placeholder="e.g. Wedding Photography" />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-1.5">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-sm focus:outline-none focus:border-[#D4AF37]/50">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-1.5">Starting Price (₹) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="0"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-sm focus:outline-none focus:border-[#D4AF37]/50" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-1.5">Image URL</label>
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-sm focus:outline-none focus:border-[#D4AF37]/50" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-1.5">Description *</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={2}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-sm focus:outline-none focus:border-[#D4AF37]/50 resize-none" placeholder="Describe this service..." />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-zinc-950 font-semibold text-sm rounded-md hover:bg-[#C9A227] disabled:opacity-60">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {editId !== null ? "Save Changes" : "Create Service"}
              </button>
              <button type="button" onClick={resetForm} className="px-5 py-2 border border-zinc-700 text-zinc-400 text-sm rounded-md hover:border-zinc-500 hover:text-zinc-200">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16">
          <Wrench className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500">No services yet. Add your first service above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {services.map((s) => (
            <div key={s.id} className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors">
              {s.imageUrl ? (
                <img src={s.imageUrl} alt={s.name} className="w-14 h-14 rounded-md object-cover flex-shrink-0 bg-zinc-800" />
              ) : (
                <div className="w-14 h-14 rounded-md bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-6 h-6 text-zinc-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium text-sm truncate">{s.name}</span>
                  <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-sm flex-shrink-0">{s.category}</span>
                </div>
                <p className="text-zinc-500 text-xs truncate">{s.description}</p>
                <p className="text-[#D4AF37] text-sm font-semibold mt-1">from ₹{s.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => startEdit(s)} className="p-2 text-zinc-500 hover:text-[#D4AF37] hover:bg-zinc-800 rounded-md transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                {deleteId === s.id ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => deleteMutation.mutate(s.id)}
                      className="px-2 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700">Confirm</button>
                    <button onClick={() => setDeleteId(null)} className="px-2 py-1 bg-zinc-700 text-zinc-300 text-xs rounded-md hover:bg-zinc-600">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteId(s.id)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/20 rounded-md transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
