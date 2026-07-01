import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Camera, Video, Star, Mountain, BookOpen, Aperture, Phone, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Link } from "wouter";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string | null;
}

const CATEGORY_ICONS: Record<string, typeof Camera> = {
  Wedding: Camera,
  Videography: Video,
  Portrait: Star,
  Events: Mountain,
  Album: BookOpen,
  default: Aperture,
};

const SAMPLE_IMAGES: Record<string, string> = {
  Wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  Videography: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80",
  Portrait: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
  Events: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  Album: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80",
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = CATEGORY_ICONS[service.category] ?? CATEGORY_ICONS.default;
  const img = service.imageUrl || SAMPLE_IMAGES[service.category] || "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80";

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: (index % 3) * 0.1 }}
      className="group bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col"
    >
      <div className="aspect-video overflow-hidden bg-zinc-800 relative">
        <img
          src={img}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75 group-hover:opacity-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
            <Icon className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <span className="text-[#D4AF37] text-xs font-medium tracking-wider uppercase">{service.category}</span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-white text-xl mb-3">{service.name}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed flex-1 mb-5">{service.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-xs">Starting from</span>
            <div className="text-[#D4AF37] font-bold text-2xl font-serif">₹{service.price.toLocaleString()}</div>
          </div>
          <a
            href="#booking"
            onClick={() => window.location.href = "/contact"}
            className="px-5 py-2.5 bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-sm font-medium rounded-sm hover:bg-[#D4AF37] hover:text-zinc-950 transition-all duration-300"
          >
            Book Now
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: () => fetch("/api/services").then((r) => r.json()),
  });

  const categories = services
    ? ["All", ...Array.from(new Set(services.map((s) => s.category)))]
    : ["All"];

  const filtered =
    activeCategory === "All"
      ? (services ?? [])
      : (services ?? []).filter((s) => s.category === activeCategory);

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
            What We Do
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl text-white mb-6"
          >
            Service <span className="text-[#D4AF37]">Catalogue</span>
          </motion.h1>
          <div className="w-20 h-px bg-[#D4AF37]/50 mx-auto mb-6" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-zinc-400 text-lg max-w-2xl mx-auto"
          >
            Professional photography and videography services for every occasion and budget.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
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

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">No services found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((service, i) => (
                <ServiceCard key={service.id} service={service} index={i} />
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center p-10 border border-[#D4AF37]/20 bg-[#D4AF37]/5 rounded-sm"
          >
            <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase mb-3">Custom Packages</p>
            <h3 className="font-serif text-3xl text-white mb-4">
              Have a Unique Requirement?
            </h3>
            <p className="text-zinc-400 mb-6 max-w-lg mx-auto text-sm leading-relaxed">
              We create custom photography & videography packages tailored to your specific event,
              budget, and vision. Call us to discuss your requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+919939860818"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#D4AF37] text-zinc-950 font-semibold text-sm rounded-sm hover:bg-[#B8941E] transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call: +91 99398 60818
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-[#D4AF37]/40 text-[#D4AF37] font-medium text-sm rounded-sm hover:bg-[#D4AF37]/10 transition-colors"
              >
                Book Online
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
