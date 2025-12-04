import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Calendar } from "lucide-react";

const Achievements = () => {
  const achievements = [
    {
      title: "Primer Puesto - Hackathon UNMSM 2024",
      date: "Junio 2024",
      icon: "🏆"
    },
    {
      title: "Miembro del IEEE Student Branch",
      date: "2022 - Presente",
      icon: "⚡"
    },
    {
      title: "Voluntario en Tech for Good",
      date: "2023",
      icon: "🌟"
    }
  ];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Logros y Actividades
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {achievements.map((achievement, index) => (
          <div 
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-all"
          >
            <span className="text-2xl">{achievement.icon}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{achievement.title}</h3>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {achievement.date}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Achievements;
