// src/types/forum.ts

export type CategoryId =
  | "discusiones"
  | "talleres"
  | "apuntes"
  | "investigacion"
  | "eventos"
  | "recursos";

export type FacultyId =
  | "medicina"
  | "derecho"
  | "ingenieria-sistemas"
  | "ciencias"
  | "administracion"
  | "fiee";

export interface Category {
  id: CategoryId;
  title: string;
  description: string;
  // gradiente de color (Tailwind) para las tarjetas
  color: string;
  // nombre del ícono de lucide-react que se usará en la UI
  iconName: string;
}

export interface Faculty {
  id: FacultyId;
  name: string;
  shortName: string;
  students: number;
  schools: string[];
  // gradiente de color (Tailwind)
  color: string;
  // emoji usado en las tarjetas
  emoji: string;
}

// Cursos/asignaturas
export interface Course {
  id: string;
  code: string;       // p.ej. "SIS-101"
  name: string;       // p.ej. "Introducción a la Programación"
  facultyId: FacultyId;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  categoryId: CategoryId;
  facultyId: FacultyId;
  author: string;
  createdAt: string; // ISO string
  // curso opcional asociado a la publicación
  courseId?: string;
}

// src/types/forum.ts

export interface User {
  id: string;
  name: string;
  facultyId: FacultyId;
  program: string;
  email?: string;

  /** Fecha de creación del usuario (opcional para compatibilidad) */
  createdAt?: string;

  /** Bio del usuario */
  bio?: string;

  /** Avatar del usuario */
  avatarUrl?: string;

  /** Banner del usuario */
  bannerUrl?: string;

  /** Intereses académicos, separados por comas */
  interests?: string;

  /** Hobbies y pasatiempos, separados por comas */
  hobbies?: string;

  /** Teléfono de contacto */
  phone?: string;

  /** Ubicación del usuario (ciudad, distrito, etc.) */
  location?: string;

  /** Indica si el usuario está bloqueado (mock moderación) */
  isBlocked?: boolean;
}

// Comentarios del foro
export interface Comment {
  id: string;
  postId: string;
  author: string;      // por ahora solo el nombre, igual que en Post
  content: string;
  createdAt: string;   // ISO string
  parentCommentId?: string; // para respuestas a otros comentarios (opcional)
}

// ---------- Reportes ----------

export type ReportReason =
  | "spam"
  | "contenido-inapropiado"
  | "fuera-de-tema"
  | "otro";

export interface Report {
  id: string;
  postId: string;
  reason: ReportReason;
  details?: string;
  createdAt: string; // ISO
}

// ---------- Notificaciones ----------

export type NotificationType = "reply" | "vote" | "system";

export interface Notification {
  id: string;
  /** Usuario receptor de la notificación (id del User) */
  userId: string;
  type: NotificationType;
  createdAt: string; // ISO
  read: boolean;
  data: {
    /** Post relacionado con la notificación */
    postId: string;
    /** Comentario relacionado, si aplica (respuesta, voto sobre comentario, etc.) */
    commentId?: string;
    /** Quién generó la acción (nombre del usuario) */
    fromUser: string;
    /** Mensaje amigable para mostrar en el UI */
    message: string;
  };
}
