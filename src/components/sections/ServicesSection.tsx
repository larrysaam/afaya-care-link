import { motion } from "framer-motion";
import { 
  Building2, 
  FileHeart, 
  Video, 
  Stamp, 
  PlaneTakeoff, 
  Home,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Building2,
    title: "Hospital Marketplace",
    description: "Access 500+ verified hospitals across India. Filter by specialty, accreditation, and patient reviews.",
    color: "primary",
  },
  {
    icon: FileHeart,
    title: "Secure Medical Vault",
    description: "AES-256 encrypted storage for all your medical records. Share securely with hospitals and doctors.",
    color: "secondary",
  },
  {
    icon: Video,
    title: "Tele-Consultations",
    description: "Video consultations optimized for African networks. Get expert opinions before you travel.",
    color: "primary",
  },
  {
    icon: Stamp,
    title: "Visa Assistance",
    description: "Automated Visa Invitation Letters. Complete support for e-Medical visa applications.",
    color: "secondary",
  },
  {
    icon: PlaneTakeoff,
    title: "Travel Coordination",
    description: "Airport pickup, hospital transfers, and in-country logistics. We track your journey end-to-end.",
    color: "primary",
  },
  {
    icon: Home,
    title: "Recovery Accommodation",
    description: "Curated recovery homes near your hospital. From budget to premium options with patient amenities.",
    color: "secondary",
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-semibold mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-display-md font-display font-bold text-foreground mb-4">
            Everything You Need for
            <br />
            <span className="text-primary">Your Medical Journey</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            One platform for the entire patient experience — from finding the right hospital 
            to recovering comfortably after treatment.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative"
            >
              <div className="h-full p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-primary/30 shadow-sm hover:shadow-card transition-all duration-300">
                {/* Icon */}
                <div 
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 ${
                    service.color === "primary" 
                      ? "bg-primary/10 text-primary" 
                      : "bg-secondary/20 text-secondary"
                  }`}
                >
                  <service.icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Learn More Link */}
                <a 
                  href="#" 
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Button variant="hero" size="xl" className="group">
            Explore All Services
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
