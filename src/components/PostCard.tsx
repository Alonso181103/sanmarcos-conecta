// src/components/PostCard.tsx

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Calendar,
  MessageSquare,
  User as UserIcon,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Share2,
  Flag,
  ArrowUp,
  ArrowDown,
  GraduationCap,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { CategoryId, FacultyId } from "@/types/forum";
import { useForum } from "@/context/ForumContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  categoryId: CategoryId;
  facultyId: FacultyId;
  courseId?: string;
  author: string;
  createdAt: string;
  showReplies?: boolean;
}

const PostCard = ({
  id,
  title,
  content,
  categoryId,
  facultyId,
  courseId,
  author,
  createdAt,
  showReplies = true,
}: PostCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    categories,
    faculties,
    courses,
    getCommentsByPostId,
    isPostSaved,
    toggleSavePost,
    getPostScore,
    getUserPostVote,
    votePost,
  } = useForum();

  const category = categories.find((c) => c.id === categoryId);
  const faculty = faculties.find((f) => f.id === facultyId);
  const course = courseId ? courses.find((c) => c.id === courseId) : null;

  const repliesCount = getCommentsByPostId(id).length;

  const formattedDate = new Date(createdAt).toLocaleString("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  });

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/publicaciones/${id}`;
    await navigator.clipboard.writeText(url);

    toast({
      title: "Enlace copiado",
      description: (
        <div className="mt-1 space-y-1">
          <p className="line-clamp-1 text-xs font-semibold">{title}</p>
          <p className="line-clamp-2 text-[11px] text-muted-foreground">
            {content}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1">
            {category && (
              <Badge variant="outline" className="text-[10px]">
                {category.title}
              </Badge>
            )}
            {faculty && (
              <Badge variant="outline" className="text-[10px]">
                {faculty.shortName}
              </Badge>
            )}
            {course && (
              <Badge variant="outline" className="text-[10px]">
                {course.code}
              </Badge>
            )}
          </div>
        </div>
      ),
    });
  };

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/publicaciones/${id}?report=1`);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSavePost(id);
  };

  const score = getPostScore(id);
  const userVote = getUserPostVote(id);

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    votePost(id, 1);
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    votePost(id, -1);
  };

  return (
    <Card
      className="
        group relative flex cursor-pointer gap-3 rounded-xl border 
        bg-card/60 backdrop-blur-sm 
        shadow-subtle 
        transition-all duration-300 ease-smooth
        hover:-translate-y-[2px] hover:bg-card hover:shadow-soft-lg hover:border-primary/30
      "
      onClick={() => navigate(`/publicaciones/${id}`)}
    >
      {/* COLUMNA PRINCIPAL */}
      <div className="flex-1">
        <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
          <div className="space-y-1">
            {/* Etiquetas superiores */}
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              {category && (
                <Badge
                  variant="outline"
                  className="
                    inline-flex items-center gap-1 border-primary/40 bg-primary/5 
                    text-[11px] font-medium text-primary
                  "
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
                  {course.code}
                </Badge>
              )}

              {showReplies && (
                <Badge
                  variant="outline"
                  className="inline-flex items-center gap-1 text-[11px]"
                >
                  <MessageSquare className="h-3 w-3" />
                  {repliesCount}
                </Badge>
              )}

              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </span>
            </div>

            {/* Título */}
            <h3
              className="
                line-clamp-2 text-sm font-semibold leading-snug md:text-[0.95rem]
                transition-colors duration-200 group-hover:text-primary
              "
            >
              {title}
            </h3>
          </div>

          {/* Acciones superiores */}
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="
                h-7 w-7 rounded-full 
                text-muted-foreground shadow-none 
                transition-all hover:text-primary hover:shadow-subtle
              "
              onClick={handleSave}
            >
              {isPostSaved(id) ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="
                h-7 w-7 rounded-full 
                text-muted-foreground transition-all hover:text-primary hover:shadow-subtle
              "
              onClick={handleCopyLink}
            >
              <Share2 className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="
                h-7 w-7 rounded-full 
                text-muted-foreground transition-all hover:text-red-500 hover:shadow-subtle
              "
              onClick={handleReport}
            >
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          {/* Contenido */}
          <p className="line-clamp-2 text-xs text-muted-foreground">{content}</p>

          {/* Autor */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <UserIcon className="h-3.5 w-3.5" />
              {author}
            </span>
          </div>
        </CardContent>
      </div>

      {/* COLUMNA DERECHA: votos */}
      <div className="flex flex-col items-center justify-center border-l px-2 py-3 text-[11px]">
        <Button
          size="icon"
          variant="ghost"
          className="
            h-6 w-6 rounded-full text-muted-foreground transition hover:text-primary
          "
          onClick={handleUpvote}
        >
          <ArrowUp
            className={cn(
              "h-3 w-3",
              userVote === 1 && "text-primary",
            )}
          />
        </Button>

        <span className="my-1 min-w-[2rem] text-center text-[0.8rem] font-medium">
          {score}
        </span>

        <Button
          size="icon"
          variant="ghost"
          className="
            h-6 w-6 rounded-full text-muted-foreground transition hover:text-primary
          "
          onClick={handleDownvote}
        >
          <ArrowDown
            className={cn(
              "h-3 w-3",
              userVote === -1 && "text-primary",
            )}
          />
        </Button>
      </div>
    </Card>
  );
};

export default PostCard;
