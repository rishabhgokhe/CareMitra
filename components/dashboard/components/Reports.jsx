"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const Reports = () => {
  const supabase = createBrowserSupabaseClient();

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [recordType, setRecordType] = useState("prescription");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch patients linked to this doctor
  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase
        .from("doctor_patient")
        .select("patient_id, users(name)")
        .eq("doctor_id", (await supabase.auth.getUser()).data.user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching patients:", error.message);
      } else {
        setPatients(
          data.map((d) => ({
            id: d.patient_id,
            name: d.users?.name || "Unknown",
          }))
        );
      }
    };

    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let fileUrl = null;

    // Upload file to Cloudinary if present
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "your_preset_here"); // replace with your Cloudinary preset

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/your_cloud_name_here/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploaded = await res.json();
      fileUrl = uploaded.secure_url;
    }

    const user = await supabase.auth.getUser();
    const doctorId = user.data.user.id;

    const { error } = await supabase.from("medical_records").insert([
      {
        patient_id: selectedPatient,
        doctor_id: doctorId,
        record_type: recordType,
        title,
        description,
        file_url: fileUrl,
      },
    ]);

    if (error) {
      console.error("Error creating report:", error.message);
    } else {
      alert("Report created successfully ✅");
      setTitle("");
      setDescription("");
      setFile(null);
      setSelectedPatient("");
    }

    setLoading(false);
  };

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg">
      <CardHeader>
        <CardTitle>Create Medical Report</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Select Patient */}
          <div>
            <Label>Select Patient</Label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger>
                <SelectValue placeholder="Choose patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Record Type */}
          <div>
            <Label>Record Type</Label>
            <Select value={recordType} onValueChange={setRecordType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prescription">Prescription</SelectItem>
                <SelectItem value="lab_report">Lab Report</SelectItem>
                <SelectItem value="discharge_summary">
                  Discharge Summary
                </SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
                <SelectItem value="consultation_note">
                  Consultation Note
                </SelectItem>
                <SelectItem value="vitals">Vitals</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Blood Test Report"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details of the report..."
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <Label>Attach File (optional)</Label>
            <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Create Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Reports;
