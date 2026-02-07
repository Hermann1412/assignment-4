import bcrypt from "bcryptjs";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Content-Type": "application/json",
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const client = await getClientPromise();
    const db = client.db("wad-01");

    // Find user by username
    const user = await db.collection("user").findOne({ username });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401, headers: corsHeaders }
      );
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401, headers: corsHeaders }
      );
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      { user: userWithoutPassword, message: "Login successful" },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
