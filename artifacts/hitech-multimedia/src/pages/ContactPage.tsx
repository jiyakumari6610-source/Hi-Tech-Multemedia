import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Booking from "@/components/Booking";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    value: "+91 99398 60818",
    href: "tel:+919939860818",
    sub: "Call or WhatsApp anytime",
  },
  {
    icon: Mail,
    title: "Email",
    value: "hitechbokaro@gmail.com",
    href: "mailto:hitechbokaro@gmail.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Bokaro Steel City",
    href: "https://maps.google.com/?q=Bokaro+Steel+City+Jharkhand",
    sub: "Jharkhand, India",
  },
  {
    icon: Clock,
    title: "Studio Hours",
    value: "Mon – Sat: 9 AM – 7 PM",
    href: null,
    sub: "Sunday: By appointment",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function ContactPage() {
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
            Get In Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl text-white mb-6"
          >
            Contact <span className="text-[#D4AF37]">Us</span>
          </motion.h1>
          <div className="w-20 h-px bg-[#D4AF37]/50 mx-auto mb-6" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-zinc-400 text-lg max-w-2xl mx-auto"
          >
            Ready to capture your memories? Reach out and let's discuss your vision.
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, i) => {
              const content = (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`group p-6 bg-zinc-950 border border-zinc-800 rounded-sm transition-all duration-300 hover:border-[#D4AF37]/40 ${item.href ? "cursor-pointer" : ""}`}
                >
                  <div className="w-12 h-12 mb-4 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
                    <item.icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">{item.title}</p>
                  <p className="text-white font-medium text-sm mb-1">{item.value}</p>
                  <p className="text-zinc-500 text-xs">{item.sub}</p>
                </motion.div>
              );

              return item.href ? (
                <a key={i} href={item.href} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                <div key={i}>{content}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="py-8 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="w-full h-56 bg-zinc-800 border border-zinc-700 rounded-sm overflow-hidden flex items-center justify-center">
            <a
              href="https://maps.google.com/?q=Bokaro+Steel+City+Jharkhand"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 text-zinc-400 hover:text-[#D4AF37] transition-colors"
            >
              <MapPin className="w-8 h-8" />
              <span className="text-sm font-medium">View on Google Maps — Bokaro Steel City, Jharkhand</span>
              <span className="text-xs text-zinc-500">Click to open maps</span>
            </a>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <Booking />

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
