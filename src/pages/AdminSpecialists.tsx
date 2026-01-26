import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Search, ArrowLeft, UserRound, Star, Briefcase, Users } from "lucide-react";
import { SpecialistForm } from "@/components/admin/SpecialistForm";

interface Specialist {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience_years: number;
  success_rate: number;
  patients_treated: number;
  is_active: boolean;
  image_url: string;
  bio: string;
}

export default function AdminSpecialists() {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSpecialist, setEditingSpecialist] = useState<Specialist | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: hospital } = useQuery({
    queryKey: ["hospital", hospitalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hospitals")
        .select("id, name")
        .eq("id", hospitalId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!hospitalId,
  });

  const { data: specialists, isLoading } = useQuery({
    queryKey: ["specialists", hospitalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("specialists")
        .select("*")
        .eq("hospital_id", hospitalId)
        .order("name");
      if (error) throw error;
      return data as Specialist[];
    },
    enabled: !!hospitalId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("specialists").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialists", hospitalId] });
      toast({ title: "Specialist removed successfully" });
    },
    onError: (error) => {
      toast({ title: "Error removing specialist", description: error.message, variant: "destructive" });
    },
  });

  const filteredSpecialists = specialists?.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (specialist: Specialist) => {
    setEditingSpecialist(specialist);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSpecialist(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/hospitals")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Specialists</h1>
            <p className="text-muted-foreground">
              {hospital?.name || "Loading..."}
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingSpecialist(null)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Specialist
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editingSpecialist ? "Edit Specialist" : "Add New Specialist"}
                </DialogTitle>
              </DialogHeader>
              <SpecialistForm
                hospitalId={hospitalId!}
                specialist={editingSpecialist}
                onSuccess={handleCloseDialog}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search specialists..."
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
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-muted" />
                    <div className="space-y-2 flex-1">
                      <div className="h-5 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredSpecialists?.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <UserRound className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No specialists found</h3>
              <p className="text-muted-foreground mb-4">Add specialists to this hospital</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Specialist
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpecialists?.map((specialist) => (
              <Card key={specialist.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-primary/20">
                        <AvatarImage src={specialist.image_url} alt={specialist.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {getInitials(specialist.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{specialist.name}</h3>
                        <Badge variant="secondary" className="mt-1">
                          {specialist.specialty}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant={specialist.is_active ? "default" : "outline"} className="text-xs">
                      {specialist.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  {/* Qualification */}
                  {specialist.qualification && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                      {specialist.qualification}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {specialist.experience_years && (
                      <div className="text-center p-2 bg-muted/50 rounded-lg">
                        <Briefcase className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                        <p className="text-sm font-medium">{specialist.experience_years} yrs</p>
                      </div>
                    )}
                    {specialist.success_rate && (
                      <div className="text-center p-2 bg-muted/50 rounded-lg">
                        <Star className="h-4 w-4 mx-auto text-chart-4 mb-1" />
                        <p className="text-sm font-medium">{specialist.success_rate}%</p>
                      </div>
                    )}
                    {specialist.patients_treated !== undefined && (
                      <div className="text-center p-2 bg-muted/50 rounded-lg">
                        <Users className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                        <p className="text-sm font-medium">{specialist.patients_treated?.toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(specialist)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm("Are you sure you want to remove this specialist?")) {
                          deleteMutation.mutate(specialist.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
