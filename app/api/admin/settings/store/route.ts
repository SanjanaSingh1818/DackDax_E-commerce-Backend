import { NextResponse } from "next/server";
import { adminSettingsState } from "@/lib/admin-settings-state";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    storeName?: string;
    storeEmail?: string;
    storePhone?: string;
    storeAddress?: string;
  };

  adminSettingsState.store.storeName = String(body.storeName || "").trim();
  adminSettingsState.store.storeEmail = String(body.storeEmail || "").trim();
  adminSettingsState.store.storePhone = String(body.storePhone || "").trim();
  adminSettingsState.store.storeAddress = String(body.storeAddress || "").trim();

  return NextResponse.json({
    success: true,
    data: adminSettingsState.store,
  });
}
