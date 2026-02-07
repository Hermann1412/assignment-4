import { ensureIndexes } from "@/lib/ensureIndexes";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Content-Type": "application/json",
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get("pass") ?? false;

  if (!challenge) {
    return NextResponse.json(
      { message: "Invalid usage" },
      { status: 400, headers: corsHeaders }
    );
  }

  const pass = process.env.ADMIN_SETUP_PASS;

  if (challenge !== pass) {
    return NextResponse.json(
      { message: "Admin password incorrect" },
      { status: 400, headers: corsHeaders }
    );
  }

  const result = await ensureIndexes();
  return NextResponse.json({ message: "Indexes ensured" }, { headers: corsHeaders });
}
