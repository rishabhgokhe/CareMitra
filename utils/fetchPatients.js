import { createBrowserSupabaseClient } from "@/lib/supabase/client";

/**
 * Fetch all patients linked to the currently authenticated doctor
 * @param {string[]} fields - List of fields to fetch from `users`
 * @param {number} from - Pagination start index
 * @param {number} to - Pagination end index
 * @returns {Promise<{ success: boolean, data?: any[], error?: string }>}
 */
export async function fetchPatients(
  fields = ["id", "name", "email", "dob", "phone", "gender", "blood_group", "created_at"],
  from = 0,
  to = 19
) {
  const supabase = createBrowserSupabaseClient();

  try {
    // 1️⃣ Auth check
    const {
      data: { user: authUser },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !authUser) {
      return { success: false, error: "You must be logged in as a doctor 🔒" };
    }

    const doctorId = authUser.id;

    // 2️⃣ Get linked patient IDs
    const { data: links, error: linkErr } = await supabase
      .from("doctor_patient")
      .select("patient_id")
      .eq("doctor_id", doctorId);

    if (linkErr) {
      return { success: false, error: "Failed to load linked patients IDs" };
    }

    const patientIds = links.map((l) => l.patient_id);
    if (patientIds.length === 0) {
      return { success: true, data: [] };
    }

    // 3️⃣ Fetch patients with pagination + selected fields
    const { data: patientData, error: patientErr } = await supabase
      .from("users")
      .select(fields.join(", "))
      .in("id", patientIds)
      .range(from, to);

    if (patientErr) {
      return { success: false, error: "Failed to load patient details" };
    }

    // 4️⃣ Add computed age
    const formatted = patientData.map((p) => ({
      ...p,
      name: p.name || "Unnamed Patient",
      age: p.dob
        ? Math.floor(
            (new Date() - new Date(p.dob)) / (1000 * 60 * 60 * 24 * 365)
          )
        : "Unknown",
    }));

    return { success: true, data: formatted };
  } catch (err) {
    console.error("fetchPatients error:", err);
    return {
      success: false,
      error: "Unexpected error while fetching patients",
    };
  }
}