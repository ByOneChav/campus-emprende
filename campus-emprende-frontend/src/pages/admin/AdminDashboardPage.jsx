import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getDashboardThunk, getTopStudentsThunk } from '@/store/admin/adminThunk';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Users, CheckCircle, Clock, XCircle, Send, Flag, ShieldCheck, Star } from 'lucide-react';

function RatingStars({ value }) {
  const rounded = Math.round(value * 10) / 10;
  return (
    <span className="flex items-center gap-1">
      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium">{rounded > 0 ? rounded.toFixed(1) : '—'}</span>
    </span>
  );
}

export default function AdminDashboardPage() {
  const dispatch = useDispatch();
  const { dashboard, topStudents, loading } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(getDashboardThunk());
    dispatch(getTopStudentsThunk());
  }, [dispatch]);

  const stats = dashboard ? [
    { label: 'Total Users',       value: dashboard.totalUsers,       icon: Users,        color: 'text-blue-600' },
    { label: 'Approved Services', value: dashboard.approvedServices, icon: CheckCircle,  color: 'text-green-600' },
    { label: 'Pending Review',    value: dashboard.pendingServices,  icon: Clock,        color: 'text-yellow-600' },
    { label: 'Rejected',          value: dashboard.rejectedServices, icon: XCircle,      color: 'text-red-500' },
    { label: 'Total Requests',    value: dashboard.totalRequests,    icon: Send,         color: 'text-indigo-600' },
    { label: 'Pending Reports',   value: dashboard.pendingReports,   icon: Flag,         color: 'text-orange-500' },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {loading
          ? [...Array(6)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
          : stats.map(({ label, value, icon: Icon, color }) => (
              <Card key={label}>
                <CardContent className="pt-5 flex items-center gap-4">
                  <Icon className={`h-8 w-8 ${color}`} />
                  <div>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Top 5 Students */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Top 5 Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : topStudents.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No student data yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">#</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-center">Services</TableHead>
                  <TableHead className="text-center">Requests</TableHead>
                  <TableHead className="text-center">Completed</TableHead>
                  <TableHead className="text-center">Avg Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topStudents.map((s, idx) => (
                  <TableRow key={s.studentId}>
                    <TableCell>
                      <Badge variant={idx === 0 ? 'default' : 'outline'} className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                        {idx + 1}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{s.studentName}</p>
                      <p className="text-xs text-muted-foreground">{s.studentEmail}</p>
                    </TableCell>
                    <TableCell className="text-center font-medium">{s.totalServices}</TableCell>
                    <TableCell className="text-center font-medium">{s.totalRequests}</TableCell>
                    <TableCell className="text-center">
                      <span className="text-green-600 font-medium">{s.completedRequests}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <RatingStars value={s.averageRating} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Service Moderation</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Review and approve or reject student service listings.</p>
            <Button asChild><Link to="/admin/services">Manage Services</Link></Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Content Reports</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Review reports submitted by students about services, reviews, and users.</p>
            <Button asChild><Link to="/admin/reports">Manage Reports</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
