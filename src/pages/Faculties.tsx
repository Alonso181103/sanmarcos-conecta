import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForum } from "@/context/ForumContext";

const Faculties = () => {
  const navigate = useNavigate();
  const { faculties, getPostsByFaculty } = useForum();

  return (
      <main className="mx-auto max-w-6xl py-6 md:py-8 space-y-8">
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm text-primary">
            <GraduationCap className="h-4 w-4" />
            <span>Facultades UNMSM</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Conecta con tu facultad y comunidad académica
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Explora las facultades de la Universidad Nacional Mayor de San
            Marcos y descubre las discusiones, recursos y eventos de cada una.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculties.map((faculty) => {
            const postsCount = getPostsByFaculty(faculty.id).length;

            return (
              <Card
                key={faculty.id}
                className="hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
                onClick={() => navigate(`/facultades/${faculty.id}`)}
              >
                <div
                  className={`h-2 bg-gradient-to-r ${faculty.color}`}
                ></div>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <span className="text-4xl">{faculty.emoji}</span>
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" />
                      {faculty.students.toLocaleString("es-PE")} estudiantes
                    </Badge>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">
                      {faculty.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {faculty.shortName}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Escuelas profesionales
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {faculty.schools.map((school) => (
                        <Badge
                          key={school}
                          variant="outline"
                          className="text-xs"
                        >
                          {school}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {postsCount}{" "}
                      {postsCount === 1
                        ? "publicación reciente"
                        : "publicaciones recientes"}
                    </span>
                    <span className="text-primary font-medium">
                      Ver detalles →
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="mt-8">
          <Card className="border-dashed border-2">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <p className="text-sm font-medium text-primary">
                  Universidad Nacional Mayor de San Marcos
                </p>
                <p className="text-lg font-semibold">
                  Decana de América, conectada en San Marcos Conecta
                </p>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Conecta con estudiantes de diferentes facultades, comparte
                  recursos y participa en discusiones que enriquecen tu vida
                  académica.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 text-sm">
                <span className="font-semibold">
                  {faculties.length} facultades representadas
                </span>
                <span className="text-muted-foreground">
                  Miles de estudiantes conectados
                </span>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
  );
};

export default Faculties;
