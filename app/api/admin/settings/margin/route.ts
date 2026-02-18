import { NextResponse } from "next/server";
import { adminSettingsState } from "@/lib/admin-settings-state";

export async function GET() {
  return NextResponse.json({
    data: {
      defaultMargin: adminSettingsState.pricing.defaultMargin,
    },
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { defaultMargin?: number };
  const nextValue = Number(body.defaultMargin);

  if (Number.isFinite(nextValue)) {
    adminSettingsState.pricing.defaultMargin = Math.max(0, nextValue);
  }

  return NextResponse.json({
    success: true,
    data: {
      defaultMargin: adminSettingsState.pricing.defaultMargin,
    },
  });
}
