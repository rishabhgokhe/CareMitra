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

  // 🔒 check role
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login first");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || data.role !== "hospital_admin") {
        toast.error("Access denied. Hospital Admins only.");
        window.location.href = "/"; // redirect
      }
    })();
  }, [supabase]);

  // 📌 fetch hospitals
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

  // 📝 form handler
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // 🚀 add doctor
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Create auth account
      const { data: authUser, error: signUpErr } = await supabase.auth.signUp({
        email: form.email,
        password: "TempPass123!", // ⚠️ use invite flow in prod
      });

      if (signUpErr) throw signUpErr;

      const userId = authUser.user.id;

      // 2️⃣ Insert into users
      const { error: userErr } = await supabase.from("users").insert({
        id: userId,
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: "doctor",
      });
      if (userErr) throw userErr;

      // 3️⃣ Insert into doctors
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
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Add Doctor to Hospital</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Phone</Label>
          <Input
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Qualification</Label>
          <Input
            value={form.qualification}
            onChange={(e) => handleChange("qualification", e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Specialization</Label>
          <Input
            value={form.specialization}
            onChange={(e) => handleChange("specialization", e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Hospital</Label>
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

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Adding..." : "Add Doctor"}
        </Button>
      </form>
    </div>
  );
}
