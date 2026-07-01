import { useState } from "react";
import {
  useListGallery,
  useUpdateGalleryItem,
  useDeleteGalleryItem,
  useCreateGalleryItem,
  getListGalleryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PhotoSelectionTab() {
  const { data: photos, isLoading } = useListGallery();
  const updateGalleryItem = useUpdateGalleryItem();
  const deleteGalleryItem = useDeleteGalleryItem();
  const createGalleryItem = useCreateGalleryItem();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [filter, setFilter] = useState<"all" | "selected" | "featured">("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ title: "", category: "", imageUrl: "", description: "" });

  const handleToggle = (id: number, field: "selected" | "featured", currentValue: boolean) => {
    updateGalleryItem.mutate(
      { id, data: { [field]: !currentValue } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Delete this photo from gallery?")) return;
    deleteGalleryItem.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() });
          toast({ title: "Photo deleted" });
        },
      }
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    createGalleryItem.mutate(
      { data: newPhoto },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() });
          setIsAddOpen(false);
          setNewPhoto({ title: "", category: "", imageUrl: "", description: "" });
          toast({ title: "Photo added" });
        },
      }
    );
  };

  const filteredPhotos = photos?.filter(p => {
    if (filter === "selected") return p.selected;
    if (filter === "featured") return p.featured;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex bg-zinc-950 rounded-lg p-1 border border-zinc-800">
          {(["all", "selected", "featured"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm rounded-md capitalize transition-colors ${
                filter === f ? "bg-primary text-primary-foreground font-medium" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" /> Add Photo
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Photo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-zinc-400">Image URL</Label>
                <Input
                  id="imageUrl"
                  required
                  value={newPhoto.imageUrl}
                  onChange={e => setNewPhoto({ ...newPhoto, imageUrl: e.target.value })}
                  className="bg-zinc-900 border-zinc-800"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title" className="text-zinc-400">Title</Label>
                <Input
                  id="title"
                  required
                  value={newPhoto.title}
                  onChange={e => setNewPhoto({ ...newPhoto, title: e.target.value })}
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-zinc-400">Category</Label>
                <Input
                  id="category"
                  required
                  value={newPhoto.category}
                  onChange={e => setNewPhoto({ ...newPhoto, category: e.target.value })}
                  className="bg-zinc-900 border-zinc-800"
                  placeholder="e.g. Wedding, Pre-wedding"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-zinc-400">Description</Label>
                <Textarea
                  id="description"
                  value={newPhoto.description}
                  onChange={e => setNewPhoto({ ...newPhoto, description: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 resize-none"
                />
              </div>
              <Button type="submit" className="w-full" disabled={createGalleryItem.isPending}>
                {createGalleryItem.isPending ? "Adding..." : "Add Photo"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {filteredPhotos?.map(photo => (
            <div
              key={photo.id}
              className={`break-inside-avoid relative group rounded-xl overflow-hidden bg-zinc-900 border ${
                photo.selected ? "border-primary" : "border-zinc-800"
              }`}
            >
              <div className="aspect-[4/5] relative">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className={`h-8 w-8 rounded-full ${
                        photo.featured ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-black/50 text-white hover:bg-black/70 border border-white/20"
                      }`}
                      onClick={() => handleToggle(photo.id, "featured", photo.featured || false)}
                      title="Toggle Featured"
                    >
                      <Star className={`h-4 w-4 ${photo.featured ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className={`h-8 w-8 rounded-full ${
                        photo.selected ? "bg-green-500 text-white hover:bg-green-600" : "bg-black/50 text-white hover:bg-black/70 border border-white/20"
                      }`}
                      onClick={() => handleToggle(photo.id, "selected", photo.selected || false)}
                      title="Toggle Selected"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(photo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-xs font-medium text-primary mb-1 uppercase tracking-wider">
                      {photo.category}
                    </div>
                    <h3 className="text-white font-serif text-lg leading-tight">{photo.title}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredPhotos?.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500">
              <ImageIcon className="h-12 w-12 mb-4 opacity-20" />
              <p>No photos found in this filter.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
