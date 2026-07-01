import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListGallery } from "@workspace/api-client-react";
import { Heart, X, ZoomIn } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function Gallery() {
  const { data: galleryItems, isLoading } = useListGallery();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const categories = ["All", ...Array.from(new Set(galleryItems?.map(item => item.category) || []))];

  const filteredItems = galleryItems?.filter(
    item => selectedCategory === "All" || item.category === selectedCategory
  );

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section id="gallery" className="py-24 bg-background relative border-t border-border">
      <div className="container px-4 mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 flex flex-col items-center"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-primary mb-4">Our Portfolio</h2>
          <div className="h-px w-24 bg-primary mx-auto opacity-50 mb-8" />
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full border transition-all duration-300 ${
                  selectedCategory === category 
                    ? "border-primary bg-primary text-primary-foreground" 
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Favorites Counter */}
          <div className="fixed bottom-6 right-6 z-50 bg-card border border-primary/30 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <span className="font-serif text-primary font-bold">{favorites.size}</span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Selected</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-sm overflow-hidden bg-muted animate-pulse" />
            ))
          ) : (
            <AnimatePresence>
              {filteredItems?.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative aspect-square overflow-hidden rounded-sm cursor-pointer border border-border"
                  onClick={() => setLightboxImage(item.imageUrl)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="font-serif text-xl text-primary transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                    <p className="text-sm text-foreground/80 font-light transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{item.category}</p>
                    
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className="p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-primary/20 transition-colors"
                      >
                        <Heart className={`w-5 h-5 transition-colors ${favorites.has(item.id) ? 'text-primary fill-primary' : 'text-primary'}`} />
                      </button>
                      <button className="p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-primary/20 transition-colors">
                        <ZoomIn className="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-none overflow-hidden">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          <DialogDescription className="sr-only">Full screen view of gallery image</DialogDescription>
          {lightboxImage && (
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={lightboxImage} 
                alt="Lightbox preview" 
                className="max-w-full max-h-[90vh] object-contain rounded-sm"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
