// src/components/Header.tsx

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import {
  Bell,
  GraduationCap,
  PenSquare,
  LogOut,
  Search,
  User as UserIcon,
  Moon,
  Sun,
  Settings,
} from "lucide-react";

import { useForum } from "@/context/ForumContext";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";
const THEME_STORAGE_KEY = "smc-theme";

const BASE = import.meta.env.BASE_URL; // "/" en local, "/sanmarcos-conecta/" en GH Pages
const DEFAULT_AVATAR = `${BASE}images/default-avatar.png`;

function normalizeImageUrl(input?: string) {
  const url = (input ?? "").trim();
  if (!url) return DEFAULT_AVATAR;

  // data-uri o url externa
  if (url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // ✅ Si ya es absoluta desde el dominio (ej: "/sanmarcos-conecta/images/x.png")
  // déjala tal cual. (Esto evita el duplicado)
  if (url.startsWith("/")) {
    // Caso especial: "/images/x.png" NO sirve en GH Pages (raíz del dominio),
    // entonces lo convertimos a BASE + "images/x.png"
    if (url.startsWith("/images/")) return `${BASE}${url.slice(1)}`;
    return url;
  }

  // Si ya incluye BASE (ej: "sanmarcos-conecta/images/x.png" o "/sanmarcos-conecta/..." no aplica aquí)
  if (url.startsWith(BASE)) return url;

  // "images/x.png"
  if (url.startsWith("images/")) return `${BASE}${url}`;

  // "default-avatar.png" pelado
  return `${BASE}images/${url}`;
}

const Header = () => {
  const navigate = useNavigate();

  const {
    currentUser,
    logout,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useForum();

  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState<Theme>("light");

  const avatarSrc = useMemo(() => normalizeImageUrl(currentUser.avatarUrl), [currentUser.avatarUrl]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      let initial: Theme = "light";

      if (stored === "light" || stored === "dark") {
        initial = stored;
      } else if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
        initial = "dark";
      }

      setTheme(initial);
      document.documentElement.classList.toggle("dark", initial === "dark");
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;
    navigate(`/publicaciones?q=${term}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur-xl shadow-subtle supports-[backdrop-filter]:bg-background/40">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        <div className="flex shrink-0 items-center gap-2">
          <Link to="/" className="group flex items-center gap-2 transition-all hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-accent text-primary-foreground shadow-soft">
              <GraduationCap className="h-4 w-4" />
            </div>

            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-semibold">San Marcos Conecta</p>
              <p className="text-[11px] text-muted-foreground">Foro académico de la UNMSM</p>
            </div>
          </Link>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <form onSubmit={handleSearchSubmit} className="w-full max-w-xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar en San Marcos Conecta..."
                className={cn(
                  "h-10 rounded-xl border border-muted/40 bg-muted/60 pl-10 shadow-subtle backdrop-blur-sm transition-all",
                  "focus:shadow-md focus:border-primary/50"
                )}
              />
            </div>
          </form>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            className="hidden rounded-xl bg-gradient-to-r from-primary to-primary/80 px-3 text-xs font-medium shadow-soft hover:shadow-soft-lg sm:inline-flex"
            onClick={() => navigate("/nueva-publicacion")}
          >
            <PenSquare className="h-4 w-4" />
            Nueva publicación
          </Button>

          <Button
            type="button"
            size="icon"
            className="inline-flex h-9 w-9 rounded-xl bg-primary text-primary-foreground shadow-soft hover:shadow-soft-lg sm:hidden"
            onClick={() => navigate("/nueva-publicacion")}
          >
            <PenSquare className="h-4 w-4" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border bg-background shadow-subtle transition-all hover:shadow-soft"
              >
                <Bell className="h-4 w-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white shadow-soft">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-80 rounded-xl border bg-background p-3 shadow-soft-lg backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold">Notificaciones</p>
                {unreadNotificationsCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-primary hover:underline"
                  >
                    Marcar todas
                  </button>
                )}
              </div>

              {notifications.length === 0 && (
                <p className="py-2 text-xs text-muted-foreground">No tienes notificaciones.</p>
              )}

              {notifications.length > 0 && (
                <div className="max-h-[320px] space-y-2 overflow-y-auto">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      className={cn(
                        "w-full rounded-xl border px-3 py-2 text-left text-xs transition-all hover:bg-muted/70 hover:shadow-subtle",
                        !n.read && "border-primary/30 bg-primary/5"
                      )}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        navigate(`/publicaciones/${n.data.postId}`);
                      }}
                    >
                      <p>
                        <span className="font-medium">{n.data.fromUser}</span> {n.data.message}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {new Date(n.createdAt).toLocaleString("es-PE", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border bg-card shadow-subtle transition-all hover:shadow-soft"
              >
                <img
                  src={avatarSrc}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                  }}
                  alt={currentUser.name}
                  className="h-full w-full object-cover"
                />
              </button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-64 rounded-xl border bg-background p-3 shadow-soft-lg backdrop-blur-xl text-xs">
              <div className="mb-2 flex items-center gap-2 border-b pb-2">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                  <img
                    src={avatarSrc}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                    }}
                    alt={currentUser.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold">{currentUser.name}</p>
                  {currentUser.email && (
                    <p className="text-[11px] text-muted-foreground">{currentUser.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs transition hover:bg-muted/60"
                  onClick={() => navigate("/perfil")}
                >
                  <UserIcon className="h-4 w-4" /> Ver mi perfil
                </button>

                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs transition hover:bg-muted/60"
                  onClick={toggleTheme}
                >
                  {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  Tema
                </button>

                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs transition hover:bg-muted/60"
                  onClick={() => alert("Sección en desarrollo.")}
                >
                  <Settings className="h-4 w-4" /> Configuración
                </button>

                <button
                  type="button"
                  className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/40"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" /> Cerrar sesión
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="border-t border-border/60 bg-background/95 px-4 pb-3 pt-1 md:hidden">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar en el foro..."
              className="h-10 rounded-xl bg-muted pl-9 shadow-subtle focus:shadow-md"
            />
          </div>
        </form>
      </div>
    </header>
  );
};

export default Header;
