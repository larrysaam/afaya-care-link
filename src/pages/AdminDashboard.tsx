import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  FileText, 
  UserPlus, 
  Shield, 
  Settings,
  BarChart3,
  Activity,
  Clock
} from 'lucide-react';
import { useAuth, AppRole } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface AnalyticsData {
  totalConsultations: number;
  pendingConsultations: number;
  scheduledConsultations: number;
  completedConsultations: number;
  totalPatients: number;
  newPatientsThisWeek: number;
  consultationsByDay: { date: string; count: number }[];
  statusDistribution: { name: string; value: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading, isAdmin, isSuperAdmin, hasRole } = useAuth();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      fetchAnalytics();
    }
  }, [user, isAdmin]);

  const fetchAnalytics = async () => {
    try {
      // Fetch consultations
      const { data: consultations, error: consultationsError } = await supabase
        .from('consultations')
        .select('status, created_at');

      if (consultationsError) throw consultationsError;

      // Fetch profiles count
      const { count: profilesCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // New patients this week
      const weekAgo = subDays(new Date(), 7);
      const { count: newPatients } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      // Process consultations data
      const statusCounts = {
        pending: 0,
        under_review: 0,
        approved: 0,
        scheduled: 0,
        completed: 0,
        cancelled: 0,
      };

      consultations?.forEach(c => {
        if (c.status in statusCounts) {
          statusCounts[c.status as keyof typeof statusCounts]++;
        }
      });

      // Consultations by day (last 7 days)
      const consultationsByDay: { date: string; count: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);
        
        const count = consultations?.filter(c => {
          const createdAt = new Date(c.created_at);
          return createdAt >= dayStart && createdAt <= dayEnd;
        }).length || 0;

        consultationsByDay.push({
          date: format(date, 'EEE'),
          count,
        });
      }

      // Status distribution for pie chart
      const statusDistribution = [
        { name: 'Pending', value: statusCounts.pending },
        { name: 'Under Review', value: statusCounts.under_review },
        { name: 'Approved', value: statusCounts.approved },
        { name: 'Scheduled', value: statusCounts.scheduled },
        { name: 'Completed', value: statusCounts.completed },
        { name: 'Cancelled', value: statusCounts.cancelled },
      ].filter(item => item.value > 0);

      setAnalytics({
        totalConsultations: consultations?.length || 0,
        pendingConsultations: statusCounts.pending,
        scheduledConsultations: statusCounts.scheduled,
        completedConsultations: statusCounts.completed,
        totalPatients: profilesCount || 0,
        newPatientsThisWeek: newPatients || 0,
        consultationsByDay,
        statusDistribution,
      });

      // Log analytics event
      await supabase.from('analytics_events').insert({
        event_type: 'admin_dashboard_view',
        user_id: user?.id,
        event_data: { timestamp: new Date().toISOString() },
      });

    } catch (error: any) {
      toast({
        title: "Error fetching analytics",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const quickLinks = [
    {
      title: 'Manage Consultations',
      description: 'Review and update consultation requests',
      icon: Calendar,
      href: '/admin/consultations',
      roles: ['admin', 'superadmin', 'consultation_admin'] as AppRole[],
    },
    {
      title: 'Manage Users',
      description: 'Add and manage admin users',
      icon: Users,
      href: '/admin/users',
      roles: ['superadmin'] as AppRole[],
    },
    {
      title: 'Visa Requests',
      description: 'Manage visa letter requests',
      icon: FileText,
      href: '/admin/visa',
      roles: ['admin', 'superadmin', 'visa_admin'] as AppRole[],
    },
    {
      title: 'Accommodations',
      description: 'Manage accommodation bookings',
      icon: Settings,
      href: '/admin/accommodations',
      roles: ['admin', 'superadmin', 'accommodation_admin'] as AppRole[],
    },
  ];

  const accessibleLinks = quickLinks.filter(link => 
    link.roles.some(role => hasRole(role)) || isSuperAdmin
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back! Here's your platform overview.
                  {isSuperAdmin && (
                    <Badge className="ml-2 bg-primary/10 text-primary">Super Admin</Badge>
                  )}
                </p>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Consultations</p>
                      <p className="text-2xl font-bold">{analytics?.totalConsultations || 0}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-primary/20" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">{analytics?.pendingConsultations || 0}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-200" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Scheduled</p>
                      <p className="text-2xl font-bold text-blue-600">{analytics?.scheduledConsultations || 0}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Patients</p>
                      <p className="text-2xl font-bold">{analytics?.totalPatients || 0}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary/20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Consultations (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics?.consultationsByDay || []}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="count" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ fill: 'hsl(var(--primary))' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    {analytics?.statusDistribution && analytics.statusDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analytics.statusDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {analytics.statusDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        No data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Access key management areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {accessibleLinks.map((link) => (
                    <Link key={link.href} to={link.href}>
                      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50">
                        <CardContent className="pt-6">
                          <link.icon className="h-8 w-8 text-primary mb-3" />
                          <h3 className="font-semibold">{link.title}</h3>
                          <p className="text-sm text-muted-foreground">{link.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Platform Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">+{analytics?.newPatientsThisWeek || 0}</p>
                    <p className="text-sm text-muted-foreground">New Patients (7d)</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{analytics?.completedConsultations || 0}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">
                      {analytics?.totalConsultations ? 
                        Math.round((analytics.completedConsultations / analytics.totalConsultations) * 100) : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">
                      {analytics?.totalPatients ? 
                        (analytics.totalConsultations / analytics.totalPatients).toFixed(1) : 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Consults/Patient</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;