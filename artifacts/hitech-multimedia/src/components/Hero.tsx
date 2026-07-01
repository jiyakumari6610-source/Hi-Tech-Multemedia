import { motion } from "framer-motion";
import heroImg from "@assets/image_1782735802375.png";

export default function Hero() {
  return (
    <section className="relative h-[100dvh] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img
          src={heroImg}
          alt="Hi-tech Multimedia Premium Wedding Album"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/90" />
      </motion.div>

      {/* Decorative Shimmer/Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent mix-blend-screen" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        {/* Decorative divider */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100px", opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="h-px bg-primary mb-6"
        />

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif text-primary mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        >
          Hi-tech Multimedia
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-2xl font-light text-foreground/90 tracking-widest uppercase mb-8"
        >
          Timeless Memories, Beautifully Captured
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <a
            href="#booking"
            className="inline-block px-8 py-3 border border-primary text-primary font-serif text-lg tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors duration-500 rounded-sm"
          >
            Enquire Now
          </a>
        </motion.div>

        {/* Decorative divider bottom */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100px", opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="h-px bg-primary mt-12"
        />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-xs tracking-widest text-primary/70 mb-2 uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-primary/70 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
