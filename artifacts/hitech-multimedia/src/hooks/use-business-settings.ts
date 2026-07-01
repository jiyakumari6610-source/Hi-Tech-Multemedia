import { useState, useEffect } from "react";

export type BusinessSettings = {
  business_name: string;
  tagline: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  studio_hours: string;
  instagram: string;
  facebook: string;
};

export const DEFAULT_SETTINGS: BusinessSettings = {
  business_name: "Hi-Tech Multimedia",
  tagline: "Timeless Memories, Beautifully Captured",
  address: "Bokaro Steel City, Jharkhand, India",
  phone: "+91 99398 60818",
  whatsapp: "+91 99398 60818",
  email: "hitechbokaro@gmail.com",
  studio_hours: "Mon – Sat: 9 AM – 7 PM",
  instagram: "",
  facebook: "",
};

export function useBusinessSettings(): BusinessSettings {
  const [settings, setSettings] = useState<BusinessSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => { if (!cancelled) setSettings(data); })
      .catch(() => { /* keep defaults on failure */ });
    return () => { cancelled = true; };
  }, []);

  return settings;
}
