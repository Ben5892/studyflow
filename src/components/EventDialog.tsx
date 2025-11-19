import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (title: string, time: string, icon: string, color: string) => void;
  editEvent?: { id: string; title: string; time: string; icon: string; color: string } | null;
}

const EventDialog = ({ open, onOpenChange, onSave, editEvent }: EventDialogProps) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
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
    if (editEvent) {
      setTitle(editEvent.title);
      const [start, end] = editEvent.time.split(" - ");
      setStartTime(start || "");
      setEndTime(end || "");
    } else {
      setTitle("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setDescription("");
      setSelectedColor("blue");
    }
  }, [editEvent, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timeString = `${startTime} - ${endTime}`;
    onSave(title, timeString, "📚", "bg-primary/10 text-primary");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editEvent ? "Edit Event" : "Add Event"}
          </DialogTitle>
          <DialogDescription>
            {editEvent ? "Update your event details" : "Create a new event on your schedule"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Meeting with team"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-base font-semibold">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time" className="text-base font-semibold">
                Start Time
              </Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time" className="text-base font-semibold">
                End Time
              </Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Add details"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">Color</Label>
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
              {editEvent ? "Update Event" : "Add Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
