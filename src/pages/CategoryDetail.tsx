import { useParams, useNavigate } from "react-router-dom";
import PostCard from "@/components/PostCard";

import { useForum } from "@/context/ForumContext";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ArrowLeft, MessageSquare } from "lucide-react";

const CategoryDetail = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  const { categories, posts } = useForum();

  if (!categoryId) {
    return (
        <main className="mx-auto max-w-5xl py-6 md:py-8">
          <p className="text-center text-muted-foreground">
            Categoría no encontrada.
          </p>
        </main>
    );
  }

  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    return (
        <main className="mx-auto max-w-5xl py-6 md:py-8">
          <p className="text-center text-muted-foreground">
            La categoría no existe.
          </p>
        </main>
    );
  }

  const categoryPosts = posts.filter((p) => p.categoryId === categoryId);

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
          <h1 className="text-2xl md:text-3xl font-bold">
            {category.title}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            {category.description ??
              "Publicaciones relacionadas a esta categoría académica."}
          </p>
        </section>

        {/* Lista de publicaciones */}
        <section className="space-y-3">
          {categoryPosts.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center space-y-2">
                <p className="text-sm font-medium">
                  No hay publicaciones en esta categoría
                </p>
                <p className="text-xs text-muted-foreground">
                  Sé el primero en crear una publicación relacionada.
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
              {categoryPosts
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

export default CategoryDetail;
