import { motion } from "framer-motion";
import { ArrowRight, Shield, Globe, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
const stats = [{
  value: "500+",
  label: "Partner Hospitals"
}, {
  value: "50K+",
  label: "Patients Helped"
}, {
  value: "15+",
  label: "African Countries"
}];
export const HeroSection = () => {
  return <section className="relative min-h-screen flex items-center pt-20 lg:pt-24 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={heroBg} alt="Medical tourism connecting Africa and India" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-charcoal/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary-foreground mb-6">
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">Trusted by patients across Africa</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} className="text-4xl sm:text-5xl lg:text-display-lg font-display font-bold text-primary-foreground mb-6 leading-tight">
            World-Class Healthcare,
            <br />
            <span className="text-secondary">One Connection Away</span>
          </motion.h1>

          {/* Description */}
          <motion.p initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="text-lg sm:text-xl text-primary-foreground/80 mb-8 max-w-2xl">
            AfayaConekt bridges African patients to India's finest hospitals. 
            From medical consultations to visa support and travel arrangements — 
            we handle everything so you can focus on healing.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }} className="flex flex-col sm:flex-row gap-4 mb-12">
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

          {/* Trust Indicators */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }} className="flex flex-wrap items-center gap-6">
            
            
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <motion.div initial={{
      opacity: 0,
      y: 50
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.7,
      delay: 0.5
    }} className="absolute bottom-0 left-0 right-0 bg-primary/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, index) => <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </div>)}
          </div>
        </div>
      </motion.div>
    </section>;
};