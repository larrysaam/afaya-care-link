import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Search, Building2, Users, Star, MapPin, Bed } from "lucide-react";
import { HospitalForm } from "@/components/admin/HospitalForm";
import { useNavigate } from "react-router-dom";

interface Hospital {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  rating: number;
  specialties: string[];
  accreditations: string[];
  is_active: boolean;
  doctors_count: number;
  image_url: string;
  beds: number;
  success_rate: number;
}

export default function AdminHospitals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: hospitals, isLoading } = useQuery({
    queryKey: ["admin-hospitals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hospitals")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as Hospital[];
    },
  });

  // Fetch actual specialist counts per hospital
  const { data: specialistCounts } = useQuery({
    queryKey: ["specialist-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("specialists")
        .select("hospital_id");
      if (error) throw error;
      const counts: Record<string, number> = {};
      data?.forEach((s) => {
        counts[s.hospital_id] = (counts[s.hospital_id] || 0) + 1;
      });
      return counts;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("hospitals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hospitals"] });
      toast({ title: "Hospital deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error deleting hospital", description: error.message, variant: "destructive" });
    },
  });

  const filteredHospitals = hospitals?.filter(
    (h) =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (hospital: Hospital) => {
    setEditingHospital(hospital);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingHospital(null);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Hospital Management</h1>
            <p className="text-muted-foreground">Add and manage partner hospitals</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingHospital(null)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Hospital
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editingHospital ? "Edit Hospital" : "Add New Hospital"}
                </DialogTitle>
              </DialogHeader>
              <HospitalForm
                hospital={editingHospital}
                onSuccess={handleCloseDialog}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search hospitals by name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredHospitals?.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No hospitals found</h3>
              <p className="text-muted-foreground mb-4">Add your first hospital to get started</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Hospital
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals?.map((hospital) => (
              <Card key={hospital.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="aspect-video relative bg-muted">
                  {hospital.image_url ? (
                    <img
                      src={hospital.image_url}
                      alt={hospital.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Building2 className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge variant={hospital.is_active ? "default" : "secondary"}>
                      {hospital.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(hospital)}>
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this hospital?")) {
                          deleteMutation.mutate(hospital.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{hospital.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {hospital.city}, {hospital.state}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    {hospital.rating && (
                      <div className="flex items-center gap-1 text-chart-4">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-medium">{hospital.rating.toFixed(1)}</span>
                      </div>
                    )}
                    {hospital.beds && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Bed className="h-4 w-4" />
                        <span>{hospital.beds} beds</span>
                      </div>
                    )}
                    {hospital.success_rate && (
                      <div className="text-chart-2 font-medium">
                        {hospital.success_rate}% success
                      </div>
                    )}
                  </div>

                  {/* Specialties */}
                  {hospital.specialties?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {hospital.specialties.slice(0, 3).map((spec) => (
                        <Badge key={spec} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {hospital.specialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{hospital.specialties.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Specialists Link */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => navigate(`/admin/hospitals/${hospital.id}/specialists`)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Specialists ({specialistCounts?.[hospital.id] || 0})
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
