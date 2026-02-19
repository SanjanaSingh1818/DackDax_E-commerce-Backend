"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ShippingInput = {
  freeShippingThreshold: number;
  deliveryDays: number;
  shippingCost: number;
};

export default function ShippingSettingsCard({
  initialValues,
  saving,
  onSave,
}: {
  initialValues: ShippingInput;
  saving: boolean;
  onSave: (input: ShippingInput) => Promise<void>;
}) {
  const [values, setValues] = useState<ShippingInput>(initialValues);

  useEffect(() => setValues(initialValues), [initialValues]);

  return (
    <Card className="rounded-xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Fraktinstallningar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="shipping-threshold">Grans for fri frakt</Label>
          <Input
            id="shipping-threshold"
            type="number"
            value={values.freeShippingThreshold}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, freeShippingThreshold: Number(event.target.value) || 0 }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shipping-days">Leveransdagar</Label>
          <Input
            id="shipping-days"
            type="number"
            value={values.deliveryDays}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, deliveryDays: Number(event.target.value) || 0 }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shipping-cost">Fraktkostnad</Label>
          <Input
            id="shipping-cost"
            type="number"
            value={values.shippingCost}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, shippingCost: Number(event.target.value) || 0 }))
            }
          />
        </div>
        <Button className="w-full sm:w-auto" disabled={saving} onClick={() => onSave(values)}>
          {saving ? "Sparar..." : "Spara fraktinstallningar"}
        </Button>
      </CardContent>
    </Card>
  );
}
