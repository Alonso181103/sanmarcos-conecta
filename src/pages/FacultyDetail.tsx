import { useParams, useNavigate } from "react-router-dom";
import PostCard from "@/components/PostCard";

import { useForum } from "@/context/ForumContext";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ArrowLeft, MessageSquare, GraduationCap } from "lucide-react";

const FacultyDetail = () => {
  const navigate = useNavigate();
  const { facultyId } = useParams<{ facultyId: string }>();

  const { faculties, posts } = useForum();

  if (!facultyId) {
    return (
        <main className="mx-auto max-w-5xl py-6 md:py-8">
          <p className="text-center text-muted-foreground">
            Facultad no encontrada.
          </p>
        </main>
    );
  }

  const faculty = faculties.find((f) => f.id === facultyId);

  if (!faculty) {
    return (
        <main className="mx-auto max-w-5xl py-6 md:py-8">
          <p className="text-center text-muted-foreground">
            La facultad no existe.
          </p>
        </main>
    );
  }

  const facultyPosts = posts.filter((p) => p.facultyId === facultyId);

  return (
      <main className="mx-auto max-w-5xl py-6 md:py-8 space-y-6">
        {/* Encabezado */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>

          <Button
            size="sm"
            className="inline-flex items-center gap-2"
            onClick={() => navigate("/nueva-publicacion")}
          >
            <MessageSquare className="h-4 w-4" />
            Nueva publicación
          </Button>
        </div>

        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">
              {faculty.name}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Publicaciones académicas relacionadas a la facultad de{" "}
            {faculty.name}.
          </p>
        </section>

        {/* Lista de publicaciones */}
        <section className="space-y-3">
          {facultyPosts.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center space-y-2">
                <p className="text-sm font-medium">
                  Aún no hay publicaciones en esta facultad
                </p>
                <p className="text-xs text-muted-foreground">
                  Inicia la conversación compartiendo la primera publicación.
                </p>
                <Button
                  size="sm"
                  className="mt-2 inline-flex items-center gap-2"
                  onClick={() => navigate("/nueva-publicacion")}
                >
                  <MessageSquare className="h-4 w-4" />
                  Crear publicación
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {facultyPosts
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((post) => (
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

export default FacultyDetail;
