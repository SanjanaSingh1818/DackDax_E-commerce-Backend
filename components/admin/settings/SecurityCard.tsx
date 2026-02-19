"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SecurityCard({
  saving,
  onSave,
}: {
  saving: boolean;
  onSave: (input: { currentPassword: string; newPassword: string }) => Promise<void>;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <Card className="rounded-xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Sakerhet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="settings-current-password">Nuvarande losenord</Label>
          <Input
            id="settings-current-password"
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-new-password">Nytt losenord</Label>
          <Input
            id="settings-new-password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </div>
        <Button
          className="w-full sm:w-auto"
          disabled={saving}
          onClick={() => onSave({ currentPassword, newPassword })}
        >
          {saving ? "Sparar..." : "Andra losenord"}
        </Button>
      </CardContent>
    </Card>
  );
}
