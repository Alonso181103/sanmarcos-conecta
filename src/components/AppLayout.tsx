// src/components/AppLayout.tsx

import { ReactNode, useState } from "react";
import Header from "@/components/Header";
import { useForum } from "@/context/ForumContext";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home as HomeIcon,
  Flame,
  Bookmark,
  GraduationCap,
  BookOpen,
  Sparkles,
  Menu,
} from "lucide-react";
import { ChatWidget } from "@/components/ChatWidget";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { currentUser, faculties } = useForum();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const faculty = faculties.find((f) => f.id === currentUser.facultyId);

  const isExactPath = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER GLOBAL */}
      <Header />

      <div className="flex-1">
        <div className="container mx-auto px-4 py-4 flex gap-4">
          {/* CONTENEDOR SIDEBAR (desktop) */}
          <div
            className={cn(
              "relative hidden lg:block transition-all duration-200 ease-out",
              isSidebarOpen ? "w-64" : "w-10"
            )}
          >
            {/* Línea vertical estilo Reddit */}
            <div
              className="absolute top-0 right-0 h-full w-px bg-border"
              aria-hidden="true"
            />

            {/* SIDEBAR */}
            {isSidebarOpen && (
              <aside className="w-64 shrink-0 flex flex-col text-xs pt-2 pr-6 space-y-4">
                {/* “Tarjeta” principal del menú */}
                <div className="rounded-2xl border bg-gradient-to-b from-card via-card to-muted/60 shadow-[var(--shadow-sm)] px-3 py-3 space-y-4">
                  {/* Navegación principal */}
                  <nav className="space-y-1">
                    <p className="px-1 pb-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Mi feed
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition",
                        isExactPath("/") && "bg-muted font-medium"
                      )}
                    >
                      <HomeIcon className="h-4 w-4" />
                      <span>Inicio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/publicaciones")}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition",
                        location.pathname.startsWith("/publicaciones") &&
                        "bg-muted font-medium"
                      )}
                    >
                      <Flame className="h-4 w-4" />
                      <span>Publicaciones</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/perfil")}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition"
                    >
                      <Bookmark className="h-4 w-4" />
                      <span>Guardados y actividad</span>
                    </button>
                  </nav>

                  {/* Sección académica */}
                  <nav className="space-y-1">
                    <p className="px-1 pb-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Académico
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate("/categorias")}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Categorías</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/facultades")}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition"
                    >
                      <GraduationCap className="h-4 w-4" />
                      <span>Facultades</span>
                    </button>
                  </nav>
                </div>
              </aside>
            )}

            {/* Botón hamburguesa incrustado en el borde derecho del contenedor */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen((v) => !v)}
              className="absolute top-4 -right-4 h-8 w-8 rounded-full border bg-card shadow-[var(--shadow-sm)] flex items-center justify-center hover:bg-muted transition"
              title={isSidebarOpen ? "Ocultar menú" : "Mostrar menú"}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          {/* CONTENIDO CENTRAL */}
          <section
            className={cn(
              "flex-1 flex flex-col gap-4 transition-all duration-200",
              !isSidebarOpen && "max-w-4xl mx-auto"
            )}
          >
            {children}
          </section>
        </div>
      </div>
      <ChatWidget />
    </div>
  );
};

export default AppLayout;
