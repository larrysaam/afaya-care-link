import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Trash2,
  Search,
  Mail
} from 'lucide-react';
import { useAuth, AppRole } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface UserWithRoles {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  roles: AppRole[];
}

const roleLabels: Record<AppRole, string> = {
  patient: 'Patient',
  admin: 'Admin',
  hospital_admin: 'Hospital Admin',
  superadmin: 'Super Admin',
  consultation_admin: 'Consultation Admin',
  visa_admin: 'Visa Admin',
  accommodation_admin: 'Accommodation Admin',
};

const roleColors: Record<AppRole, string> = {
  patient: 'bg-gray-100 text-gray-800',
  admin: 'bg-blue-100 text-blue-800',
  hospital_admin: 'bg-purple-100 text-purple-800',
  superadmin: 'bg-red-100 text-red-800',
  consultation_admin: 'bg-green-100 text-green-800',
  visa_admin: 'bg-yellow-100 text-yellow-800',
  accommodation_admin: 'bg-orange-100 text-orange-800',
};

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user, loading, isSuperAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('consultation_admin');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && user && !isSuperAdmin) {
      toast({
        title: "Access Denied",
        description: "Only Super Admins can access this page.",
        variant: "destructive",
      });
      navigate('/admin');
    }
  }, [user, loading, isSuperAdmin, navigate, toast]);

  useEffect(() => {
    if (user && isSuperAdmin) {
      fetchUsers();
    }
  }, [user, isSuperAdmin]);

  const fetchUsers = async () => {
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, email, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles: UserWithRoles[] = profiles?.map(profile => ({
        ...profile,
        roles: roles?.filter(r => r.user_id === profile.user_id).map(r => r.role as AppRole) || [],
      })) || [];

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast({
        title: "Error fetching users",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRole = async () => {
    if (!selectedUserId || !selectedRole) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: selectedUserId,
          role: selectedRole,
        });

      if (error) {
        if (error.code === '23505') {
          throw new Error('User already has this role');
        }
        throw error;
      }

      toast({
        title: "Role added",
        description: "The role has been assigned successfully.",
      });

      setIsAddDialogOpen(false);
      setSelectedUserId('');
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error adding role",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveRole = async (userId: string, role: AppRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast({
        title: "Role removed",
        description: "The role has been removed successfully.",
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error removing role",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminUsers = filteredUsers.filter(u => 
    u.roles.some(r => ['admin', 'superadmin', 'consultation_admin', 'visa_admin', 'accommodation_admin', 'hospital_admin'].includes(r))
  );

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">User Management</h1>
                <p className="text-muted-foreground">Manage admin roles and permissions</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Admin Role
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Admin Role</DialogTitle>
                    <DialogDescription>
                      Select a user and assign them an admin role.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Select User</Label>
                      <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map(u => (
                            <SelectItem key={u.user_id} value={u.user_id}>
                              {u.full_name || u.email || 'Unknown User'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Select Role</Label>
                      <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin (Full Access)</SelectItem>
                          <SelectItem value="superadmin">Super Admin</SelectItem>
                          <SelectItem value="consultation_admin">Consultation Admin</SelectItem>
                          <SelectItem value="visa_admin">Visa Admin</SelectItem>
                          <SelectItem value="accommodation_admin">Accommodation Admin</SelectItem>
                          <SelectItem value="hospital_admin">Hospital Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddRole} disabled={!selectedUserId || isSubmitting}>
                      {isSubmitting ? 'Adding...' : 'Add Role'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Admin Users Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Admin Users ({adminUsers.length})
                </CardTitle>
                <CardDescription>
                  Users with administrative privileges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No admin users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      adminUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{u.full_name || 'Unknown'}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {u.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {u.roles.map(role => (
                                <Badge 
                                  key={role} 
                                  className={`${roleColors[role]} cursor-pointer hover:opacity-80`}
                                >
                                  {roleLabels[role]}
                                  {role !== 'patient' && u.user_id !== user?.id && (
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <button className="ml-1 hover:text-red-600">
                                          ×
                                        </button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Remove Role</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to remove the {roleLabels[role]} role from {u.full_name || u.email}?
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleRemoveRole(u.user_id, role)}>
                                            Remove
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  )}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(u.created_at), 'PP')}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUserId(u.user_id);
                                setIsAddDialogOpen(true);
                              }}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* All Users */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  All Users ({filteredUsers.length})
                </CardTitle>
                <CardDescription>
                  All registered users on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.slice(0, 10).map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{u.full_name || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">{u.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {u.roles.map(role => (
                              <Badge key={role} className={roleColors[role]}>
                                {roleLabels[role]}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(u.created_at), 'PP')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUserId(u.user_id);
                              setIsAddDialogOpen(true);
                            }}
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredUsers.length > 10 && (
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    Showing 10 of {filteredUsers.length} users
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;