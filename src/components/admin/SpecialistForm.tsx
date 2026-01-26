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
import { X } from "lucide-react";
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <Label htmlFor="patients_treated">Patients Treated</Label>
          <Input
            id="patients_treated"
            type="number"
            value={formData.patients_treated}
            onChange={(e) => setFormData({ ...formData, patients_treated: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image_url">Profile Image URL</Label>
          <Input
            id="image_url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Languages Spoken</Label>
        <div className="flex gap-2">
          <Input
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            placeholder="Add language (e.g., English)"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
          />
          <Button type="button" variant="secondary" onClick={addLanguage}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.languages.map((lang: string) => (
            <Badge key={lang} variant="secondary" className="gap-1">
              {lang}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeLanguage(lang)} />
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Available Days</Label>
        <div className="flex flex-wrap gap-2 p-3 border rounded-md">
          {weekdays.map((day) => (
            <Badge
              key={day}
              variant={formData.available_days.includes(day) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleDay(day)}
            >
              {day}
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
        <Label htmlFor="is_active">Specialist is Active</Label>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : isEditing ? "Update Specialist" : "Add Specialist"}
        </Button>
      </div>
    </form>
  );
}
