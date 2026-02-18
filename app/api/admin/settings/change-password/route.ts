import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    currentPassword?: string;
    newPassword?: string;
  };

  const currentPassword = String(body.currentPassword || "").trim();
  const newPassword = String(body.newPassword || "").trim();

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { success: false, error: "Both password fields are required." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    data: { changed: true },
  });
}
