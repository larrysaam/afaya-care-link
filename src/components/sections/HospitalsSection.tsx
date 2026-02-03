import { motion } from "framer-motion";
import { MapPin, Star, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const hospitals = [
  {
    name: "Apollo Hospitals",
    location: "Chennai, Delhi, Mumbai",
    rating: 4.9,
    specialties: ["Cardiac Surgery", "Oncology", "Transplants"],
    accreditation: "JCI Accredited",
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400&h=300&fit=crop",
  },
  {
    name: "Fortis Healthcare",
    location: "Bangalore, Gurgaon",
    rating: 4.8,
    specialties: ["Orthopedics", "Neurology", "Pediatrics"],
    accreditation: "NABH Certified",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop",
  },
  {
    name: "Medanta Hospital",
    location: "Gurgaon, Lucknow",
    rating: 4.9,
    specialties: ["Liver Transplant", "Cardiac Care", "Cancer"],
    accreditation: "JCI Accredited",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop",
  },
  {
    name: "Max Super Specialty",
    location: "New Delhi, Noida",
    rating: 4.7,
    specialties: ["IVF", "Spine Surgery", "Bariatrics"],
    accreditation: "NABH Certified",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop",
  },
];

export const HospitalsSection = () => {
  return (
    <section id="hospitals" className="py-20 lg:py-32 bg-muted">
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
            Partner Hospitals
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-display-md font-display font-bold text-foreground mb-4">
            India's Leading Hospitals
          </h2>
          <p className="text-lg text-muted-foreground">
            We partner with JCI and NABH accredited hospitals known for excellence in specialized treatments.
          </p>
        </motion.div>

        {/* Hospital Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hospitals.map((hospital, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={hospital.image}
                    alt={hospital.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-background/90 backdrop-blur-sm flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span className="text-sm font-semibold">{hospital.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {hospital.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{hospital.location}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm mb-4">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-primary font-medium">{hospital.accreditation}</span>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2">
                    {hospital.specialties.slice(0, 2).map((specialty, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                      >
                        {specialty}
                      </span>
                    ))}
                    {hospital.specialties.length > 2 && (
                      <span className="px-2.5 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                        +{hospital.specialties.length - 2}
                      </span>
                    )}
                  </div>
                </div>
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
          className="text-center mt-12"
        >
          <Button asChild variant="outline" size="lg" className="group">
            <Link to="/hospitals">
              View All Hospitals
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
