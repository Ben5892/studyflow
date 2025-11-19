import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import BottomNav from "@/components/BottomNav";
import TaskDialog from "@/components/TaskDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  due: string;
  due_type: string;
  completed: boolean;
}

const Tasks = () => {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } else {
      setTasks(data || []);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const { error } = await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    } else {
      fetchTasks();
    }
  };

  const handleSaveTask = async (title: string, dueType: string, due: string) => {
    if (editTask) {
      const { error } = await supabase
        .from("tasks")
        .update({ title, due_type: dueType, due })
        .eq("id", editTask.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update task",
          variant: "destructive",
        });
      } else {
        toast({ title: "Task updated!" });
        fetchTasks();
      }
    } else {
      const { error } = await supabase.from("tasks").insert({
        title,
        due_type: dueType,
        due,
        user_id: user?.id,
        completed: false,
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create task",
          variant: "destructive",
        });
      } else {
        toast({ title: "Task created!" });
        fetchTasks();
      }
    }
    setEditTask(null);
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    } else {
      toast({ title: "Task deleted!" });
      fetchTasks();
    }
  };

  const getDueColor = (dueType: string) => {
    switch (dueType) {
      case "tomorrow":
        return "text-[hsl(var(--due-today))]";
      case "friday":
        return "text-[hsl(var(--due-soon))]";
      default:
        return "text-primary";
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-lg mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Tasks</h1>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setEditTask(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No tasks yet. Tap + to add your first task!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 bg-card p-4 rounded-lg border border-border"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="mt-0.5"
                />
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    setEditTask({ id: task.id, title: task.title, dueType: task.due_type, due: task.due });
                    setDialogOpen(true);
                  }}
                >
                  <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </p>
                  <p className={`text-sm ${getDueColor(task.due_type)}`}>
                    Due: {task.due}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTask(task.id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveTask}
        editTask={editTask}
      />
      <BottomNav />
    </div>
  );
};

export default Tasks;
