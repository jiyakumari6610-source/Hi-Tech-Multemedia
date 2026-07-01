import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useBusinessSettings } from "@/hooks/use-business-settings";

export default function Contact() {
  const settings = useBusinessSettings();
  const phoneDigits = settings.phone.replace(/[^\d+]/g, "");

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container px-4 mx-auto max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-primary mb-4">Get in Touch</h2>
          <div className="h-px w-24 bg-primary mx-auto opacity-50 mb-4" />
          <p className="text-foreground/70 font-light">Let us discuss how we can capture your next big moment.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card border-border/50 p-8 text-center h-full flex flex-col items-center justify-center hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center mb-4">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-serif text-xl text-primary mb-2">Phone</h3>
              <a href={`tel:${phoneDigits}`} className="text-foreground/80 hover:text-primary transition-colors">
                {settings.phone}
              </a>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card border-border/50 p-8 text-center h-full flex flex-col items-center justify-center hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-serif text-xl text-primary mb-2">Email</h3>
              <a href={`mailto:${settings.email}`} className="text-foreground/80 hover:text-primary transition-colors">
                {settings.email}
              </a>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card border-border/50 p-8 text-center h-full flex flex-col items-center justify-center hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-serif text-xl text-primary mb-2">Studio</h3>
              <p className="text-foreground/80">
                {settings.address}
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
