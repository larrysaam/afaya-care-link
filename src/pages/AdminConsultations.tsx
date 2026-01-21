import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, Clock, User, FileText, Search, Filter, Check, X, CalendarIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Consultation {
  id: string;
  patient_id: string;
  hospital_id: string;
  specialist_name: string;
  specialty: string;
  condition_description: string;
  medical_history: string | null;
  current_medications: string | null;
  urgency_level: string;
  preferred_date: string | null;
  status: 'pending' | 'under_review' | 'approved' | 'scheduled' | 'completed' | 'cancelled';
  admin_notes: string | null;
  scheduled_date: string | null;
  meeting_link: string | null;
  created_at: string;
  updated_at: string;
}

interface Profile {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  under_review: { label: 'Under Review', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  scheduled: { label: 'Scheduled', color: 'bg-primary/10 text-primary' },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

const urgencyConfig = {
  normal: { label: 'Normal', color: 'bg-gray-100 text-gray-800' },
  urgent: { label: 'Urgent', color: 'bg-orange-100 text-orange-800' },
  emergency: { label: 'Emergency', color: 'bg-red-100 text-red-800' },
};

const AdminConsultations = () => {
  const navigate = useNavigate();
  const { user, loading, isAdmin } = useAuth();
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  
  // Update form state
  const [newStatus, setNewStatus] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [meetingLink, setMeetingLink] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && user && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [user, loading, isAdmin, navigate, toast]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchConsultations();
      
      // Set up realtime subscription
      const channel = supabase
        .channel('admin-consultations-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'consultations',
          },
          () => {
            fetchConsultations();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, isAdmin]);

