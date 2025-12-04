// src/pages/Sobre.tsx

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
  BookOpen,
  Calendar,
  Users,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const Sobre = () => {
  const navigate = useNavigate();
  const { currentUser, faculties } = useForum();

  const firstName =
    currentUser?.name?.split(" ")[0] || "sanmarquino/a";

  const userFaculty =
    faculties.find((f) => f.id === currentUser.facultyId) ?? faculties[0];

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-6 md:px-0 md:py-10">
      {/* HERO / INTRO */}
      <section>
        <Card className="relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-primary/95 via-primary to-accent text-primary-foreground shadow-soft-lg">
          <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-soft-light">
            <div className="absolute -left-10 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-[-5rem] right-[-4rem] h-72 w-72 rounded-full bg-black/10 blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col gap-4 px-6 py-10 text-left md:px-10 md:py-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Bienvenido/a a San Marcos Conecta</span>
            </div>

            <div className="space-y-3 max-w-2xl">
              <h1 className="text-balance text-2xl font-semibold leading-tight md:text-3xl lg:text-[2.1rem]">
                Tu comunidad académica en línea,
                <span className="block">
                  pensada para estudiantes sanmarquinos.
                </span>
              </h1>
              <p className="text-xs text-primary-foreground/85 md:text-sm">
                San Marcos Conecta es un foro donde puedes compartir
                apuntes, resolver dudas de tus cursos y enterarte de
                talleres, charlas y eventos de la{" "}
                <span className="font-semibold">
                  Decana de América
                </span>. Todo organizado por categorías, facultades y
                cursos.
              </p>
            </div>

            <div className="mt-2 flex flex-wrap gap-2 text-[0.7rem] md:text-xs">
              <Badge
                variant="outline"
                className="border-white/40 bg-black/10 text-primary-foreground"
              >
                Para ti, {firstName}
              </Badge>
              {userFaculty && (
                <Badge
                  variant="outline"
                  className="border-white/40 bg-black/10 text-primary-foreground"
                >
                  {userFaculty.shortName}
                </Badge>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                size="sm"
                className="rounded-full bg-white px-5 text-xs font-semibold text-primary shadow-subtle hover:bg-white/90 hover:shadow-soft md:text-sm"
                onClick={() => navigate("/nueva-publicacion")}
              >
                Empezar a publicar
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full border-white/40 bg-white/5 text-xs text-primary-foreground hover:bg-white/10 md:text-sm"
                onClick={() => navigate("/publicaciones")}
              >
                Ver publicaciones
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* QUÉ PUEDES HACER */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-semibold md:text-lg">
            ¿Qué puedes hacer en San Marcos Conecta?
          </h2>
          <p className="text-xs text-muted-foreground md:text-sm">
            La idea es que tengas un espacio seguro y organizado para
            todo lo académico del día a día.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Card className="rounded-xl border bg-card/80 shadow-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-primary" />
                Compartir apuntes
              </CardTitle>
              <CardDescription className="text-[0.75rem]">
                Sube resúmenes, fórmulas, bancos de preguntas y
                materiales que te hayan servido.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-[0.75rem] text-muted-foreground">
              • Organiza tus publicaciones por curso y categoría. <br />
              • Ayudas a otros y refuerzas lo aprendido.
            </CardContent>
          </Card>

          <Card className="rounded-xl border bg-card/80 shadow-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4 text-primary" />
                Resolver dudas
              </CardTitle>
              <CardDescription className="text-[0.75rem]">
                Haz preguntas sobre tareas, prácticas, exámenes o
                conceptos que no te hayan quedado claros.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-[0.75rem] text-muted-foreground">
              • Etiqueta el curso y la facultad. <br />
              • Recibe respuestas de otros estudiantes.
            </CardContent>
          </Card>

          <Card className="rounded-xl border bg-card/80 shadow-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                Difundir eventos
              </CardTitle>
              <CardDescription className="text-[0.75rem]">
                Comparte información de talleres, charlas, grupos de
                estudio y actividades académicas.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-[0.75rem] text-muted-foreground">
              • Usa la categoría de eventos. <br />
              • Indica fecha, lugar y facultad.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CÓMO EMPEZAR */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-semibold md:text-lg">
            ¿Cómo empezar en menos de 1 minuto?
          </h2>
          <p className="text-xs text-muted-foreground md:text-sm">
            Sigue estos pasos rápidos para sacarle provecho desde hoy.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Card className="rounded-xl border bg-card/80 shadow-subtle">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">1. Completa tu perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-[0.75rem] text-muted-foreground">
              <p>
                Sube tu foto, añade tu facultad, intereses académicos y
                pasatiempos.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-0 text-[0.7rem]"
                onClick={() => navigate("/perfil")}
              >
                Ir a mi perfil
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-xl border bg-card/80 shadow-subtle">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">2. Explora el foro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-[0.75rem] text-muted-foreground">
              <p>
                Revisa las publicaciones por categoría, facultad o
                curso. Usa el buscador para encontrar temas específicos.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-0 text-[0.7rem]"
                onClick={() => navigate("/publicaciones")}
              >
                Ver publicaciones
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-xl border bg-card/80 shadow-subtle">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">3. Publica algo útil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-[0.75rem] text-muted-foreground">
              <p>
                Comparte un apunte, una duda o un evento. Mientras más
                claro y organizado, mejor.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-0 text-[0.7rem]"
                onClick={() => navigate("/nueva-publicacion")}
              >
                Crear publicación
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* BUENAS PRÁCTICAS */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-base font-semibold md:text-lg">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Buenas prácticas y convivencia
          </h2>
          <p className="text-xs text-muted-foreground md:text-sm">
            La idea es que el foro se sienta como un buen grupo de estudio,
            pero ordenado y respetuoso.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Card className="rounded-xl border bg-card/80 shadow-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Para que tus publicaciones ayuden de verdad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-[0.75rem] text-muted-foreground">
              <p>• Usa títulos claros y específicos.</p>
              <p>• Elige bien la categoría, curso y facultad.</p>
              <p>• Resume el problema o el tema al inicio.</p>
              <p>• Si compartes archivos, explícalos brevemente.</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border bg-card/80 shadow-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Respeto y comunidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-[0.75rem] text-muted-foreground">
              <p>• Nada de insultos, ataques personales o discriminación.</p>
              <p>• Evita spoilers de exámenes reales sin contexto.</p>
              <p>• Aporta soluciones, no solo críticas.</p>
              <p>• Reporta contenido inapropiado para mantener el espacio sano.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CIERRE / CTA */}
      <section>
        <Card className="rounded-2xl border bg-card/80 shadow-soft">
          <CardContent className="flex flex-col items-start justify-between gap-3 px-4 py-5 text-sm md:flex-row md:items-center md:px-6">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-primary md:text-[0.8rem]">
                Listo para aportar a la comunidad
              </p>
              <p className="text-sm md:text-base">
                Crea una publicación, responde a alguien o comparte un apunte
                que te gustaría haber tenido antes.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                className="rounded-full shadow-subtle hover:shadow-soft"
                onClick={() => navigate("/nueva-publicacion")}
              >
                Empezar ahora
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={() => navigate("/publicaciones")}
              >
                Explorar el foro
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Sobre;
