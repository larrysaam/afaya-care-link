import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Upload, FileText, X, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { getHospitalById, Hospital } from '@/data/hospitals';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const consultationSchema = z.object({
  fullName: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Valid email is required").max(255),
  phone: z.string().trim().min(10, "Valid phone number is required").max(20),
  country: z.string().trim().min(2, "Country is required").max(100),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  gender: z.string().min(1, "Gender is required"),
  specialty: z.string().min(1, "Please select a specialty"),
  specialist: z.string().min(1, "Please select a specialist"),
  conditionDescription: z.string().trim().min(20, "Please describe your condition in detail (at least 20 characters)").max(2000),
  medicalHistory: z.string().max(2000).optional(),
  currentMedications: z.string().max(1000).optional(),
  urgencyLevel: z.string().default("normal"),
  preferredDate: z.date().optional(),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

// Mock specialists data - in production, this would come from the database
const getSpecialistsForHospital = (hospitalId: string, specialty: string) => {
  const specialists: Record<string, { name: string; specialty: string; experience: string }[]> = {
    "medanta-gurugram": [
      { name: "Dr. Naresh Trehan", specialty: "Cardiology", experience: "40+ years" },
      { name: "Dr. Arvind Kumar", specialty: "Oncology", experience: "25+ years" },
      { name: "Dr. Rajesh Ahlawat", specialty: "Urology", experience: "30+ years" },
      { name: "Dr. Rana Patir", specialty: "Neurology", experience: "28+ years" },
      { name: "Dr. Ashok Rajgopal", specialty: "Orthopedics", experience: "35+ years" },
    ],
    "apollo-chennai": [
      { name: "Dr. K. Hari Prasad", specialty: "Cardiology", experience: "30+ years" },
      { name: "Dr. Prathap C Reddy", specialty: "Oncology", experience: "35+ years" },
      { name: "Dr. Venkatesh Munikrishnan", specialty: "Transplant Surgery", experience: "20+ years" },
    ],
    "fortis-delhi": [
      { name: "Dr. Ashok Seth", specialty: "Cardiology", experience: "35+ years" },
      { name: "Dr. Simmardeep Gill", specialty: "Oncology", experience: "22+ years" },
    ],
  };

  const hospitalSpecialists = specialists[hospitalId] || [];
  return specialty 
    ? hospitalSpecialists.filter(s => s.specialty === specialty)
    : hospitalSpecialists;
};

const ConsultationRequest = () => {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specialists, setSpecialists] = useState<{ name: string; specialty: string; experience: string }[]>([]);

  const form = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      country: '',
      gender: '',
      specialty: '',
      specialist: '',
      conditionDescription: '',
      medicalHistory: '',
      currentMedications: '',
      urgencyLevel: 'normal',
    },
  });

  const selectedSpecialty = form.watch('specialty');

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to schedule a consultation.",
        variant: "destructive",
      });
      navigate(`/auth?redirect=/consultation/${hospitalId}`);
    }
  }, [user, loading, navigate, hospitalId, toast]);

  useEffect(() => {
    if (hospitalId) {
      const hospitalData = getHospitalById(hospitalId);
      if (hospitalData) {
        setHospital(hospitalData);
      } else {
        navigate('/hospitals');
      }
    }
  }, [hospitalId, navigate]);

  useEffect(() => {
    if (hospitalId && selectedSpecialty) {
      const specialistsList = getSpecialistsForHospital(hospitalId, selectedSpecialty);
      setSpecialists(specialistsList);
      form.setValue('specialist', '');
    }
  }, [hospitalId, selectedSpecialty, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => {
        const isValidType = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/dicom'].includes(file.type) || 
                           file.name.endsWith('.dcm');
        const isValidSize = file.size <= 20 * 1024 * 1024; // 20MB max
        return isValidType && isValidSize;
      });
      
      if (validFiles.length !== files.length) {
        toast({
          title: "Some files were not added",
          description: "Only PDF, JPEG, PNG, and DICOM files under 20MB are allowed.",
          variant: "destructive",
        });
      }
      
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ConsultationFormData) => {
    if (!user || !hospital) return;

    setIsSubmitting(true);

    try {
      // Create consultation record
      const { data: consultation, error: consultationError } = await supabase
        .from('consultations')
        .insert({
          patient_id: user.id,
          hospital_id: hospital.id,
          specialist_name: data.specialist,
          specialty: data.specialty,
          condition_description: data.conditionDescription,
          medical_history: data.medicalHistory || null,
          current_medications: data.currentMedications || null,
          urgency_level: data.urgencyLevel,
          preferred_date: data.preferredDate ? format(data.preferredDate, 'yyyy-MM-dd') : null,
          status: 'pending',
        })
        .select()
        .single();

      if (consultationError) throw consultationError;

      // Update user profile
      await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          country: data.country,
          date_of_birth: format(data.dateOfBirth, 'yyyy-MM-dd'),
          gender: data.gender,
        });

      // Upload medical documents
      for (const file of selectedFiles) {
        const filePath = `${user.id}/${consultation.id}/${Date.now()}-${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('medical-documents')
          .upload(filePath, file);

        if (!uploadError) {
          await supabase
            .from('medical_documents')
            .insert({
              consultation_id: consultation.id,
              file_name: file.name,
              file_path: filePath,
              file_type: file.type,
              file_size: file.size,
            });
        }
      }

      toast({
        title: "Consultation request submitted!",
        description: "Our team will review your request and contact you soon.",
      });

      navigate('/my-consultations');
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit consultation request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hospital Info */}
            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <img 
                    src={hospital.logo} 
                    alt={hospital.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <CardTitle className="text-xl">{hospital.name}</CardTitle>
                    <CardDescription>{hospital.city}, {hospital.state}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Consultation Form */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule a Consultation</CardTitle>
                <CardDescription>
                  Please fill in your details and describe your medical condition. Our specialists will review your request.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground border-b pb-2">Personal Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 234 567 8900" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country *</FormLabel>
                              <FormControl>
                                <Input placeholder="Nigeria" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Date of Birth *</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                    className={cn("p-3 pointer-events-auto")}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Medical Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground border-b pb-2">Medical Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="specialty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Specialty Required *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select specialty" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {hospital.specialties.map((specialty) => (
                                    <SelectItem key={specialty} value={specialty}>
                                      {specialty}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="specialist"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Specialist *</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                                disabled={!selectedSpecialty || specialists.length === 0}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={
                                      !selectedSpecialty 
                                        ? "Select specialty first" 
                                        : specialists.length === 0 
                                          ? "No specialists available"
                                          : "Select specialist"
                                    } />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {specialists.map((specialist) => (
                                    <SelectItem key={specialist.name} value={specialist.name}>
                                      {specialist.name} ({specialist.experience})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="urgencyLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Urgency Level</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select urgency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="normal">Normal</SelectItem>
                                  <SelectItem value="urgent">Urgent</SelectItem>
                                  <SelectItem value="emergency">Emergency</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="preferredDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Preferred Consultation Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                    className={cn("p-3 pointer-events-auto")}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormDescription>
                                Select your preferred date for the video consultation
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="conditionDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Describe Your Condition *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please describe your medical condition, symptoms, and any relevant history in detail..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Provide as much detail as possible to help the specialist understand your case
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="medicalHistory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medical History</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Previous surgeries, chronic conditions, allergies, family medical history..."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currentMedications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Medications</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List any medications you are currently taking..."
                                className="min-h-[60px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Medical Documents */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground border-b pb-2">Medical Documents</h3>
                      
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-2">
                          Upload medical reports, X-rays, MRI scans, or other relevant documents
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Supported formats: PDF, JPEG, PNG, DICOM (max 20MB each)
                        </p>
                        <Label htmlFor="file-upload" className="cursor-pointer">
                          <Button type="button" variant="outline" asChild>
                            <span>
                              <Upload className="h-4 w-4 mr-2" />
                              Choose Files
                            </span>
                          </Button>
                          <input
                            id="file-upload"
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png,.dcm,application/pdf,image/jpeg,image/png"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </Label>
                      </div>

                      {selectedFiles.length > 0 && (
                        <div className="space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div 
                              key={index}
                              className="flex items-center justify-between p-3 bg-muted rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="text-sm font-medium">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Important Notice */}
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-800 dark:text-amber-200">
                        <p className="font-medium mb-1">Important Information</p>
                        <ul className="list-disc list-inside space-y-1 text-amber-700 dark:text-amber-300">
                          <li>Your consultation request will be reviewed by our medical team</li>
                          <li>You will receive a confirmation email within 24-48 hours</li>
                          <li>The specialist may request additional information before scheduling</li>
                          <li>Video consultation fees will be communicated before confirmation</li>
                        </ul>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting Request...' : 'Submit Consultation Request'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConsultationRequest;
