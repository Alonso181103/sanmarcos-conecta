// src/pages/Index.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForum } from "@/context/ForumContext";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import {
  User as UserIcon,
  GraduationCap,
  Mail,
  MessageSquare,
  BookOpen,
  Calendar,
  PenSquare,
  Bookmark,
  Star,
  Award,
  MapPin,
  Music,
  Code,
  Plane,
  Gamepad2,
} from "lucide-react";
import type { FacultyId } from "@/types/forum";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/**
 * En local: BASE_URL = "/"
 * En GitHub Pages: BASE_URL = "/<nombre-repo>/"
 */
const BASE = import.meta.env.BASE_URL;
const DEFAULT_AVATAR = `${BASE}images/default-avatar.png`;
const DEFAULT_BANNER = `${BASE}images/default-banner.jpg`;

/**
 * Normaliza URLs para que funcionen tanto en local como en GitHub Pages.
 * Soporta:
 * - data:... (FileReader)
 * - http(s)://...
 * - /images/...
 * - images/...
 * - default-avatar.png (sin carpeta)
 */
const normalizePublicImage = (url?: string) => {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;

  if (
    trimmed.startsWith("data:") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return trimmed;
  }

  // "/images/x.png" -> `${BASE}images/x.png`
  if (trimmed.startsWith("/")) return `${BASE}${trimmed.slice(1)}`;

  // "images/x.png" -> `${BASE}images/x.png`
  if (trimmed.startsWith("images/")) return `${BASE}${trimmed}`;

  // "default-avatar.png" -> `${BASE}images/default-avatar.png`
  return `${BASE}images/${trimmed}`;
};

