import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ThumbsUp, MessageCircle } from "lucide-react";

const RecentInteractions = () => {
  const interactions = [
    {
      type: "post",
      title: "¿Mejores prácticas para React Hooks?",
      category: "Desarrollo Web",
      time: "Hace 2 horas",
      stats: { likes: 12, comments: 8 }
    },
    {
      type: "comment",
      title: "Comentó en: Guía de preparación para examen de IA",
      category: "Inteligencia Artificial",
      time: "Hace 5 horas",
      stats: { likes: 5, comments: 0 }
    },
    {
      type: "post",
      title: "Recomendaciones de recursos para aprender AWS",
      category: "Cloud Computing",
      time: "Hace 1 día",
      stats: { likes: 18, comments: 12 }
    }
  ];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Últimas Interacciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {interactions.map((interaction, index) => (
          <div 
            key={index}
            className="p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {interaction.type === "post" ? (
                  <MessageSquare className="h-4 w-4 text-primary" />
                ) : (
                  <MessageCircle className="h-4 w-4 text-accent" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium text-sm">{interaction.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-primary">{interaction.category}</span>
                  <span>•</span>
                  <span>{interaction.time}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    {interaction.stats.likes}
                  </span>
                  {interaction.stats.comments > 0 && (
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {interaction.stats.comments}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentInteractions;
