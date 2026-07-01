import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function GalleryPage() {
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
            transition={{ duration: 0.6 }}
            className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase mb-4"
          >
            Our Portfolio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-serif text-5xl md:text-6xl text-white mb-6"
          >
            Our <span className="text-[#D4AF37]">Gallery</span>
          </motion.h1>
          <div className="w-20 h-px bg-[#D4AF37]/50 mx-auto mb-6" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-zinc-400 text-lg max-w-2xl mx-auto"
          >
            A curated selection of our finest work — weddings, portraits, events, and more.
          </motion.p>
        </div>
      </section>

      {/* Gallery Section */}
      <Gallery />

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
