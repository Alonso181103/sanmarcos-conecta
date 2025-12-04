import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Lightbulb,
  BookOpen,
  Users,
  Calendar,
  FileText,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForum } from "@/context/ForumContext";
import { Category } from "@/types/forum";

const iconMap: Record<string, LucideIcon> = {
  MessageSquare,
  Lightbulb,
  BookOpen,
  Users,
  Calendar,
  FileText,
};

const Categories = () => {
  const navigate = useNavigate();
  const { categories, getPostsByCategory } = useForum();

  const getIconForCategory = (category: Category): LucideIcon => {
    const Icon = iconMap[category.iconName];
    return Icon ?? MessageSquare;
  };

  return (
      <main className="mx-auto max-w-6xl py-6 md:py-8 space-y-8">
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm text-primary">
            <MessageSquare className="h-4 w-4" />
            <span>Categorías del foro</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Explora las categorías de San Marcos Conecta
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Organiza tus preguntas, recursos y anuncios en categorías pensadas
            para la vida académica en la UNMSM.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = getIconForCategory(category);
            const postsCount = getPostsByCategory(category.id).length;

            return (
              <Card
                key={category.id}
                className="hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
                onClick={() => navigate(`/categorias/${category.id}`)}
              >
                <div
                  className={`h-2 bg-gradient-to-r ${category.color}`}
                ></div>
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">
                        {category.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {postsCount}{" "}
                      {postsCount === 1
                        ? "publicación reciente"
                        : "publicaciones recientes"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-primary font-medium">
                      Ver publicaciones
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="mt-8">
          <Card>
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <p className="text-sm font-medium text-primary">
                  ¿No sabes dónde publicar?
                </p>
                <p className="text-lg font-semibold">
                  Empieza creando una nueva publicación
                </p>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Puedes cambiar de categoría más adelante. Lo importante es que
                  compartas tus dudas, recursos o anuncios con tu comunidad.
                </p>
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary-dark hover:opacity-90"
                onClick={() => navigate("/nueva-publicacion")}
              >
                Crear nueva publicación
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
  );
};

export default Categories;
