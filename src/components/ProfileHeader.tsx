import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil } from "lucide-react";

const ProfileHeader = () => {
  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <div className="h-32 bg-gradient-to-r from-primary via-primary-dark to-accent"></div>
      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-16">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
              alt="Ana María Rodríguez Torres"
              className="h-32 w-32 rounded-full border-4 border-card object-cover shadow-lg"
            />
            <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-green-500 border-4 border-card"></div>
          </div>
          
          <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
            <h1 className="text-3xl font-bold">Ana María Rodríguez Torres</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2 text-muted-foreground">
              <span className="text-primary font-semibold">20201234</span>
              <span>•</span>
              <span>8vo Ciclo</span>
              <span>•</span>
              <span>Ingeniería de Software</span>
            </div>
          </div>
          
          <Button className="gap-2 bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 transition-opacity">
            <Pencil className="h-4 w-4" />
            Editar Perfil
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;
