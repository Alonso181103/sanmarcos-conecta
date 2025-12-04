import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

const AcademicInfo = () => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Información Académica
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Facultad</p>
            <p className="font-medium">Facultad de Ingeniería de Sistemas e Informática</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Año de Ingreso</p>
            <p className="font-medium">2020-I</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Escuela Profesional</p>
            <p className="font-medium">Ingeniería de Software</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AcademicInfo;
