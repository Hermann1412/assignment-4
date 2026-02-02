import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await getClientPromise();
  const db = client.db("wad-01");

  const items = await db.collection("item").find().toArray();
  return NextResponse.json(items);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, category, price } = body ?? {};
    if (!name || !category || price === undefined) {
      return new NextResponse("Missing fields: name, category and price are required", { status: 400 });
    }

    const client = await getClientPromise();
    const db = client.db("wad-01");

    const insert = await db.collection("item").insertOne({
      itemName: name,
      itemCategory: category,
      itemPrice: Number(price),
    });

    const created = await db.collection("item").findOne({ _id: insert.insertedId });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Server error", { status: 500 });
  }
} 
