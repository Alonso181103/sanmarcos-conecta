// src/pages/AdminPanel.tsx

import Header from "@/components/Header";
import { useForum } from "@/context/ForumContext";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, ShieldBan } from "lucide-react";

const AdminPanel = () => {
  const {
    currentUser,
    posts,
    users,
    getPostReportCount,
    getReportsByPostId,
    deletePost,
    updateUserProfile,
  } = useForum();

  const isAdmin =
    currentUser.email?.toLowerCase().includes("admin") ||
    currentUser.name.toLowerCase().includes("admin");

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <Card>
            <CardContent className="p-6 text-center space-y-2">
              <p className="text-sm font-semibold">
                No tienes permisos para ver esta sección.
              </p>
              <p className="text-xs text-muted-foreground">
                Este panel está reservado para moderadores / administradores.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const reportedPosts = posts
    .map((p) => ({
      post: p,
      reportCount: getPostReportCount(p.id),
    }))
    .filter((item) => item.reportCount > 0)
    .sort((a, b) => b.reportCount - a.reportCount);

  const handleDeletePost = (id: string) => {
    if (
      window.confirm(
        "¿Seguro que quieres eliminar esta publicación y todos sus comentarios?"
      )
    ) {
      deletePost(id);
    }
  };

  const handleToggleBlockUser = (userId: string, isBlocked?: boolean) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const willBlock = !isBlocked;
    if (
      window.confirm(
        willBlock
          ? `¿Bloquear a ${target.name}? No podrá crear publicaciones ni comentarios.`
          : `¿Desbloquear a ${target.name}?`
      )
    ) {
      updateUserProfile({
        id: userId,
        isBlocked: willBlock,
      } as any);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        <section className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 dark:bg-red-950/40 px-4 py-1 text-xs text-red-700 dark:text-red-300">
            <AlertTriangle className="h-4 w-4" />
            <span>Panel de moderación</span>
          </div>
          <h1 className="text-2xl font-bold">Centro de reportes</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Desde aquí puedes revisar publicaciones reportadas y tomar acciones
            básicas de moderación.
          </p>
        </section>

        {/* Publicaciones reportadas */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Publicaciones reportadas
          </h2>

          {reportedPosts.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-sm text-muted-foreground">
                No hay publicaciones reportadas por el momento.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {reportedPosts.map(({ post, reportCount }) => {
                const postReports = getReportsByPostId(post.id);

                return (
                  <Card key={post.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold line-clamp-2">
                            {post.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {post.author} ·{" "}
                            {new Date(post.createdAt).toLocaleString("es-PE", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-red-600">
                            {reportCount} reporte
                            {reportCount !== 1 && "s"}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <div className="space-y-1">
                        {postReports.map((r) => (
                          <p
                            key={r.id}
                            className="text-[11px] text-muted-foreground border-l pl-2"
                          >
                            <span className="font-medium">
                              Motivo: {r.reason}
                            </span>
                            {r.details && (
                              <>
                                {" · "}
                                <span>{r.details}</span>
                              </>
                            )}
                          </p>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              (window.location.href = `/publicaciones/${post.id}`)
                            }
                          >
                            Ver publicación
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="inline-flex items-center gap-1"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Usuarios (mock bloqueo) */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShieldBan className="h-5 w-5 text-primary" />
            Usuarios (bloqueo mock)
          </h2>
          <Card>
            <CardContent className="p-4 space-y-2 text-sm max-h-[320px] overflow-y-auto">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between gap-2 border-b last:border-b-0 py-1"
                >
                  <div>
                    <p className="font-medium text-xs md:text-sm">
                      {u.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {u.email ?? "sin correo registrado"}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={u.isBlocked ? "secondary" : "outline"}
                    className="inline-flex items-center gap-1 text-[11px]"
                    onClick={() => handleToggleBlockUser(u.id, u.isBlocked)}
                  >
                    <ShieldBan className="h-3 w-3" />
                    {u.isBlocked ? "Desbloquear" : "Bloquear"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default AdminPanel;