const Profile = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    posts,
    faculties,
    getCommentsByPostId,
    savedPosts,
    isPostSaved,
    getPostScore,
    getCommentScore,
    updateUserProfile,
  } = useForum();

  // ------- Helpers de facultad -------
  const getFacultyShort = (id: FacultyId) =>
    faculties.find((f) => f.id === id)?.shortName ?? "Facultad";

  const getFacultyName = (id: FacultyId) =>
    faculties.find((f) => f.id === id)?.name ?? "Facultad";

  const formattedFacultyShort = getFacultyShort(currentUser.facultyId);
  const formattedFacultyName = getFacultyName(currentUser.facultyId);

  // ------- Publicaciones del usuario -------
  const myPosts = useMemo(
    () => posts.filter((p) => p.author === currentUser.name),
    [posts, currentUser.name]
  );

  // ------- Comentarios del usuario -------
  const myComments = useMemo(() => {
    const items: {
      id: string;
      postId: string;
      postTitle: string;
      createdAt: string;
      content: string;
    }[] = [];

    posts.forEach((post) => {
      const comments = getCommentsByPostId(post.id);
      comments.forEach((c) => {
        if (c.author === currentUser.name) {
          items.push({
            id: c.id,
            postId: post.id,
            postTitle: post.title,
            createdAt: c.createdAt,
            content: c.content,
          });
        }
      });
    });

    return items.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [posts, currentUser.name, getCommentsByPostId]);

  // ------- Publicaciones guardadas -------
  const savedPostsList = useMemo(
    () => posts.filter((p) => isPostSaved(p.id)),
    [posts, isPostSaved, savedPosts]
  );

  // ------- Últimos N (para resumen) -------
  const latestMyPosts = myPosts
    .slice()
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const latestMyComments = myComments.slice(0, 5);

  const latestSavedPosts = savedPostsList
    .slice()
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  // ------- Karma tipo Reddit -------
  const postKarma = useMemo(
    () => myPosts.reduce((acc, p) => acc + getPostScore(p.id), 0),
    [myPosts, getPostScore]
  );

  const commentKarma = useMemo(
    () => myComments.reduce((acc, c) => acc + getCommentScore(c.id), 0),
    [myComments, getCommentScore]
  );

  const totalKarma = postKarma + commentKarma;

  // ------- Fecha "En el foro desde" -------
  const createdAtDate = currentUser.createdAt ? new Date(currentUser.createdAt) : null;

  const oldestActivityDate = (() => {
    const dates: number[] = [];
    if (createdAtDate) dates.push(createdAtDate.getTime());
    myPosts.forEach((p) => dates.push(new Date(p.createdAt).getTime()));
    myComments.forEach((c) => dates.push(new Date(c.createdAt).getTime()));
    if (!dates.length) return null;
    return new Date(Math.min(...dates));
  })();

  const formattedMemberSince = oldestActivityDate
    ? oldestActivityDate.toLocaleDateString("es-PE", {
        month: "long",
        year: "numeric",
      })
    : "Recientemente";

  // ------- Intereses y hobbies -------
  const interestsArray = useMemo(() => {
    const raw = currentUser.interests ?? "";
    const splitted = raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (splitted.length > 0) return splitted;

    return [
      "Aprendizaje colaborativo",
      `Proyectos de ${formattedFacultyShort}`,
      "Investigación y papers",
      "Vida universitaria",
      "Tecnología en educación",
    ];
  }, [currentUser.interests, formattedFacultyShort]);

  const hobbiesArray = useMemo(() => {
    const raw = currentUser.hobbies ?? "";
    const splitted = raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (splitted.length > 0) return splitted;

    return ["Videojuegos", "Música", "Programar", "Viajar"];
  }, [currentUser.hobbies]);

  // ------- Estado para editar perfil -------
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [bioDraft, setBioDraft] = useState(currentUser.bio ?? "");

  const [avatarDraft, setAvatarDraft] = useState(
    normalizePublicImage(currentUser.avatarUrl) ?? DEFAULT_AVATAR
  );
  const [bannerDraft, setBannerDraft] = useState(
    normalizePublicImage(currentUser.bannerUrl) ?? DEFAULT_BANNER
  );

  const [interestsDraft, setInterestsDraft] = useState(
    currentUser.interests ?? interestsArray.join(", ")
  );
  const [hobbiesDraft, setHobbiesDraft] = useState(
    currentUser.hobbies ?? hobbiesArray.join(", ")
  );
  const [phoneDraft, setPhoneDraft] = useState(currentUser.phone ?? "");
  const [locationDraft, setLocationDraft] = useState(
    currentUser.location ?? "Ciudad Universitaria, Lima – Perú"
  );

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setBioDraft(currentUser.bio ?? "");
    setAvatarDraft(normalizePublicImage(currentUser.avatarUrl) ?? DEFAULT_AVATAR);
    setBannerDraft(normalizePublicImage(currentUser.bannerUrl) ?? DEFAULT_BANNER);
    setInterestsDraft(currentUser.interests ?? interestsArray.join(", "));
    setHobbiesDraft(currentUser.hobbies ?? hobbiesArray.join(", "));
    setPhoneDraft(currentUser.phone ?? "");
    setLocationDraft(currentUser.location ?? "Ciudad Universitaria, Lima – Perú");
  }, [currentUser.id, currentUser, interestsArray, hobbiesArray]);

  const handleOpenEdit = () => {
    setIsEditOpen(true);
  };

  const handleFileToDataUrl = (file: File, cb: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        cb(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFileToDataUrl(file, (url) => {
      setAvatarDraft(url);
    });
  };

  const handleBannerChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFileToDataUrl(file, (url) => {
      setBannerDraft(url);
    });
  };

  const handleSaveProfile = () => {
    updateUserProfile({
      bio: bioDraft.trim(),
      avatarUrl: avatarDraft.trim() || undefined,
      bannerUrl: bannerDraft.trim() || undefined,
      interests: interestsDraft.trim(),
      hobbies: hobbiesDraft.trim(),
      phone: phoneDraft.trim() || undefined,
      location: locationDraft.trim() || undefined,
    });
    setIsEditOpen(false);
  };

  const currentAvatar = normalizePublicImage(currentUser.avatarUrl) ?? DEFAULT_AVATAR;
  const currentBanner = normalizePublicImage(currentUser.bannerUrl) ?? DEFAULT_BANNER;

  const isSaveDisabled =
    bioDraft.trim() === (currentUser.bio ?? "") &&
    avatarDraft.trim() ===
      (normalizePublicImage(currentUser.avatarUrl) ?? DEFAULT_AVATAR) &&
    bannerDraft.trim() ===
      (normalizePublicImage(currentUser.bannerUrl) ?? DEFAULT_BANNER) &&
    interestsDraft.trim() === (currentUser.interests ?? "") &&
    hobbiesDraft.trim() === (currentUser.hobbies ?? "") &&
    phoneDraft.trim() === (currentUser.phone ?? "") &&
    locationDraft.trim() ===
      (currentUser.location ?? "Ciudad Universitaria, Lima – Perú");

  // ------- Render -------
  return (
    <main className="container mx-auto max-w-5xl space-y-6 px-4 py-6 md:py-8">
      {/* Banner + avatar + cabecera */}
      <section className="overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-md)]">
        {/* Banner */}
        <div className="relative h-32 w-full overflow-hidden md:h-44">
          <img
            src={currentBanner}
            alt="Banner de perfil"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-accent/80 mix-blend-soft-light" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent" />
        </div>

        {/* Contenido principal */}
        <div className="relative px-4 pb-5 pt-0 md:px-6">
          {/* Avatar sobrepuesto */}
          <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex gap-3 md:gap-4">
              <div className="relative -mt-14 md:-mt-16">
                <div className="h-24 w-24 overflow-hidden rounded-3xl border-4 border-background bg-background shadow-[0_12px_30px_rgba(0,0,0,0.35)] md:h-28 md:w-28">
                  <img
                    src={currentAvatar}
                    alt={currentUser.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 pt-4 md:pt-6">
                <div className="inline-flex flex-wrap items-center gap-2">
                  <h1 className="text-lg font-semibold leading-tight md:text-2xl">
                    {currentUser.name}
                  </h1>
                  <Badge
                    variant="outline"
                    className="border-primary/40 bg-primary/5 text-[11px] text-primary"
                  >
                    Sanmarquino · {formattedFacultyShort}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground md:text-sm">
                  {currentUser.program}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    {formattedFacultyName}
                  </span>
                  {currentUser.email && (
                    <>
                      <span className="hidden md:inline">·</span>
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {currentUser.email}
                      </span>
                    </>
                  )}
                  <span className="hidden items-center gap-1 md:inline-flex">
                    <Calendar className="h-3 w-3" />
                    En el foro desde{" "}
                    <span className="font-medium">{formattedMemberSince}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Botón editar */}
            <div className="flex items-center gap-2 pb-2 md:pb-3 md:ml-auto">
              <Button
                size="sm"
                variant="outline"
                className="inline-flex items-center gap-1 text-xs"
                onClick={handleOpenEdit}
              >
                <PenSquare className="h-3.5 w-3.5" />
                Editar perfil
              </Button>
            </div>
          </div>

          {/* Bio + resumen rápido */}
          <div className="mt-3 grid gap-4 md:mt-4 md:grid-cols-[minmax(0,2.1fr)_minmax(0,1.6fr)]">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">
                Sobre mí
              </p>
              {currentUser.bio ? (
                <p className="whitespace-pre-wrap break-words text-sm">
                  {currentUser.bio}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Aún no has escrito una biografía. Cuéntale a otros
                  sanmarquinos quién eres, qué estudias o qué te interesa.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="flex flex-col items-center gap-1 rounded-lg border bg-background/80 px-3 py-2">
                <span className="text-[11px] text-muted-foreground">
                  Karma total
                </span>
                <span className="text-lg font-semibold text-primary">
                  {totalKarma}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-lg border bg-background/80 px-3 py-2">
                <span className="text-[11px] text-muted-foreground">
                  Publicaciones
                </span>
                <span className="text-lg font-semibold text-primary">
                  {myPosts.length}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-lg border bg-background/80 px-3 py-2">
                <span className="text-[11px] text-muted-foreground">
                  Comentarios
                </span>
                <span className="text-lg font-semibold text-primary">
                  {myComments.length}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-lg border bg-background/80 px-3 py-2">
                <span className="text-[11px] text-muted-foreground">
                  Guardados
                </span>
                <span className="text-lg font-semibold text-primary">
                  {savedPostsList.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info académica + actividad en el foro */}
      <section className="grid gap-4 md:grid-cols-[minmax(0,2.1fr)_minmax(0,1.6fr)]">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span>Información académica</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2">
              <span className="text-muted-foreground">Facultad</span>
              <span className="font-medium text-right">
                {formattedFacultyName}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2">
              <span className="text-muted-foreground">Programa / escuela</span>
              <span className="font-medium text-right">
                {currentUser.program}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2">
              <span className="text-muted-foreground">Universidad</span>
              <span className="font-medium text-right">
                Universidad Nacional Mayor de San Marcos
              </span>
            </div>
            {oldestActivityDate && (
              <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2">
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  En el foro desde
                </span>
                <span className="font-medium text-right">
                  {formattedMemberSince}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Award className="h-4 w-4 text-primary" />
                <span>Actividad en el foro</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg border bg-background/80 px-3 py-2">
              <p className="text-[11px] text-muted-foreground">Posts creados</p>
              <p className="text-xl font-semibold text-primary">
                {myPosts.length}
              </p>
            </div>
            <div className="rounded-lg border bg-background/80 px-3 py-2">
              <p className="text-[11px] text-muted-foreground">Comentarios</p>
              <p className="text-xl font-semibold text-primary">
                {myComments.length}
              </p>
            </div>
            <div className="rounded-lg border bg-background/80 px-3 py-2">
              <p className="text-[11px] text-muted-foreground">Karma de posts</p>
              <p className="text-xl font-semibold text-primary">{postKarma}</p>
            </div>
            <div className="rounded-lg border bg-background/80 px-3 py-2">
              <p className="text-[11px] text-muted-foreground">
                Karma de comentarios
              </p>
              <p className="text-xl font-semibold text-primary">
                {commentKarma}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Intereses / Hobbies + Contacto */}
      <section className="grid gap-4 md:grid-cols-[minmax(0,2.1fr)_minmax(0,1.6fr)]">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>Intereses y pasatiempos</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-muted-foreground">
                Intereses académicos
              </p>
              <div className="flex flex-wrap gap-1.5">
                {interestsArray.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-medium text-muted-foreground">
                Hobbies y tiempo libre
              </p>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {hobbiesArray.map((hob, idx) => {
                  const Icon =
                    idx === 0 ? Gamepad2 : idx === 1 ? Music : idx === 2 ? Code : Plane;
                  return (
                    <div
                      key={`${hob}-${idx}`}
                      className="flex flex-col items-center gap-1 rounded-lg bg-muted/60 px-2 py-2"
                    >
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-[11px]">{hob}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de contacto */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <UserIcon className="h-4 w-4 text-primary" />
              <span>Información de contacto</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2">
              <Mail className="h-4 w-4 text-primary" />
              <div className="space-y-0.5">
                <p className="text-[11px] text-muted-foreground">
                  Correo institucional
                </p>
                <p className="font-medium">{currentUser.email ?? "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2">
              <PhoneIcon className="h-4 w-4 text-primary" />
              <div className="space-y-0.5">
                <p className="text-[11px] text-muted-foreground">Teléfono</p>
                <p className="font-medium">
                  {currentUser.phone ?? "No registrado"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2">
              <MapPin className="h-4 w-4 text-primary" />
              <div className="space-y-0.5">
                <p className="text-[11px] text-muted-foreground">Ubicación</p>
                <p className="font-medium">
                  {currentUser.location ?? "Ciudad Universitaria, Lima – Perú"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Actividad reciente con tabs */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground">
              Actividad reciente
            </p>
            <p className="text-[11px] text-muted-foreground">
              Explora un resumen, tus publicaciones, comentarios y lo que guardaste.
            </p>
          </div>
        </div>

        <Tabs defaultValue="resumen" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-4">
            <TabsTrigger value="resumen" className="text-xs">
              Resumen
            </TabsTrigger>
            <TabsTrigger value="posts" className="text-xs">
              Mis publicaciones
            </TabsTrigger>
            <TabsTrigger value="comments" className="text-xs">
              Comentarios
            </TabsTrigger>
            <TabsTrigger value="saved" className="text-xs">
              Guardados
            </TabsTrigger>
          </TabsList>

          {/* Resumen */}
          <TabsContent value="resumen" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="md:col-span-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span>Últimas publicaciones</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {latestMyPosts.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground">
                      Aún no has publicado nada. Crea tu primera publicación para iniciar una conversación.
                    </p>
                  ) : (
                    <ul className="space-y-2 text-xs">
                      {latestMyPosts.map((post) => (
                        <li key={post.id}>
                          <button
                            type="button"
                            onClick={() => navigate(`/publicaciones/${post.id}`)}
                            className="w-full rounded-lg border bg-background/70 p-2 text-left transition hover:border-primary/60 hover:bg-muted/40"
                          >
                            <p className="line-clamp-2 text-xs font-medium">{post.title}</p>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              {new Date(post.createdAt).toLocaleDateString("es-PE", {
                                day: "2-digit",
                                month: "short",
                              })}
                            </p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <Card className="md:col-span-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>Últimos comentarios</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {latestMyComments.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground">
                      Aún no has comentado en ninguna publicación.
                    </p>
                  ) : (
                    <ul className="space-y-2 text-xs">
                      {latestMyComments.map((comment) => (
                        <li key={comment.id}>
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/publicaciones/${comment.postId}?comment=${comment.id}`
                              )
                            }
                            className="w-full rounded-lg border bg-background/70 p-2 text-left transition hover:border-primary/60 hover:bg-muted/40"
                          >
                            <p className="line-clamp-2 text-[11px] text-muted-foreground">
                              En: {comment.postTitle}
                            </p>
                            <p className="mt-1 line-clamp-2 text-xs">{comment.content}</p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <Card className="md:col-span-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <Bookmark className="h-4 w-4 text-primary" />
                    <span>Guardados</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {latestSavedPosts.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground">
                      Aún no has guardado ninguna publicación.
                    </p>
                  ) : (
                    <ul className="space-y-2 text-xs">
                      {latestSavedPosts.map((post) => (
                        <li key={post.id}>
                          <button
                            type="button"
                            onClick={() => navigate(`/publicaciones/${post.id}`)}
                            className="w-full rounded-lg border bg-background/70 p-2 text-left transition hover:border-primary/60 hover:bg-muted/40"
                          >
                            <p className="line-clamp-2 text-xs font-medium">{post.title}</p>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              {new Date(post.createdAt).toLocaleDateString("es-PE", {
                                day: "2-digit",
                                month: "short",
                              })}
                            </p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Mis publicaciones */}
          <TabsContent value="posts">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="space-y-1">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Mis publicaciones
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Todas las publicaciones que has creado en el foro.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {myPosts.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground">
                    Aún no has creado publicaciones.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {myPosts
                      .slice()
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .map((post) => (
                        <li key={post.id}>
                          <button
                            type="button"
                            onClick={() => navigate(`/publicaciones/${post.id}`)}
                            className="flex w-full items-center justify-between gap-2 rounded-lg border bg-background/70 p-2 text-left transition hover:border-primary/60 hover:bg-muted/40"
                          >
                            <div className="space-y-0.5">
                              <p className="line-clamp-2 text-xs font-medium">
                                {post.title}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {new Date(post.createdAt).toLocaleDateString("es-PE", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            <div className="text-right text-[11px] text-muted-foreground">
                              <p>
                                Karma:{" "}
                                <span className="font-semibold">
                                  {getPostScore(post.id)}
                                </span>
                              </p>
                            </div>
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comentarios */}
          <TabsContent value="comments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="space-y-1">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Mis comentarios
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Comentarios que has dejado en distintas publicaciones.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {myComments.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground">
                    Aún no has comentado en ninguna publicación.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {myComments.map((comment) => (
                      <li key={comment.id}>
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/publicaciones/${comment.postId}?comment=${comment.id}`
                            )
                          }
                          className="w-full rounded-lg border bg-background/70 p-2 text-left transition hover:border-primary/60 hover:bg-muted/40"
                        >
                          <p className="line-clamp-2 text-[11px] text-muted-foreground">
                            En: {comment.postTitle}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs">{comment.content}</p>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString("es-PE", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            · Karma:{" "}
                            <span className="font-semibold">
                              {getCommentScore(comment.id)}
                            </span>
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guardados */}
          <TabsContent value="saved">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="space-y-1">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <Bookmark className="h-4 w-4 text-primary" />
                    Publicaciones guardadas
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Todo lo que marcaste para revisar más tarde.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {savedPostsList.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground">
                    Todavía no has guardado publicaciones.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {savedPostsList
                      .slice()
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .map((post) => (
                        <li key={post.id}>
                          <button
                            type="button"
                            onClick={() => navigate(`/publicaciones/${post.id}`)}
                            className="flex w-full items-center justify-between gap-2 rounded-lg border bg-background/70 p-2 text-left transition hover:border-primary/60 hover:bg-muted/40"
                          >
                            <div className="space-y-0.5">
                              <p className="line-clamp-2 text-xs font-medium">
                                {post.title}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {new Date(post.createdAt).toLocaleDateString("es-PE", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Diálogo de edición de perfil */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
            <DialogDescription>
              Actualiza tu biografía, foto, intereses y datos de contacto.
            </DialogDescription>
          </DialogHeader>

          {/* 👇 Todo lo que sigue es la parte scrollable */}
          <div className="flex-1 space-y-4 overflow-y-auto pr-1 text-xs">
            {/* Banner */}
            <div className="space-y-2">
              <p className="text-xs font-medium">Banner de perfil</p>
              <div className="relative overflow-hidden rounded-xl border bg-muted">
                <img
                  src={bannerDraft}
                  alt="Banner preview"
                  className="h-24 w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-2 flex justify-center">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="rounded-full bg-background/90 backdrop-blur"
                    onClick={() => bannerInputRef.current?.click()}
                  >
                    Cambiar banner
                  </Button>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Usa una imagen panorámica (aprox. 3:1).
              </p>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerChange}
              />
            </div>

            {/* Avatar */}
            <div className="space-y-2">
              <p className="text-xs font-medium">Foto de perfil</p>
              <div className="flex flex-col items-center gap-2">
                <div className="h-20 w-20 overflow-hidden rounded-3xl border bg-muted shadow-[var(--shadow-sm)]">
                  <img
                    src={avatarDraft}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  Cambiar foto
                </Button>
                <p className="text-[10px] text-muted-foreground text-center">
                  Elige una imagen cuadrada para que se vea mejor.
                </p>
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium">Biografía</p>
              <Textarea
                rows={4}
                value={bioDraft}
                onChange={(e) => setBioDraft(e.target.value)}
                placeholder="Cuenta quién eres, qué estudias, en qué ciclo estás o qué temas te interesan."
                className="text-sm"
              />
            </div>

            {/* Intereses y hobbies */}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <p className="text-xs font-medium">Intereses académicos</p>
                <Textarea
                  rows={3}
                  value={interestsDraft}
                  onChange={(e) => setInterestsDraft(e.target.value)}
                  placeholder="Ejemplo: algoritmos, ingeniería de software, IA, proyectos, comunidad..."
                  className="text-xs"
                />
                <p className="text-[10px] text-muted-foreground">
                  Separa cada interés con comas. Se mostrarán como chips en tu perfil.
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-medium">Hobbies y pasatiempos</p>
                <Textarea
                  rows={3}
                  value={hobbiesDraft}
                  onChange={(e) => setHobbiesDraft(e.target.value)}
                  placeholder="Ejemplo: videojuegos, música, leer, programar, viajar..."
                  className="text-xs"
                />
                <p className="text-[10px] text-muted-foreground">
                  También separa por comas; se usarán en la sección de pasatiempos.
                </p>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <p className="text-xs font-medium">Teléfono</p>
                <Input
                  value={phoneDraft}
                  onChange={(e) => setPhoneDraft(e.target.value)}
                  placeholder="Ejemplo: +51 999 999 999"
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-medium">Ubicación</p>
                <Input
                  value={locationDraft}
                  onChange={(e) => setLocationDraft(e.target.value)}
                  placeholder="Ejemplo: San Miguel, Lima"
                  className="text-xs"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-2 pt-2 pb-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditOpen(false)}
              >
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSaveProfile} disabled={isSaveDisabled}>
                Guardar cambios
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

// Icono de teléfono simple
const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.12.86.37 1.7.72 2.49a2 2 0 0 1-.45 2.11L8 9a16 16 0 0 0 7 7l.68-.38a2 2 0 0 1 2.11-.45c.79.35 1.63.6 2.49.72A2 2 0 0 1 22 16.92z" />
  </svg>
);

export default Profile;
