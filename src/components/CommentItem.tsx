// src/components/CommentItem.tsx

import { useState, useEffect } from "react";
import { Comment } from "@/types/forum";
import { useForum } from "@/context/ForumContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Reply,
  Link as LinkIcon,
  User as UserIcon,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";

interface CommentItemProps {
  comment: Comment;
  highlightedId?: string | null;
  setRef: (id: string, el: HTMLDivElement | null) => void;
  onReply: (commentId: string) => void;

  // Profundidad visual del hilo (0 = raíz)
  depth?: number;
}

/**
 * Componente recursivo para mostrar un comentario y sus respuestas.
 * Soporta: votos, respuesta, copiar enlace, edición y borrado.
 */
const CommentItem = ({
  comment,
  highlightedId,
  setRef,
  onReply,
  depth = 0,
}: CommentItemProps) => {
  const {
    getCommentsByPostId,
    getCommentScore,
    getUserCommentVote,
    voteComment,
    currentUser,
    updateComment,
    deleteComment,
  } = useForum();

  const MAX_DEPTH = 3;
  const nextDepth = depth < MAX_DEPTH ? depth + 1 : MAX_DEPTH;

  const commentsSource = getCommentsByPostId(comment.postId);

  // Respuestas directas a este comentario
  const replies = commentsSource.filter(
    (c) => c.parentCommentId === comment.id
  );

  const isHighlighted = highlightedId === comment.id;
  const isRoot = !comment.parentCommentId;
  const isOwner = currentUser.name === comment.author;

  // Edición
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  // Si el comentario cambia externamente, sincronizamos el texto
  useEffect(() => {
    setEditText(comment.content);
  }, [comment.id, comment.content]);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/publicaciones/${comment.postId}?comment=${comment.id}`;
    await navigator.clipboard.writeText(url);
  };

  // Votos
  const score = getCommentScore(comment.id);
  const userVote = getUserCommentVote(comment.id);

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    voteComment(comment.id, 1);
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    voteComment(comment.id, -1);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCancelEdit = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsEditing(false);
    setEditText(comment.content);
  };

  const handleSaveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editText.trim()) return;
    updateComment(comment.id, editText.trim());
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = window.confirm(
      "¿Seguro que quieres eliminar este comentario? También se borrarán sus respuestas."
    );
    if (!ok) return;
    deleteComment(comment.id);
  };

  const createdAt = new Date(comment.createdAt).toLocaleString("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  });

  // Fondo sutil según profundidad
  const depthBgClass =
    depth === 0
      ? "bg-card"
      : depth === 1
      ? "bg-muted/70"
      : "bg-muted";

  return (
    <div
      className={`
        space-y-3
        ${!isRoot ? "pl-4 md:pl-6 border-l border-border/60" : ""}
      `}
    >
      {/* Comentario principal */}
      <div
        ref={(el) => setRef(comment.id, el)}
        className={`
          border rounded-md p-3 shadow-sm transition-all
          ${depthBgClass}
          ${isHighlighted ? "animate-highlight" : ""}
        `}
      >
        {/* Encabezado */}
        <div className="flex items-start justify-between mb-1">
          <div className="flex flex-col gap-0.5 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <UserIcon className="h-3 w-3" />
              <span className="font-medium">{comment.author}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {createdAt}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {/* Copiar enlace */}
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                handleCopyLink();
              }}
            >
              <LinkIcon className="h-3 w-3" />
            </Button>

            {/* Responder */}
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-primary hover:bg-primary/10"
              onClick={(e) => {
                e.stopPropagation();
                onReply(comment.id);
              }}
            >
              <Reply className="h-3 w-3" />
            </Button>

            {/* Editar / eliminar solo si es del usuario actual */}
            {isOwner && !isEditing && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={handleEditClick}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-red-500 hover:text-red-600"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Contenido o modo edición */}
        {isEditing ? (
          <div className="mt-2 space-y-2">
            <Textarea
              rows={3}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="text-xs md:text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                className="inline-flex items-center gap-1"
                onClick={handleCancelEdit}
              >
                <X className="h-3 w-3" />
                Cancelar
              </Button>
              <Button
                size="sm"
                className="inline-flex items-center gap-1"
                disabled={!editText.trim()}
                onClick={handleSaveEdit}
              >
                <Check className="h-3 w-3" />
                Guardar
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-1 text-xs md:text-sm whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        )}

        {/* Votos abajo */}
        <div className="mt-2 flex items-center justify-end gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={handleUpvote}
          >
            <ArrowUp
              className={
                userVote === 1 ? "h-3 w-3 text-primary" : "h-3 w-3"
              }
            />
          </Button>
          <span className="min-w-[1.5rem] text-center text-[11px] font-medium">
            {score}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={handleDownvote}
          >
            <ArrowDown
              className={
                userVote === -1 ? "h-3 w-3 text-primary" : "h-3 w-3"
              }
            />
          </Button>
        </div>
      </div>

      {/* Respuestas anidadas */}
      {replies.length > 0 && (
        <div className="space-y-3">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              highlightedId={highlightedId}
              setRef={setRef}
              onReply={onReply}
              depth={nextDepth}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
