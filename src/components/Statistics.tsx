import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const Statistics = () => {
  const stats = [
    { label: "Posts Creados", value: "45", color: "text-primary", icon: "📝" },
    { label: "Comentarios", value: "83", color: "text-accent", icon: "💬" },
    { label: "Me Gusta", value: "156", color: "text-secondary", icon: "👍" }
  ];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Actividad en el Foro
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-muted/50 to-muted/30 hover:from-primary/5 hover:to-accent/5 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Statistics;
