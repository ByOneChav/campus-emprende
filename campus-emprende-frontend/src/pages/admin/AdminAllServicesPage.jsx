import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllServicesThunk } from "@/store/admin/adminThunk";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase } from "lucide-react";

const CATEGORY_LABELS = {
  WEB_DEV: "Desarrollo web",
  GRAPHIC_DESIGN: "Diseño Gráfico",
  TECH_SUPPORT: "Soporte técnico",
  TUTORING: "Tutoría",
  PHOTOGRAPHY: "Fotografía",
  OTHER: "Otro",
};

const STATUS_COLORS = {
  ACTIVE: "bg-green-100 text-green-700",
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  RECHAZADO: "bg-red-100 text-red-700",
  INACTIVO: "bg-gray-100 text-gray-600",
};

export default function AdminAllServicesPage() {
  const dispatch = useDispatch();
  const { allServices, loading } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(getAllServicesThunk());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Todos los servicios</h1>
        {!loading && <Badge variant="secondary">{allServices.length}</Badge>}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : allServices.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <Briefcase className="h-10 w-10 mx-auto mb-3" />
          <p>No se encontraron servicios.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {allServices.map((s) => (
            <Card key={s.id}>
              <CardContent className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/services/${s.id}`}
                    className="font-medium text-sm hover:underline"
                  >
                    {s.title}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {CATEGORY_LABELS[s.category]} ·{" "}
                    <Link
                      to={`/profiles/${s.providerId}`}
                      className="hover:underline"
                    >
                      {s.providerName}
                    </Link>
                  </p>
                </div>
                <Badge className={STATUS_COLORS[s.status] || ""}>
                  {s.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
