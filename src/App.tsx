import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Faculties from "./pages/Faculties";
import Profile from "./pages/Index";
import NotFound from "./pages/NotFound";
import NewPost from "./pages/NewPost";
import PostsList from "./pages/PostsList";
import PostDetail from "./pages/PostDetail";
import CategoryDetail from "./pages/CategoryDetail";
import FacultyDetail from "./pages/FacultyDetail";
import Login from "./pages/Login";
import Sobre from "@/pages/Sobre";

import { ForumProvider, useForum } from "./context/ForumContext";
import AppLayout from "./components/AppLayout";

const queryClient = new QueryClient();

// Ruta protegida
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useForum();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Wrapper para /login: si ya estás autenticado, te manda a "/"
const LoginWrapper = () => {
  const { isAuthenticated } = useForum();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Login />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ForumProvider>
        <>
          <Toaster />
          <Sonner />
        </>
        <BrowserRouter>
          <Routes>
            {/* Login sin layout */}
            <Route path="/login" element={<LoginWrapper />} />

            {/* Todas las demás rutas usan ProtectedRoute + AppLayout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Home />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/categorias"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Categories />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/categorias/:categoryId"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CategoryDetail />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/facultades"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Faculties />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/facultades/:facultyId"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <FacultyDetail />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/nueva-publicacion"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <NewPost />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/publicaciones"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <PostsList />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/publicaciones/:postId"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <PostDetail />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* CATCH-ALL */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <NotFound />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sobre"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Sobre />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </ForumProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
