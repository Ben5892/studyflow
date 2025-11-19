import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BottomNav from "@/components/BottomNav";
import EventDialog from "@/components/EventDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  time: string;
  icon: string;
  color: string;
}

const Scheduler = () => {
  const { user, loading } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user, date]);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("event_date", date?.toISOString().split("T")[0])
      .order("created_at", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } else {
      setEvents(data || []);
    }
  };

  const handleSaveEvent = async (title: string, time: string, icon: string, color: string) => {
    if (editEvent) {
      const { error } = await supabase
        .from("events")
        .update({ title, time, icon, color })
        .eq("id", editEvent.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update event",
          variant: "destructive",
        });
      } else {
        toast({ title: "Event updated!" });
        fetchEvents();
      }
    } else {
      const { error } = await supabase.from("events").insert({
        title,
        time,
        icon,
        color,
        user_id: user?.id,
        event_date: date?.toISOString().split("T")[0],
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create event",
          variant: "destructive",
        });
      } else {
        toast({ title: "Event created!" });
        fetchEvents();
      }
    }
    setEditEvent(null);
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    } else {
      toast({ title: "Event deleted!" });
      fetchEvents();
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-lg mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Scheduler</h1>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setEditEvent(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="w-5 h-5 text-primary" />
          </Button>
        </div>

        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">
              {date?.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h2>
          </div>
          
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
          />
        </Card>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Preview</h2>
          {events.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No events for this day. Tap + to add one!</p>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 bg-card p-4 rounded-lg border border-border"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${event.color}`}>
                  {event.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.time}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditEvent(event);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteEvent(event.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </div>
      </div>

      <EventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveEvent}
        editEvent={editEvent}
      />
      <BottomNav />
    </div>
  );
};

export default Scheduler;
