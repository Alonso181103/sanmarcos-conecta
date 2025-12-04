// src/pages/NewPost.tsx

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useForum } from "@/context/ForumContext";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  MessageSquare,
  PenSquare,
  AlertCircle,
  BookOpen,
  GraduationCap,
  Tag,
  Sparkles,
} from "lucide-react";

import type { CategoryId, FacultyId } from "@/types/forum";

const NewPost = () => {
  const navigate = useNavigate();
  const { categories, faculties, courses, currentUser, createPost } =
    useForum();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | "">(
    ""
  );
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyId | "">(
    currentUser.facultyId ?? ""
  );
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Tipo de “intención” visual (no cambia el modelo, solo ayuda al usuario)
  const [intent, setIntent] = useState<
    "pregunta" | "apunte" | "evento" | "otro"
  >("pregunta");

  const isValid =
    title.trim().length >= 8 &&
    content.trim().length >= 20 &&
    !!selectedCategory &&
    !!selectedFaculty;

  const userFaculty =
    faculties.find((f) => f.id === currentUser.facultyId) ?? faculties[0];

  const facultyCourses = useMemo(
    () =>
      courses.filter((c) =>
        selectedFaculty ? c.facultyId === selectedFaculty : true
      ),
    [courses, selectedFaculty]
  );

  const categoryApuntes = categories.find((c) => c.id === "apuntes");
  const categoryEventos = categories.find((c) => c.id === "eventos");
  const categoryDiscusiones = categories.find(
    (c) => c.id === "discusiones"
  );

  // Ajustar categoría al cambiar la intención rápida
  const handleIntentChange = (
    newIntent: "pregunta" | "apunte" | "evento" | "otro"
  ) => {
    setIntent(newIntent);

    if (newIntent === "apunte" && categoryApuntes) {
      setSelectedCategory(categoryApuntes.id);
    } else if (newIntent === "evento" && categoryEventos) {
      setSelectedCategory(categoryEventos.id);
    } else if (newIntent === "pregunta" && categoryDiscusiones) {
      setSelectedCategory(categoryDiscusiones.id);
    }
  };

  const validate = () => {
    const newErrors: string[] = [];

    if (!title.trim()) {
      newErrors.push("El título es obligatorio.");
    } else if (title.trim().length < 8) {
      newErrors.push("El título debe tener al menos 8 caracteres.");
    }

    if (!content.trim()) {
      newErrors.push("El contenido es obligatorio.");
    } else if (content.trim().length < 20) {
      newErrors.push(
        "El contenido debe explicar claramente tu duda, aporte o anuncio (mínimo 20 caracteres)."
      );
    }

    if (!selectedCategory) {
      newErrors.push("Debes elegir una categoría.");
    }

    if (!selectedFaculty) {
      newErrors.push("Debes seleccionar una facultad.");
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      return;
    }

    setSubmitting(true);

    const newPost = createPost({
      title: title.trim(),
      content: content.trim(),
      categoryId: selectedCategory as CategoryId,
      facultyId: selectedFaculty as FacultyId,
      courseId: selectedCourseId || undefined,
    });

    setSubmitting(false);
    navigate(`/publicaciones/${newPost.id}`);
  };

  return (
    <main className="mx-auto max-w-4xl space-y-6 py-6 md:py-8">
      {/* Encabezado */}
      <section className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs text-primary">
          <Sparkles className="h-4 w-4" />
          <span>Crea una nueva publicación para tu comunidad sanmarquina</span>
        </div>
        <h1 className="text-balance text-2xl font-semibold md:text-3xl">
          Nueva publicación
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Comparte una duda, un apunte, un recurso o un evento. Mientras más
          claro seas, más fácil será que tus compañeros puedan ayudarte o
          aprovechar lo que compartes.
        </p>
      </section>

      {/* Layout principal: “asistente” */}
      <section className="grid gap-4 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.7fr)]">
        {/* Columna izquierda: formulario principal */}
        <Card className="shadow-[var(--shadow-md)]">
          <CardHeader className="space-y-4 pb-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-semibold md:text-base">
                1. Cuéntanos de qué va tu publicación
              </h2>
              <p className="text-xs text-muted-foreground">
                Primero define el tipo, la categoría y el contexto académico.
              </p>
            </div>

            {/* Intención rápida */}
            <div className="flex flex-wrap gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleIntentChange("pregunta")}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 transition-[background,color,border,transform] ${
                  intent === "pregunta"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:-translate-y-[1px] hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <MessageSquare className="h-3 w-3" />
                Pregunta / duda
              </button>

              <button
                type="button"
                onClick={() => handleIntentChange("apunte")}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 transition-[background,color,border,transform] ${
                  intent === "apunte"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:-translate-y-[1px] hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <BookOpen className="h-3 w-3" />
                Apunte / resumen
              </button>

              <button
                type="button"
                onClick={() => handleIntentChange("evento")}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 transition-[background,color,border,transform] ${
                  intent === "evento"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:-translate-y-[1px] hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Tag className="h-3 w-3" />
                Taller / evento
              </button>

              <button
                type="button"
                onClick={() => handleIntentChange("otro")}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 transition-[background,color,border,transform] ${
                  intent === "otro"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:-translate-y-[1px] hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <PenSquare className="h-3 w-3" />
                Otro
              </button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 border-t border-dashed border-border/60 pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contexto académico */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Categoría */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Categoría <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedCategory || ""}
                    onValueChange={(value) =>
                      setSelectedCategory(value as CategoryId)
                    }
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          className="text-xs"
                        >
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground">
                    Esto ayuda a organizar el contenido del foro.
                  </p>
                </div>

                {/* Facultad */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Facultad <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedFaculty || ""}
                    onValueChange={(value) =>
                      setSelectedFaculty(value as FacultyId)
                    }
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Selecciona tu facultad" />
                    </SelectTrigger>
                    <SelectContent>
                      {faculties.map((faculty) => (
                        <SelectItem
                          key={faculty.id}
                          value={faculty.id}
                          className="text-xs"
                        >
                          {faculty.shortName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground">
                    Usamos esto para mostrar antes lo que es relevante para tus
                    compañeros.
                  </p>
                </div>
              </div>

              {/* Curso */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Curso (opcional)
                </Label>
                <Select
                  value={selectedCourseId}
                  onValueChange={(value) => setSelectedCourseId(value)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Selecciona el curso al que pertenece (si aplica)" />
                  </SelectTrigger>
                  <SelectContent>
                    {facultyCourses.map((course) => (
                      <SelectItem
                        key={course.id}
                        value={course.id}
                        className="text-xs"
                      >
                        {course.code} · {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  Esto permite que otros filtren por ese curso en la lista de
                  publicaciones.
                </p>
              </div>

              {/* Información principal */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Título de la publicación{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ejemplo: [FISI] Duda sobre ejercicios de recursividad"
                    className="h-9 text-sm"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Piensa en cómo lo buscarías tú mismo en el foro. Mínimo 8
                    caracteres.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Detalle de tu publicación{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={
                      intent === "pregunta"
                        ? "Explica qué tema no entiendes, qué has intentado y qué parte específica te está costando. Mientras más contexto des, mejor podrán ayudarte."
                        : intent === "apunte"
                        ? "Describe brevemente el tema del apunte y, si quieres, incluye contexto como curso, profesor o tipo de examen para el que sirve."
                        : intent === "evento"
                        ? "Incluye nombre, fecha, modalidad (virtual/presencial), facultad organizadora y a quién va dirigido."
                        : "Describe claramente lo que quieres compartir o discutir, pensando en que otros puedan entenderlo rápido."
                    }
                    className="text-sm"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Mínimo 20 caracteres. Sé respetuoso y evita datos sensibles
                    de otras personas.
                  </p>
                </div>
              </div>

              {/* Errores */}
              {errors.length > 0 && (
                <div className="space-y-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
                  <div className="flex items-center gap-2 font-medium">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Revisa estos puntos antes de publicar:
                  </div>
                  <ul className="ml-5 list-disc space-y-0.5">
                    {errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Acciones */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <p className="text-[11px] text-muted-foreground">
                  Publicarás como{" "}
                  <span className="font-medium">{currentUser.name}</span> de{" "}
                  <span className="font-medium">
                    {userFaculty?.shortName}
                  </span>
                  .
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="inline-flex items-center gap-2"
                    onClick={() => navigate(-1)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={submitting || !isValid}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/85 hover:opacity-90"
                  >
                    <MessageSquare className="h-4 w-4" />
                    {submitting ? "Publicando..." : "Publicar en el foro"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Columna derecha: ayuda y contexto */}
        <Card className="border-dashed shadow-[var(--shadow-sm)]">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <PenSquare className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">Consejos rápidos</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-[11px] text-muted-foreground">
            <div className="rounded-lg bg-muted/70 p-3">
              <p className="mb-1 text-xs font-semibold text-foreground">
                Un buen título:
              </p>
              <ul className="ml-4 list-disc space-y-0.5">
                <li>Incluye la facultad o curso entre corchetes si ayuda.</li>
                <li>Resume el problema o tema en una sola frase.</li>
                <li>Evita títulos genéricos como “Ayuda urgente”.</li>
              </ul>
            </div>

            <div className="rounded-lg bg-muted/70 p-3">
              <p className="mb-1 text-xs font-semibold text-foreground">
                Para preguntas:
              </p>
              <ul className="ml-4 list-disc space-y-0.5">
                <li>Cuenta qué ya intentaste antes de preguntar.</li>
                <li>Adjunta contexto: tema, profesor, tipo de ejercicio.</li>
                <li>Si hay una fórmula o snippet, explícalo con tus palabras.</li>
              </ul>
            </div>

            <div className="rounded-lg bg-muted/70 p-3">
              <p className="mb-1 text-xs font-semibold text-foreground">
                Para apuntes:
              </p>
              <ul className="ml-4 list-disc space-y-0.5">
                <li>Aclara si son apuntes de clase, resumen o formulario.</li>
                <li>Menciona si están alineados a un examen específico.</li>
                <li>Indica el curso y ciclo recomendado.</li>
              </ul>
            </div>

            <div className="rounded-lg bg-muted/70 p-3">
              <p className="mb-1 text-xs font-semibold text-foreground">
                Para eventos:
              </p>
              <ul className="ml-4 list-disc space-y-0.5">
                <li>Incluye fecha, horario y modalidad.</li>
                <li>Indica si requiere inscripción previa.</li>
                <li>Explica para quién está pensado (ciclos, carreras).</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default NewPost;
