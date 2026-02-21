import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User, Phone, Globe } from 'lucide-react';
import platformLogo from '@/assets/logo.png';

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  fullName: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100),
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  phone: z.string().trim().min(7, { message: "Enter a valid phone number" }).max(20),
  country: z.string().min(1, { message: "Please select your country" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(72),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const africanCountries = [
  "Nigeria", "Kenya", "Ghana", "Ethiopia", "Tanzania", "Uganda", "South Africa",
  "Cameroon", "Senegal", "Rwanda", "Mozambique", "Zambia", "Zimbabwe", "Angola",
  "Sudan", "Somalia", "Mali", "Niger", "Burkina Faso", "Ivory Coast",
  "Madagascar", "Malawi", "Congo (DRC)", "Chad", "Guinea", "Benin", "Togo",
  "Sierra Leone", "Liberia", "Mauritania", "Eritrea", "Gambia", "Botswana",
  "Namibia", "Gabon", "Lesotho", "Equatorial Guinea", "Mauritius", "Eswatini",
  "Djibouti", "Comoros", "Cape Verde", "Seychelles", "Other",
];

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', email: '', phone: '', country: '', password: '', confirmPassword: '' },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Login failed",
        description: error.message === "Invalid login credentials" 
          ? "Invalid email or password. Please try again."
          : error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate('/');
    }
  };  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.fullName, data.phone, data.country);
    setIsLoading(false);

    if (error) {
      const errorMessage = error.message.includes("already registered")
        ? "This email is already registered. Please login instead."
        : error.message;
      
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      // Show confirmation dialog and switch to login tab
      setConfirmationEmail(data.email);
      setShowConfirmationDialog(true);
      setActiveTab('login');
      signupForm.reset();
      
      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account.",
      });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password.",
      });
      
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error: any) {
      toast({
        title: "Failed to send reset email",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">      <Header />
      
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
            <h1 className="text-2xl font-bold text-foreground">Welcome</h1>
            <p className="text-muted-foreground">Sign in to access your medical journey</p>
          </div>

          <Card className="border-border/50 shadow-lg">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="pb-4 pt-6 px-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
              </div>

              <CardContent>
                <TabsContent value="login" className="mt-0">
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="login-email" type="email" placeholder="you@example.com" className="pl-10" {...loginForm.register('email')} />
                      </div>
                      {loginForm.formState.errors.email && <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="login-password" type="password" placeholder="••••••••" className="pl-10" {...loginForm.register('password')} />
                      </div>
                      {loginForm.formState.errors.password && <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>}
                    </div>                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>

                    <div className="text-center mt-4">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-0">
                  <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-name" type="text" placeholder="John Doe" className="pl-10" {...signupForm.register('fullName')} />
                      </div>
                      {signupForm.formState.errors.fullName && <p className="text-sm text-destructive">{signupForm.formState.errors.fullName.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-email" type="email" placeholder="you@example.com" className="pl-10" {...signupForm.register('email')} />
                      </div>
                      {signupForm.formState.errors.email && <p className="text-sm text-destructive">{signupForm.formState.errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-phone" type="tel" placeholder="+234 800 000 0000" className="pl-10" {...signupForm.register('phone')} />
                      </div>
                      {signupForm.formState.errors.phone && <p className="text-sm text-destructive">{signupForm.formState.errors.phone.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-country">Country</Label>
                      <Select onValueChange={(val) => signupForm.setValue('country', val, { shouldValidate: true })}>
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
                      {signupForm.formState.errors.country && <p className="text-sm text-destructive">{signupForm.formState.errors.country.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-password" type="password" placeholder="••••••••" className="pl-10" {...signupForm.register('password')} />
                      </div>
                      {signupForm.formState.errors.password && <p className="text-sm text-destructive">{signupForm.formState.errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-confirm" type="password" placeholder="••••••••" className="pl-10" {...signupForm.register('confirmPassword')} />
                      </div>
                      {signupForm.formState.errors.confirmPassword && <p className="text-sm text-destructive">{signupForm.formState.errors.confirmPassword.message}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>          <p className="text-center text-sm text-muted-foreground mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </main>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForgotPassword(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send reset link'}
              </Button>
            </DialogFooter>
          </form>        </DialogContent>
      </Dialog>

      {/* Email Confirmation Dialog */}
      <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">📧 Confirm Your Email</DialogTitle>
            <DialogDescription className="text-center pt-4">
              We've sent a confirmation email to:
              <div className="font-semibold text-foreground mt-2">
                {confirmationEmail}
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Next steps:</strong>
              </p>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the confirmation link in the email</li>
                <li>Return here to sign in</li>
              </ol>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Important:</strong> You must confirm your email before you can sign in.
              </p>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button
              onClick={() => setShowConfirmationDialog(false)}
              className="w-full"
            >
              Got it! I'll check my email
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmationDialog(false);
                setShowForgotPassword(true);
                setResetEmail(confirmationEmail);
              }}
              className="w-full"
              size="sm"
            >
              Didn't receive the email? Resend
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Auth;
