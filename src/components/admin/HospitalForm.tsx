import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { specialties, accreditations } from "@/data/hospitals";
import { Badge } from "@/components/ui/badge";
import { X, Building2, MapPin, Globe, Star, Users, Award } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HospitalFormProps {
  hospital?: any;
  onSuccess: () => void;
}

export function HospitalForm({ hospital, onSuccess }: HospitalFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!hospital;

  const [formData, setFormData] = useState({
    name: hospital?.name || "",
    slug: hospital?.slug || "",
    city: hospital?.city || "",
    state: hospital?.state || "",
    address: hospital?.address || "",
    phone: hospital?.phone || "",
    email: hospital?.email || "",
    website: hospital?.website || "",
    description: hospital?.description || "",
    established: hospital?.established || "",
    beds: hospital?.beds || "",
    rating: hospital?.rating || "",
    review_count: hospital?.review_count || 0,
    image_url: hospital?.image_url || "",
    logo_url: hospital?.logo_url || "",
    international_patients: hospital?.international_patients || 0,
    success_rate: hospital?.success_rate || "",
    avg_cost_savings: hospital?.avg_cost_savings || "",
    is_active: hospital?.is_active ?? true,
    specialties: hospital?.specialties || [],
    accreditations: hospital?.accreditations || [],
    features: hospital?.features || [],
  });

  const [newFeature, setNewFeature] = useState("");

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        slug: data.slug || generateSlug(data.name),
        established: data.established ? parseInt(data.established.toString()) : null,
        beds: data.beds ? parseInt(data.beds.toString()) : null,
        rating: data.rating ? parseFloat(data.rating.toString()) : null,
        success_rate: data.success_rate ? parseFloat(data.success_rate.toString()) : null,
        avg_cost_savings: data.avg_cost_savings ? parseInt(data.avg_cost_savings.toString()) : null,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("hospitals")
          .update(payload)
          .eq("id", hospital.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("hospitals").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hospitals"] });
      toast({ title: isEditing ? "Hospital updated" : "Hospital created" });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const toggleSpecialty = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(spec)
        ? prev.specialties.filter((s: string) => s !== spec)
        : [...prev.specialties, spec],
    }));
  };

  const toggleAccreditation = (accred: string) => {
    setFormData((prev) => ({
      ...prev,
      accreditations: prev.accreditations.includes(accred)
        ? prev.accreditations.filter((a: string) => a !== accred)
        : [...prev.accreditations, accred],
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f: string) => f !== feature),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Uploads */}
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Hospital Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload
              label="Hospital Image"
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              folder="hospitals/images"
              aspectRatio="video"
            />
            <ImageUpload
              label="Hospital Logo"
              value={formData.logo_url}
              onChange={(url) => setFormData({ ...formData, logo_url: url })}
              folder="hospitals/logos"
              aspectRatio="square"
            />
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Hospital Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter hospital name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="auto-generated-from-name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the hospital..."
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active" className="cursor-pointer">Hospital is Active & Visible</Label>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Location & Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Mumbai"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Maharashtra"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="established">Established Year</Label>
              <Input
                id="established"
                type="number"
                value={formData.established}
                onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                placeholder="1990"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Full Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Street address, landmark..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 22 1234 5678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@hospital.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://hospital.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Statistics & Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="beds">Beds</Label>
              <Input
                id="beds"
                type="number"
                value={formData.beds}
                onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                placeholder="500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                placeholder="4.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="success_rate">Success Rate %</Label>
              <Input
                id="success_rate"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.success_rate}
                onChange={(e) => setFormData({ ...formData, success_rate: e.target.value })}
                placeholder="95"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="international_patients">Int'l Patients/Yr</Label>
              <Input
                id="international_patients"
                type="number"
                value={formData.international_patients}
                onChange={(e) => setFormData({ ...formData, international_patients: parseInt(e.target.value) || 0 })}
                placeholder="5000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specialties */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Medical Specialties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {specialties.map((spec) => (
              <Badge
                key={spec}
                variant={formData.specialties.includes(spec) ? "default" : "outline"}
                className="cursor-pointer transition-colors hover:bg-primary/80"
                onClick={() => toggleSpecialty(spec)}
              >
                {spec}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accreditations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            Accreditations & Certifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {accreditations.map((accred) => (
              <Badge
                key={accred}
                variant={formData.accreditations.includes(accred) ? "default" : "outline"}
                className="cursor-pointer transition-colors hover:bg-primary/80"
                onClick={() => toggleAccreditation(accred)}
              >
                {accred}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            Features & Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a feature (e.g., 24/7 Emergency)"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              className="flex-1"
            />
            <Button type="button" variant="secondary" onClick={addFeature}>
              Add
            </Button>
          </div>
          {formData.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature: string) => (
                <Badge key={feature} variant="secondary" className="gap-1 pr-1">
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    className="ml-1 rounded-full hover:bg-destructive/20 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="submit" disabled={mutation.isPending} size="lg">
          {mutation.isPending ? "Saving..." : isEditing ? "Update Hospital" : "Create Hospital"}
        </Button>
      </div>
    </form>
  );
}
