"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type StoreInput = {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
};

export default function StoreSettingsCard({
  initialValues,
  saving,
  onSave,
}: {
  initialValues: StoreInput;
  saving: boolean;
  onSave: (input: StoreInput) => Promise<void>;
}) {
  const [values, setValues] = useState<StoreInput>(initialValues);

  useEffect(() => setValues(initialValues), [initialValues]);

  return (
    <Card className="rounded-xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Butiksinstallningar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="store-name">Butiksnamn</Label>
          <Input
            id="store-name"
            value={values.storeName}
            onChange={(event) => setValues((prev) => ({ ...prev, storeName: event.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="store-email">Butikens e-post</Label>
          <Input
            id="store-email"
            value={values.storeEmail}
            onChange={(event) => setValues((prev) => ({ ...prev, storeEmail: event.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="store-phone">Butikens telefon</Label>
          <Input
            id="store-phone"
            value={values.storePhone}
            onChange={(event) => setValues((prev) => ({ ...prev, storePhone: event.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="store-address">Butiksadress</Label>
          <Input
            id="store-address"
            value={values.storeAddress}
            onChange={(event) => setValues((prev) => ({ ...prev, storeAddress: event.target.value }))}
          />
        </div>
        <Button className="w-full sm:w-auto" disabled={saving} onClick={() => onSave(values)}>
          {saving ? "Sparar..." : "Spara butiksinstallningar"}
        </Button>
      </CardContent>
    </Card>
  );
}
