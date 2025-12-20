import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { createRoom } from "@/lib/firestore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRoomDialog({ open, onOpenChange }: CreateRoomDialogProps) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    emoji: "📋",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!formData.name.trim()) {
      toast.error("Please enter a room name");
      return;
    }

    setLoading(true);
    try {
      const roomData = await createRoom({
        name: formData.name.trim(),
        emoji: formData.emoji,
        description: formData.description.trim(),
        ownerId: currentUser.uid,
        members: [currentUser.uid],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      toast.success(`Room "${formData.name}" created!`, {
        description: `Invite code: ${roomData.inviteCode}`
      });

      setFormData({ name: "", emoji: "📋", description: "" });
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const commonEmojis = ["📋", "💼", "🏠", "🎯", "💡", "🚀", "🎨", "📚", "🎮", "🏆", "⭐", "🔥"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription>
            Create a collaborative workspace to organize tasks with your team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emoji">Room Icon</Label>
            <div className="flex flex-wrap gap-2">
              {commonEmojis.map((emoji) => (
                <Button
                  key={emoji}
                  type="button"
                  variant={formData.emoji === emoji ? "default" : "outline"}
                  size="sm"
                  className="text-xl h-10 w-10 p-0"
                  onClick={() => setFormData({ ...formData, emoji })}
                >
                  {emoji}
                </Button>
              ))}
            </div>
            <Input
              id="emoji"
              value={formData.emoji}
              onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
              placeholder="Or enter custom emoji"
              maxLength={2}
              className="w-20 text-center text-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Room Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Marketing Team, Personal Tasks"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What is this room for?"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Room
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
