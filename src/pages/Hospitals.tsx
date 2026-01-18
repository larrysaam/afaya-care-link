import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Building2, TrendingUp } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HospitalFilters } from "@/components/hospitals/HospitalFilters";
import { HospitalCard } from "@/components/hospitals/HospitalCard";
import { filterHospitals, hospitals } from "@/data/hospitals";

const Hospitals = () => {
  const [filters, setFilters] = useState({
    search: "",
    specialty: "",
    city: "",
    minRating: "",
    accreditation: "",
  });

  const filteredHospitals = useMemo(() => {
    return filterHospitals({
      specialty: filters.specialty && filters.specialty !== "all" ? filters.specialty : undefined,
      city: filters.city && filters.city !== "all" ? filters.city : undefined,
      minRating: filters.minRating && filters.minRating !== "all" ? parseFloat(filters.minRating) : undefined,
      accreditation: filters.accreditation && filters.accreditation !== "all" ? filters.accreditation : undefined,
      search: filters.search || undefined,
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 text-primary mb-4">
              <Building2 className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wider">Hospital Marketplace</span>
            </div>
            <h1 className="font-display text-display-md lg:text-display-lg text-foreground mb-4">
              Find World-Class
              <span className="text-gradient-hero"> Hospitals in India</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover JCI-accredited hospitals, compare specialties, and connect with top medical professionals for your healthcare journey.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              { label: "Partner Hospitals", value: "50+" },
              { label: "Medical Specialties", value: "35+" },
              { label: "Cities Covered", value: "12" },
              { label: "International Patients/Year", value: "100K+" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="bg-card rounded-xl p-4 border border-border/50"
              >
                <div className="flex items-center gap-2 text-primary mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-display font-bold text-xl">{stat.value}</span>
                </div>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <HospitalFilters filters={filters} onFilterChange={setFilters} />

          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredHospitals.length}</span> of{" "}
                <span className="font-semibold text-foreground">{hospitals.length}</span> hospitals
              </p>
            </div>

            {filteredHospitals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHospitals.map((hospital, index) => (
                  <HospitalCard key={hospital.id} hospital={hospital} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Building2 className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                  No hospitals found
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try adjusting your filters or search terms to find more hospitals.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Hospitals;
