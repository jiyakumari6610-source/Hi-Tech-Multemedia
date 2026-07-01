import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useBusinessSettings } from "@/hooks/use-business-settings";

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  const settings = useBusinessSettings();
  const phoneDigits = (settings.whatsapp || settings.phone).replace(/[^\d]/g, "");
  const message = encodeURIComponent(
    `Hi! I'd like to book ${settings.business_name} for my event. Please share the details and availability.`
  );
  const waUrl = `https://wa.me/${phoneDigits}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 12, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.92 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="bg-zinc-900 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg border border-zinc-700 whitespace-nowrap"
          >
            Book via WhatsApp
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.2 }}
        className="relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center"
        style={{ background: "#25D366" }}
        aria-label="Chat on WhatsApp"
      >
        {/* Pulse ring */}
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ background: "#25D366" }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* WhatsApp SVG icon */}
        <svg
          className="w-7 h-7 relative z-10"
          viewBox="0 0 32 32"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.003 2.667C8.637 2.667 2.667 8.636 2.667 16c0 2.363.632 4.678 1.833 6.7L2.667 29.333l6.8-1.8A13.282 13.282 0 0016.003 29.333C23.37 29.333 29.333 23.364 29.333 16S23.37 2.667 16.003 2.667zm0 24c-2.13 0-4.22-.573-6.05-1.657l-.433-.257-4.033 1.067 1.083-3.933-.283-.45A10.628 10.628 0 015.333 16c0-5.883 4.787-10.667 10.67-10.667S26.667 10.117 26.667 16 21.887 26.667 16.003 26.667zm5.83-7.983c-.317-.16-1.877-.927-2.167-1.033-.29-.107-.5-.16-.71.16-.21.317-.81 1.033-.993 1.247-.183.21-.367.237-.683.08-.317-.16-1.337-.493-2.547-1.573-.94-.84-1.577-1.877-1.763-2.193-.183-.317-.02-.487.14-.643.143-.14.317-.367.477-.55.16-.183.21-.317.317-.527.107-.21.053-.393-.027-.55-.08-.16-.71-1.713-.973-2.347-.257-.617-.517-.533-.71-.543l-.603-.01c-.21 0-.55.08-.837.393-.29.317-1.1 1.077-1.1 2.627 0 1.55 1.127 3.047 1.283 3.257.16.21 2.217 3.383 5.373 4.743.75.323 1.337.517 1.793.663.753.24 1.44.207 1.983.127.603-.09 1.877-.767 2.143-1.507.267-.74.267-1.373.187-1.507-.077-.133-.29-.21-.61-.367z" />
        </svg>
      </motion.a>
    </div>
  );
}
