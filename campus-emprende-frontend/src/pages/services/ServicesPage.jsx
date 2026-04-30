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
  Send,
  Trash2,
  ExternalLink,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
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
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Explorar servicios</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {loading
              ? "Loading…"
              : `${services.length} servicios aprobados${services.length !== 1 ? "s" : ""}`}
            {hasFilters && !loading && " matching your filters"}
          </p>
        </div>
        {isAuthenticated && (
          <Button asChild>
            <Link to="/services/create">
              <Plus className="mr-2 h-4 w-4" />
              Ofrecer un servicio
            </Link>
          </Button>
        )}
      </div>

      {/* Search & Filter */}
      <form className="flex flex-col sm:flex-row gap-3 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título o descripción…"
            className="pl-9 pr-9"
            value={keyword}
            onChange={handleKeywordChange}
          />
          {keyword && (
            <button
              type="button"
              onClick={() => handleKeywordChange({ target: { value: "" } })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Select value={category || "ALL"} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas las categorías</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
      </form>

      {/* Active filter pills */}
      {hasFilters && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {keyword && (
            <Badge variant="secondary" className="flex items-center gap-1 pr-1">
              "{keyword}"
              <button
                onClick={() => handleKeywordChange({ target: { value: "" } })}
                className="ml-0.5 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {category && (
            <Badge variant="secondary" className="flex items-center gap-1 pr-1">
              {CATEGORY_LABELS[category]}
              <button
                onClick={() => handleCategoryChange("ALL")}
                className="ml-0.5 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
          >
            Borrar todo
          </button>
        </div>
      )}
      {!hasFilters && <div className="mb-6" />}

      {/* Feed */}
      {loading ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No se encontraron servicios</p>
          <p className="text-sm mt-1">Prueba con una palabra clave o categoría diferente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 space-y-4">
          {services.map((s) => (
            <div key={s.id} className="break-inside-avoid mb-4">
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
