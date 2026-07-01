import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Calendar, Image as ImageIcon, FileText,
  ArrowLeft, Settings, Package, Wrench, LogOut, MessageSquareQuote, Send
} from "lucide-react";
import Overview from "./admin/Overview";
import BookingsTab from "./admin/BookingsTab";
import PhotoSelectionTab from "./admin/PhotoSelectionTab";
import PhotoReviewSendTab from "./admin/PhotoReviewSendTab";
import InvoicesTab from "./admin/InvoicesTab";
import SettingsTab from "./admin/SettingsTab";
import ProductsTab from "./admin/ProductsTab";
import ServicesTab from "./admin/ServicesTab";
import ReviewsTab from "./admin/ReviewsTab";

const SESSION_KEY = "htmm_admin_auth";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, component: Overview },
  { id: "bookings", label: "Bookings", icon: Calendar, component: BookingsTab },
  { id: "gallery", label: "Gallery Manager", icon: ImageIcon, component: PhotoSelectionTab },
  { id: "photo-review", label: "Send for Review", icon: Send, component: PhotoReviewSendTab },
  { id: "reviews", label: "Reviews", icon: MessageSquareQuote, component: ReviewsTab },
  { id: "invoices", label: "Invoices", icon: FileText, component: InvoicesTab },
  { id: "products", label: "Products", icon: Package, component: ProductsTab },
  { id: "services", label: "Services", icon: Wrench, component: ServicesTab },
  { id: "settings", label: "Settings", icon: Settings, component: SettingsTab },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [, navigate] = useLocation();

  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.component || Overview;

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-zinc-800">
          <Link href="/" className="inline-flex items-center text-sm text-zinc-400 hover:text-[#D4AF37] transition-colors mb-5">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to website
          </Link>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
            Hi-tech <span className="text-[#D4AF37]">Admin</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1 tracking-wider">Studio Management Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/25"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                }`}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-[#D4AF37]" : "text-zinc-500"}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-500 hover:bg-red-950/30 hover:text-red-400 transition-all duration-200 text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm flex items-center justify-between px-6 flex-shrink-0">
          <h2 className="text-base font-semibold text-white">
            {TABS.find((t) => t.id === activeTab)?.label}
          </h2>
          <span className="text-xs text-zinc-600">Hi-tech Multimedia Admin</span>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
              >
                <ActiveComponent />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
