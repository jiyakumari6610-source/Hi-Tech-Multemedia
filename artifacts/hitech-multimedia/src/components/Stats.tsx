import { motion } from "framer-motion";
import { useGetStats } from "@workspace/api-client-react";
import { Camera, Video, BookHeart, Users } from "lucide-react";

export default function Stats() {
  const { data: stats, isLoading } = useGetStats();

  const statItems = [
    { label: "Happy Clients", value: stats?.totalBookings ? stats.totalBookings + 500 : 500, icon: Users },
    { label: "Events Covered", value: stats?.totalBookings ? stats.totalBookings + 1200 : 1200, icon: Camera },
    { label: "Premium Albums", value: 350, icon: BookHeart },
    { label: "Hours of Video", value: "2k+", icon: Video },
  ];

  return (
    <section className="py-20 border-y border-border bg-background relative overflow-hidden">
      <div className="container px-4 mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {statItems.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center mb-4 bg-card">
                <stat.icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <h4 className="text-3xl md:text-4xl font-serif text-primary mb-2">
                {isLoading ? "-" : stat.value}
              </h4>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
