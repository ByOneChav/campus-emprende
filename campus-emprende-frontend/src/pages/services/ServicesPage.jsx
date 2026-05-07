import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { browseServices } from '@/api/services';
import {
  getCommentsThunk,
  addCommentThunk,
  deleteCommentThunk,
} from "@/store/comment/commentThunk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Plus,
  MessageCircle,
  Sparkles,
  Send,
  Trash2,
  ExternalLink,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { browseServicesThunk } from "../../store/service/serviceThunk";

const CATEGORIES = [
  "WEB_DEV",
  "GRAPHIC_DESIGN",
  "TECH_SUPPORT",
  "TUTORING",
  "PHOTOGRAPHY",
  "OTHER",
];
const CATEGORY_LABELS = {
  WEB_DEV: "Desarrollo web",
  GRAPHIC_DESIGN: "Diseño Gráfico",
  TECH_SUPPORT: "Soporte técnico",
  TUTORING: "Tutoría",
  PHOTOGRAPHY: "Fotografía",
  OTHER: "Otro",
};
const CATEGORY_GRADIENTS = {
  WEB_DEV: "from-blue-500 to-indigo-600",
  GRAPHIC_DESIGN: "from-pink-500 to-rose-600",
  TECH_SUPPORT: "from-emerald-500 to-teal-600",
  TUTORING: "from-amber-400 to-orange-500",
  PHOTOGRAPHY: "from-purple-500 to-violet-600",
  OTHER: "from-slate-400 to-slate-600",
};

function timeAgo(dateStr) {

  if (!dateStr) return "";

  try {

    return formatDistanceToNow(

      new Date(dateStr),

      {
        addSuffix: true,
        locale: es, // Cambia el idioma a español
      }

    );

  } catch {

    return "";

  }

}

