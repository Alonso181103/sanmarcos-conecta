// src/pages/Home.tsx

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForum } from "@/context/ForumContext";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  MessageSquare,
  Calendar,
  User as UserIcon,
  BookOpen,
  GraduationCap,
  ArrowRight,
  PenSquare,
  Sparkles,
} from "lucide-react";

import type { CategoryId, FacultyId } from "@/types/forum";

const Home = () => {
  const navigate = useNavigate();
  const { posts, categories, faculties, courses, currentUser } = useForum();

  const firstName =
    currentUser?.name?.split(" ")[0] || "sanmarquino/a";

  const userFaculty =
    faculties.find((f) => f.id === currentUser.facultyId) ?? faculties[0];

  // ---------- Helpers ----------
  const getCategoryLabel = (id: CategoryId) =>
    categories.find((c) => c.id === id)?.title ?? "Categoría";

  const getFacultyShort = (id: FacultyId) =>
    faculties.find((f) => f.id === id)?.shortName ?? "Facultad";

  const getCourseInfo = (courseId?: string) =>
    courseId ? courses.find((c) => c.id === courseId) : undefined;

  // ---------- Datos derivados ----------
  const latestPosts = useMemo(
    () =>
      [...posts]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
        .slice(0, 4),
    [posts],
  );

  const facultyPosts = useMemo(
    () =>
      posts
        .filter((p) => p.facultyId === userFaculty.id)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
        .slice(0, 3),
    [posts, userFaculty.id],
  );

  const upcomingEvents = useMemo(
    () =>
      posts
        .filter((p) => p.categoryId === "eventos")
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
        .slice(0, 3),
    [posts],
  );

  const popularCourses = useMemo(
    () => courses.slice(0, 4),
    [courses],
  );

  const categoryApuntes = categories.find((c) => c.id === "apuntes");
  const categoryEventos = categories.find((c) => c.id === "eventos");
  const categoryDiscusiones = categories.find(
    (c) => c.id === "discusiones",
  );

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-6 md:px-0 md:py-8">
      {/* HERO FULL-WIDTH */}
      <section>
        <Card className="relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-primary/95 via-primary to-accent text-primary-foreground shadow-soft-lg">
          {/* Glow decorativo */}
          <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-soft-light">
            <div className="absolute -left-10 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-[-5rem] right-[-4rem] h-72 w-72 rounded-full bg-black/10 blur-3xl" />
          </div>

          <div className="relative z-10 flex min-h-[220px] flex-col items-center justify-center gap-4 px-6 py-10 text-center md:min-h-[260px] lg:py-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Foro académico de la Decana de América</span>
            </div>

            <div className="space-y-3 max-w-2xl">
              <h1 className="text-balance text-2xl font-semibold leading-tight md:text-3xl lg:text-[2.1rem]">
                Tu comunidad universitaria en línea,
                <span className="block">
                  hecha por y para sanmarquinos.
                </span>
              </h1>
              <p className="text-xs text-primary-foreground/85 md:text-sm">
                Comparte apuntes, resuelve dudas de tus cursos y mantente
                al día con los eventos y actividades de{" "}
                <span className="font-semibold">
                  {userFaculty?.name}
                </span>{" "}
                y de toda San Marcos, en un solo lugar.
              </p>
            </div>
            <Button
              size="sm"
              className="mt-1 rounded-full bg-white px-6 text-xs font-semibold text-primary shadow-subtle hover:bg-white/90 hover:shadow-soft md:text-sm"
              onClick={() => navigate("/sobre")}
            >
              LEER MÁS
            </Button>
          </div>
        </Card>
      </section>

      {/* PARA TI + PRÓXIMOS EVENTOS */}
      <section className="grid items-stretch gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2.2fr)]">
        {/* Panel “Para ti” */}
        <Card className="rounded-2xl shadow-subtle">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base md:text-lg">
              <span className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-primary" />
                Para ti, {firstName}
              </span>
              <Badge
                variant="outline"
                className="hidden border-primary/30 text-[0.65rem] uppercase tracking-wide text-primary md:inline-flex"
              >
                {userFaculty?.shortName}
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Accesos rápidos para que no pierdas tiempo buscando lo
              importante.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-xs md:text-[0.8rem]">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="inline-flex items-center gap-1 rounded-full border-dashed shadow-subtle hover:shadow-soft"
                onClick={() =>
                  navigate(`/facultades/${userFaculty.id}`)
                }
              >
                <GraduationCap className="h-3.5 w-3.5" />
                Mi facultad
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="inline-flex items-center gap-1 rounded-full shadow-subtle hover:shadow-soft"
                onClick={() => navigate("/categorias")}
              >
                <BookOpen className="h-3.5 w-3.5" />
                Ver categorías
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="inline-flex items-center gap-1 rounded-full shadow-subtle hover:shadow-soft"
                onClick={() => navigate("/publicaciones")}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Ver todo el foro
              </Button>
            </div>
            <div className="mt-2 rounded-xl bg-muted/60 p-3 text-[0.7rem] shadow-subtle md:text-[0.75rem]">
              <p className="font-medium">
                Tip: comparte apuntes de tus cursos
              </p>
              <p className="text-muted-foreground">
                Ayudas a tus compañeros, refuerzas lo que aprendiste y
                de paso dejas tu huella en la comunidad sanmarquina.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Próximos eventos */}
        <Card className="rounded-2xl shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <Calendar className="h-4 w-4 text-primary" />
              Próximos eventos
            </CardTitle>
            {categoryEventos && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 rounded-full px-2 text-[0.7rem]"
                onClick={() =>
                  navigate(`/categorias/${categoryEventos.id}`)
                }
              >
                Ver más
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Aún no hay eventos recientes. ¿Te animas a publicar el
                próximo taller o charla?
              </p>
            ) : (
              upcomingEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() =>
                    navigate(`/publicaciones/${event.id}`)
                  }
                  className="group flex w-full items-start justify-between rounded-xl border border-transparent bg-muted/60 p-2.5 text-left text-xs shadow-subtle transition-all hover:-translate-y-[1px] hover:border-primary/40 hover:bg-background hover:shadow-soft"
                >
                  <div>
                    <p className="line-clamp-1 font-medium group-hover:text-primary">
                      {event.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[0.7rem] text-muted-foreground">
                      {event.content}
                    </p>
                  </div>
                  <div className="ml-2 flex flex-col items-end gap-1">
                    <Badge
                      variant="outline"
                      className="border-primary/25 bg-primary/5 text-[0.65rem]"
                    >
                      {getFacultyShort(event.facultyId)}
                    </Badge>
                    <span className="text-[0.65rem] text-muted-foreground">
                      {new Date(
                        event.createdAt,
                      ).toLocaleDateString("es-PE", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      {/* FILA DE CHIPS “RÁPIDOS” */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold tracking-tight text-muted-foreground md:text-base">
            Explora rápido
          </h2>
          <span className="text-[0.7rem] text-muted-foreground md:text-xs">
            Filtra por lo que más te sirve hoy.
          </span>
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <button
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary shadow-subtle transition-[background,transform,box-shadow] hover:-translate-y-[1px] hover:bg-primary/15 hover:shadow-soft"
            onClick={() => navigate("/publicaciones")}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Todo el foro
          </button>

          {categoryApuntes && (
            <button
              className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-subtle transition-[background,transform,box-shadow] hover:-translate-y-[1px] hover:bg-background hover:shadow-soft"
              onClick={() =>
                navigate(`/categorias/${categoryApuntes.id}`)
              }
            >
              <BookOpen className="h-3.5 w-3.5" />
              Apuntes
            </button>
          )}

          {categoryDiscusiones && (
            <button
              className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-subtle transition-[background,transform,box-shadow] hover:-translate-y-[1px] hover:bg-background hover:shadow-soft"
              onClick={() =>
                navigate(`/categorias/${categoryDiscusiones.id}`)
              }
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Debates
            </button>
          )}

          {categoryEventos && (
            <button
              className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-subtle transition-[background,transform,box-shadow] hover:-translate-y-[1px] hover:bg-background hover:shadow-soft"
              onClick={() =>
                navigate(`/categorias/${categoryEventos.id}`)
              }
            >
              <Calendar className="h-3.5 w-3.5" />
              Eventos
            </button>
          )}

          <button
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-muted-foreground/40 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-subtle transition-[background,transform,border-color,box-shadow] hover:-translate-y-[1px] hover:border-primary/50 hover:bg-muted/60 hover:shadow-soft"
            onClick={() => navigate("/nueva-publicacion")}
          >
            <PenSquare className="h-3.5 w-3.5" />
            Publicar algo
          </button>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL: PUBLICACIONES + CURSOS */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2.1fr)]">
        {/* Columna izquierda: actividad reciente */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold tracking-tight md:text-base">
              Actividad reciente en el foro
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 rounded-full px-2 text-[0.7rem]"
              onClick={() => navigate("/publicaciones")}
            >
              Ver todas
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-2">
            {latestPosts.length === 0 ? (
              <Card className="rounded-2xl border-dashed shadow-subtle">
                <CardContent className="flex flex-col items-start gap-2 py-6 text-sm text-muted-foreground">
                  <p>No hay publicaciones recientes aún.</p>
                  <Button
                    size="sm"
                    className="mt-1 inline-flex items-center gap-2 rounded-xl shadow-subtle hover:shadow-soft"
                    onClick={() => navigate("/nueva-publicacion")}
                  >
                    <PenSquare className="h-4 w-4" />
                    Crea la primera
                  </Button>
                </CardContent>
              </Card>
            ) : (
              latestPosts.map((post) => {
                const course = getCourseInfo(post.courseId);
                return (
                  <button
                    key={post.id}
                    onClick={() =>
                      navigate(`/publicaciones/${post.id}`)
                    }
                    className="group flex w-full flex-col rounded-xl border bg-card/80 p-3 text-left text-xs shadow-subtle transition-[transform,box-shadow,border-color,background] hover:-translate-y-[1px] hover:border-primary/40 hover:bg-background hover:shadow-soft md:p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className="border-primary/40 bg-primary/5 text-[0.65rem] font-medium text-primary"
                          >
                            {getCategoryLabel(post.categoryId)}
                          </Badge>
                          <span className="text-[0.65rem] text-muted-foreground">
                            {new Date(
                              post.createdAt,
                            ).toLocaleDateString("es-PE", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </span>
                        </div>
                        <h3 className="line-clamp-2 text-sm font-semibold leading-snug md:text-[0.95rem] group-hover:text-primary">
                          {post.title}
                        </h3>
                        <p className="line-clamp-2 max-w-xl text-[0.7rem] text-muted-foreground">
                          {post.content}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.7rem] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <UserIcon className="h-3.5 w-3.5" />
                        {post.author}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GraduationCap className="h-3.5 w-3.5" />
                        {getFacultyShort(post.facultyId)}
                      </span>
                      {course && (
                        <span className="inline-flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          {course.code}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Columna derecha: posts de tu facultad + cursos */}
        <div className="space-y-4">
          {/* Publicaciones de tu facultad */}
          <Card className="rounded-2xl shadow-subtle">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                <GraduationCap className="h-4 w-4 text-primary" />
                Lo último en {userFaculty?.shortName}
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Mira qué están preguntando o compartiendo tus
                compañeros de {userFaculty?.name}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {facultyPosts.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Todavía no hay publicaciones recientes en tu facultad.
                  Podrías ser el primero en compartir algo.
                </p>
              ) : (
                facultyPosts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() =>
                      navigate(`/publicaciones/${post.id}`)
                    }
                    className="group flex w-full flex-col rounded-xl bg-muted/60 p-2.5 text-left text-xs shadow-subtle transition-[background,transform,box-shadow] hover:-translate-y-[1px] hover:bg-background hover:shadow-soft"
                  >
                    <p className="line-clamp-1 font-medium group-hover:text-primary">
                      {post.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[0.7rem] text-muted-foreground">
                      {post.content}
                    </p>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          {/* Cursos populares */}
          <Card className="rounded-2xl shadow-subtle">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                <BookOpen className="h-4 w-4 text-primary" />
                Cursos destacados
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Algunos de los cursos que más se repiten en las
                publicaciones del foro.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-xs">
              {popularCourses.map((course) => {
                const faculty = faculties.find(
                  (f) => f.id === course.facultyId,
                );
                return (
                  <button
                    key={course.id}
                    className="group flex flex-col items-start rounded-xl border bg-gradient-to-br from-background via-background to-muted p-2.5 text-left shadow-subtle transition-[background,transform,box-shadow,border-color] hover:-translate-y-[1px] hover:border-primary/40 hover:shadow-soft"
                    onClick={() =>
                      navigate(`/publicaciones?course=${course.id}`)
                    }
                  >
                    <span className="text-[0.65rem] font-medium text-muted-foreground group-hover:text-primary">
                      {course.code}
                    </span>
                    <span className="line-clamp-2 text-[0.75rem] font-semibold">
                      {course.name}
                    </span>
                    {faculty && (
                      <span className="mt-1 text-[0.65rem] text-muted-foreground">
                        {faculty.shortName}
                      </span>
                    )}
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default Home;
