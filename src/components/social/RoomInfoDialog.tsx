import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Users, QrCode, Crown, Calendar } from "lucide-react";
import { FirestoreRoom, FirestoreUser } from "@/types/firestore";
import { useState, useEffect } from "react";
import { getUserProfile } from "@/lib/firestore";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface RoomInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: FirestoreRoom | null;
}

export function RoomInfoDialog({ open, onOpenChange, room }: RoomInfoDialogProps) {
  const { currentUser } = useAuth();
  const [members, setMembers] = useState<FirestoreUser[]>([]);
  const [owner, setOwner] = useState<FirestoreUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (room && open) {
      loadRoomMembers();
    }
  }, [room, open]);

  const loadRoomMembers = async () => {
    if (!room) return;

    setLoading(true);
    try {
      const memberProfiles = await Promise.all(
        room.members.map(uid => getUserProfile(uid))
      );
      const validMembers = memberProfiles.filter(m => m !== null) as FirestoreUser[];
      setMembers(validMembers);

      const ownerProfile = await getUserProfile(room.ownerId);
      setOwner(ownerProfile);
    } catch (error) {
      console.error("Error loading room members:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyInviteCode = () => {
    if (room) {
      navigator.clipboard.writeText(room.inviteCode);
      toast.success("Invite code copied to clipboard!");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!room) return null;

  const isOwner = currentUser?.uid === room.ownerId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{room.emoji}</span>
            <div>
              <DialogTitle>{room.name}</DialogTitle>
              <DialogDescription>
                {room.description || "No description"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Invite Code */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <QrCode className="h-4 w-4" />
              Invite Code
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-3 bg-muted rounded-md font-mono text-lg text-center">
                {room.inviteCode}
              </code>
              <Button variant="outline" size="icon" onClick={copyInviteCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this code with others to invite them to this room
            </p>
          </div>

          {/* Owner */}
          {owner && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Crown className="h-4 w-4" />
                Owner
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={owner.photoURL || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(owner.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{owner.displayName}</p>
                  <p className="text-xs text-muted-foreground">{owner.email}</p>
                </div>
                {isOwner && (
                  <Badge variant="secondary" className="ml-auto">You</Badge>
                )}
              </div>
            </div>
          )}

          {/* Members */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4" />
              Members ({room.members.length})
            </div>
            <ScrollArea className="h-[200px] w-full rounded-md border">
              <div className="p-3 space-y-2">
                {loading ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Loading members...
                  </p>
                ) : (
                  members.map((member) => (
                    <div
                      key={member.uid}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.photoURL || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(member.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{member.displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                      </div>
                      {member.uid === currentUser?.uid && (
                        <Badge variant="outline" className="text-xs">You</Badge>
                      )}
                      {member.uid === room.ownerId && (
                        <Crown className="h-3 w-3 text-yellow-500" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Created Date */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Created
            </div>
            <span className="font-medium">
              {new Date(room.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
