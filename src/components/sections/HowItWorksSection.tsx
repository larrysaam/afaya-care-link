import { motion } from "framer-motion";
import { Search, FileText, Video, Plane } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Find Your Hospital",
    description: "Search verified hospitals by specialty, location, and rating. View doctor profiles and accreditations.",
  },
  {
    icon: FileText,
    step: "02",
    title: "Share Medical Records",
    description: "Securely upload your medical reports including MRI/DICOM files. Our encrypted vault keeps your data safe.",
  },
  {
    icon: Video,
    step: "03",
    title: "Virtual Consultation",
    description: "Connect with specialists through video calls. Get expert opinions and treatment recommendations.",
  },
  {
    icon: Plane,
    step: "04",
    title: "Travel & Treatment",
    description: "We handle visa support, airport pickup, and accommodation. Focus on your health, we handle the rest.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Your Journey
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-display-md font-display font-bold text-foreground mb-4">
            How AfayaConekt Works
          </h2>
          <p className="text-lg text-muted-foreground">
            From discovery to recovery, we guide you through every step of your medical journey abroad.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-card rounded-2xl p-6 lg:p-8 shadow-card hover:shadow-card-hover transition-all duration-300 h-full border border-border/50">
                {/* Step Number */}
                <div className="text-6xl font-bold text-muted/60 absolute top-4 right-6 group-hover:text-primary/10 transition-colors">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <step.icon className="w-7 h-7 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector Line (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
