"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import ButtonLoader from "@/components/elements/ButtonLoader";

export default function HospitalAddDoctor() {
  const supabase = createBrowserSupabaseClient();

  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    specialization: "",
    hospitalId: "",
  });

  // Fetch hospitals
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("hospitals")
        .select("id, name");
      if (error) {
        console.error(error);
        toast.error("Failed to load hospitals");
      } else {
        setHospitals(data);
      }
    })();
  }, [supabase]);

  // Form handler
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Submit
  // 🚀 Add doctor
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.hospitalId) {
      toast.error("Please select a hospital");
      return;
    }

    setLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        toast.error("You must be logged in to add a doctor");
        setLoading(false);
        return;
      }

      const { data: authUser, error: signUpErr } = await supabase.auth.signUp({
        email: form.email,
        password: "TempPass123!",
      });

      if (signUpErr) throw signUpErr;

      const userId = authUser.user.id;

      const { error: userErr } = await supabase.from("users").insert({
        id: userId,
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: "doctor",
      });
      if (userErr) throw userErr;

      const { error: docErr } = await supabase.from("doctors").insert({
        id: userId,
        hospital_id: form.hospitalId,
        qualification: form.qualification,
        specialization: form.specialization,
      });
      if (docErr) throw docErr;

      toast.success("Doctor added successfully!");
      setForm({
        name: "",
        email: "",
        phone: "",
        qualification: "",
        specialization: "",
        hospitalId: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error adding doctor");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">Add a Doctor</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Assign a new doctor to a hospital. Fill in the details below and
          select the hospital they will be associated with.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-1">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Dr. John Doe"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="doctor@example.com"
            required
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+91 12345 67890"
            required
          />
        </div>

        {/* Qualification */}
        <div className="space-y-1">
          <Label htmlFor="qualification">Qualification</Label>
          <Input
            id="qualification"
            value={form.qualification}
            onChange={(e) => handleChange("qualification", e.target.value)}
            placeholder="MBBS, MD"
            required
          />
        </div>

        {/* Specialization */}
        <div className="space-y-1">
          <Label htmlFor="specialization">Specialization</Label>
          <Input
            id="specialization"
            value={form.specialization}
            onChange={(e) => handleChange("specialization", e.target.value)}
            placeholder="Cardiology, Neurology"
            required
          />
        </div>

        {/* Hospital Select */}
        <div className="space-y-1">
          <Label>Assign to Hospital</Label>
          <Select
            value={form.hospitalId}
            onValueChange={(v) => handleChange("hospitalId", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a hospital" />
            </SelectTrigger>
            <SelectContent>
              {hospitals.map((h) => (
                <SelectItem key={h.id} value={h.id}>
                  {h.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <ButtonLoader text="Adding..." /> : "Add Doctor"}
        </Button>
      </form>
    </div>
  );
}
