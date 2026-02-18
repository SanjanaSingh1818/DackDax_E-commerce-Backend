import { NextResponse } from "next/server";
import { adminSettingsState } from "@/lib/admin-settings-state";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    freeShippingThreshold?: number;
    deliveryDays?: number;
    shippingCost?: number;
  };

  adminSettingsState.shipping.freeShippingThreshold = Number(body.freeShippingThreshold) || 0;
  adminSettingsState.shipping.deliveryDays = Number(body.deliveryDays) || 0;
  adminSettingsState.shipping.shippingCost = Number(body.shippingCost) || 0;

  return NextResponse.json({
    success: true,
    data: adminSettingsState.shipping,
  });
}
