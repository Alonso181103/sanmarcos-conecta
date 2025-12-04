// src/data/forumData.ts

import { Category, Faculty, Post, User, Comment, Course } from "@/types/forum";

export const CATEGORIES: Category[] = [
  {
    id: "discusiones",
    title: "Discusiones",
    description:
      "Participa en debates académicos y comparte tus opiniones con otros estudiantes.",
    color: "from-blue-500 to-blue-600",
    iconName: "MessageSquare",
  },
  {
    id: "talleres",
    title: "Talleres",
    description: "Descubre y comparte talleres y actividades prácticas.",
    color: "from-purple-500 to-purple-600",
    iconName: "Lightbulb",
  },
  {
    id: "apuntes",
    title: "Apuntes y Materiales",
    description: "Comparte tus apuntes, resúmenes y material de estudio.",
    color: "from-emerald-500 to-emerald-600",
    iconName: "BookOpen",
  },
  {
    id: "investigacion",
    title: "Investigación",
    description:
      "Conecta con grupos de investigación y comparte avances de tus proyectos.",
    color: "from-amber-500 to-amber-600",
    iconName: "Users",
  },
  {
    id: "eventos",
    title: "Eventos Académicos",
    description:
      "Infórmate sobre conferencias, seminarios y actividades académicas.",
    color: "from-rose-500 to-rose-600",
    iconName: "Calendar",
  },
  {
    id: "recursos",
    title: "Recursos Recomendados",
    description: "Comparte libros, cursos, videos y herramientas útiles.",
    color: "from-indigo-500 to-indigo-600",
    iconName: "FileText",
  },
];

export const FACULTIES: Faculty[] = [
  {
    id: "medicina",
    name: "Facultad de Medicina",
    shortName: "Medicina",
    students: 3200,
    schools: ["Medicina Humana", "Obstetricia", "Enfermería", "Tecnología Médica"],
    color: "from-red-500 to-red-600",
    emoji: "🏥",
  },
  {
    id: "derecho",
    name: "Facultad de Derecho y Ciencia Política",
    shortName: "Derecho",
    students: 2800,
    schools: ["Derecho", "Ciencia Política"],
    color: "from-blue-500 to-blue-600",
    emoji: "⚖️",
  },
  {
    id: "ingenieria-sistemas",
    name: "Facultad de Ingeniería de Sistemas e Informática",
    shortName: "FISI",
    students: 2200,
    schools: [
      "Ingeniería de Sistemas",
      "Ingeniería de Software",
      "Ciencia de la Computación",
    ],
    color: "from-sky-500 to-sky-600",
    emoji: "💻",
  },
  {
    id: "ciencias",
    name: "Facultad de Ciencias",
    shortName: "Ciencias",
    students: 2500,
    schools: ["Matemáticas", "Física", "Química", "Estadística"],
    color: "from-green-500 to-green-600",
    emoji: "🔬",
  },
  {
    id: "administracion",
    name: "Facultad de Ciencias Administrativas",
    shortName: "Administración",
    students: 2600,
    schools: ["Administración", "Turismo", "Marketing"],
    color: "from-purple-500 to-purple-600",
    emoji: "💼",
  },
  {
    id: "fiee",
    name: "Facultad de Ingeniería Electrónica y Eléctrica",
    shortName: "FIEE",
    students: 1700,
    schools: [
      "Ingeniería Electrónica",
      "Ingeniería Eléctrica",
      "Ingeniería de Telecomunicaciones",
    ],
    color: "from-orange-500 to-orange-600",
    emoji: "⚡",
  },
];

// 🔹 Cursos por facultad
export const COURSES: Course[] = [
  // FISI
  {
    id: "sis101",
    code: "SIS-101",
    name: "Introducción a la Programación",
    facultyId: "ingenieria-sistemas",
  },
  {
    id: "sis201",
    code: "SIS-201",
    name: "Estructuras de Datos",
    facultyId: "ingenieria-sistemas",
  },
  {
    id: "sis301",
    code: "SIS-301",
    name: "Bases de Datos",
    facultyId: "ingenieria-sistemas",
  },
  // Ciencias
  {
    id: "mat101",
    code: "MAT-101",
    name: "Cálculo I",
    facultyId: "ciencias",
  },
  {
    id: "mat201",
    code: "MAT-201",
    name: "Álgebra Lineal",
    facultyId: "ciencias",
  },
  // Medicina
  {
    id: "med101",
    code: "MED-101",
    name: "Anatomía Humana I",
    facultyId: "medicina",
  },
  // Derecho
  {
    id: "der101",
    code: "DER-101",
    name: "Introducción al Derecho",
    facultyId: "derecho",
  },
];

