import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-8xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-semibold">Página no encontrada</h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Button 
          size="lg"
          onClick={() => navigate("/")}
          className="gap-2 bg-gradient-to-r from-primary to-primary-dark hover:opacity-90"
        >
          <Home className="h-4 w-4" />
          Volver al Inicio
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
