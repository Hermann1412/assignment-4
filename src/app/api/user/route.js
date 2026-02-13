import { getClientPromise } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Content-Type": "application/json",
};

export async function GET() {
  const client = await getClientPromise();
  const db = client.db("wad-01");

  const users = await db
    .collection("user")
    .find({}, { projection: { password: 0 } })
    .toArray();

  const safe = users.map((u) => {
    const { password, ...rest } = u;
    return rest;
  });

  return NextResponse.json(safe);
}

export async function POST(req) {
  const data = await req.json();
  const username = data.username;
  const email = data.email;
  const password = data.password;
  const firstname = data.firstname;
  const lastname = data.lastname;

  if (!username || !email || !password) {
    return NextResponse.json(
      { message: "Missing mandatory data" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");
    const result = await db.collection("user").insertOne({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      firstname,
      lastname,
      status: "ACTIVE",
      profileImage: null,
    });
    console.log("result", result);
    return NextResponse.json(
      { id: result.insertedId },
      { status: 200, headers: corsHeaders }
    );
  } catch (exception) {
    console.log("Exception", exception.toString());
    const errorMsg = exception.toString();
    let displayErrorMsg = "";
    if (errorMsg.includes("duplicate")) {
      if (errorMsg.includes("username")) {
        displayErrorMsg = "Duplicate Username!";
      } else if (errorMsg.includes("email")) {
        displayErrorMsg = "Duplicate Email!";
      }
    }
    return NextResponse.json(
      { message: displayErrorMsg },
      { status: 400, headers: corsHeaders }
    );
  }
}
