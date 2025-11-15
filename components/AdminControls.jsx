import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Settings } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { TTL_SECONDS } from '../lib/constants';

const AdminControls = ({ chatID, isPermanent, onSettingsChange }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [desiredState, setDesiredState] = useState(isPermanent);
  const { toast } = useToast();

  useEffect(() => {
    setDesiredState(isPermanent);
  }, [isPermanent]);

  const handleSubmit = async () => {
    if (!password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password is required"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatID,
          password,
          action: desiredState ? 'makePermanent' : 'makeTemporary'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        });
        onSettingsChange();
        setOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to update settings"
        });
        setDesiredState(isPermanent);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update settings"
      });
      setDesiredState(isPermanent);
    } finally {
      setLoading(false);
      setPassword('');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setPassword('');
    setDesiredState(isPermanent);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="hover:bg-[#27272a]">
          <Settings className="h-4 w-4 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="dialog-responsive bg-[#18181b] border-[#27272a]">
        <DialogHeader>
          <DialogTitle className="text-white">Chat Settings</DialogTitle>
          <DialogDescription className="text-[#a1a1aa]">
            Manage chat persistence and other settings
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium text-white">
                Permanent Storage
              </label>
              <p className="text-xs text-[#a1a1aa]">
                {desiredState ? 
                  "Chat will be stored permanently" : 
                  `Chat will be deleted after ${TTL_SECONDS} seconds`}
              </p>
            </div>
            <Switch
              checked={desiredState}
              onCheckedChange={setDesiredState}
              disabled={loading}
              className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-[#515151]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">
              Admin Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              disabled={loading}
              className="bg-[#27272a] border-[#3f3f46] text-white placeholder:text-[#71717a]"
            />
            <Button
              onClick={handleSubmit}
              disabled={loading}
              variant="secondary"
              className="w-full  mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Updating Settings...</span>
                </span>
              ) : (
                <span>
                  {desiredState ? "Make Chat Permanent" : "Make Chat Temporary"}
                </span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AdminControls; 