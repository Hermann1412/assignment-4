import { verifyJWT } from "@/lib/auth";
import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function OPTIONS(req) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(req) {
  const user = verifyJWT(req);
  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
        headers: corsHeaders,
      }
    );
  }

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");
    const email = user.email;
    const profile = await db.collection("user").findOne({ email });

    if (!profile) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    // Remove password from response
    const { password, ...profileData } = profile;

    return NextResponse.json(profileData, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (exception) {
    console.log("exception", exception.toString());
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
