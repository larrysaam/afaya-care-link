import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, Globe, Mail, Save } from 'lucide-react';

const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().trim().max(20).optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  date_of_birth: z.string().optional().or(z.literal('')),
  gender: z.string().optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const africanCountries = [
  "Nigeria", "Kenya", "Ghana", "Ethiopia", "Tanzania", "Uganda", "South Africa",
  "Cameroon", "Senegal", "Rwanda", "Mozambique", "Zambia", "Zimbabwe", "Angola",
  "Sudan", "Somalia", "Mali", "Niger", "Burkina Faso", "Ivory Coast",
  "Madagascar", "Malawi", "Congo (DRC)", "Chad", "Guinea", "Benin", "Togo",
  "Sierra Leone", "Liberia", "Mauritania", "Eritrea", "Gambia", "Botswana",
  "Namibia", "Gabon", "Lesotho", "Equatorial Guinea", "Mauritius", "Eswatini",
  "Djibouti", "Comoros", "Cape Verde", "Seychelles", "Other",
];

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: '', phone: '', country: '', date_of_birth: '', gender: '' },
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }
    if (user) {
      fetchProfile();
    }
  }, [user, loading]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      form.reset({
        full_name: data.full_name || '',
        phone: data.phone || '',
        country: data.country || '',
        date_of_birth: data.date_of_birth || '',
        gender: data.gender || '',
      });
    }
    setIsLoading(false);
  };

  const onSubmit = async (values: ProfileFormData) => {
    if (!user) return;
    setIsSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: values.full_name,
        phone: values.phone || null,
        country: values.country || null,
        date_of_birth: values.date_of_birth || null,
        gender: values.gender || null,
      })
      .eq('user_id', user.id);

    setIsSaving(false);

    if (error) {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    } else {
      toast({ title: "Profile updated", description: "Your information has been saved." });
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container max-w-lg mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                My Profile
              </CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input value={user?.email || ''} disabled className="pl-10 bg-muted" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="full_name" className="pl-10" {...form.register('full_name')} />
                  </div>
                  {form.formState.errors.full_name && <p className="text-sm text-destructive">{form.formState.errors.full_name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" type="tel" placeholder="+234 800 000 0000" className="pl-10" {...form.register('phone')} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select value={form.watch('country')} onValueChange={(val) => form.setValue('country', val)}>
                    <SelectTrigger>
                      <Globe className="h-4 w-4 text-muted-foreground mr-2" />
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {africanCountries.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" {...form.register('date_of_birth')} />
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={form.watch('gender')} onValueChange={(val) => form.setValue('gender', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
