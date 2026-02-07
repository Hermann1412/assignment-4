import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import corsHeaders from "@/lib/cors";

export async function GET(req, { params }) {
  const resolved = await params;
  const id = resolved?.id;
  if (!id) return new NextResponse("Missing id", { status: 400 });

  const client = await getClientPromise();
  const db = client.db("wad-01");

  try {
    const user = await db.collection("user").findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
    if (!user) return new NextResponse("Not found", { status: 404 });
    return NextResponse.json(user, { headers: corsHeaders });
  } catch (err) {
    return new NextResponse("Invalid id", { status: 400 });
  }
}

export async function PUT(req, { params }) {
  const resolved = await params;
  const id = resolved?.id;
  if (!id) {
    return NextResponse.json(
      { message: "Missing id" },
      { status: 400, headers: corsHeaders }
    );
  }

  const data = await req.json();
  const { firstname, lastname, email, password } = data;

  const client = await getClientPromise();
  const db = client.db("wad-01");

  try {
    const updateData = {
      firstname: firstname || "",
      lastname: lastname || "",
      email: email || "",
    };

    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const result = await db.collection("user").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after", projection: { password: 0 } }
    );

    if (!result.value) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { message: "Profile updated successfully", user: result.value },
      { status: 200, headers: corsHeaders }
    );
  } catch (exception) {
    console.log("exception", exception.toString());
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  if (!id) return new NextResponse("Missing id", { status: 400 });

  const client = await getClientPromise();
  const db = client.db("wad-01");

  try {
    const result = await db.collection("user").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return new NextResponse("Not found", { status: 404 });
    return NextResponse.json({ deletedCount: result.deletedCount }, { headers: corsHeaders });
  } catch (err) {
    return new NextResponse("Invalid id", { status: 400 });
  }
}
