import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, Package, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string | null;
}

const SAMPLE_PRODUCTS: Product[] = [
  { id: 0, name: "Premium Wedding Album", description: "Luxury hardcover wedding album with lay-flat binding, 40–80 pages, custom size options", price: 3500, category: "Albums", imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80" },
  { id: 1, name: "Softcover Photo Book", description: "Elegant softcover photobook ideal for portraits, events, and travel memories", price: 1200, category: "Albums", imageUrl: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400&q=80" },
  { id: 2, name: "Canvas Wall Art", description: "Gallery-quality canvas prints stretched on solid wood frames, ready to hang", price: 899, category: "Prints", imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&q=80" },
  { id: 3, name: "Photo Frame Set", description: "Set of 3 premium metal photo frames in matching gold/black finish", price: 650, category: "Frames", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },
  { id: 4, name: "USB / Pendrive Package", description: "All event photos & videos delivered on a custom-branded USB drive with carry case", price: 800, category: "Digital", imageUrl: "https://images.unsplash.com/photo-1563396983906-b3795482a59a?w=400&q=80" },
  { id: 5, name: "Acrylic Photo Block", description: "Stunning photo printed behind crystal-clear acrylic — a modern display centerpiece", price: 1100, category: "Prints", imageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&q=80" },
  { id: 6, name: "Mini Accordion Album", description: "Compact accordion-style mini album perfect as a keepsake gift for guests", price: 450, category: "Albums", imageUrl: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400&q=80" },
  { id: 7, name: "Photo Calendar", description: "Personalized 12-month wall calendar printed with your favourite memories", price: 350, category: "Prints", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
];

const ALL_CATEGORIES = ["All", "Albums", "Prints", "Frames", "Digital"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: (index % 4) * 0.08 }}
      className="group bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col"
    >
      <div className="aspect-[4/3] overflow-hidden bg-zinc-800">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-zinc-600" />
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-serif text-white text-base font-medium leading-tight">{product.name}</h3>
          <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded-sm whitespace-nowrap flex-shrink-0">
            {product.category}
          </span>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed flex-1 mb-4">{product.description}</p>
        <div className="flex items-center justify-between gap-3 mt-auto">
          <div>
            <span className="text-[#D4AF37] text-xs font-medium">Starting at</span>
            <div className="text-white font-semibold text-lg">₹{product.price.toLocaleString()}</div>
          </div>
          <a
            href="tel:+919939860818"
            className="flex items-center gap-1.5 px-3 py-2 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-medium rounded-sm hover:bg-[#D4AF37] hover:text-zinc-950 transition-all duration-300"
          >
            <Phone className="w-3.5 h-3.5" />
            Enquire
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: apiProducts } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => fetch("/api/products").then((r) => r.json()),
  });

  const products = (apiProducts && apiProducts.length > 0) ? apiProducts : SAMPLE_PRODUCTS;

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const categories = apiProducts && apiProducts.length > 0
    ? ["All", ...Array.from(new Set(apiProducts.map((p) => p.category)))]
    : ALL_CATEGORIES;

  return (
    <main className="w-full bg-zinc-950 text-foreground overflow-x-hidden">
      <Navbar />

      {/* Page Header */}
      <section className="relative pt-32 pb-16 bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#D4AF3720_0%,_transparent_60%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase mb-4"
          >
            Shop Our Catalogue
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl text-white mb-6"
          >
            Product <span className="text-[#D4AF37]">Catalogue</span>
          </motion.h1>
          <div className="w-20 h-px bg-[#D4AF37]/50 mx-auto mb-6" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-zinc-400 text-lg max-w-2xl mx-auto"
          >
            Premium albums, prints, frames, and digital packages to preserve your memories in style.
          </motion.p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-sm font-medium rounded-sm border transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#D4AF37] text-zinc-950 border-[#D4AF37]"
                    : "border-zinc-700 text-zinc-400 hover:border-[#D4AF37]/50 hover:text-zinc-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">No products in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center p-10 border border-[#D4AF37]/20 bg-[#D4AF37]/5 rounded-sm"
          >
            <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase mb-3">Custom Orders</p>
            <h3 className="font-serif text-3xl text-white mb-4">
              Need a Custom Product?
            </h3>
            <p className="text-zinc-400 mb-6 max-w-lg mx-auto text-sm leading-relaxed">
              We offer bespoke album designs, custom frame sizes, bulk printing, and more.
              Contact us directly for custom quotes and special packages.
            </p>
            <a
              href="tel:+919939860818"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#D4AF37] text-zinc-950 font-semibold text-sm rounded-sm hover:bg-[#B8941E] transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call Us: +91 99398 60818
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
