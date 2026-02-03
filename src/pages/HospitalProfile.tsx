import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, MapPin, Award, Bed, Users, Calendar, Heart, Shield, Video, Plane, CheckCircle2, TrendingUp, Clock, Mail, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

const HospitalProfile = () => {
  const { id } = useParams<{ id: string }>();

  const { data: hospital, isLoading, error } = useQuery({
    queryKey: ["hospital", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hospitals")
        .select("*")
        .eq("slug", id)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      // Transform to expected format
      return {
        id: data.slug,
        name: data.name,
        city: data.city,
        state: data.state,
        rating: data.rating || 0,
        reviewCount: data.review_count || 0,
        specialties: data.specialties || [],
        accreditations: data.accreditations || [],
        description: data.description || "",
        established: data.established || 0,
        beds: data.beds || 0,
        doctors: data.doctors_count || 0,
        image: data.image_url || "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&h=500&fit=crop",
        logo: data.logo_url || "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=100&h=100&fit=crop",
        address: data.address || "",
        phone: data.phone || "",
        email: data.email || "",
        website: data.website || "",
        features: data.features || [],
        internationalPatients: data.international_patients || 0,
        successRate: data.success_rate || 0,
        avgCostSavings: data.avg_cost_savings || 0,
      };
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="font-display text-display-md text-foreground mb-4">Hospital Not Found</h1>
          <p className="text-muted-foreground mb-8">The hospital you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/hospitals">Browse All Hospitals</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 lg:pt-24">
        <div className="absolute inset-0 h-[400px] lg:h-[450px]">
          <img src={hospital.image} alt={hospital.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-charcoal/40" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button asChild variant="ghost" className="mb-6 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/hospitals">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Hospitals
              </Link>
            </Button>
          </motion.div>

          {/* Hospital Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-2xl p-6 lg:p-8 shadow-card border border-border/50 mt-48 lg:mt-56"
          >
            <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border">
                <img src={hospital.logo} alt={`${hospital.name} logo`} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="font-display text-display-sm lg:text-display-md text-foreground">
                    {hospital.name}
                  </h1>
                  {hospital.accreditations.includes("JCI Accredited") && (
                    <Badge className="bg-primary text-primary-foreground">
                      <Shield className="w-3 h-3 mr-1" />
                      JCI Accredited
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{hospital.city}, {hospital.state}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span className="font-semibold text-foreground">{hospital.rating}</span>
                    <span>({hospital.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>Est. {hospital.established}</span>
                  </div>
                </div>

                <p className="text-muted-foreground max-w-3xl">{hospital.description}</p>
              </div>

              <div className="flex flex-col gap-3 lg:items-end">
                <Link to={`/consultation/${hospital.id}`}>
                  <Button size="lg" className="w-full lg:w-auto">
                    <Video className="w-4 h-4 mr-2" />
                    Schedule Consultation
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full lg:w-auto">
                  <Heart className="w-4 h-4 mr-2" />
                  Save Hospital
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                  <TabsTrigger value="specialties" className="rounded-lg">Specialties</TabsTrigger>
                  <TabsTrigger value="facilities" className="rounded-lg">Facilities</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-6">
                  {/* Key Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { icon: Bed, label: "Hospital Beds", value: hospital.beds },
                      { icon: Users, label: "Specialist Doctors", value: hospital.doctors },
                      { icon: TrendingUp, label: "Success Rate", value: `${hospital.successRate}%` },
                      { icon: Plane, label: "Int'l Patients/Year", value: hospital.internationalPatients.toLocaleString() },
                    ].map(({ icon: Icon, label, value }) => (
                      <Card key={label} className="border-border/50">
                        <CardContent className="p-4">
                          <Icon className="w-8 h-8 text-primary mb-2" />
                          <div className="font-display font-bold text-xl text-foreground">{value}</div>
                          <div className="text-sm text-muted-foreground">{label}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Why Choose */}
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-accent" />
                        Why Choose {hospital.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {hospital.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Accreditations */}
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-accent" />
                        Accreditations & Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        {hospital.accreditations.map((acc) => (
                          <Badge key={acc} variant="secondary" className="py-2 px-4 text-sm">
                            <Award className="w-4 h-4 mr-2 text-accent" />
                            {acc}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="specialties" className="mt-6">
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle>Medical Specialties</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {hospital.specialties.map((specialty) => (
                          <div
                            key={specialty}
                            className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Heart className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{specialty}</div>
                              <div className="text-sm text-muted-foreground">Department</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="facilities" className="mt-6">
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle>Hospital Facilities & Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {hospital.features.map((feature) => (
                          <div key={feature} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium text-foreground">{feature}</div>
                              <div className="text-sm text-muted-foreground">Available for international patients</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card className="border-border/50 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Contact Hospital</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Address</div>
                      <div className="text-foreground">{hospital.address}</div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    <Button asChild className="w-full" size="lg">
                      <Link to={`/consultation/${hospital.id}`}>
                        <Video className="w-4 h-4 mr-2" />
                        Schedule Consultation
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Inquiry
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Savings */}
              <Card className="border-border/50 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-semibold">Cost Advantage</span>
                  </div>
                  <div className="font-display text-3xl font-bold text-foreground mb-1">
                    Save up to {hospital.avgCostSavings}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Compared to similar treatments in the US, UK, or Europe
                  </p>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card className="border-border/50">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Quick Response</div>
                    <div className="text-sm text-muted-foreground">Usually responds within 24 hours</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HospitalProfile;
