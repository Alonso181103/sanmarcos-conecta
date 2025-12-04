// src/context/ForumContext.tsx

import { createContext, useContext, useState, ReactNode, useMemo } from "react";

import {
  forumApi,
  CreatePostInput,
  CreateCommentInput,
  LoginCredentials,
  CreateReportInput,
} from "@/services/forumApi";

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
  Notification,
} from "@/types/forum";

interface ForumContextValue {
  // Datos base
  posts: Post[];
  categories: Category[];
  faculties: Faculty[];
  courses: Course[];
  currentUser: User;

  // Posts CRUD
  createPost: (input: CreatePostInput) => Post;
  updatePost: (
    id: string,
    data: {
      title: string;
      content: string;
      categoryId: CategoryId;
      facultyId: FacultyId;
      courseId?: string;
    }
  ) => Post | undefined;
  deletePost: (id: string) => void;

  getPostById: (id: string) => Post | undefined;
  getPostsByCategory: (categoryId: CategoryId) => Post[];
  getPostsByFaculty: (facultyId: FacultyId) => Post[];
  getCategoryById: (id: CategoryId) => Category | undefined;
  getFacultyById: (id: FacultyId) => Faculty | undefined;

  // Comentarios
  getCommentsByPostId: (postId: string) => Comment[];
  createComment: (input: CreateCommentInput) => Comment;
  updateComment: (id: string, content: string) => Comment | undefined;
  deleteComment: (id: string) => void;

  // Reportes
  createReport: (input: CreateReportInput) => Report;
  getReportsByPostId: (postId: string) => Report[];
  getPostReportCount: (postId: string) => number;

  // Auth
  users: User[];
  login: (credentials: LoginCredentials) => User;
  logout: () => void;
  isAuthenticated: boolean;

  // Cursos
  getCoursesByFaculty: (facultyId: FacultyId) => Course[];

  // Guardados
  savedPosts: string[];
  isPostSaved: (postId: string) => boolean;
  toggleSavePost: (postId: string) => void;

  // Votos posts
  getPostScore: (postId: string) => number;
  getUserPostVote: (postId: string) => 1 | -1 | 0;
  votePost: (postId: string, value: 1 | -1) => void;

  // Votos comentarios
  getCommentScore: (commentId: string) => number;
  getUserCommentVote: (commentId: string) => 1 | -1 | 0;
  voteComment: (commentId: string, value: 1 | -1) => void;

  // Perfil
  updateUserProfile: (data: Partial<User>) => User;

