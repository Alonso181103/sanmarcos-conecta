import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

const Interests = () => {
  const interests = [
    "Desarrollo Web",
    "Inteligencia Artificial",
    "Machine Learning",
    "Ciberseguridad",
    "Cloud Computing",
    "UX/UI Design",
    "Emprendimiento Tech",
    "Datos Abiertos"
  ];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Intereses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="px-3 py-1 bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border border-primary/20 transition-all cursor-default"
            >
              {interest}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Interests;
