import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export async function POST(request) {
  const supabase = createBrowserSupabaseClient();

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1️⃣ Get current user
    const {
      data: { user: authUser },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authUser.id;

    // 2️⃣ Get existing avatar URL
    const { data: userData, error: userErr } = await supabase
      .from("users")
      .select("avatar_url")
      .eq("id", userId)
      .maybeSingle();

    if (userErr) throw userErr;

    // 3️⃣ Delete old avatar from Cloudinary if exists
    if (userData?.avatar_url) {
      const publicId = userData.avatar_url.split("/").pop().split(".")[0]; // assumes URL ends with filename.ext
      try {
        await cloudinary.uploader.destroy(`avatars/${publicId}`);
      } catch (err) {
        console.warn("Failed to delete old avatar:", err);
      }
    }

    // 4️⃣ Upload new file to Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "avatars" }, (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        })
        .end(buffer);
    });

    // 5️⃣ Save new URL to Supabase
    const { error: updateErr } = await supabase
      .from("users")
      .update({ avatar_url: result.secure_url })
      .eq("id", userId);

    if (updateErr) throw updateErr;

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
