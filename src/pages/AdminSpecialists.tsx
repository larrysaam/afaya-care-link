import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Search, ArrowLeft, UserRound } from "lucide-react";
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

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/hospitals")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Specialists</h1>
            <p className="text-muted-foreground">
              {hospital?.name || "Loading..."}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search specialists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingSpecialist(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Specialist
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
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

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading specialists...</div>
        ) : filteredSpecialists?.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <UserRound className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No specialists found</h3>
            <p className="text-muted-foreground">Add specialists to this hospital</p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Qualification</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead>Patients</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSpecialists?.map((specialist) => (
                  <TableRow key={specialist.id}>
                    <TableCell className="font-medium">{specialist.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{specialist.specialty}</Badge>
                    </TableCell>
                    <TableCell>{specialist.qualification || "N/A"}</TableCell>
                    <TableCell>{specialist.experience_years ? `${specialist.experience_years} yrs` : "N/A"}</TableCell>
                    <TableCell>{specialist.success_rate ? `${specialist.success_rate}%` : "N/A"}</TableCell>
                    <TableCell>{specialist.patients_treated?.toLocaleString() || 0}</TableCell>
                    <TableCell>
                      <Badge variant={specialist.is_active ? "default" : "secondary"}>
                        {specialist.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(specialist)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("Are you sure you want to remove this specialist?")) {
                              deleteMutation.mutate(specialist.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
