import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import siteLogo from "@/assets/logo.png";

const footerLinks = {
  patients: {
    title: "For Patients",
    links: [
      { label: "Find Hospitals", href: "#" },
      { label: "Upload Records", href: "#" },
      { label: "Book Consultation", href: "#" },
      { label: "Visa Assistance", href: "#" },
      { label: "Accommodation", href: "#" },
    ],
  },
  providers: {
    title: "For Providers",
    links: [
      { label: "Partner with Us", href: "#" },
      { label: "Hospital Dashboard", href: "#" },
      { label: "Host Accommodation", href: "#" },
      { label: "API Documentation", href: "#" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About AfayaConekt", href: "#" },
      { label: "Our Mission", href: "#" },
      { label: "Press & Media", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact Us", href: "#" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Data Security", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export const Footer = () => {
  return (
    <footer className="bg-charcoal text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">          {/* Brand Column */}          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-6 lg:mb-0">
            <a href="/" className="flex items-center gap-2 mb-4">
              <img src={siteLogo} alt="AfayaConekt Logo" className="w-10 h-10 rounded-xl object-cover" />
              <span className="font-display font-bold text-xl">
                Afaya<span className="text-secondary">Conekt</span>
              </span>
            </a>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-4">
              Bridging African patients to world-class healthcare in India. Your health journey, simplified.
            </p>
            <div className="text-primary-foreground/60 text-sm space-y-2 mb-6">
              <div className="flex items-start gap-2">
                <span className="font-medium">📧</span>
                <a href="mailto:contact@afayaconekt.care" className="hover:text-primary-foreground transition-colors">
                  contact@afayaconekt.care
                </a>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium">📱</span>
                <div className="space-y-1">
                  <a href="tel:+237670758611" className="block hover:text-primary-foreground transition-colors">
                    +237 670 758 611 (Cameroon)
                  </a>
                  <a href="tel:+917007979670" className="block hover:text-primary-foreground transition-colors">
                    +91 70079 79670 (India)
                  </a>
                </div>
              </div>
            </div>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((column, index) => (
            <div key={index}>
              <h4 className="font-semibold text-primary-foreground mb-4">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/50 text-sm">
              © {new Date().getFullYear()} AfayaConekt. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-primary-foreground/50">
              <span>🇳🇬 Nigeria</span>
              <span>🇰🇪 Kenya</span>
              <span>🇬🇭 Ghana</span>
              <span>🇮🇳 India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
