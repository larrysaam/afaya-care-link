import { motion } from "framer-motion";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-warm opacity-90" />
          
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cta-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="2" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cta-pattern)" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10 px-8 py-16 lg:px-16 lg:py-20 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-display-sm font-display font-bold text-secondary-foreground mb-4">
              Ready to Start Your
              <br />
              Medical Journey?
            </h2>
            <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto mb-8">
              Create your free account today and get access to India's best hospitals, 
              secure medical record storage, and personalized care coordination.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button 
                size="xl" 
                className="bg-charcoal text-primary-foreground hover:bg-charcoal/90 shadow-lg group"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                className="border-2 border-charcoal/30 text-charcoal hover:bg-charcoal/10"
              >
                Contact Our Team
              </Button>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-secondary-foreground/70">
              <a href="tel:+911234567890" className="flex items-center gap-2 hover:text-secondary-foreground transition-colors">
                <Phone className="w-4 h-4" />
                <span>+91 123 456 7890</span>
              </a>
              <a href="mailto:care@afayaconekt.com" className="flex items-center gap-2 hover:text-secondary-foreground transition-colors">
                <Mail className="w-4 h-4" />
                <span>care@afayaconekt.com</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
