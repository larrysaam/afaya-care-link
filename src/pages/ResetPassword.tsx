import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import platformLogo from '@/assets/logo.png';

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(72),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    // Check if we have a valid session from the password reset link
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidToken(true);
      }
    });

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsValidToken(true);
      }
    });
  }, []);

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;

      toast({
        title: "Password reset successful",
        description: "Your password has been updated. You can now sign in with your new password.",
      });

      // Sign out and redirect to login
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Failed to reset password",
        description: error.message || "Please try again or request a new reset link.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4 pt-28 lg:pt-32">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground mb-4">Invalid or Expired Link</h1>
                <p className="text-muted-foreground mb-6">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
                <Button onClick={() => navigate('/auth')}>
                  Go to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 pt-28 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <img src={platformLogo} alt="AfayaConekt Logo" className="h-10 w-10 rounded-xl object-cover" />
              <span className="text-2xl font-bold text-primary">AfayaConekt</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Reset Your Password</h1>
            <p className="text-muted-foreground">Enter your new password below</p>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardContent className="pt-6">
              <form onSubmit={form.handleSubmit(handleResetPassword)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      {...form.register('password')}
                    />
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      {...form.register('confirmPassword')}
                    />
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Resetting password...' : 'Reset Password'}
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

export default ResetPassword;
