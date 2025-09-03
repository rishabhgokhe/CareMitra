import { createBrowserSupabaseClient } from "@/lib/supabase/client";

/**
 * Fetch all appointments linked to the currently authenticated doctor
 * @param {string[]} fields - optional fields to fetch
 * @param {number} from - optional pagination start index
 * @param {number} to - optional pagination end index
 * @returns {Promise<{ success: boolean, data?: any[], error?: string }>}
 */
export async function fetchAppointments(
  fields = [
    "id",
    "scheduled_at",
    "status",
    "notes",
    "patient:patient_id (id, name, email, phone, dob)",
    "hospital:hospital_id (id, name, location)"
  ],
  from,
  to
) {
  const supabase = createBrowserSupabaseClient();

  try {
    const {
      data: { user: authUser },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !authUser) {
      return { success: false, error: "You must be logged in as a doctor 🔒" };
    }

    const doctorId = authUser.id;

    let query = supabase
      .from("appointments")
      .select(fields.join(","))
      .eq("doctor_id", doctorId)
      .order("scheduled_at", { ascending: true });

    if (from !== undefined && to !== undefined) {
      query = query.range(from, to);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: "Failed to fetch appointments ❌" };
    }

    const formatted = data.map((appt) => ({
      id: appt.id,
      patientId: appt.patient?.id,
      patientName: appt.patient?.name || "Unnamed Patient",
      patientEmail: appt.patient?.email || "Unknown Email",
      patientPhone: appt.patient?.phone || "Unknown Phone",
      patientAge: appt.patient?.dob
        ? Math.floor(
            (new Date() - new Date(appt.patient.dob)) /
              (1000 * 60 * 60 * 24 * 365)
          )
        : "Unknown",
      hospitalName: appt.hospital?.name || "Unknown Hospital",
      hospitalLocation: appt.hospital?.location || "",
      scheduledAt: new Date(appt.scheduled_at),
      status: appt.status,
      notes: appt.notes,
    }));

    return { success: true, data: formatted };
  } catch (err) {
    console.error("fetchAppointments error:", err);
    return {
      success: false,
      error: "Unexpected error while fetching appointments 💥",
    };
  }
}