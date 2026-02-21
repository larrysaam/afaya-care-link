import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const heroImages = [hero1, hero2, hero3];

const stats = [
  { value: "20+", label: "Partner Hospitals" },
  { value: "100+", label: "Patients Helped" },
  { value: "15+", label: "African Countries" },
];

export const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 lg:pt-24 overflow-hidden">
      {/* Background Images with Crossfade */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((img, index) => (
          <AnimatePresence key={index}>
            {currentImage === index && (
              <motion.img
                key={`hero-img-${index}`}
                src={img}
                alt="Medical tourism connecting Africa and India"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
              />
            )}
          </AnimatePresence>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-charcoal/40" />
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentImage === index
                ? "bg-primary-foreground w-8"
                : "bg-primary-foreground/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary-foreground mb-6"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">Trusted by patients across Africa</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-display-lg font-display font-bold text-primary-foreground mb-6 leading-tight"
          >
            World-Class Healthcare,
            <br />
            <span className="text-secondary">One Connection Away</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-primary-foreground/80 mb-8 max-w-2xl"
          >
            AfayaConekt bridges African patients to India's finest hospitals.
            From medical consultations to visa support and travel arrangements —
            we handle everything so you can focus on healing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <Button asChild variant="warm" size="xl" className="group">
              <Link to="/hospitals">
                Find a Hospital
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="heroOutline" size="xl">
              <a href="#how-it-works">How It Works</a>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="absolute bottom-0 left-0 right-0 bg-primary/95 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
