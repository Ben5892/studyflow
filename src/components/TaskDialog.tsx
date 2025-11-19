import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (title: string, dueType: string, due: string) => void;
  editTask?: { id: string; title: string; dueType: string; due: string } | null;
}

const TaskDialog = ({ open, onOpenChange, onSave, editTask }: TaskDialogProps) => {
  const [title, setTitle] = useState("");
  const [dueType, setDueType] = useState("tomorrow");
  const [notes, setNotes] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");

  const colors = [
    { name: "blue", class: "bg-blue-500" },
    { name: "red", class: "bg-red-400" },
    { name: "green", class: "bg-green-400" },
    { name: "orange", class: "bg-orange-300" },
    { name: "purple", class: "bg-purple-400" },
    { name: "pink", class: "bg-pink-400" },
  ];

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDueType(editTask.dueType);
    } else {
      setTitle("");
      setDueType("tomorrow");
      setNotes("");
      setSelectedColor("blue");
    }
  }, [editTask, open]);

  const getDueText = (type: string) => {
    switch (type) {
      case "tomorrow": return "Tomorrow";
      case "friday": return "Friday";
      case "week": return "Next Week";
      case "semester": return "End of Semester";
      default: return "Tomorrow";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(title, dueType, getDueText(dueType));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editTask ? "Edit Task" : "Add Task"}
          </DialogTitle>
          <DialogDescription>
            {editTask ? "Update your task details" : "Create a new task for your study plan"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Study for math exam"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="due" className="text-base font-semibold">
              Due Date
            </Label>
            <Select value={dueType} onValueChange={setDueType}>
              <SelectTrigger id="due" className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
                <SelectItem value="week">Next Week</SelectItem>
                <SelectItem value="semester">End of Semester</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base font-semibold">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Add details"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">Priority</Label>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  className={cn(
                    "w-12 h-12 rounded-full transition-transform hover:scale-110",
                    color.class,
                    selectedColor === color.name && "ring-4 ring-offset-2 ring-foreground/20"
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button type="submit" className="px-8 bg-foreground text-background hover:bg-foreground/90">
              {editTask ? "Update Task" : "Add Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
