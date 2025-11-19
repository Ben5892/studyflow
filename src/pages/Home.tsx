import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import BottomNav from "@/components/BottomNav";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Home = () => {
  const { user, loading } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("completed", false)
      .order("created_at", { ascending: false })
      .limit(3);

    setTasks(data || []);
  };

  const quickNotes = [
    {
      title: "Meeting with Prof. Davis",
      preview: "Discuss project proposal and timeline for t...",
    },
    {
      title: "Chemistry Lab Ideas",
      preview: "Brainstorm experiments for titrations, may...",
    },
    {
      title: "Book list for History 101",
      preview: "Check library for 'A People's History of the...",
    },
  ];

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-lg mx-auto p-4 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search anything..."
            className="pl-10 bg-card border-border"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Quick Notes</h2>
            <Button variant="link" className="text-primary p-0 h-auto">
              View all
            </Button>
          </div>
          <div className="space-y-2">
            {quickNotes.map((note, index) => (
              <Card key={index} className="p-4 bg-card border-border">
                <h3 className="font-medium mb-1">{note.title}</h3>
                <p className="text-sm text-muted-foreground">{note.preview}</p>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Upcoming Tasks</h2>
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No tasks yet</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3">
                  <Checkbox className="mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">Due: {task.due}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Calendar Snapshot</h2>
          <Card className="p-4 bg-card border-border">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
            />
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
