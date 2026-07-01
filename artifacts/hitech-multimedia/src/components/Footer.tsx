import { Facebook, Instagram } from "lucide-react";
import { useBusinessSettings } from "@/hooks/use-business-settings";

export default function Footer() {
  const settings = useBusinessSettings();

  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container px-4 mx-auto flex flex-col items-center text-center">
        <h3 className="font-serif text-2xl text-primary mb-6">{settings.business_name}</h3>

        <div className="flex space-x-6 mb-8">
          {settings.facebook && (
            <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
          )}
          {settings.instagram && (
            <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          )}
        </div>

        <p className="text-sm text-muted-foreground font-light">
          © {new Date().getFullYear()} {settings.business_name}. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground/50 mt-2 font-light">
          {settings.tagline}
        </p>
      </div>
    </footer>
  );
}
