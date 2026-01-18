import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Get Supabase session to access the access token
    const supabase = await createClient();
    const { data: { session: supabaseSession } } = await supabase.auth.getSession();
    
    if (!supabaseSession?.access_token) {
      return NextResponse.json({ error: "No access token available" }, { status: 401 });
    }

    const userId = session.user.id;
    const bucketId = "Files";

    // Generate a unique filename with "private" prefix
    const fileExt = file.name.split(".").pop();
    const fileName = `private/${userId}/profile-photo.${fileExt}`;

    // Convert File to ArrayBuffer for upload
    const fileBuffer = await file.arrayBuffer();

    // Set the session on the client to ensure access token is used
    await supabase.auth.setSession({
      access_token: supabaseSession.access_token,
      refresh_token: supabaseSession.refresh_token,
    });

    // Upload the file using server-side client (now with explicit session)
    const { error: uploadError } = await supabase.storage
      .from(bucketId)
      .upload(fileName, fileBuffer, {
        cacheControl: "3600",
        upsert: true, // Replace existing file
        contentType: file.type,
      });

    if (uploadError) {
      console.error("Error uploading profile photo:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload profile photo", details: uploadError.message },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucketId)
      .getPublicUrl(fileName);

    return NextResponse.json({ url: urlData.publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Profile photo upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
