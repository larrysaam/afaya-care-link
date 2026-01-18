import { motion } from "framer-motion";
import { Shield, Lock, FileCheck, HeartHandshake } from "lucide-react";

const trustPoints = [
  {
    icon: Shield,
    title: "Verified Hospitals",
    description: "All partner hospitals are JCI or NABH accredited with verified credentials.",
  },
  {
    icon: Lock,
    title: "Bank-Level Security",
    description: "AES-256 encryption for all medical records. Your data stays private and protected.",
  },
  {
    icon: FileCheck,
    title: "Transparent Pricing",
    description: "No hidden costs. Complete treatment estimates including accommodation and travel.",
  },
  {
    icon: HeartHandshake,
    title: "24/7 Support",
    description: "Dedicated patient coordinators available round-the-clock for any assistance.",
  },
];

export const TrustSection = () => {
  return (
    <section className="py-20 lg:py-24 bg-gradient-trust text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Your Trust, Our Priority
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            We understand how important your health decisions are. That's why security 
            and transparency are at the core of everything we do.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {trustPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-4">
                <point.icon className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
