import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

type Testimonial = {
  id?: number;
  name: string;
  event: string;
  text: string;
};

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    name: "Priya & Rahul",
    event: "Wedding",
    text: "Hi-tech Multimedia made our wedding look like a Bollywood movie. The attention to detail, the lighting, and the way they captured our candid moments was just breathtaking. Our album is a masterpiece."
  },
  {
    name: "Anjali Singh",
    event: "Pre-Wedding",
    text: "We were quite nervous about posing, but the team made us feel so comfortable. The pre-wedding shoot was so much fun, and the pictures turned out incredible. Highly recommend them in Bokaro!"
  },
  {
    name: "Vikram Sharma",
    event: "Corporate Event",
    text: "Professional, punctual, and brilliant at their craft. They covered our annual corporate gala and delivered high-quality photos and videos well before the deadline. A class apart."
  }
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Testimonial[]) => {
        if (Array.isArray(data) && data.length > 0) setTestimonials(data);
      })
      .catch(() => { /* keep fallback testimonials */ });
  }, []);

  return (
    <section className="py-24 bg-card relative">
      <div className="container px-4 mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-primary mb-4">Words of Love</h2>
          <div className="h-px w-24 bg-primary mx-auto opacity-50 mb-4" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id ?? i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-background border border-border p-8 relative group"
            >
              <Quote className="w-10 h-10 text-primary/20 absolute top-4 left-4" />
              <div className="relative z-10 pt-4">
                <p className="text-foreground/80 font-light italic mb-6 text-lg leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div>
                  <h4 className="font-serif text-xl text-primary">{testimonial.name}</h4>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{testimonial.event}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
