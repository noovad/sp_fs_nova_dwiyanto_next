"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface InviteMemberInputProps {
  onInvite: (email: string) => void;
  loading?: boolean;
}

export function InviteMemberInput({
  onInvite,
  loading,
}: InviteMemberInputProps) {
  const [email, setEmail] = useState("");

  const handleInvite = () => {
    if (email.trim()) {
      onInvite(email.trim());
      setEmail("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInvite();
    }
  };

  return (
    <div className="space-y-2">
      <Label>Invite New Member</Label>
    <div className="flex gap-2">
      <Input
        type="email"
        autoComplete="email"
        placeholder="Enter email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyPress}
        className="flex-1"
      />
      <Button
        onClick={handleInvite}
        disabled={loading || !email.trim()}
        className="bg-green-600 hover:bg-green-700"
      >
        {loading ? "Inviting..." : "Invite"}
      </Button>
    </div>
    </div>
  );
}
