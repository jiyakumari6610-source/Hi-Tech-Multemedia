import { motion } from "framer-motion";
import { ArrowRight, Camera, Video, BookOpen } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Booking from "@/components/Booking";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const quickServices = [
  { icon: Camera, title: "Photography", desc: "Wedding, Pre-wedding, Birthday & Events", href: "/services" },
  { icon: Video, title: "Videography", desc: "Cinematic wedding films & highlight reels", href: "/services" },
  { icon: BookOpen, title: "Albums & Products", desc: "Premium photo albums, frames & canvas prints", href: "/products" },
];

export default function Home() {
  return (
    <main className="w-full bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      <Navbar />
      <Hero />

      {/* Quick Services Teaser */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase mb-3">What We Offer</p>
            <h2 className="font-serif text-4xl text-white mb-4">Our Expertise</h2>
            <div className="w-16 h-px bg-[#D4AF37]/50 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickServices.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group text-center p-8 border border-zinc-800 rounded-sm hover:border-[#D4AF37]/50 transition-all duration-300 hover:bg-zinc-900/50"
              >
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
                  <item.icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="text-white font-serif text-xl mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm mb-4">{item.desc}</p>
                <Link href={item.href} className="inline-flex items-center gap-1.5 text-[#D4AF37] text-xs font-medium hover:underline">
                  Learn More <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-[#D4AF37]/40 text-[#D4AF37] text-sm font-medium rounded-sm hover:bg-[#D4AF37] hover:text-zinc-950 transition-all duration-300"
            >
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <About />

      {/* Gallery Teaser with link */}
      <div className="relative">
        <Gallery />
        <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
          <Link
            href="/gallery"
            className="pointer-events-auto inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-950/90 border border-[#D4AF37]/40 text-[#D4AF37] text-sm font-medium rounded-sm hover:bg-[#D4AF37] hover:text-zinc-950 transition-all duration-300 backdrop-blur-sm"
          >
            View Full Gallery <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <Stats />
      <Testimonials />
      <Booking />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
