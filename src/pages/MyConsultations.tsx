import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, isWithinInterval, addMinutes, subMinutes } from 'date-fns';
import { Calendar, Clock, Hospital, FileText, Video, ExternalLink, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Helper function to check if user can join the video call
const canJoinCall = (scheduledDate: string | null) => {
  if (!scheduledDate) return false;
  const scheduledTime = new Date(scheduledDate);
  const now = new Date();

  // Allow joining 15 minutes before and up to 2 hours after scheduled time
  return isWithinInterval(now, {
    start: subMinutes(scheduledTime, 15),
    end: addMinutes(scheduledTime, 120)
  });
};

// Helper function to get call status message
const getCallStatusMessage = (scheduledDate: string | null) => {
  if (!scheduledDate) return null;
  const scheduledTime = new Date(scheduledDate);
  const now = new Date();
  const joinWindow = subMinutes(scheduledTime, 15);
  if (now < joinWindow) {
    return `Join available from ${format(joinWindow, 'p')}`;
  } else if (canJoinCall(scheduledDate)) {
    return 'Ready to join';
  } else {
    return 'Session ended';
  }
};
interface Consultation {
  id: string;
  hospital_id: string;
  specialist_name: string;
  specialty: string;
  condition_description: string;
  status: 'pending' | 'under_review' | 'approved' | 'scheduled' | 'completed' | 'cancelled';
  scheduled_date: string | null;
  meeting_link: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}
const statusConfig = {
  pending: {
    label: 'Pending Review',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
  },
  under_review: {
    label: 'Under Review',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
  },
  approved: {
    label: 'Approved',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  },
  scheduled: {
    label: 'Scheduled',
    color: 'bg-primary/10 text-primary'
  },
  completed: {
    label: 'Completed',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  }
};
const MyConsultations = () => {
  const navigate = useNavigate();
  const {
    user,
    loading
  } = useAuth();
  const {
    toast
  } = useToast();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);
  useEffect(() => {
    if (user) {
      fetchConsultations();

      // Set up realtime subscription
      const channel = supabase.channel('consultations-changes').on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'consultations',
        filter: `patient_id=eq.${user.id}`
      }, () => {
        fetchConsultations();
      }).subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);
  const fetchConsultations = async () => {
    if (!user) return;
    try {
      const {
        data,
        error
      } = await supabase.from('consultations').select('*').eq('patient_id', user.id).order('created_at', {
        ascending: false
      });
      if (error) throw error;
      setConsultations(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching consultations",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  if (loading || isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>;
  }
  return <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8 px-4">
        <div className="container max-w-4xl mx-0 pr-[50px] pl-[50px] my-[50px] px-0">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="mx-0 my-[80px]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-bold text-foreground text-xl">My Consultations</h1>
                <p className="text-muted-foreground text-sm">Track and manage your consultation requests</p>
              </div>
              <Button variant="outline" onClick={fetchConsultations}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            {consultations.length === 0 ? <Card className="text-center py-12">
                <CardContent>
                  <Hospital className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No Consultations Yet</h2>
                  <p className="text-muted-foreground mb-6">
                    Start your medical journey by scheduling a consultation with one of our partner hospitals.
                  </p>
                  <Link to="/hospitals">
                    <Button>Browse Hospitals</Button>
                  </Link>
                </CardContent>
              </Card> : <div className="space-y-4">
                {consultations.map(consultation => <Card key={consultation.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{consultation.specialty}</CardTitle>
                          <CardDescription>
                            with {consultation.specialist_name}
                          </CardDescription>
                        </div>
                        <Badge className={statusConfig[consultation.status].color}>
                          {statusConfig[consultation.status].label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {consultation.condition_description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Submitted: {format(new Date(consultation.created_at), 'PPP')}
                        </div>
                        
                        {consultation.scheduled_date && <div className="flex items-center gap-2 text-primary font-medium">
                            <Clock className="h-4 w-4" />
                            Scheduled: {format(new Date(consultation.scheduled_date), 'PPP p')}
                          </div>}
                      </div>

                      {consultation.admin_notes && <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-sm font-medium mb-1">Note from Admin:</p>
                          <p className="text-sm text-muted-foreground">{consultation.admin_notes}</p>
                        </div>}

                      {consultation.status === 'scheduled' && consultation.meeting_link && <div className="space-y-2">
                          <div className={`text-xs px-2 py-1 rounded inline-block ${canJoinCall(consultation.scheduled_date) ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                            {getCallStatusMessage(consultation.scheduled_date)}
                          </div>
                          <div className="flex gap-3">
                            <Button className="flex-1" disabled={!canJoinCall(consultation.scheduled_date)} asChild={canJoinCall(consultation.scheduled_date)}>
                              {canJoinCall(consultation.scheduled_date) ? <a href={consultation.meeting_link} target="_blank" rel="noopener noreferrer">
                                  <Video className="h-4 w-4 mr-2" />
                                  Join Video Consultation
                                  <ExternalLink className="h-4 w-4 ml-2" />
                                </a> : <span className="flex items-center">
                                  <Video className="h-4 w-4 mr-2" />
                                  Join Video Consultation
                                </span>}
                            </Button>
                          </div>
                        </div>}

                      <div className="flex justify-end pt-2 border-t">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/consultation-details/${consultation.id}`}>
                            <FileText className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>)}
              </div>}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>;
};
export default MyConsultations;