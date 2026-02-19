"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Percent } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MarginSettingsCard({
  margin,
  saving,
  onSave,
}: {
  margin: number;
  saving: boolean;
  onSave: (value: number) => Promise<void>;
}) {
  const [value, setValue] = useState<number>(margin);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setValue(margin);
  }, [margin]);

  const handleSave = async () => {
    if (!Number.isFinite(value) || value < 0) return;
    await onSave(value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className="rounded-xl border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Marginalinstallningar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Standardmarginal (%)</p>
          <p className="text-xs text-muted-foreground">Anvands for nya produktberakningar.</p>
        </div>

        <div className="relative">
          <Percent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="number"
            min={0}
            value={Number.isFinite(value) ? value : 0}
            onChange={(event) => setValue(Number(event.target.value))}
            className="w-full rounded-lg border bg-background px-10 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full rounded-lg sm:w-auto">
          {saving ? "Sparar..." : "Spara marginal"}
        </Button>

        {saved ? (
          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <CheckCircle className="h-4 w-4" />
            Marginal sparad
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