export const USERS: User[] = [
  {
    id: "user-1",
    name: "Alonso Moreno",
    facultyId: "ingenieria-sistemas",
    program: "Ingeniería de Sistemas",
    email: "alonso.moreno@unmsm.edu.pe",
  },
  {
    id: "user-2",
    name: "María López",
    facultyId: "ciencias",
    program: "Matemáticas",
    email: "maria.lopez@unmsm.edu.pe",
  },
  {
    id: "user-3",
    name: "Carlos Pérez",
    facultyId: "ingenieria-sistemas",
    program: "Ingeniería de Software",
    email: "carlos.perez@unmsm.edu.pe",
  },
  {
    id: "user-4",
    name: "Ana Castillo",
    facultyId: "medicina",
    program: "Medicina Humana",
    email: "ana.castillo@unmsm.edu.pe",
  },
];

export const CURRENT_USER: User = USERS[0];

export const INITIAL_POSTS: Post[] = [
  {
    id: "p1",
    title: "Duda sobre integrales en Cálculo I",
    content:
      "Hola, ¿alguien podría explicar la diferencia entre integral definida e indefinida con un ejemplo relacionado a física?",
    categoryId: "discusiones",
    facultyId: "ciencias",
    author: "María López",
    createdAt: new Date().toISOString(),
    courseId: "mat101",
  },
  {
    id: "p2",
    title: "Apuntes de Álgebra Lineal – FISI 2025-I",
    content:
      "Comparto mis apuntes de Álgebra Lineal (espacios vectoriales, transformaciones lineales y autovalores). Si alguien tiene ejercicios resueltos, sería genial que los comparta.",
    categoryId: "apuntes",
    facultyId: "ingenieria-sistemas",
    author: "Alonso Moreno",
    createdAt: new Date().toISOString(),
    courseId: "mat201",
  },
  {
    id: "p3",
    title: "Taller de introducción a Git y GitHub",
    content:
      "Este sábado tendremos un taller introductorio a control de versiones con Git y GitHub para alumnos de primer ciclo.",
    categoryId: "talleres",
    facultyId: "ingenieria-sistemas",
    author: "Carlos Pérez",
    createdAt: new Date().toISOString(),
    courseId: "sis101",
  },
  {
    id: "p4",
    title: "Convocatoria a grupo de investigación en IA aplicada a salud",
    content:
      "Estamos formando un grupo de investigación para trabajar en proyectos de IA aplicada a imágenes médicas. Buscamos estudiantes de Ciencias y Medicina.",
    categoryId: "investigacion",
    facultyId: "medicina",
    author: "Ana Castillo",
    createdAt: new Date().toISOString(),
    courseId: "med101",
  },
];

// Comentarios iniciales
export const INITIAL_COMMENTS: Comment[] = [
  {
    id: "c1",
    postId: "p1",
    author: "Juan Pérez",
    content:
      "La integral definida se usa cuando tienes límites y quieres un valor numérico, por ejemplo el área bajo la curva entre a y b. La indefinida es más general, te da una familia de funciones.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "c2",
    postId: "p1",
    author: "Lucía Fernández",
    content:
      "Piensa en la integral indefinida como la operación inversa de derivar. Cuando le pones límites, se convierte en definida y puedes interpretarla como área.",
    createdAt: new Date().toISOString(),
    parentCommentId: "c1", // 🔹 ejemplo de respuesta anidada
  },
  {
    id: "c3",
    postId: "p2",
    author: "Carlos Pérez",
    content:
      "Gracias por los apuntes, justo estaba buscando algo así para repasar antes del parcial 😅.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "c4",
    postId: "p3",
    author: "María López",
    content:
      "¿El taller será grabado? Algunos no podremos asistir por choque de horario.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "c5",
    postId: "p4",
    author: "Diego Ramos",
    content:
      "¿También aceptan estudiantes de Ingeniería de Sistemas interesados en IA médica?",
    createdAt: new Date().toISOString(),
  },
];
