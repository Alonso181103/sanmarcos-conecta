// src/pages/PostsList.tsx

import { useMemo, useState, useEffect } from "react";
import {
  useNavigate,
  useSearchParams,
  useNavigationType,
} from "react-router-dom";
import PostCard from "@/components/PostCard";

import { useForum } from "@/context/ForumContext";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  MessageSquare,
  Search,
  Filter,
  Calendar,
  BookOpen,
  GraduationCap,
  PenSquare,
  ArrowUpDown,
} from "lucide-react";

import { CategoryId, FacultyId } from "@/types/forum";

const PostsList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigationType = useNavigationType();

  const {
    posts,
    categories,
    faculties,
    courses,
    getCommentsByPostId,
    getPostScore,
  } = useForum();

  // ---------- Estado inicial desde la URL ----------
  const initialCategory = (searchParams.get("category") as CategoryId) || "";
  const initialFaculty = (searchParams.get("faculty") as FacultyId) || "";
  const initialCourse = searchParams.get("course") || "";
  const initialQuery = searchParams.get("q") || "";
  const initialSort =
    (searchParams.get("sort") as "recent" | "replies" | "top") || "recent";

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryId | "">(initialCategory);
  const [selectedFaculty, setSelectedFaculty] =
    useState<FacultyId | "">(initialFaculty);
  const [selectedCourseId, setSelectedCourseId] =
    useState<string>(initialCourse);

  const [sortOrder, setSortOrder] =
    useState<"recent" | "replies" | "top">(initialSort);

  // ---------- Restaurar scroll al volver ----------
  useEffect(() => {
    if (navigationType === "POP") {
      const saved = sessionStorage.getItem("postsListScroll");
      if (saved) {
        window.scrollTo(0, Number(saved));
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [navigationType]);

  // Guardar scroll al salir
  useEffect(() => {
    return () => {
      sessionStorage.setItem("postsListScroll", String(window.scrollY));
    };
  }, []);

  // ---------- Sincronizar filtros con la URL ----------
  useEffect(() => {
    const params: Record<string, string> = {};

    if (selectedCategory) params.category = selectedCategory;
    if (selectedFaculty) params.faculty = selectedFaculty;
    if (selectedCourseId) params.course = selectedCourseId;
    if (searchTerm.trim()) params.q = searchTerm.trim();
    if (sortOrder !== "recent") params.sort = sortOrder;

    setSearchParams(params, { replace: true });
  }, [
    selectedCategory,
    selectedFaculty,
    selectedCourseId,
    searchTerm,
    sortOrder,
    setSearchParams,
  ]);

  // ---------- Lógica de filtrado + orden ----------
  const filteredPosts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let result = posts.filter((post) => {
      if (selectedCategory && post.categoryId !== selectedCategory) {
        return false;
      }
      if (selectedFaculty && post.facultyId !== selectedFaculty) {
        return false;
      }
      if (selectedCourseId && post.courseId !== selectedCourseId) {
        return false;
      }

      if (!term) return true;

      const course = post.courseId
        ? courses.find((c) => c.id === post.courseId)
        : undefined;

      return (
        post.title.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term) ||
        post.author.toLowerCase().includes(term) ||
        (course &&
          (course.code.toLowerCase().includes(term) ||
            course.name.toLowerCase().includes(term)))
      );
    });

    // Orden
    if (sortOrder === "replies") {
      result = [...result].sort((a, b) => {
        const countA = getCommentsByPostId(a.id).length;
        const countB = getCommentsByPostId(b.id).length;
        if (countB !== countA) {
          return countB - countA;
        }
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
      });
    } else if (sortOrder === "top") {
      result = [...result].sort((a, b) => {
        const scoreDiff = getPostScore(b.id) - getPostScore(a.id);
        if (scoreDiff !== 0) return scoreDiff;
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
      });
    } else {
      // recent
      result = [...result].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [
    posts,
    selectedCategory,
    selectedFaculty,
    selectedCourseId,
    searchTerm,
    courses,
    sortOrder,
    getCommentsByPostId,
    getPostScore,
  ]);

  const activeFiltersLabel = useMemo(() => {
    const parts: string[] = [];
    if (selectedCategory) {
      const cat = categories.find((c) => c.id === selectedCategory);
      if (cat) parts.push(cat.title);
    }
    if (selectedFaculty) {
      const fac = faculties.find((f) => f.id === selectedFaculty);
      if (fac) parts.push(fac.shortName);
    }
    if (selectedCourseId) {
      const course = courses.find((c) => c.id === selectedCourseId);
      if (course) parts.push(course.code);
    }
    if (!parts.length) return "Sin filtros activos";
    return parts.join(" · ");
  }, [
    selectedCategory,
    selectedFaculty,
    selectedCourseId,
    categories,
    faculties,
    courses,
  ]);

  const clearAllFilters = () => {
    setSelectedCategory("");
    setSelectedFaculty("");
    setSelectedCourseId("");
    setSearchTerm("");
    setSortOrder("recent");
    setSearchParams({}, { replace: true });
  };

  return (
    <main className="mx-auto max-w-6xl space-y-6 py-6 md:py-8">
      {/* ENCABEZADO */}
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs text-primary">
            <MessageSquare className="h-4 w-4" />
            <span>Explora las conversaciones del foro académico</span>
          </div>
          <h1 className="text-balance text-2xl font-semibold md:text-3xl">
            Publicaciones del foro
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Busca por título, contenido, curso o autor y combina filtros para
            encontrar exactamente lo que necesitas en cuestión de segundos.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-end">
          <Button
            size="sm"
            variant="outline"
            className="inline-flex items-center gap-2"
            onClick={clearAllFilters}
          >
            <Filter className="h-4 w-4" />
            Limpiar filtros
          </Button>
          <Button
            size="sm"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
            onClick={() => navigate("/nueva-publicacion")}
          >
            <PenSquare className="h-4 w-4" />
            Nueva publicación
          </Button>
        </div>
      </section>

      {/* BUSCADOR + FILTROS */}
      <section className="space-y-4">
        <Card className="border-0 bg-gradient-to-br from-background via-background to-muted/70 shadow-[var(--shadow-md)]">
          <CardContent className="space-y-4 pt-4">
            {/* BUSCADOR */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por título, contenido, autor o curso..."
                    className="h-10 rounded-full border-none bg-background pl-9 text-sm shadow-[var(--shadow-sm)] focus-visible:ring-2 focus-visible:ring-primary/70"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] md:text-xs">
                <span className="text-muted-foreground">Resumen:</span>
                <Badge
                  variant="outline"
                  className="border-dashed border-primary/40 bg-primary/5 text-[0.7rem] text-primary"
                >
                  {activeFiltersLabel}
                </Badge>
              </div>
            </div>

            {/* FILTRO CATEGORÍA */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] md:text-xs">
              <BookOpen className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Categoría:</span>

              <button
                type="button"
                onClick={() => setSelectedCategory("")}
                className={`rounded-full px-3 py-1 text-[11px] transition-[background,color,border] ${
                  !selectedCategory
                    ? "border border-primary bg-primary text-primary-foreground"
                    : "border border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                Todas
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === cat.id ? "" : cat.id
                    )
                  }
                  className={`rounded-full px-3 py-1 text-[11px] transition-[background,color,border,transform] ${
                    selectedCategory === cat.id
                      ? "border border-primary bg-primary text-primary-foreground"
                      : "border border-border bg-card text-muted-foreground hover:-translate-y-[1px] hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            {/* FILTRO FACULTAD */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] md:text-xs">
              <GraduationCap className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Facultad:</span>

              <button
                type="button"
                onClick={() => setSelectedFaculty("")}
                className={`rounded-full px-3 py-1 text-[11px] transition-[background,color,border] ${
                  !selectedFaculty
                    ? "border border-primary bg-primary text-primary-foreground"
                    : "border border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                Todas
              </button>

              {faculties.map((fac) => (
                <button
                  key={fac.id}
                  type="button"
                  onClick={() =>
                    setSelectedFaculty(
                      selectedFaculty === fac.id ? "" : fac.id
                    )
                  }
                  className={`rounded-full px-3 py-1 text-[11px] transition-[background,color,border,transform] ${
                    selectedFaculty === fac.id
                      ? "border border-primary bg-primary text-primary-foreground"
                      : "border border-border bg-card text-muted-foreground hover:-translate-y-[1px] hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {fac.shortName}
                </button>
              ))}
            </div>

            {/* FILTRO CURSO */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-[11px] md:text-xs">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Curso:</span>

                <button
                  type="button"
                  onClick={() => setSelectedCourseId("")}
                  className={`rounded-full px-3 py-1 text-[11px] transition-[background,color,border] ${
                    !selectedCourseId
                      ? "border border-primary bg-primary text-primary-foreground"
                      : "border border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Todos
                </button>
              </div>

              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() =>
                      setSelectedCourseId(
                        selectedCourseId === course.id ? "" : course.id
                      )
                    }
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] transition-[background,color,border,transform] ${
                      selectedCourseId === course.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:-translate-y-[1px] hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    <BookOpen className="h-3 w-3" />
                    <span className="font-medium">{course.code}</span>
                    <span className="hidden text-[10px] sm:inline">
                      {course.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RESUMEN + ORDEN */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] md:text-xs">
          <p className="text-muted-foreground">
            {filteredPosts.length}{" "}
            {filteredPosts.length === 1
              ? "publicación encontrada"
              : "publicaciones encontradas"}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Ordenar por:</span>

            <button
              type="button"
              onClick={() => setSortOrder("recent")}
              className={`rounded-full px-3 py-1 border text-[11px] transition-[background,color,border] ${
                sortOrder === "recent"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              Más recientes
            </button>

            <button
              type="button"
              onClick={() => setSortOrder("replies")}
              className={`rounded-full px-3 py-1 border text-[11px] transition-[background,color,border] ${
                sortOrder === "replies"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              Más respuestas
            </button>

            <button
              type="button"
              onClick={() => setSortOrder("top")}
              className={`rounded-full px-3 py-1 border text-[11px] transition-[background,color,border] ${
                sortOrder === "top"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              Mejor puntuación
            </button>
          </div>
        </div>
      </section>

      {/* LISTA DE PUBLICACIONES */}
      <section className="space-y-3">
        {filteredPosts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-start gap-2 py-8 text-sm text-muted-foreground">
              <p>No encontramos publicaciones que coincidan con tu búsqueda.</p>
              <p className="text-[0.8rem]">
                Prueba cambiando los filtros o creando una nueva publicación
                para abrir la conversación.
              </p>
              <Button
                size="sm"
                className="mt-2 inline-flex items-center gap-2"
                onClick={() => navigate("/nueva-publicacion")}
              >
                <PenSquare className="h-4 w-4" />
                Crear publicación
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                categoryId={post.categoryId}
                facultyId={post.facultyId}
                courseId={post.courseId}
                author={post.author}
                createdAt={post.createdAt}
                showReplies={true}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default PostsList;
