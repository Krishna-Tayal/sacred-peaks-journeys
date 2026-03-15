import { Link } from "react-router-dom";
import { Mountain, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-mountain text-primary-foreground/80">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mountain className="h-6 w-6 text-gold" />
              <span className="font-display text-lg font-bold text-gold">Trip Tonick</span>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/60">
              Your trusted companion for sacred Himalayan pilgrimages. Experience divine journeys with comfort and care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-base font-semibold text-gold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Destinations", "Packages", "Gallery", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-sm hover:text-gold transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-display text-base font-semibold text-gold mb-4">Char Dham</h4>
            <ul className="space-y-2">
              {["Kedarnath", "Badrinath", "Gangotri", "Yamunotri"].map((dest) => (
                <li key={dest}>
                  <Link
                    to={`/destinations/${dest.toLowerCase()}`}
                    className="text-sm hover:text-gold transition-colors"
                  >
                    {dest}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-base font-semibold text-gold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gold" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gold" />
                info@triptonick.com
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gold mt-0.5" />
                Rishikesh, Uttarakhand, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} Trip Tonick. All rights reserved. | Crafted with devotion for sacred journeys.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
