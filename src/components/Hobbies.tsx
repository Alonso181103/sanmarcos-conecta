import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Music, Camera, Book, Dumbbell, Plane, Coffee, Code } from "lucide-react";

const Hobbies = () => {
  const hobbies = [
    { name: "Fotografía", icon: Camera, color: "text-purple-500" },
    { name: "Lectura", icon: Book, color: "text-blue-500" },
    { name: "Música", icon: Music, color: "text-pink-500" },
    { name: "Programación", icon: Code, color: "text-green-500" },
    { name: "Deportes", icon: Dumbbell, color: "text-orange-500" },
    { name: "Viajar", icon: Plane, color: "text-cyan-500" },
    { name: "Arte", icon: Palette, color: "text-red-500" },
    { name: "Café & Charlas", icon: Coffee, color: "text-amber-500" }
  ];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          Hobbies y Pasatiempos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {hobbies.map((hobby, index) => {
            const Icon = hobby.icon;
            return (
              <div 
                key={index}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 hover:from-primary/5 hover:to-accent/5 transition-all cursor-default"
              >
                <Icon className={`h-6 w-6 ${hobby.color}`} />
                <span className="text-xs font-medium text-center">{hobby.name}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Hobbies;
