import { NextResponse } from "next/server";
import { adminSettingsState } from "@/lib/admin-settings-state";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: adminSettingsState,
  });
}