function ServicePost({ service, currentUserId, isAuthenticated }) {
  const dispatch = useDispatch();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const inputRef = useRef(null);

  const bucket = useSelector((s) => s.comment.byServiceId[service.id]);
  const submitting = useSelector((s) => s.comment.submitting);
  const comments = bucket?.items ?? [];
  const commentsLoading = bucket?.loading ?? false;

  const toggleComments = () => {
    if (!commentsOpen && !bucket) {
      dispatch(getCommentsThunk(service.id));
    }
    setCommentsOpen((v) => !v);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    setCommentText("");
    await dispatch(addCommentThunk({ serviceId: service.id, content: text }));
  };

  const handleDelete = (commentId) => {
    dispatch(deleteCommentThunk({ commentId, serviceId: service.id }));
  };

  const gradient =
    CATEGORY_GRADIENTS[service.category] ?? CATEGORY_GRADIENTS.OTHER;
  const initials = service.providerName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const commentCount = bucket ? comments.length : service.commentCount;

  return (
    <article className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image / gradient banner */}
      {service.imageUrl ? (
        <img
          src={service.imageUrl}
          alt={service.title}
          className="w-full aspect-video object-cover"
        />
      ) : (
        <div
          className={`w-full aspect-video bg-linear-to-br ${gradient} flex items-center justify-center`}
        >
          <span className="text-white/80 text-4xl font-bold select-none">
            {service.title?.charAt(0)?.toUpperCase()}
          </span>
        </div>
      )}

      {/* Header: provider */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-none truncate">
            {service.providerName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {timeAgo(service.createdAt)}
          </p>
        </div>
        <Badge variant="secondary" className="text-xs shrink-0">
          {CATEGORY_LABELS[service.category]}
        </Badge>
      </div>

      {/* Content */}
      <div className="px-4 pb-3 space-y-1">
        <h3 className="font-semibold text-sm leading-snug">{service.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {service.description}
        </p>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-1 px-3 pb-2 border-t pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
          onClick={toggleComments}
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">{commentCount ?? 0}</span>
        </Button>
        <div className="flex-1" />
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          <Link to={`/services/${service.id}`}>
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            Vista
          </Link>
        </Button>
      </div>

      {/* Comments section */}
      {commentsOpen && (
        <div className="border-t bg-muted/30 px-4 py-3 space-y-3">
          {/* Comment list */}
          {commentsLoading ? (
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : comments.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-2">
              Aún no hay comentarios. ¡Sé el primero!
            </p>
          ) : (
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {comments.map((c) => (
                <li key={c.id} className="flex items-start gap-2 group">
                  <Avatar className="h-6 w-6 shrink-0 mt-0.5">
                    <AvatarFallback className="text-[10px]">
                      {c.authorName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold">
                      {c.authorName}{" "}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {c.content}
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {timeAgo(c.createdAt)}
                    </p>
                  </div>
                  {c.authorId === currentUserId && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-0.5 shrink-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Comment input */}
          {isAuthenticated && (
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                ref={inputRef}
                placeholder="Añade un comentario…"
                className="h-8 text-xs flex-1"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="h-8 w-8 shrink-0"
                disabled={submitting || !commentText.trim()}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          )}
        </div>
      )}
    </article>
  );
}

function PostSkeleton() {
  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      <Skeleton className="w-full aspect-video" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const { isAuthenticated, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const currentUserId = user?.id ?? null;
  const { services, loading } = useSelector((store) => store.service);
  const dispatch=useDispatch()

  const hasFilters = keyword.trim() !== "" || category !== "";

  useEffect(() => {
    dispatch(browseServicesThunk({keyword, category}));
  }, [keyword, category]);

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   setSearchParams({ keyword, category });

  // };

  const handleKeywordChange = (e) => {
    const val = e.target.value;
    setKeyword(val);
    // When keyword is cleared, immediately restore full list (keeping category filter)
    if (!val.trim()) {
      setSearchParams({ keyword: "", category });
    }
  };

  const handleCategoryChange = (val) => {
    const newCat = val === "ALL" ? "" : val;
    setCategory(newCat);
    setSearchParams({ keyword, category: newCat });
  };

  const clearFilters = () => {
    setKeyword("");
    setCategory("");
    setSearchParams({});
    browseServicesThunk("", "");
  };

  return (
  <div className="max-w-7xl mx-auto px-4 py-8">

    {/* =========================
        HERO HEADER
    ========================== */}

    <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/40 mb-8">

      {/* Glow */}
      <div className="absolute -top-20 right-[-60px] h-56 w-56 rounded-full bg-blue-100 blur-3xl opacity-70" />

      {/* Barra superior */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0A84FF] via-[#5AA9FF] to-[#B7D8FF]" />

      <div className="relative px-7 py-7">

        {/* Top section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          {/* Left */}
          <div>

            {/* Badge */}
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-blue-200
                bg-blue-50
                px-4
                py-1.5
                text-sm
                font-medium
                text-[#0A84FF]
                shadow-sm
                mb-5
              "
            >

              <Sparkles className="h-4 w-4" />

              Marketplace universitario

            </div>

            {/* Title */}
            <h1
              className="
                text-4xl
                font-black
                tracking-tight
                text-slate-900
              "
            >
              Explorar servicios
            </h1>

            {/* Subtitle */}
            <p className="mt-2 text-[16px] text-slate-500">

              {loading
                ? "Cargando servicios..."
                : `${services.length} servicio${services.length !== 1 ? "s" : ""} aprobado${services.length !== 1 ? "s" : ""}`}

              {hasFilters && !loading && " encontrados con tus filtros"}

            </p>

          </div>

          {/* Right Button */}
          {isAuthenticated && (

            <Button
              asChild

              className="
                h-14
                rounded-2xl
                px-7
                text-[15px]
                font-semibold
                shadow-lg
                shadow-blue-500/30
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:shadow-xl
              "
            >

              <Link to="/services/create">

                <Plus className="mr-2 h-5 w-5" />

                Ofrecer un servicio

              </Link>

            </Button>

          )}

        </div>

        {/* =========================
            SEARCH + FILTER
        ========================== */}

        <form className="mt-8 flex flex-col lg:flex-row gap-4">

          {/* Search */}
          <div className="relative flex-1">

            <Search
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                h-5
                w-5
                text-slate-400
              "
            />

            <Input
              placeholder="Buscar por título o descripción..."
              className="
                h-14
                rounded-2xl
                border-slate-200
                bg-slate-50/70
                pl-12
                pr-10
                text-[15px]
                shadow-sm
                transition-all
                duration-300
                focus:bg-white
                focus:ring-2
                focus:ring-blue-200
              "
              value={keyword}
              onChange={handleKeywordChange}
            />

            {keyword && (

              <button
                type="button"
                onClick={() => handleKeywordChange({ target: { value: "" } })}

                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                  transition-colors
                  hover:text-slate-700
                "
              >

                <X className="h-4 w-4" />

              </button>

            )}

          </div>

          {/* Select */}
          <Select
            value={category || "ALL"}
            onValueChange={handleCategoryChange}
          >

            <SelectTrigger
              className="
                h-14
                w-full
                lg:w-[250px]
                rounded-2xl
                border-slate-200
                bg-slate-50/70
                text-[15px]
                shadow-sm
              "
            >

              <SelectValue placeholder="Todas las categorías" />

            </SelectTrigger>

            <SelectContent className="rounded-2xl">

              <SelectItem value="ALL">
                Todas las categorías
              </SelectItem>

              {CATEGORIES.map((c) => (

                <SelectItem key={c} value={c}>

                  {CATEGORY_LABELS[c]}

                </SelectItem>

              ))}

            </SelectContent>

          </Select>

        </form>

      </div>

    </div>

    {/* =========================
        FILTER PILLS
    ========================== */}

    {hasFilters && (

      <div className="flex items-center gap-2 mb-6 flex-wrap">

        {keyword && (

          <Badge
            variant="secondary"

            className="
              flex
              items-center
              gap-1
              rounded-full
              px-3
              py-1.5
            "
          >

            "{keyword}"

            <button
              onClick={() => handleKeywordChange({ target: { value: "" } })}

              className="hover:text-destructive"
            >

              <X className="h-3 w-3" />

            </button>

          </Badge>

        )}

        {category && (

          <Badge
            variant="secondary"

            className="
              flex
              items-center
              gap-1
              rounded-full
              px-3
              py-1.5
            "
          >

            {CATEGORY_LABELS[category]}

            <button
              onClick={() => handleCategoryChange("ALL")}

              className="hover:text-destructive"
            >

              <X className="h-3 w-3" />

            </button>

          </Badge>

        )}

      </div>

    )}

    {/* =========================
        SERVICES GRID
    ========================== */}

    {loading ? (

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {[...Array(6)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}

      </div>

    ) : services.length === 0 ? (

      <div
        className="
          rounded-[32px]
          border
          border-slate-200
          bg-white
          py-24
          text-center
          shadow-lg
        "
      >

        <MessageCircle className="h-14 w-14 mx-auto mb-4 text-slate-300" />

        <p className="text-xl font-semibold text-slate-700">
          No se encontraron servicios
        </p>

        <p className="text-sm text-slate-500 mt-2">
          Prueba con otra búsqueda o categoría.
        </p>

      </div>

    ) : (

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {services.map((s) => (

          <div key={s.id} className="break-inside-avoid">

            <ServicePost
              service={s}
              currentUserId={currentUserId}
              isAuthenticated={isAuthenticated}
            />

          </div>

        ))}

      </div>

    )}

  </div>
);
}
