"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import Loader from "@/components/elements/Loader";

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
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: doctorData, error: doctorErr } = await supabase
        .from("doctors")
        .select("id")
        .eq("id", user.id)
        .single();

      if (doctorErr) {
        console.error("Doctor lookup failed:", doctorErr);
      }
      const doctorId = doctorData?.id;

      console.log("auth user id:", user.id);
      console.log("doctor from table:", doctorData);
      console.log("doctorId used in query:", doctorId);

      const { data: patientData, error: patientErr } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .eq("role", "patient")
        .single();

      if (patientErr) {
        console.error(patientErr);
        setLoading(false);
        return;
      }

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

  if (loading) return <Loader text="Hang tight, loading patient details..." />;

  if (!patient)
    return (
      <div className="text-center text-red-500">
        Patient not found or not accessible.
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Patient Overview */}
      <Card>
        <CardHeader>
          <CardTitle>{patient.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {patient.gender} • {patient.dob} • Blood: {patient.blood_group}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Phone: {patient.phone}</p>
          <p className="text-sm">Email: {patient.email}</p>
        </CardContent>
      </Card>

      {/* Tabs for Appointments, Records, Prescriptions */}
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>

        {/* Appointments */}
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No appointments found with you.
                </p>
              ) : (
                <ul className="space-y-2">
                  {appointments.map((appt) => (
                    <li key={appt.id} className="border-b pb-2 last:border-0">
                      <p className="font-medium">
                        {new Date(appt.scheduled_at).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appt.notes}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Status: {appt.status}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Records */}
        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle>Medical Records</CardTitle>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No records available with you.
                </p>
              ) : (
                <ul className="space-y-2">
                  {records.map((rec) => (
                    <li key={rec.id} className="border-b pb-2 last:border-0">
                      <p className="font-medium">{rec.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {rec.description}
                      </p>
                      {rec.file_url && (
                        <a
                          href={rec.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 underline"
                        >
                          View File
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prescriptions */}
        <TabsContent value="prescriptions">
          <Card>
            <CardHeader>
              <CardTitle>Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              {prescriptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No prescriptions found.
                </p>
              ) : (
                <ul className="space-y-2">
                  {prescriptions.map((rx) => (
                    <li key={rx.id} className="border-b pb-2 last:border-0">
                      <p className="font-medium">{rx.medicine}</p>
                      <p className="text-sm text-muted-foreground">
                        {rx.dosage} • {rx.duration}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
