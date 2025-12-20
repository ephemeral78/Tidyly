import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface MyCodesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MyCodesDialog({ open, onOpenChange }: MyCodesDialogProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [friendCode, setFriendCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (currentUser && open) {
      getUserProfile(currentUser.uid).then((profile) => {
        if (profile) {
          setFriendCode(profile.friendCode);
        }
      });
    }
  }, [currentUser, open]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'Code copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>My Codes</DialogTitle>
          <DialogDescription>
            Share these codes with others to connect
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Friend Code</CardTitle>
              <CardDescription>
                Share this code with people you want to add as friends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={friendCode}
                  readOnly
                  className="font-mono text-lg"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => copyToClipboard(friendCode)}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Room Codes</CardTitle>
              <CardDescription>
                Each room you own has a unique invite code. View them in the room settings.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
