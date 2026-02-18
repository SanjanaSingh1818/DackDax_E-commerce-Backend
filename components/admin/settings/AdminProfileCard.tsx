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
          <Label htmlFor="settings-name">Name</Label>
          <Input
            id="settings-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Admin Name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-email">Email</Label>
          <Input
            id="settings-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@dackdax.se"
          />
        </div>
        <Button disabled={saving} onClick={() => onSave({ name, email })}>
          {saving ? "Sparar..." : "Update Profile"}
        </Button>
      </CardContent>
    </Card>
  );
}
