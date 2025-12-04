// src/pages/Login.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForum } from "@/context/ForumContext";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { GraduationCap, LogIn } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { users, login } = useForum();

  const [selectedEmail, setSelectedEmail] = useState(
    users[0]?.email ?? ""
  );
  const [emailInput, setEmailInput] = useState(users[0]?.email ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const email = emailInput.trim();
    if (!email) {
      setError("Ingresa un correo institucional.");
      return;
    }

    try {
      setSubmitting(true);
      login({ email });
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo iniciar sesión."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectChange = (value: string) => {
    setSelectedEmail(value);
    setEmailInput(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="relative overflow-hidden border-0 shadow-[var(--shadow-lg)] bg-card/95">
          {/* banda decorativa arriba */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-primary/80 via-primary to-accent/80 opacity-80" />
          <div className="relative z-10">
            <CardHeader className="space-y-4 pb-4 pt-6 text-center">
              <div className="inline-flex items-center justify-center gap-2 rounded-full bg-background/80 px-4 py-1 text-xs text-primary shadow-[var(--shadow-sm)]">
                <GraduationCap className="h-4 w-4" />
                <span>San Marcos Conecta</span>
              </div>

              <div className="space-y-1">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  Inicia sesión
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Usa tu correo institucional para ingresar al foro
                  académico de la UNMSM.
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {users.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Seleccionar usuario 
                    </label>
                    <Select
                      value={selectedEmail}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Selecciona un usuario" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((u) => (
                          <SelectItem
                            key={u.id}
                            value={u.email ?? ""}
                            className="text-xs"
                          >
                            {u.name} – {u.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Correo institucional
                  </label>
                  <Input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="tucorreo@unmsm.edu.pe"
                    className="h-9 text-sm"
                  />
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary/85 text-sm font-medium shadow-[var(--shadow-md)] hover:opacity-90"
                >
                  <LogIn className="h-4 w-4" />
                  {submitting ? "Ingresando..." : "Ingresar al foro"}
                </Button>
              </form>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
