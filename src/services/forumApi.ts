// src/services/forumApi.ts

import {
  CATEGORIES,
  FACULTIES,
  INITIAL_POSTS,
  CURRENT_USER,
  INITIAL_COMMENTS,
  USERS,
  COURSES,
} from "@/data/forumData";
import {
  Category,
  Faculty,
  Post,
  User,
  CategoryId,
  FacultyId,
  Comment,
  Course,
  Report,
  ReportReason,
  Notification,
} from "@/types/forum";

export type CreatePostInput = {
  title: string;
  content: string;
  categoryId: CategoryId;
  facultyId: FacultyId;
  // curso opcional
  courseId?: string;
};

export type UpdatePostInput = {
  id: string;
  title?: string;
  content?: string;
  categoryId?: CategoryId;
  facultyId?: FacultyId;
  courseId?: string | null;
};

export type CreateCommentInput = {
  postId: string;
  content: string;
  parentCommentId?: string;
};

export type UpdateCommentInput = {
  id: string;
  content: string;
};

export type CreateReportInput = {
  postId: string;
  reason: ReportReason;
  details?: string;
};

export type LoginCredentials = {
  email: string;
};

// “Base de datos” en memoria
let posts: Post[] = [...INITIAL_POSTS];
let comments: Comment[] = [...INITIAL_COMMENTS];
let reports: Report[] = [];
let notifications: Notification[] = [];

// usuario actual (mock auth)
let currentUserId: string = CURRENT_USER.id;

