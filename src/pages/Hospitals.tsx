import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Building2, TrendingUp, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HospitalFilters } from "@/components/hospitals/HospitalFilters";
import { HospitalCard } from "@/components/hospitals/HospitalCard";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type DbHospital = Tables<"hospitals">;

// Transform database hospital to the format expected by HospitalCard
const transformHospital = (dbHospital: DbHospital) => ({
  id: dbHospital.slug,
  name: dbHospital.name,
  city: dbHospital.city,
  state: dbHospital.state,
  rating: dbHospital.rating || 0,
  reviewCount: dbHospital.review_count || 0,
  specialties: dbHospital.specialties || [],
  accreditations: dbHospital.accreditations || [],
  description: dbHospital.description || "",
  established: dbHospital.established || 0,
  beds: dbHospital.beds || 0,
  doctors: dbHospital.doctors_count || 0,
  image: dbHospital.image_url || "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&h=500&fit=crop",
  logo: dbHospital.logo_url || "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=100&h=100&fit=crop",
  address: dbHospital.address || "",
  phone: dbHospital.phone || "",
  email: dbHospital.email || "",
  website: dbHospital.website || "",
  features: dbHospital.features || [],
  internationalPatients: dbHospital.international_patients || 0,
  successRate: dbHospital.success_rate || 0,
  avgCostSavings: dbHospital.avg_cost_savings || 0,
});

const Hospitals = () => {
  const [filters, setFilters] = useState({
    search: "",
    specialty: "",
    city: "",
    minRating: "",
    accreditation: "",
  });

  // Fetch hospitals from database
  const { data: dbHospitals = [], isLoading } = useQuery({
    queryKey: ["hospitals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hospitals")
        .select("*")
        .eq("is_active", true)
        .order("name");
      
      if (error) throw error;
      return data || [];
    },
  });

  // Transform and filter hospitals
  const hospitals = useMemo(() => dbHospitals.map(transformHospital), [dbHospitals]);

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((hospital) => {
      if (filters.specialty && filters.specialty !== "all" && !hospital.specialties.includes(filters.specialty)) {
        return false;
      }
      if (filters.city && filters.city !== "all" && hospital.city !== filters.city) {
        return false;
      }
      if (filters.minRating && filters.minRating !== "all" && hospital.rating < parseFloat(filters.minRating)) {
        return false;
      }
      if (filters.accreditation && filters.accreditation !== "all" && !hospital.accreditations.includes(filters.accreditation)) {
        return false;
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          hospital.name.toLowerCase().includes(searchLower) ||
          hospital.city.toLowerCase().includes(searchLower) ||
          hospital.specialties.some((s) => s.toLowerCase().includes(searchLower))
        );
      }
      return true;
    });
  }, [hospitals, filters]);

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

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredHospitals.length > 0 ? (
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
                  {hospitals.length === 0 
                    ? "No hospitals have been added to the database yet."
                    : "Try adjusting your filters or search terms to find more hospitals."}
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
