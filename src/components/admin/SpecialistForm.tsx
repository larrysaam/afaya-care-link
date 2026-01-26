import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { specialties } from "@/data/hospitals";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, UserRound, Briefcase, Calendar, Globe } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SpecialistFormProps {
  hospitalId: string;
  specialist?: any;
  onSuccess: () => void;
}

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function SpecialistForm({ hospitalId, specialist, onSuccess }: SpecialistFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!specialist;

  const [formData, setFormData] = useState({
    name: specialist?.name || "",
    specialty: specialist?.specialty || "",
    qualification: specialist?.qualification || "",
    experience_years: specialist?.experience_years || "",
    bio: specialist?.bio || "",
    image_url: specialist?.image_url || "",
    success_rate: specialist?.success_rate || "",
    patients_treated: specialist?.patients_treated || 0,
    languages: specialist?.languages || [],
    available_days: specialist?.available_days || [],
    is_active: specialist?.is_active ?? true,
  });

  const [newLanguage, setNewLanguage] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        hospital_id: hospitalId,
        experience_years: data.experience_years ? parseInt(data.experience_years.toString()) : null,
        success_rate: data.success_rate ? parseFloat(data.success_rate.toString()) : null,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("specialists")
          .update(payload)
          .eq("id", specialist.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("specialists").insert(payload);
        if (error) throw error;
      }

      // Update doctors_count on hospital
      const { count } = await supabase
        .from("specialists")
        .select("*", { count: "exact", head: true })
        .eq("hospital_id", hospitalId)
        .eq("is_active", true);

      await supabase
        .from("hospitals")
        .update({ doctors_count: count || 0 })
        .eq("id", hospitalId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialists", hospitalId] });
      queryClient.invalidateQueries({ queryKey: ["admin-hospitals"] });
      toast({ title: isEditing ? "Specialist updated" : "Specialist added" });
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

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      available_days: prev.available_days.includes(day)
        ? prev.available_days.filter((d: string) => d !== day)
        : [...prev.available_days, day],
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()],
      }));
      setNewLanguage("");
    }
  };

  const removeLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l: string) => l !== lang),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Image */}
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <UserRound className="h-4 w-4 text-primary" />
            Profile Photo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-[200px]">
            <ImageUpload
              label=""
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              folder="specialists"
              aspectRatio="square"
            />
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <UserRound className="h-4 w-4 text-primary" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. John Smith"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty *</Label>
              <Select
                value={formData.specialty}
                onValueChange={(value) => setFormData({ ...formData, specialty: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="MBBS, MD, FRCS..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience_years">Years of Experience</Label>
              <Input
                id="experience_years"
                type="number"
                value={formData.experience_years}
                onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                placeholder="15"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio / Profile</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              placeholder="Brief professional background..."
              className="resize-none"
            />
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active" className="cursor-pointer">Specialist is Active & Visible</Label>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            Experience & Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="95"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patients_treated">Patients Treated</Label>
              <Input
                id="patients_treated"
                type="number"
                value={formData.patients_treated}
                onChange={(e) => setFormData({ ...formData, patients_treated: parseInt(e.target.value) || 0 })}
                placeholder="5000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            Languages Spoken
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Add language (e.g., English)"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
              className="flex-1"
            />
            <Button type="button" variant="secondary" onClick={addLanguage}>
              Add
            </Button>
          </div>
          {formData.languages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.languages.map((lang: string) => (
                <Badge key={lang} variant="secondary" className="gap-1 pr-1">
                  {lang}
                  <button
                    type="button"
                    onClick={() => removeLanguage(lang)}
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

      {/* Availability */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {weekdays.map((day) => (
              <Badge
                key={day}
                variant={formData.available_days.includes(day) ? "default" : "outline"}
                className="cursor-pointer transition-colors hover:bg-primary/80"
                onClick={() => toggleDay(day)}
              >
                {day}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="submit" disabled={mutation.isPending} size="lg">
          {mutation.isPending ? "Saving..." : isEditing ? "Update Specialist" : "Add Specialist"}
        </Button>
      </div>
    </form>
  );
}
