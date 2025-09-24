import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with Service Role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();

    const { templateId, hospitalId } = body;
    if (!templateId || !hospitalId) {
      return NextResponse.json(
        { error: "Missing templateId or hospitalId" },
        { status: 400 }
      );
    }

    // 1️⃣ Fetch template record from DB
    const { data: template, error: fetchErr } = await supabase
      .from("hospital_templates")
      .select("*")
      .eq("id", templateId)
      .single();

    if (fetchErr) throw fetchErr;
    if (!template)
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );

    // 2️⃣ Delete file from Cloudinary
    if (template.template_url) {
      try {
        const publicId = template.template_url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(
          `hospital/${hospitalId}/templates/${publicId}`,
          { resource_type: "auto" }
        );
      } catch (err) {
        console.warn("Failed to delete Cloudinary file", err);
      }
    }

    // 3️⃣ Delete record from Supabase
    const { error: delErr } = await supabase
      .from("hospital_templates")
      .delete()
      .eq("id", templateId);

    if (delErr) throw delErr;

    return NextResponse.json({ message: "Template deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete template" },
      { status: 500 }
    );
  }
}
