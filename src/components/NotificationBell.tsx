import { useState } from "react";
import { Bell, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Nuevo evento en tu facultad", time: "Hace 5 min" },
    { id: 2, message: "Tu pregunta recibió una respuesta", time: "Hace 30 min" },
    { id: 3, message: "Nuevo curso recomendado para ti", time: "Hace 1 hora" },
  ]);

  const unread = notifications.length;

  const clearAll = () => setNotifications([]);
  const removeNotification = (id: number) =>
    setNotifications(notifications.filter((n) => n.id !== id));

  return (
    <div className="relative inline-block">
      {/* Botón de campana */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label="Ver notificaciones"
        className="relative"
      >
        <Bell className="h-6 w-6" />

        {/* Badge de número */}
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 grid place-content-center"
          >
            {unread}
          </motion.span>
        )}
      </Button>

      {/* Panel de Notificaciones */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 z-50"
          >
            <Card className="p-3 shadow-lg border">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-sm">Notificaciones</h3>

                {notifications.length > 0 && (
                  <button
                    className="text-xs text-blue-600 hover:underline"
                    onClick={clearAll}
                  >
                    Limpiar todas
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No tienes notificaciones
                </p>
              ) : (
                <div className="flex flex-col gap-2 max-h-64 overflow-auto">
                  {notifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="p-3 rounded-md bg-muted hover:bg-muted/80 flex items-start gap-3"
                    >
                      <div className="flex-1">
                        <p className="text-sm">{notif.message}</p>
                        <p className="text-xs text-muted-foreground">{notif.time}</p>
                      </div>

                      <button
                        onClick={() => removeNotification(notif.id)}
                        className="text-muted-foreground hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
