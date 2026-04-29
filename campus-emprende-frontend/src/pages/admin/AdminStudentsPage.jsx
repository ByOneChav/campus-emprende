import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStudentsThunk } from '@/store/admin/adminThunk';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { GraduationCap } from 'lucide-react';

export default function AdminStudentsPage() {
  const dispatch = useDispatch();
  const { students, loading } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(getStudentsThunk()); }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Students</h1>
        {!loading && <Badge variant="secondary">{students.length}</Badge>}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : students.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <GraduationCap className="h-10 w-10 mx-auto mb-3" />
          <p>No students found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {students.map((u) => (
            <Card key={u.id}>
              <CardContent className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <Link to={`/profiles/${u.id}`} className="font-medium text-sm hover:underline">
                    {u.fullName}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">{u.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {u.createdAt && (
                    <span className="text-xs text-muted-foreground">
                      Joined {new Date(u.createdAt).toLocaleDateString()}
                    </span>
                  )}
                  <Badge className="bg-blue-100 text-blue-700">STUDENT</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
