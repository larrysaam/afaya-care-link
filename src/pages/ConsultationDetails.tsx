import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, isPast, isWithinInterval, addMinutes, subMinutes } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Hospital, 
  FileText, 
  Video, 
  ExternalLink, 
  ArrowLeft,
  User,
  Stethoscope,
  AlertCircle,
  Pill,
  History,
  Download,
  File
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface Consultation {
  id: string;
  hospital_id: string;
  specialist_name: string;
  specialty: string;
  condition_description: string;
  medical_history: string | null;
  current_medications: string | null;
  urgency_level: string | null;
  preferred_date: string | null;
  status: 'pending' | 'under_review' | 'approved' | 'scheduled' | 'completed' | 'cancelled';
  scheduled_date: string | null;
  meeting_link: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface MedicalDocument {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  uploaded_at: string;
}

const statusConfig = {
  pending: {
    label: 'Pending Review',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    description: 'Your consultation request is awaiting review by our team.'
  },
  under_review: {
    label: 'Under Review',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    description: 'Our medical team is reviewing your request and will schedule your consultation soon.'
  },
  approved: {
    label: 'Approved',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    description: 'Your consultation has been approved. We will schedule a date and time shortly.'
  },
  scheduled: {
    label: 'Scheduled',
    color: 'bg-primary/10 text-primary',
    description: 'Your video consultation has been scheduled. Join at the designated time.'
  },
  completed: {
    label: 'Completed',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    description: 'This consultation has been completed.'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    description: 'This consultation has been cancelled.'
  }
};

const urgencyConfig = {
  normal: { label: 'Normal', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  urgent: { label: 'Urgent', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  emergency: { label: 'Emergency', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

const ConsultationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && id) {
      fetchConsultationDetails();
    }
  }, [user, id]);

  const fetchConsultationDetails = async () => {
    if (!user || !id) return;

    try {
      // Fetch consultation
      const { data: consultationData, error: consultationError } = await supabase
        .from('consultations')
        .select('*')
        .eq('id', id)
        .eq('patient_id', user.id)
        .maybeSingle();

      if (consultationError) throw consultationError;
      
      if (!consultationData) {
        toast({
          title: "Consultation not found",
          description: "This consultation does not exist or you don't have access to it.",
          variant: "destructive"
        });
        navigate('/my-consultations');
        return;
      }

      setConsultation(consultationData);

      // Fetch medical documents
      const { data: docsData, error: docsError } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('consultation_id', id)
        .order('uploaded_at', { ascending: false });

      if (docsError) throw docsError;
      setDocuments(docsData || []);

    } catch (error: any) {
      toast({
        title: "Error fetching consultation",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canJoinCall = () => {
    if (!consultation?.scheduled_date || consultation.status !== 'scheduled') return false;
    
    const scheduledTime = new Date(consultation.scheduled_date);
    const now = new Date();
    
    // Allow joining 15 minutes before and up to 2 hours after scheduled time
    return isWithinInterval(now, {
      start: subMinutes(scheduledTime, 15),
      end: addMinutes(scheduledTime, 120)
    });
  };

  const getCallStatus = () => {
    if (!consultation?.scheduled_date) return null;
    
    const scheduledTime = new Date(consultation.scheduled_date);
    const now = new Date();
    const joinWindow = subMinutes(scheduledTime, 15);
    
    if (now < joinWindow) {
      return { status: 'upcoming', message: `Available to join ${format(joinWindow, 'PPP')} at ${format(joinWindow, 'p')}` };
    } else if (canJoinCall()) {
      return { status: 'ready', message: 'You can join the video call now' };
    } else {
      return { status: 'ended', message: 'The scheduled time has passed' };
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

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!consultation) {
    return null;
  }

  const callStatus = getCallStatus();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back Button */}
            <Link to="/my-consultations" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Consultations
            </Link>

            {/* Header Card */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Stethoscope className="h-6 w-6 text-primary" />
                      {consultation.specialty}
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                      Consultation with {consultation.specialist_name}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {consultation.urgency_level && (
                      <Badge className={urgencyConfig[consultation.urgency_level as keyof typeof urgencyConfig]?.color || urgencyConfig.normal.color}>
                        {urgencyConfig[consultation.urgency_level as keyof typeof urgencyConfig]?.label || 'Normal'}
                      </Badge>
                    )}
                    <Badge className={statusConfig[consultation.status].color}>
                      {statusConfig[consultation.status].label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {statusConfig[consultation.status].description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Video Call Section - Only show for scheduled consultations */}
            {consultation.status === 'scheduled' && consultation.scheduled_date && consultation.meeting_link && (
              <Card className="mb-6 border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Video className="h-5 w-5" />
                    Video Consultation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{format(new Date(consultation.scheduled_date), 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{format(new Date(consultation.scheduled_date), 'h:mm a')}</span>
                    </div>
                  </div>
                  
                  {callStatus && (
                    <div className={`p-3 rounded-lg ${
                      callStatus.status === 'ready' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                        : callStatus.status === 'upcoming'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                    }`}>
                      <p className="text-sm font-medium">{callStatus.message}</p>
                    </div>
                  )}

                  <Button 
                    size="lg" 
                    className="w-full md:w-auto"
                    disabled={!canJoinCall()}
                    asChild={canJoinCall()}
                  >
                    {canJoinCall() ? (
                      <a href={consultation.meeting_link} target="_blank" rel="noopener noreferrer">
                        <Video className="h-5 w-5 mr-2" />
                        Join Video Call
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    ) : (
                      <span>
                        <Video className="h-5 w-5 mr-2" />
                        Join Video Call
                      </span>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Admin Notes */}
            {consultation.admin_notes && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                    Note from Medical Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{consultation.admin_notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Consultation Details */}
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              {/* Medical Condition */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Medical Condition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{consultation.condition_description}</p>
                </CardContent>
              </Card>

              {/* Dates */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Important Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Submitted On</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(consultation.created_at), 'PPP')}</p>
                  </div>
                  {consultation.preferred_date && (
                    <div>
                      <p className="text-sm font-medium">Preferred Date</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(consultation.preferred_date), 'PPP')}</p>
                    </div>
                  )}
                  {consultation.scheduled_date && (
                    <div>
                      <p className="text-sm font-medium text-primary">Scheduled Date & Time</p>
                      <p className="text-sm text-primary font-medium">{format(new Date(consultation.scheduled_date), 'PPP p')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Medical History & Medications */}
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              {consultation.medical_history && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <History className="h-5 w-5 text-primary" />
                      Medical History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{consultation.medical_history}</p>
                  </CardContent>
                </Card>
              )}

              {consultation.current_medications && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Pill className="h-5 w-5 text-primary" />
                      Current Medications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{consultation.current_medications}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Uploaded Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <File className="h-5 w-5 text-primary" />
                  Medical Documents
                </CardTitle>
                <CardDescription>
                  Documents and reports uploaded with this consultation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-4 text-center">
                    No documents uploaded for this consultation.
                  </p>
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
                              {formatFileSize(doc.file_size)} • Uploaded {format(new Date(doc.uploaded_at), 'PPP')}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => downloadDocument(doc)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConsultationDetails;
