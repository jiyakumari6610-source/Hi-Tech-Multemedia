import { motion } from "framer-motion";
import aboutImg from "@/assets/about.jpg";

export default function About() {
  return (
    <section id="about" className="py-24 bg-background overflow-hidden">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-primary/20 p-2">
              <div className="w-full h-full relative overflow-hidden">
                <img 
                  src={aboutImg} 
                  alt="Hi-tech Multimedia Studio" 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-primary/50" />
            <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-primary/50" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2 space-y-6"
          >
            <div className="inline-block">
              <h2 className="text-4xl md:text-5xl font-serif text-primary">Our Legacy</h2>
              <div className="h-px w-1/2 bg-primary mt-4" />
            </div>
            
            <p className="text-lg text-foreground/80 leading-relaxed font-light">
              Based in the heart of Bokaro, Hi-tech Multimedia is not just a studio—it is a sanctuary where your most precious memories are preserved for eternity. For over a decade, we have been the silent witnesses to countless love stories, joyous celebrations, and momentous milestones.
            </p>
            
            <p className="text-lg text-foreground/80 leading-relaxed font-light">
              We specialize in premium wedding photography, cinematic videography, and the crafting of exquisite, bespoke wedding albums. Our approach blends traditional Indian warmth with contemporary, cinematic grandeur.
            </p>

            <div className="pt-6 grid grid-cols-2 gap-8 border-t border-border">
              <div>
                <h4 className="text-3xl font-serif text-primary mb-2">15+</h4>
                <p className="text-sm uppercase tracking-widest text-muted-foreground">Years Experience</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif text-primary mb-2">500+</h4>
                <p className="text-sm uppercase tracking-widest text-muted-foreground">Weddings Captured</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