const generatePostId = () =>
  `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const generateCommentId = () =>
  `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const generateReportId = () =>
  `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const generateNotificationId = () =>
  `n-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const forumApi = {
  // ---------- CATEGORÍAS ----------
  getCategories(): Category[] {
    return CATEGORIES;
  },

  // ---------- FACULTADES ----------
  getFaculties(): Faculty[] {
    return FACULTIES;
  },

  getFacultyById(id: FacultyId): Faculty | undefined {
    return FACULTIES.find((f) => f.id === id);
  },

  // ---------- CURSOS ----------
  getCourses(): Course[] {
    return COURSES;
  },

  getCoursesByFaculty(facultyId: FacultyId): Course[] {
    return COURSES.filter((c) => c.facultyId === facultyId);
  },

  // ---------- USUARIOS / AUTH MOCK ----------
  getUsers(): User[] {
    return USERS;
  },

  getCurrentUser(): User {
    const found = USERS.find((u) => u.id === currentUserId);

    const base = found ?? CURRENT_USER;

    // Aseguramos campos nuevos con valores por defecto para compatibilidad
    return {
      ...base,
      createdAt: base.createdAt ?? new Date().toISOString(),
      bio: base.bio ?? "",
      avatarUrl: base.avatarUrl ?? "/images/default-avatar.png",
      bannerUrl: base.bannerUrl ?? "/images/default-banner.jpg",
    };
  },

  login(credentials: LoginCredentials): User {
    const user = USERS.find(
      (u) =>
        u.email?.toLowerCase() === credentials.email.toLowerCase().trim()
    );

    if (!user) {
      throw new Error("Usuario no encontrado. Usa un correo registrado.");
    }

    currentUserId = user.id;
    return this.getCurrentUser();
  },

  logout(): void {
    currentUserId = CURRENT_USER.id;
  },

  updateUserProfile(userId: string, data: Partial<User>): User {
    const index = USERS.findIndex((u) => u.id === userId);
    if (index === -1) {
      throw new Error("Usuario no encontrado");
    }

    USERS[index] = {
      ...USERS[index],
      ...data,
    };

    if (currentUserId === userId) {
      return this.getCurrentUser();
    }

    return {
      ...USERS[index],
      createdAt: USERS[index].createdAt ?? new Date().toISOString(),
      bio: USERS[index].bio ?? "",
      avatarUrl: USERS[index].avatarUrl ?? "/images/default-avatar.png",
      bannerUrl: USERS[index].bannerUrl ?? "/images/default-banner.jpg",
    };
  },

  // ---------- POSTS ----------
  getPosts(): Post[] {
    return posts;
  },

  getPostById(id: string): Post | undefined {
    return posts.find((p) => p.id === id);
  },

  getPostsByCategory(categoryId: CategoryId): Post[] {
    return posts.filter((p) => p.categoryId === categoryId);
  },

  getPostsByFaculty(facultyId: FacultyId): Post[] {
    return posts.filter((p) => p.facultyId === facultyId);
  },

  createPost(input: CreatePostInput): Post {
    const now = new Date().toISOString();
    const currentUser = this.getCurrentUser();

    const newPost: Post = {
      id: generatePostId(),
      title: input.title,
      content: input.content,
      categoryId: input.categoryId,
      facultyId: input.facultyId,
      author: currentUser.name,
      createdAt: now,
      courseId: input.courseId,
    };

    posts = [newPost, ...posts];
    return newPost;
  },

  updatePost(input: UpdatePostInput): Post | undefined {
    const idx = posts.findIndex((p) => p.id === input.id);
    if (idx === -1) return undefined;

    const current = posts[idx];
    const updated: Post = {
      ...current,
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.content !== undefined ? { content: input.content } : {}),
      ...(input.categoryId !== undefined
        ? { categoryId: input.categoryId }
        : {}),
      ...(input.facultyId !== undefined
        ? { facultyId: input.facultyId }
        : {}),
      ...(input.courseId !== undefined ? { courseId: input.courseId } : {}),
    };

    posts[idx] = updated;
    return updated;
  },

  deletePost(id: string): void {
    posts = posts.filter((p) => p.id !== id);
    // eliminamos también comentarios de ese post
    comments = comments.filter((c) => c.postId !== id);
    // y reportes de ese post
    reports = reports.filter((r) => r.postId !== id);
  },

  // ---------- COMMENTS ----------
  getCommentsByPostId(postId: string): Comment[] {
    return comments
      .filter((c) => c.postId === postId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  },

  createComment(input: CreateCommentInput): Comment {
    const now = new Date().toISOString();
    const currentUser = this.getCurrentUser();

    const newComment: Comment = {
      id: generateCommentId(),
      postId: input.postId,
      content: input.content.trim(),
      parentCommentId: input.parentCommentId,
      author: currentUser.name,
      createdAt: now,
    };

    comments = [...comments, newComment];

    // ---------- NOTIFICACIONES POR RESPUESTA ----------

    // 1) Respuesta a otro comentario
    if (input.parentCommentId) {
      const parent = comments.find((c) => c.id === input.parentCommentId);
      if (parent && parent.author !== currentUser.name) {
        const targetUser = USERS.find((u) => u.name === parent.author);
        if (targetUser) {
          const notification: Notification = {
            id: generateNotificationId(),
            userId: targetUser.id,
            type: "reply",
            createdAt: now,
            read: false,
            data: {
              postId: input.postId,
              commentId: newComment.id,
              fromUser: currentUser.name,
              message: `${currentUser.name} respondió a tu comentario.`,
            },
          };
          notifications = [notification, ...notifications];
        }
      }
    }

    // 2) Comentario en una publicación de otra persona
    const post = this.getPostById(input.postId);
    if (post && post.author !== currentUser.name) {
      const postAuthorUser = USERS.find((u) => u.name === post.author);
      if (postAuthorUser) {
        const notification: Notification = {
          id: generateNotificationId(),
          userId: postAuthorUser.id,
          type: "reply",
          createdAt: now,
          read: false,
          data: {
            postId: post.id,
            commentId: newComment.id,
            fromUser: currentUser.name,
            message: `${currentUser.name} comentó tu publicación.`,
          },
        };
        notifications = [notification, ...notifications];
      }
    }

    return newComment;
  },

  updateComment(input: UpdateCommentInput): Comment | undefined {
    const idx = comments.findIndex((c) => c.id === input.id);
    if (idx === -1) return undefined;

    const updated: Comment = {
      ...comments[idx],
      content: input.content.trim(),
    };

    comments[idx] = updated;
    return updated;
  },

  deleteComment(id: string): void {
    // Eliminamos también todas las respuestas encadenadas
    const toDelete = new Set<string>();
    const stack: string[] = [id];

    while (stack.length > 0) {
      const current = stack.pop() as string;
      toDelete.add(current);

      comments
        .filter((c) => c.parentCommentId === current)
        .forEach((child) => {
          if (!toDelete.has(child.id)) {
            stack.push(child.id);
          }
        });
    }

    comments = comments.filter((c) => !toDelete.has(c.id));
  },

  // ---------- REPORTES ----------
  createReport(input: CreateReportInput): Report {
    const now = new Date().toISOString();

    const newReport: Report = {
      id: generateReportId(),
      postId: input.postId,
      reason: input.reason,
      details: input.details?.trim() || undefined,
      createdAt: now,
    };

    reports = [...reports, newReport];
    return newReport;
  },

  getReportsByPostId(postId: string): Report[] {
    return reports
      .filter((r) => r.postId === postId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  },

  getPostReportCount(postId: string): number {
    return reports.filter((r) => r.postId === postId).length;
  },

  // ---------- NOTIFICACIONES ----------
  getNotificationsForUser(userId: string): Notification[] {
    return notifications
      .filter((n) => n.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  getUnreadNotificationCount(userId: string): number {
    return notifications.filter((n) => n.userId === userId && !n.read).length;
  },

  markNotificationAsRead(id: string): void {
    const idx = notifications.findIndex((n) => n.id === id);
    if (idx !== -1) {
      notifications[idx] = { ...notifications[idx], read: true };
    }
  },

  markAllNotificationsAsRead(userId: string): void {
    notifications = notifications.map((n) =>
      n.userId === userId ? { ...n, read: true } : n
    );
  },
};
