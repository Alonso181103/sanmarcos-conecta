// src/pages/PostDetail.tsx

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useForum } from "@/context/ForumContext";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
  ArrowLeft,
  MessageSquare,
  Reply,
  Calendar,
  BookOpen,
  GraduationCap,
  Bookmark,
  BookmarkCheck,
  Share2,
  Flag,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";

import CommentItem from "@/components/CommentItem";
import { ReportReason } from "@/types/forum";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const REPORT_REASONS: {
  key: ReportReason;
  label: string;
  description: string;
}[] = [
  {
    key: "spam",
    label: "Spam o publicidad",
    description: "Contenido repetitivo, engañoso o promocional.",
  },
  {
    key: "contenido-inapropiado",
    label: "Contenido inapropiado",
    description: "Lenguaje ofensivo, ataques personales o contenido sensible.",
  },
  {
    key: "fuera-de-tema",
    label: "Fuera de tema",
    description: "No tiene relación con la vida académica ni la UNMSM.",
  },
  {
    key: "otro",
    label: "Otro",
    description: "Describe brevemente el problema.",
  },
];

const PostDetail = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();

  const {
    getPostById,
    getCommentsByPostId,
    createComment,
    categories,
    faculties,
    courses,
    isPostSaved,
    toggleSavePost,
    getPostScore,
    getUserPostVote,
    votePost,
    currentUser,
    updatePost,
    deletePost,
    getPostReportCount,
    createReport,
  } = useForum();

  const post = postId ? getPostById(postId) : undefined;

  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [highlightedCommentId, setHighlightedCommentId] =
    useState<string | null>(null);

  // Edición de publicación
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editTitle, setEditTitle] = useState(post?.title ?? "");
  const [editContent, setEditContent] = useState(post?.content ?? "");

  // Reporte
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<ReportReason | "">("");
  const [reportDetails, setReportDetails] = useState("");

  const commentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [searchParams] = useSearchParams();
  const anchorCommentId = searchParams.get("comment");
  const reportParam = searchParams.get("report");

  const comments = postId ? getCommentsByPostId(postId) : [];

  // Comentario al que se está respondiendo (para la vista previa)
  const replyingToComment =
    replyTo ? comments.find((c) => c.id === replyTo) ?? null : null;

  // Registrar ref de comentario (raíz y replies)
  const setCommentRef = (commentId: string, el: HTMLDivElement | null) => {
    commentRefs.current[commentId] = el;
  };

  // Scroll al comentario si viene ?comment=ID
  useEffect(() => {
    if (anchorCommentId && commentRefs.current[anchorCommentId]) {
      setTimeout(() => {
        commentRefs.current[anchorCommentId]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        setHighlightedCommentId(anchorCommentId);
      }, 300);
    }
  }, [anchorCommentId, comments]);

  // Abrir automáticamente el modal de reporte si venimos con ?report=1
  useEffect(() => {
    if (reportParam === "1") {
      setIsReportOpen(true);
    }
  }, [reportParam]);

  // Si el post cambia (por edición o navegación), sincronizar campos de edición
  useEffect(() => {
    if (post) {
      setEditTitle(post.title);
      setEditContent(post.content);
    }
  }, [post?.id]);

  if (!post) {
    return (
      <main className="mx-auto max-w-4xl py-6 md:py-8">
        <p className="text-center text-sm text-muted-foreground">
          Publicación no encontrada.
        </p>
      </main>
    );
  }

  const isOwner = currentUser.name === post.author;

  // Meta de la publicación
  const category = categories.find((c) => c.id === post.categoryId);
  const faculty = faculties.find((f) => f.id === post.facultyId);
  const course = post.courseId
    ? courses.find((c) => c.id === post.courseId)
    : undefined;

  const createdAt = new Date(post.createdAt).toLocaleString("es-PE", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const saved = isPostSaved(post.id);
  const postScore = getPostScore(post.id);
  const postUserVote = getUserPostVote(post.id);
  const reportCount = getPostReportCount(post.id);

  const handleSendComment = () => {
    if (!commentText.trim()) return;

    const newComment = createComment({
      postId: post.id,
      content: commentText.trim(),
      parentCommentId: replyTo || undefined,
    });

    setCommentText("");
    setReplyTo(null);

    setTimeout(() => {
      const el = commentRefs.current[newComment.id];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedCommentId(newComment.id);
      }
    }, 150);
  };

  const handleCopyPostLink = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = `${window.location.origin}/publicaciones/${post.id}`;
    await navigator.clipboard.writeText(url);
  };

  const handleToggleSave = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toggleSavePost(post.id);
  };

  const handleUpvotePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    votePost(post.id, 1);
  };

  const handleDownvotePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    votePost(post.id, -1);
  };

  // Edición de la publicación
  const handleStartEditPost = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditTitle(post.title);
    setEditContent(post.content);
    setIsEditingPost(true);
  };

  const handleCancelEditPost = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsEditingPost(false);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleSaveEditPost = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!editTitle.trim() || !editContent.trim()) return;

    updatePost(post.id, {
      title: editTitle.trim(),
      content: editContent.trim(),
      categoryId: post.categoryId,
      facultyId: post.facultyId,
      courseId: post.courseId,
    });

    setIsEditingPost(false);
  };

  const handleDeletePost = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const confirmDelete = window.confirm(
      "¿Seguro que quieres eliminar esta publicación? También se eliminarán sus comentarios."
    );
    if (!confirmDelete) return;

    deletePost(post.id);
    navigate("/publicaciones");
  };

  // Reportes
  const handleOpenReport = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsReportOpen(true);
    setReportReason("");
    setReportDetails("");
  };

  const handleSubmitReport = () => {
    if (!reportReason) return;

    createReport({
      postId: post.id,
      reason: reportReason as ReportReason,
      details: reportDetails.trim() || undefined,
    });

    setIsReportOpen(false);
    setReportReason("");
    setReportDetails("");
    alert("Reporte enviado. Gracias por ayudarnos a moderar el contenido.");
  };

  return (
    <main className="mx-auto max-w-4xl space-y-6 py-6 md:py-8">
      {/* Barra superior: volver + meta ligera */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full bg-muted/80 px-3 py-1.5 text-xs text-muted-foreground transition-[background,color,transform] hover:-translate-y-[1px] hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver
        </button>

        <div className="hidden items-center gap-2 text-[11px] text-muted-foreground sm:flex">
          {category && (
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 text-[11px]"
            >
              <MessageSquare className="h-3 w-3" />
              {category.title}
            </Badge>
          )}
          {faculty && (
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 text-[11px]"
            >
              <GraduationCap className="h-3 w-3" />
              {faculty.shortName}
            </Badge>
          )}
        </div>
      </div>

      {/* Publicación */}
      <Card className="relative overflow-hidden border-0 bg-card shadow-[var(--shadow-md)]">
        {/* Banda superior suave */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-primary/12 via-primary/5 to-accent/10" />
        <div className="relative z-10">
          <CardHeader className="space-y-4 pb-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              {/* Título + meta */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {category && (
                    <Badge
                      variant="outline"
                      className="inline-flex items-center gap-1 border-primary/40 bg-primary/5 text-[11px] font-medium text-primary"
                    >
                      <MessageSquare className="h-3 w-3" />
                      {category.title}
                    </Badge>
                  )}

                  {faculty && (
                    <Badge
                      variant="secondary"
                      className="inline-flex items-center gap-1 text-[11px]"
                    >
                      <GraduationCap className="h-3 w-3" />
                      {faculty.shortName}
                    </Badge>
                  )}

                  {course && (
                    <Badge
                      variant="outline"
                      className="inline-flex items-center gap-1 text-[11px]"
                    >
                      <BookOpen className="h-3 w-3" />
                      {course.code} · {course.name}
                    </Badge>
                  )}

                  <Badge
                    variant="outline"
                    className="inline-flex items-center gap-1 text-[11px]"
                  >
                    <MessageSquare className="h-3 w-3" />
                    {comments.length}
                  </Badge>

                  <Badge
                    variant="outline"
                    className="inline-flex items-center gap-1 text-[11px]"
                  >
                    <Calendar className="h-3 w-3" />
                    {createdAt}
                  </Badge>

                  {reportCount > 0 && (
                    <Badge
                      variant="outline"
                      className="inline-flex items-center gap-1 border-red-300 text-[11px] text-red-500"
                    >
                      <Flag className="h-3 w-3" />
                      {reportCount} reporte
                      {reportCount !== 1 && "s"}
                    </Badge>
                  )}
                </div>

                {isEditingPost ? (
                  <>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-lg font-semibold md:text-2xl"
                      placeholder="Título de la publicación"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Ajusta el título para que sea claro y fácil de encontrar.
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="break-words text-lg font-semibold md:text-2xl">
                      {post.title}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      Por <span className="font-medium">{post.author}</span>
                    </p>
                  </>
                )}
              </div>

              {/* Acciones principales */}
              <div className="flex flex-col items-end gap-2">
                {/* Votos */}
                {!isEditingPost && (
                  <div className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-1 text-xs shadow-[var(--shadow-sm)]">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={handleUpvotePost}
                    >
                      <ArrowUp
                        className={
                          postUserVote === 1
                            ? "h-4 w-4 text-primary"
                            : "h-4 w-4"
                        }
                      />
                    </Button>
                    <span className="min-w-[2rem] text-center text-xs font-medium">
                      {postScore}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={handleDownvotePost}
                    >
                      <ArrowDown
                        className={
                          postUserVote === -1
                            ? "h-4 w-4 text-primary"
                            : "h-4 w-4"
                        }
                      />
                    </Button>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex items-center gap-1">
                  {/* Guardar */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full"
                    onClick={handleToggleSave}
                  >
                    {saved ? (
                      <BookmarkCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>

                  {/* Copiar enlace */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full"
                    onClick={handleCopyPostLink}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>

                  {/* Reportar */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full text-red-500"
                    onClick={handleOpenReport}
                  >
                    <Flag className="h-4 w-4" />
                  </Button>

                  {/* Edición/ borrado si es dueño */}
                  {isOwner && !isEditingPost && (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full"
                        onClick={handleStartEditPost}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full text-red-500"
                        onClick={handleDeletePost}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {/* Guardar edición */}
                  {isOwner && isEditingPost && (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full text-green-600"
                        onClick={handleSaveEditPost}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full text-red-500"
                        onClick={handleCancelEditPost}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-1">
            {isEditingPost ? (
              <>
                <Textarea
                  rows={6}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Describe el problema, comparte contexto o detalla el material que estás compartiendo..."
                  className="text-sm"
                />
                <p className="text-[11px] text-muted-foreground">
                  Piensa en tus compañeros: mientras más claro seas, más fácil
                  será ayudarte.
                </p>
              </>
            ) : (
              <p className="whitespace-pre-wrap text-sm text-foreground">
                {post.content}
              </p>
            )}
          </CardContent>
        </div>
      </Card>

      {/* Comentarios */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-sm font-semibold md:text-base">Comentarios</h2>
        </div>

        {comments.length === 0 && (
          <div className="py-2 text-xs text-muted-foreground">
            Sé el primero en comentar.
          </div>
        )}

        <div className="space-y-3">
          {comments
            .filter((c) => !c.parentCommentId)
            .map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                highlightedId={highlightedCommentId}
                setRef={setCommentRef}
                onReply={(id) => setReplyTo(id)}
                depth={0}
              />
            ))}
        </div>
      </section>

      {/* Caja de comentario */}
      <section>
        <Card className="shadow-[var(--shadow-sm)]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Escribir comentario</h3>
            </div>

            {replyTo && replyingToComment && (
              <p className="flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
                <Reply className="h-3 w-3" />
                <span>Respondiendo a</span>
                <span className="font-semibold">
                  {replyingToComment.author}
                </span>
                <span className="mx-1 text-muted-foreground">·</span>
                <span className="max-w-[220px] line-clamp-1 md:max-w-xs">
                  {replyingToComment.content}
                </span>
                <button
                  className="ml-1 text-[11px] text-blue-600 hover:underline"
                  onClick={() => setReplyTo(null)}
                >
                  cancelar
                </button>
              </p>
            )}

            {replyTo && !replyingToComment && (
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Reply className="h-3 w-3" />
                Respondiendo a un comentario
                <button
                  className="ml-1 text-[11px] text-blue-600 hover:underline"
                  onClick={() => setReplyTo(null)}
                >
                  cancelar
                </button>
              </p>
            )}
          </CardHeader>

          <CardContent className="space-y-2">
            <Textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Escribe tu comentario aquí..."
              className="text-sm"
            />

            <div className="flex justify-end">
              <Button
                size="sm"
                disabled={!commentText.trim()}
                onClick={handleSendComment}
                className="inline-flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Comentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Diálogo de reporte */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reportar publicación</DialogTitle>
            <DialogDescription>
              Ayúdanos a mantener el foro seguro y enfocado en la vida
              académica sanmarquina.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Motivo del reporte
              </p>
              <div className="grid gap-2 text-[11px]">
                {REPORT_REASONS.map((reason) => (
                  <button
                    key={reason.key}
                    type="button"
                    onClick={() => setReportReason(reason.key)}
                    className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-left transition-[background,border-color,transform] ${
                      reportReason === reason.key
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:-translate-y-[1px] hover:border-primary/40"
                    }`}
                  >
                    <div className="mt-0.5 h-2.5 w-2.5 rounded-full border border-primary/60 bg-primary/10" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium">{reason.label}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {reason.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Detalles adicionales (opcional)
              </p>
              <Textarea
                rows={3}
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Ejemplo: lenguaje ofensivo hacia un compañero, contenido completamente ajeno al curso, etc."
                className="text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReportOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                disabled={!reportReason}
                onClick={handleSubmitReport}
              >
                Enviar reporte
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default PostDetail;
