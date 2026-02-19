"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminProfileCard({
  initialName,
  initialEmail,
  saving,
  onSave,
}: {
  initialName: string;
  initialEmail: string;
  saving: boolean;
  onSave: (input: { name: string; email: string }) => Promise<void>;
}) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);

  useEffect(() => setName(initialName), [initialName]);
  useEffect(() => setEmail(initialEmail), [initialEmail]);

  return (
    <Card className="rounded-xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Adminprofil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="settings-name">Namn</Label>
          <Input
            id="settings-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Adminnamn"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-email">E-post</Label>
          <Input
            id="settings-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@dackdax.se"
          />
        </div>
        <Button className="w-full sm:w-auto" disabled={saving} onClick={() => onSave({ name, email })}>
          {saving ? "Sparar..." : "Uppdatera profil"}
        </Button>
      </CardContent>
    </Card>
  );
}
