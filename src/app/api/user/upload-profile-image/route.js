import { verifyJWT } from "@/lib/auth";
import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Helper to parse multipart form data
async function parseMultipartFormData(req) {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data")) {
    throw new Error("Invalid content-type");
  }
  return await req.formData();
}

export async function OPTIONS(req) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req) {
  const user = verifyJWT(req);
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401, headers: corsHeaders }
    );
  }

  let formData;

  try {
    formData = await parseMultipartFormData(req);
  } catch (err) {
    return NextResponse.json(
      { message: "Invalid form data" },
      { status: 400, headers: corsHeaders }
    );
  }

  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json(
      { message: "No file uploaded" },
      { status: 400, headers: corsHeaders }
    );
  }

  // Check if file is an image
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { message: "Only image files are allowed" },
      { status: 400, headers: corsHeaders }
    );
  }

  // Generate unique filename using uuid
  const ext = file.name.split(".").pop();
  const filename = uuidv4() + "." + ext;
  const savePath = path.join(process.cwd(), "public", "profile-images", filename);

  // Save file to disk
  const arrayBuffer = await file.arrayBuffer();
  await fs.writeFile(savePath, Buffer.from(arrayBuffer));

  // Update user in MongoDB
  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");
    const email = user.email;

    // Get current user to delete old image
    const profile = await db.collection("user").findOne({ email });
    if (profile && profile.profileImage) {
      const filePath = path.join(process.cwd(), "public", profile.profileImage);
      try {
        await fs.rm(filePath);
      } catch (err) {
        // File might not exist, ignore
      }
    }

    // Update user with new profile image
    await db.collection("user").updateOne(
      { email },
      { $set: { profileImage: `/profile-images/${filename}` } }
    );

    return NextResponse.json(
      { imageUrl: `/profile-images/${filename}` },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.log("error", error.toString());
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(req) {
  const user = verifyJWT(req);
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401, headers: corsHeaders }
    );
  }

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");
    const email = user.email;

    // Get user profile
    const profile = await db.collection("user").findOne({ email });

    if (profile && profile.profileImage) {
      const filePath = path.join(process.cwd(), "public", profile.profileImage);
      try {
        await fs.rm(filePath);
      } catch (err) {
        // File might not exist, ignore
      }

      // Remove from database
      await db.collection("user").updateOne(
        { email },
        { $set: { profileImage: null } }
      );
    }

    return NextResponse.json(
      { message: "OK" },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.log("error", error.toString());
    return NextResponse.json(
      { message: "Failed to delete profile image" },
      { status: 500, headers: corsHeaders }
    );
  }
}
