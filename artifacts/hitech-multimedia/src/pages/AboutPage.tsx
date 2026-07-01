import { motion } from "framer-motion";
import { Award, Heart, Camera, Star, Users, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Stats from "@/components/Stats";

const values = [
  {
    icon: Camera,
    title: "Premium Quality",
    desc: "We use professional-grade equipment and advanced editing techniques to ensure every image and video meets the highest standards.",
  },
  {
    icon: Heart,
    title: "Passion & Dedication",
    desc: "Every project is treated as if it were our own memory to preserve — with deep care, creativity, and a personal touch.",
  },
  {
    icon: Star,
    title: "Client-First Approach",
    desc: "Your vision, your story, your preferences come first. We listen, plan, and deliver exactly what you dream of.",
  },
];

const whyUs = [
  "10+ years of professional experience in photography & videography",
  "Served 500+ satisfied clients across Jharkhand and beyond",
  "Latest DSLR & drone equipment for stunning aerial coverage",
  "Same-day highlights delivered for weddings",
  "Premium album printing & binding with lifetime guarantee",
  "Affordable packages tailored to every budget",
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  return (
    <main className="w-full bg-zinc-950 text-foreground overflow-x-hidden">
      <Navbar />

      {/* Page Header */}
      <section className="relative pt-32 pb-20 bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#D4AF3720_0%,_transparent_60%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase mb-4"
          >
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-serif text-5xl md:text-6xl text-white mb-6"
          >
            About <span className="text-[#D4AF37]">Us</span>
          </motion.h1>
          <div className="w-20 h-px bg-[#D4AF37]/50 mx-auto mb-6" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Bokaro's premier photography & multimedia studio, capturing memories since over a decade.
          </motion.p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase mb-3">Who We Are</p>
            <h2 className="font-serif text-4xl text-white mb-6 leading-tight">
              Preserving Your Most <br />
              <span className="text-[#D4AF37]">Precious Moments</span>
            </h2>
            <div className="space-y-4 text-zinc-400 leading-relaxed">
              <p>
                Hi-tech Multimedia is Bokaro Steel City's most trusted photography and videography studio,
                founded with a singular passion — to capture life's most precious moments in their truest,
                most beautiful form.
              </p>
              <p>
                Based in the heart of Jharkhand, we have built a reputation for exceptional quality,
                unmatched creativity, and a client-first approach. From grand wedding celebrations to
                intimate birthday portraits, every project receives our complete dedication.
              </p>
              <p>
                We combine state-of-the-art equipment with artistic expertise to create photographs and
                films that you'll treasure for a lifetime — and pass down for generations.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-6">
              {[
                { icon: Users, label: "500+ Happy Clients" },
                { icon: Award, label: "Premium Quality" },
                { icon: Clock, label: "10+ Years Experience" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                  <item.icon className="w-4 h-4 text-[#D4AF37]" />
                  {item.label}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-zinc-800 rounded-sm overflow-hidden border border-zinc-700">
              <img
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80"
                alt="Hi-tech Multimedia Studio"
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-zinc-950 border border-[#D4AF37]/30 rounded-sm flex flex-col items-center justify-center text-center p-4">
              <span className="font-serif text-4xl text-[#D4AF37] font-bold">10+</span>
              <span className="text-zinc-400 text-xs mt-1 leading-tight">Years of Excellence</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase mb-3">Our Principles</p>
            <h2 className="font-serif text-4xl text-white">Core Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group p-8 border border-zinc-800 rounded-sm hover:border-[#D4AF37]/40 transition-all duration-300 text-center hover:bg-zinc-900/50"
              >
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
                  <v.icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="font-serif text-xl text-white mb-3">{v.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="aspect-video bg-zinc-800 rounded-sm overflow-hidden border border-zinc-700">
              <img
                src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80"
                alt="Photography Setup"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase mb-3">Why Hi-tech</p>
            <h2 className="font-serif text-4xl text-white mb-8 leading-tight">
              Why Choose <span className="text-[#D4AF37]">Us?</span>
            </h2>
            <ul className="space-y-4">
              {whyUs.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <Stats />

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
