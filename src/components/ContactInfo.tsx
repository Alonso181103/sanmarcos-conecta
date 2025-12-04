import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactInfo = () => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Información de Contacto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <Mail className="h-4 w-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="font-medium">ana.rodriguez@unmsm.edu.pe</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <Phone className="h-4 w-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Teléfono</p>
            <p className="font-medium">+51 987 654 321</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <MapPin className="h-4 w-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Ubicación</p>
            <p className="font-medium">San Miguel, Lima</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
