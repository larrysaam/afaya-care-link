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
import { X } from "lucide-react";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Hospital Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
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
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Full Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="beds">Number of Beds</Label>
          <Input
            id="beds"
            type="number"
            value={formData.beds}
            onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="success_rate">Success Rate (%)</Label>
          <Input
            id="success_rate"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.success_rate}
            onChange={(e) => setFormData({ ...formData, success_rate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="international_patients">Int'l Patients/Year</Label>
          <Input
            id="international_patients"
            type="number"
            value={formData.international_patients}
            onChange={(e) => setFormData({ ...formData, international_patients: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="image_url">Hospital Image URL</Label>
          <Input
            id="image_url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="logo_url">Logo URL</Label>
          <Input
            id="logo_url"
            value={formData.logo_url}
            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Specialties</Label>
        <div className="flex flex-wrap gap-2 p-3 border rounded-md">
          {specialties.map((spec) => (
            <Badge
              key={spec}
              variant={formData.specialties.includes(spec) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleSpecialty(spec)}
            >
              {spec}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Accreditations & Certifications</Label>
        <div className="flex flex-wrap gap-2 p-3 border rounded-md">
          {accreditations.map((accred) => (
            <Badge
              key={accred}
              variant={formData.accreditations.includes(accred) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleAccreditation(accred)}
            >
              {accred}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Features & Services</Label>
        <div className="flex gap-2">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Add a feature (e.g., 24/7 Emergency)"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
          />
          <Button type="button" variant="secondary" onClick={addFeature}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.features.map((feature: string) => (
            <Badge key={feature} variant="secondary" className="gap-1">
              {feature}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFeature(feature)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Hospital is Active</Label>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : isEditing ? "Update Hospital" : "Create Hospital"}
        </Button>
      </div>
    </form>
  );
}
