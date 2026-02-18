"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PricingInput = {
  defaultMargin: number;
  vat: number;
};

export default function PricingSettingsCard({
  initialValues,
  saving,
  onSave,
}: {
  initialValues: PricingInput;
  saving: boolean;
  onSave: (input: PricingInput) => Promise<void>;
}) {
  const [values, setValues] = useState<PricingInput>(initialValues);

  useEffect(() => setValues(initialValues), [initialValues]);

  return (
    <Card className="rounded-xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Prisinstallningar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pricing-margin">Default Margin %</Label>
          <Input
            id="pricing-margin"
            type="number"
            value={values.defaultMargin}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, defaultMargin: Number(event.target.value) || 0 }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pricing-vat">VAT %</Label>
          <Input
            id="pricing-vat"
            type="number"
            value={values.vat}
            onChange={(event) => setValues((prev) => ({ ...prev, vat: Number(event.target.value) || 0 }))}
          />
        </div>
        <Button disabled={saving} onClick={() => onSave(values)}>
          {saving ? "Sparar..." : "Save Pricing"}
        </Button>
      </CardContent>
    </Card>
  );
}
