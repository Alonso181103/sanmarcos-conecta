// src/components/ThemeToggle.tsx

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("relative", className)}
      onClick={toggleTheme}
      aria-label="Cambiar tema"
    >
      {/* Sol */}
      <Sun
        className={cn(
          "h-4 w-4 transition-transform duration-200",
          theme === "dark" && "scale-0"
        )}
      />
      {/* Luna */}
      <Moon
        className={cn(
          "h-4 w-4 absolute inset-0 m-auto transition-transform duration-200",
          theme === "light" && "scale-0"
        )}
      />
    </Button>
  );
};

export default ThemeToggle;
