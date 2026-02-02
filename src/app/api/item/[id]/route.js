import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  const resolvedParams = await params;
  const client = await getClientPromise();
  const db = client.db("wad-01");

  // if no id param, return all items
  if (!resolvedParams?.id) {
    const items = await db.collection("item").find().toArray();
    return NextResponse.json(items);
  }

  // otherwise return single item
  const id = resolvedParams.id;
  try {
    const item = await db.collection("item").findOne({ _id: new ObjectId(id) });
    if (!item) return new NextResponse("Not found", { status: 404 });
    return NextResponse.json(item);
  } catch (err) {
    return new NextResponse("Invalid id", { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  if (!id) return new NextResponse("Missing id", { status: 400 });

  const client = await getClientPromise();
  const db = client.db("wad-01");

  try {
    const result = await db.collection("item").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return new NextResponse("Not found", { status: 404 });
    return NextResponse.json({ deletedCount: result.deletedCount });
  } catch (err) {
    return new NextResponse("Invalid id", { status: 400 });
  }
}
