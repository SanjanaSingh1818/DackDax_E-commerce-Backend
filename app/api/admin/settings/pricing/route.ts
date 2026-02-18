import { NextResponse } from "next/server";
import { adminSettingsState } from "@/lib/admin-settings-state";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    defaultMargin?: number;
    vat?: number;
  };

  adminSettingsState.pricing.defaultMargin = Number(body.defaultMargin) || 0;
  adminSettingsState.pricing.vat = Number(body.vat) || 0;

  return NextResponse.json({
    success: true,
    data: adminSettingsState.pricing,
  });
}
