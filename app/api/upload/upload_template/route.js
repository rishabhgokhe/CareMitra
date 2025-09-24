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
    const formData = await request.formData();

    const file = formData.get("file");
    const hospitalId = formData.get("hospital_id");
    const templateType = formData.get("template_type");
    const placeholders = formData.get("placeholders"); // JSON string
    const templateId = formData.get("template_id");     // optional

    if (!file || !hospitalId || !templateType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let placeholderArray = [];
    try { placeholderArray = placeholders ? JSON.parse(placeholders) : []; } 
    catch { placeholderArray = []; }

    // Delete old template if editing
    if (templateId) {
      const { data: oldTemplate } = await supabase
        .from("hospital_templates")
        .select("*")
        .eq("id", templateId)
        .single();

      if (oldTemplate?.template_url) {
        try {
          const publicId = oldTemplate.template_url.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(
            `hospital/${hospitalId}/templates/${publicId}`,
            { resource_type: "auto" }
          );
        } catch (err) {
          console.warn("Failed to delete old Cloudinary file", err);
        }
      }
    }

    // Upload new file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: `hospital/${hospitalId}/templates`, resource_type: "auto" },
          (error, uploadResult) => error ? reject(error) : resolve(uploadResult)
        )
        .end(buffer);
    });

    // Insert or update DB
    if (templateId) {
      const { error: updateErr } = await supabase
        .from("hospital_templates")
        .update({
          template_type: templateType,
          template_url: result.secure_url,
          placeholders: placeholderArray,
        })
        .eq("id", templateId);

      if (updateErr) throw updateErr;
    } else {
      const { error: insertErr } = await supabase
        .from("hospital_templates")
        .insert([{
          hospital_id: hospitalId,
          template_type: templateType,
          template_url: result.secure_url,
          placeholders: placeholderArray,
        }]);

      if (insertErr) throw insertErr;
    }

    return NextResponse.json({
      url: result.secure_url,
      message: "Template uploaded successfully",
    });
  } catch (error) {
    console.error("Upload template error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}