import { NextResponse } from "next/server";
import { adminSettingsState } from "@/lib/admin-settings-state";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    name?: string;
    email?: string;
  };

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();

  if (!name || !email) {
    return NextResponse.json(
      { success: false, error: "Name and email are required." },
      { status: 400 }
    );
  }

  adminSettingsState.profile.name = name;
  adminSettingsState.profile.email = email;

  return NextResponse.json({
    success: true,
    data: adminSettingsState.profile,
  });
}
