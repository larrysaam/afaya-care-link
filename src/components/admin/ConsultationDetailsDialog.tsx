import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Download, 
  File,
  Mail,
  Phone,
  Globe,
  Stethoscope,
  Pill,
  History,
  CalendarIcon,
  Video,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
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

interface MedicalDocument {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  uploaded_at: string;
}

interface ConsultationDetailsDialogProps {
  consultation: Consultation;
  patient: Profile | undefined;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
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
  normal: { label: 'Normal', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  urgent: { label: 'Urgent', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  emergency: { label: 'Emergency', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

export const ConsultationDetailsDialog = ({
  consultation,
  patient,
  isOpen,
  onClose,
  onUpdate
}: ConsultationDetailsDialogProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  
  // Update form state
  const [newStatus, setNewStatus] = useState(consultation.status);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    consultation.scheduled_date ? new Date(consultation.scheduled_date) : undefined
  );
  const [scheduledTime, setScheduledTime] = useState(
    consultation.scheduled_date ? format(new Date(consultation.scheduled_date), 'HH:mm') : '10:00'
  );
  const [meetingLink, setMeetingLink] = useState(consultation.meeting_link || '');
  const [adminNotes, setAdminNotes] = useState(consultation.admin_notes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
      // Reset form state when opening
      setNewStatus(consultation.status);
      setScheduledDate(consultation.scheduled_date ? new Date(consultation.scheduled_date) : undefined);
      setScheduledTime(consultation.scheduled_date ? format(new Date(consultation.scheduled_date), 'HH:mm') : '10:00');
      setMeetingLink(consultation.meeting_link || '');
      setAdminNotes(consultation.admin_notes || '');
    }
  }, [isOpen, consultation]);

  const fetchDocuments = async () => {
    setIsLoadingDocs(true);
    try {
      const { data, error } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('consultation_id', consultation.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const handleUpdateConsultation = async () => {
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
          status: newStatus,
          scheduled_date: scheduledDateTime,
          meeting_link: newStatus === 'scheduled' ? meetingLink : null,
          admin_notes: adminNotes || null,
        })
        .eq('id', consultation.id);

      if (error) throw error;

      toast({
        title: "Consultation updated",
        description: "The consultation has been updated successfully.",
      });

      onUpdate();
      onClose();
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

  const downloadDocument = async (doc: MedicalDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('medical-documents')
        .download(doc.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({
        title: "Download failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Consultation Details</DialogTitle>
              <DialogDescription>
                View and manage this consultation request
              </DialogDescription>
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
        </DialogHeader>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Patient Details</TabsTrigger>
            <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
            <TabsTrigger value="update">Update Status</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[50vh] mt-4">
            {/* Patient Details Tab */}
            <TabsContent value="details" className="space-y-4 pr-4">
              {/* Patient Info */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Patient Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Full Name</p>
                    <p className="font-medium">{patient?.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Country</p>
                    <p className="font-medium">{patient?.country || 'N/A'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{patient?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{patient?.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Consultation Info */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Consultation Request
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Specialty</p>
                    <p className="font-medium">{consultation.specialty}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Specialist</p>
                    <p className="font-medium">{consultation.specialist_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Submitted On</p>
                    <p className="font-medium">{format(new Date(consultation.created_at), 'PPP')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Preferred Date</p>
                    <p className="font-medium">
                      {consultation.preferred_date 
                        ? format(new Date(consultation.preferred_date), 'PPP')
                        : 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Medical Condition */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Medical Condition
                </h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {consultation.condition_description}
                </p>
              </div>

              {/* Medical History */}
              {consultation.medical_history && (
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Medical History
                  </h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {consultation.medical_history}
                  </p>
                </div>
              )}

              {/* Current Medications */}
              {consultation.current_medications && (
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Pill className="h-4 w-4" />
                    Current Medications
                  </h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {consultation.current_medications}
                  </p>
                </div>
              )}

              {/* Scheduled Info */}
              {consultation.scheduled_date && (
                <div className="bg-primary/5 p-4 rounded-lg space-y-2 border border-primary/20">
                  <h4 className="font-semibold flex items-center gap-2 text-primary">
                    <Video className="h-4 w-4" />
                    Scheduled Consultation
                  </h4>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(consultation.scheduled_date), 'PPP')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(consultation.scheduled_date), 'p')}</span>
                    </div>
                  </div>
                  {consultation.meeting_link && (
                    <Button variant="outline" size="sm" asChild className="mt-2">
                      <a href={consultation.meeting_link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Meeting Link
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="pr-4">
              {isLoadingDocs ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8">
                  <File className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No documents uploaded</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div 
                      key={doc.id} 
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <File className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{doc.file_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(doc.file_size)} • {doc.file_type || 'Unknown type'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded {format(new Date(doc.uploaded_at), 'PPP')}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => downloadDocument(doc)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Update Status Tab */}
            <TabsContent value="update" className="space-y-4 pr-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Consultation['status'])}>
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
                    <Label>Consultation Date *</Label>
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
                      <PopoverContent className="w-auto p-0" align="start">
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
                    <Label>Time *</Label>
                    <Input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Meeting Link *</Label>
                    <Input
                      placeholder="https://meet.google.com/... or https://zoom.us/..."
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Provide a video conferencing link (Google Meet, Zoom, etc.)
                    </p>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label>Admin Notes</Label>
                <Textarea
                  placeholder="Add notes for the patient (they will see this)..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateConsultation} 
            disabled={isUpdating || (newStatus === 'scheduled' && (!scheduledDate || !meetingLink))}
          >
            {isUpdating ? 'Updating...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
