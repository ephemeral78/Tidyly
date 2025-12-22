import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Copy, 
  Users, 
  QrCode, 
  Crown, 
  Calendar, 
  UserMinus, 
  DoorOpen,
  AlertTriangle 
} from "lucide-react";
import { FirestoreRoom, FirestoreUser } from "@/types/firestore";
import { useState, useEffect } from "react";
import { getUserProfile, leaveRoom, removeMemberFromRoom } from "@/lib/firestore";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [kickDialogOpen, setKickDialogOpen] = useState(false);
  const [memberToKick, setMemberToKick] = useState<FirestoreUser | null>(null);

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

  const handleLeaveRoom = async () => {
    if (!room || !currentUser) return;

    try {
      await leaveRoom(currentUser.uid, room.id);
      toast.success("You have left the room");
      onOpenChange(false);
    } catch (error) {
      console.error("Error leaving room:", error);
      toast.error("Failed to leave room");
    }
  };

  const handleKickMember = async () => {
    if (!room || !currentUser || !memberToKick) return;

    try {
      await removeMemberFromRoom(room.id, memberToKick.uid, currentUser.uid);
      toast.success(`${memberToKick.displayName} has been removed from the room`);
      setKickDialogOpen(false);
      setMemberToKick(null);
      loadRoomMembers(); // Reload members list
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error(error instanceof Error ? error.message : "Failed to remove member");
    }
  };

  const openKickDialog = (member: FirestoreUser) => {
    setMemberToKick(member);
    setKickDialogOpen(true);
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
                      {/* Show kick button only for owner and not for themselves or owner */}
                      {isOwner && member.uid !== currentUser?.uid && member.uid !== room.ownerId && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => openKickDialog(member)}
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
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

        {/* Leave Room Button - Only show if not the owner */}
        {!isOwner && (
          <DialogFooter>
            <Button 
              variant="destructive" 
              onClick={() => setLeaveDialogOpen(true)}
              className="w-full"
            >
              <DoorOpen className="h-4 w-4 mr-2" />
              Leave Room
            </Button>
          </DialogFooter>
        )}
      </DialogContent>

      {/* Leave Room Confirmation Dialog */}
      <AlertDialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Leave Room?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave <strong>{room?.name}</strong>? You'll need a new invite code to rejoin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeaveRoom} className="bg-destructive hover:bg-destructive/90">
              Leave Room
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Kick Member Confirmation Dialog */}
      <AlertDialog open={kickDialogOpen} onOpenChange={setKickDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <UserMinus className="h-5 w-5 text-destructive" />
              Remove Member?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{memberToKick?.displayName}</strong> from this room? They'll need a new invite to rejoin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMemberToKick(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleKickMember} className="bg-destructive hover:bg-destructive/90">
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
