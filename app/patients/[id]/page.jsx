"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Calendar, FileText, Pill } from "lucide-react";
import AppointmentCard from "@/components/dashboard/components/appointment/AppointmentCard";
import PaitentInfoCard from "@/components/dashboard/components/paitents/PaitentInfoCard";
import PatientReportGenerator from "@/components/dashboard/components/paitents/PatientReportGenerator";

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-muted/30 rounded-2xl p-6 h-40 w-full"></div>
  );
}

export default function PatientDetailsPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return setLoading(false);

      const { data: doctorData } = await supabase
        .from("doctors")
        .select("id")
        .eq("id", user.id)
        .single();

      const doctorId = doctorData?.id;

      const { data: patientData } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .eq("role", "patient")
        .single();

      const { data: appointmentData } = await supabase
        .from("appointments")
        .select("*")
        .eq("patient_id", id)
        .eq("doctor_id", doctorId);

      const { data: recordData } = await supabase
        .from("medical_records")
        .select("*")
        .eq("patient_id", id)
        .eq("doctor_id", doctorId);

      const { data: prescriptionData } = await supabase
        .from("prescriptions")
        .select("*")
        .eq("patient_id", id)
        .eq("doctor_id", doctorId);

      setPatient(patientData);
      setAppointments(appointmentData || []);
      setRecords(recordData || []);
      setPrescriptions(prescriptionData || []);
      setLoading(false);
    }

    if (id) fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex flex-col h-screen">
        {/* <Topnav /> */}
        <div className="flex flex-1">
          {/* <AppSidebar /> */}
          <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </main>
        </div>
      </div>
    );

  if (!patient)
    return (
      <div className="text-center text-red-500 p-10">
        Patient not found or not accessible.
      </div>
    );

  return (
    <div className="flex h-screen">
      {/* <AppSidebar /> */}
      <div className="flex-1 flex flex-col">
        {/* <Topnav /> */}
        <main className="flex-1 p-6 md:p-10 space-y-10 overflow-y-auto">
          <PaitentInfoCard patient={patient} />
          <PatientReportGenerator
            patient={patient}
            appointments={appointments}
            records={records}
            prescriptions={prescriptions}
          />

          {/* Tabs */}
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="mb-8 flex justify-center gap-3 bg-muted/30 p-1 rounded-2xl shadow-inner">
              <TabsTrigger
                value="appointments"
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-md"
              >
                <Calendar className="h-4 w-4" /> Appointments
              </TabsTrigger>
              <TabsTrigger
                value="records"
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-md"
              >
                <FileText className="h-4 w-4" /> Records
              </TabsTrigger>
              <TabsTrigger
                value="prescriptions"
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-md"
              >
                <Pill className="h-4 w-4" /> Prescriptions
              </TabsTrigger>
            </TabsList>

            {/* Appointments */}
            <TabsContent value="appointments">
              {appointments.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground rounded-2xl">
                  No appointments found.
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {appointments.map((appt) => (
                    <AppointmentCard
                      key={appt.id}
                      appointment={{
                        id: appt.id,
                        patientId: patient.id,
                        patientName: patient.name,
                        patientEmail: patient.email,
                        patientPhone: patient.phone,
                        patientAge: patient.age,
                        paitentAvatar: patient.avatar_url,
                        hospitalName: appt.hospital_name,
                        hospitalLocation: appt.hospital_location,
                        scheduledAt: appt.scheduled_at,
                        status: appt.status,
                        notes: appt.notes,
                      }}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Records */}
            <TabsContent value="records">
              {records.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground rounded-2xl">
                  No records available with you.
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {records.map((rec) => (
                    <Card
                      key={rec.id}
                      className="rounded-2xl border shadow-sm hover:shadow-lg transition"
                    >
                      <CardHeader>
                        <CardTitle className="text-base font-semibold">
                          {rec.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground space-y-3">
                        <p>{rec.description}</p>
                        {rec.file_url && (
                          <a
                            href={rec.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 underline"
                          >
                            📄 View File
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Prescriptions */}
            <TabsContent value="prescriptions">
              {prescriptions.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground rounded-2xl">
                  No prescriptions found.
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {prescriptions.map((rx) => (
                    <Card
                      key={rx.id}
                      className="rounded-2xl border shadow-sm hover:shadow-lg transition"
                    >
                      <CardHeader>
                        <CardTitle className="text-base font-semibold">
                          {rx.medicine}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        <p>
                          {rx.dosage} • {rx.duration}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