  const fetchConsultations = async () => {
    try {
      const { data: consultationsData, error: consultationsError } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (consultationsError) throw consultationsError;
      setConsultations(consultationsData || []);

      // Fetch profiles for all patients
      const patientIds = [...new Set(consultationsData?.map(c => c.patient_id) || [])];
      if (patientIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, full_name, email, phone, country')
          .in('user_id', patientIds);

        const profilesMap: Record<string, Profile> = {};
        profilesData?.forEach(p => {
          profilesMap[p.user_id] = p;
        });
        setProfiles(profilesMap);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching consultations",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openUpdateDialog = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setNewStatus(consultation.status);
    setScheduledDate(consultation.scheduled_date ? new Date(consultation.scheduled_date) : undefined);
    setScheduledTime(consultation.scheduled_date ? format(new Date(consultation.scheduled_date), 'HH:mm') : '10:00');
    setMeetingLink(consultation.meeting_link || '');
    setAdminNotes(consultation.admin_notes || '');
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateConsultation = async () => {
    if (!selectedConsultation) return;

    setIsUpdating(true);

    try {
      let scheduledDateTime = null;
      if (newStatus === 'scheduled' && scheduledDate) {
        const [hours, minutes] = scheduledTime.split(':');
        const dateTime = new Date(scheduledDate);
        dateTime.setHours(parseInt(hours), parseInt(minutes));
        scheduledDateTime = dateTime.toISOString();
      }

      const { error } = await supabase
        .from('consultations')
        .update({
          status: newStatus as 'pending' | 'under_review' | 'approved' | 'scheduled' | 'completed' | 'cancelled',
          scheduled_date: scheduledDateTime,
          meeting_link: newStatus === 'scheduled' ? meetingLink : null,
          admin_notes: adminNotes || null,
        })
        .eq('id', selectedConsultation.id);

      if (error) throw error;

      toast({
        title: "Consultation updated",
        description: "The consultation status has been updated successfully.",
      });

      setIsUpdateDialogOpen(false);
      fetchConsultations();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = 
      consultation.specialist_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profiles[consultation.patient_id]?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profiles[consultation.patient_id]?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage consultation requests</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{consultations.filter(c => c.status === 'pending').length}</div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{consultations.filter(c => c.status === 'under_review').length}</div>
                  <p className="text-sm text-muted-foreground">Under Review</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{consultations.filter(c => c.status === 'scheduled').length}</div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{consultations.filter(c => c.status === 'completed').length}</div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient, specialist, or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Consultations List */}
            <div className="space-y-4">
              {filteredConsultations.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No consultations found</p>
                  </CardContent>
                </Card>
              ) : (
                filteredConsultations.map((consultation) => {
                  const patient = profiles[consultation.patient_id];
                  return (
                    <Card key={consultation.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between flex-wrap gap-2">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {patient?.full_name || 'Unknown Patient'}
                            </CardTitle>
                            <CardDescription>
                              {patient?.email} • {patient?.country}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={urgencyConfig[consultation.urgency_level as keyof typeof urgencyConfig]?.color || urgencyConfig.normal.color}>
                              {urgencyConfig[consultation.urgency_level as keyof typeof urgencyConfig]?.label || 'Normal'}
                            </Badge>
                            <Badge className={statusConfig[consultation.status].color}>
                              {statusConfig[consultation.status].label}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Specialty & Specialist</p>
                            <p className="text-sm text-muted-foreground">
                              {consultation.specialty} - {consultation.specialist_name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Preferred Date</p>
                            <p className="text-sm text-muted-foreground">
                              {consultation.preferred_date 
                                ? format(new Date(consultation.preferred_date), 'PPP')
                                : 'Not specified'}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-1">Condition</p>
                          <p className="text-sm text-muted-foreground">{consultation.condition_description}</p>
                        </div>

                        {consultation.medical_history && (
                          <div>
                            <p className="text-sm font-medium mb-1">Medical History</p>
                            <p className="text-sm text-muted-foreground">{consultation.medical_history}</p>
                          </div>
                        )}

                        {consultation.scheduled_date && (
                          <div className="bg-primary/5 p-3 rounded-lg flex items-center gap-3">
                            <Clock className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium">Scheduled for</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(consultation.scheduled_date), 'PPP p')}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-3 border-t">
                          <p className="text-xs text-muted-foreground">
                            Submitted: {format(new Date(consultation.created_at), 'PPP')}
                          </p>
                          <Dialog open={isUpdateDialogOpen && selectedConsultation?.id === consultation.id} onOpenChange={setIsUpdateDialogOpen}>
                            <DialogTrigger asChild>
                              <Button onClick={() => openUpdateDialog(consultation)}>
                                Update Status
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Update Consultation</DialogTitle>
                                <DialogDescription>
                                  Update the status and schedule for this consultation request.
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Status</Label>
                                  <Select value={newStatus} onValueChange={setNewStatus}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="under_review">Under Review</SelectItem>
                                      <SelectItem value="approved">Approved</SelectItem>
                                      <SelectItem value="scheduled">Scheduled</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {newStatus === 'scheduled' && (
                                  <>
                                    <div className="space-y-2">
                                      <Label>Consultation Date</Label>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant="outline"
                                            className={cn(
                                              "w-full justify-start text-left font-normal",
                                              !scheduledDate && "text-muted-foreground"
                                            )}
                                          >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                          <CalendarComponent
                                            mode="single"
                                            selected={scheduledDate}
                                            onSelect={setScheduledDate}
                                            disabled={(date) => date < new Date()}
                                            initialFocus
                                            className={cn("p-3 pointer-events-auto")}
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </div>

                                    <div className="space-y-2">
                                      <Label>Time</Label>
                                      <Input
                                        type="time"
                                        value={scheduledTime}
                                        onChange={(e) => setScheduledTime(e.target.value)}
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label>Meeting Link</Label>
                                      <Input
                                        placeholder="https://meet.google.com/..."
                                        value={meetingLink}
                                        onChange={(e) => setMeetingLink(e.target.value)}
                                      />
                                    </div>
                                  </>
                                )}

                                <div className="space-y-2">
                                  <Label>Admin Notes</Label>
                                  <Textarea
                                    placeholder="Add notes for the patient..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                  />
                                </div>
                              </div>

                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleUpdateConsultation} disabled={isUpdating}>
                                  {isUpdating ? 'Updating...' : 'Update Consultation'}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminConsultations;