  // 🔔 Notificaciones
  notifications: Notification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const ForumContext = createContext<ForumContextValue | undefined>(undefined);

/**
 * En local: BASE_URL = "/"
 * En GitHub Pages: BASE_URL = "/<repo>/"
 */
const BASE = import.meta.env.BASE_URL;
const DEFAULT_AVATAR_URL = `${BASE}images/default-avatar.png`;
const DEFAULT_BANNER_URL = `${BASE}images/default-banner.jpg`;

/**
 * Normaliza rutas que vengan en user.avatarUrl/bannerUrl para que
 * funcionen bien en GitHub Pages.
 *
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

  if (trimmed.startsWith("/")) return `${BASE}${trimmed.slice(1)}`; // "/images/x" -> `${BASE}images/x`
  if (trimmed.startsWith("images/")) return `${BASE}${trimmed}`; // "images/x" -> `${BASE}images/x`

  // "default-avatar.png" -> `${BASE}images/default-avatar.png`
  return `${BASE}images/${trimmed}`;
};

const withDefaultImages = (user: User): User => ({
  ...user,
  avatarUrl: normalizePublicImage(user.avatarUrl) ?? DEFAULT_AVATAR_URL,
  bannerUrl: normalizePublicImage(user.bannerUrl) ?? DEFAULT_BANNER_URL,
});

export const ForumProvider = ({ children }: { children: ReactNode }) => {
  // Base
  const [posts, setPosts] = useState<Post[]>(() => forumApi.getPosts());
  const categories = useMemo(() => forumApi.getCategories(), []);
  const faculties = useMemo(() => forumApi.getFaculties(), []);
  const [courses] = useState<Course[]>(() => forumApi.getCourses());
  const [currentUser, setCurrentUser] = useState<User>(() =>
    withDefaultImages(forumApi.getCurrentUser())
  );
  const [users] = useState<User[]>(() => forumApi.getUsers());

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Versiones para recargar comentarios / reportes
  const [commentsVersion, setCommentsVersion] = useState(0);
  const [reportsVersion, setReportsVersion] = useState(0);

  // Guardados
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  // Votos
  const [postVotes, setPostVotes] = useState<Record<string, 1 | -1>>({});
  const [commentVotes, setCommentVotes] = useState<Record<string, 1 | -1>>({});

  // 🔔 Notificaciones
  const [notificationsVersion, setNotificationsVersion] = useState(0);

  const notifications = forumApi.getNotificationsForUser(currentUser.id);
  const unreadNotificationsCount = forumApi.getUnreadNotificationCount(
    currentUser.id
  );

  // ---------------------------
  // Posts
  // ---------------------------
  const createPost = (input: CreatePostInput) => {
    const p = forumApi.createPost(input);
    setPosts((prev) => [p, ...prev]);
    return p;
  };

  const updatePost = (id: string, data: any) => {
    const updated = forumApi.updatePost({ id, ...data });
    if (updated) {
      setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    }
    return updated;
  };

  const deletePost = (id: string) => {
    forumApi.deletePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setCommentsVersion((v) => v + 1);
    setReportsVersion((v) => v + 1);
  };

  const getPostById = (id: string) => posts.find((p) => p.id === id);
  const getPostsByCategory = (categoryId: CategoryId) =>
    posts.filter((p) => p.categoryId === categoryId);
  const getPostsByFaculty = (facultyId: FacultyId) =>
    posts.filter((p) => p.facultyId === facultyId);

  const getCategoryById = (id: CategoryId) => categories.find((c) => c.id === id);
  const getFacultyById = (id: FacultyId) => faculties.find((f) => f.id === id);

  // ---------------------------
  // Comentarios
  // ---------------------------
  const getCommentsByPostId = (postId: string) => {
    void commentsVersion;
    return forumApi.getCommentsByPostId(postId);
  };

  const createComment = (input: CreateCommentInput) => {
    const c = forumApi.createComment(input);
    setCommentsVersion((v) => v + 1);
    setNotificationsVersion((v) => v + 1);
    return c;
  };

  const updateComment = (id: string, content: string) => {
    const c = forumApi.updateComment({ id, content });
    if (c) {
      setCommentsVersion((v) => v + 1);
    }
    return c;
  };

  const deleteComment = (id: string) => {
    forumApi.deleteComment(id);
    setCommentsVersion((v) => v + 1);
  };

  // ---------------------------
  // Reportes
  // ---------------------------
  const createReport = (input: CreateReportInput) => {
    const r = forumApi.createReport(input);
    setReportsVersion((v) => v + 1);
    return r;
  };

  const getReportsByPostId = (postId: string) => {
    void reportsVersion;
    return forumApi.getReportsByPostId(postId);
  };

  const getPostReportCount = (postId: string) => {
    void reportsVersion;
    return forumApi.getPostReportCount(postId);
  };

  // ---------------------------
  // Auth
  // ---------------------------
  const login = (credentials: LoginCredentials) => {
    const u = withDefaultImages(forumApi.login(credentials));
    setCurrentUser(u);
    setIsAuthenticated(true);
    setNotificationsVersion((v) => v + 1);
    return u;
  };

  const logout = () => {
    forumApi.logout();
    const u = withDefaultImages(forumApi.getCurrentUser());
    setCurrentUser(u);
    setIsAuthenticated(false);
  };

  // ---------------------------
  // Perfil
  // ---------------------------
  const updateUserProfile = (data: Partial<User>) => {
    // OJO: Normalizamos también lo que venga en data, por si guardas "default-avatar.png" etc.
    const fixedData: Partial<User> = { ...data };
    if (typeof fixedData.avatarUrl === "string") {
      fixedData.avatarUrl = normalizePublicImage(fixedData.avatarUrl);
    }
    if (typeof fixedData.bannerUrl === "string") {
      fixedData.bannerUrl = normalizePublicImage(fixedData.bannerUrl);
    }

    const u = withDefaultImages(forumApi.updateUserProfile(currentUser.id, fixedData));
    setCurrentUser(u);
    return u;
  };

  // ---------------------------
  // Cursos
  // ---------------------------
  const getCoursesByFaculty = (facultyId: FacultyId) =>
    forumApi.getCoursesByFaculty(facultyId);

  // ---------------------------
  // Guardados
  // ---------------------------
  const isPostSaved = (postId: string) => savedPosts.includes(postId);

  const toggleSavePost = (postId: string) => {
    setSavedPosts((prev) =>
      prev.includes(postId) ? prev.filter((p) => p !== postId) : [...prev, postId]
    );
  };

  // ---------------------------
  // Votos posts
  // ---------------------------
  const getUserPostVote = (postId: string) => postVotes[postId] ?? 0;

  const votePost = (postId: string, value: 1 | -1) => {
    setPostVotes((prev) => {
      const current = prev[postId] ?? 0;
      const next = { ...prev };

      if (current === value) delete next[postId];
      else next[postId] = value;

      return next;
    });
  };

  const getPostScore = (postId: string) => postVotes[postId] ?? 0;

  // ---------------------------
  // Votos comentarios
  // ---------------------------
  const getUserCommentVote = (id: string) => commentVotes[id] ?? 0;

  const voteComment = (id: string, value: 1 | -1) => {
    setCommentVotes((prev) => {
      const current = prev[id] ?? 0;
      const next = { ...prev };

      if (current === value) delete next[id];
      else next[id] = value;

      return next;
    });
  };

  const getCommentScore = (id: string) => commentVotes[id] ?? 0;

  // ---------------------------
  // 🔔 Notificaciones
  // ---------------------------
  const markNotificationAsRead = (id: string) => {
    forumApi.markNotificationAsRead(id);
    setNotificationsVersion((v) => v + 1);
  };

  const markAllNotificationsAsRead = () => {
    forumApi.markAllNotificationsAsRead(currentUser.id);
    setNotificationsVersion((v) => v + 1);
  };

  // ---------------------------
  // PROVIDER
  // ---------------------------
  const value: ForumContextValue = useMemo(
    () => ({
      posts,
      categories,
      faculties,
      courses,
      currentUser,

      createPost,
      updatePost,
      deletePost,

      getPostById,
      getPostsByCategory,
      getPostsByFaculty,
      getCategoryById,
      getFacultyById,

      getCommentsByPostId,
      createComment,
      updateComment,
      deleteComment,

      createReport,
      getReportsByPostId,
      getPostReportCount,

      users,
      login,
      logout,
      isAuthenticated,

      getCoursesByFaculty,

      savedPosts,
      isPostSaved,
      toggleSavePost,

      getPostScore,
      getUserPostVote,
      votePost,

      getCommentScore,
      getUserCommentVote,
      voteComment,

      updateUserProfile,

      // 🔔 Notificaciones
      notifications,
      unreadNotificationsCount,
      markNotificationAsRead,
      markAllNotificationsAsRead,
    }),
    [
      posts,
      categories,
      faculties,
      courses,
      currentUser,
      users,
      isAuthenticated,
      savedPosts,
      postVotes,
      commentVotes,
      commentsVersion,
      reportsVersion,
      notificationsVersion,
    ]
  );

  return <ForumContext.Provider value={value}>{children}</ForumContext.Provider>;
};

export const useForum = () => {
  const ctx = useContext(ForumContext);
  if (!ctx) throw new Error("useForum debe usarse dentro de ForumProvider");
  return ctx;
};
