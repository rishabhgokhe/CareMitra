"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import ButtonLoader from "@/components/elements/ButtonLoader";
import toast from "react-hot-toast";

export default function AddNewHospital() {
  const supabase = createBrowserSupabaseClient();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    contact_email: "",
    contact_phone: "",
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
  });
  const [templates, setTemplates] = useState([]); // Array of { file, template_type }
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["address", "city", "state", "country", "pincode"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTemplateChange = (index, field, value) => {
    setTemplates((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addTemplate = () => {
    setTemplates((prev) => [...prev, { file: null, template_type: "" }]);
  };

  const removeTemplate = (index) => {
    setTemplates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Create hospital first
      const { data: hospitalData, error: hospitalErr } = await supabase
        .from("hospitals")
        .insert([{ ...form, location: form.location }])
        .select("id")
        .single();

      if (hospitalErr) throw hospitalErr;

      const hospitalId = hospitalData.id;

      // 2️⃣ Upload templates one by one
      for (let tpl of templates) {
        if (!tpl.file || !tpl.template_type) continue;

        const formData = new FormData();
        formData.append("file", tpl.file);
        formData.append("hospital_id", hospitalId);
        formData.append("template_type", tpl.template_type);
        formData.append(
          "placeholders",
          JSON.stringify([
            "dr_name",
            "patient_name",
            "medicine",
            "quantity",
            "timing",
            "signature",
            "qr_code_id",
          ])
        );

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await res.json();
        if (res.status !== 200)
          throw new Error(result.error || "Upload failed");
      }

      toast.success("Hospital and templates added successfully!");
      setForm({
        name: "",
        slug: "",
        contact_email: "",
        contact_phone: "",
        location: {
          address: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
        },
      });
      setTemplates([]);
    } catch (err) {
      console.error(err);
      toast.error("Error adding hospital or templates");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Add New Hospital</CardTitle>
          <CardDescription>
            Fill in the details below to create a new hospital and upload
            templates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hospital Info */}
            <div className="space-y-1">
              <Label htmlFor="name">Hospital Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="slug">Unique Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={form.slug}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={form.contact_email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                type="tel"
                value={form.contact_phone}
                onChange={handleChange}
              />
            </div>

            {/* Location Info */}
            <div className="space-y-1">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={form.location.address}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={form.location.city}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={form.location.state}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={form.location.country}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={form.location.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Template Upload */}
            <div className="space-y-2">
              <Label>Upload Templates</Label>
              {templates.map((tpl, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) =>
                      handleTemplateChange(idx, "file", e.target.files[0])
                    }
                  />
                  <select
                    value={tpl.template_type}
                    onChange={(e) =>
                      handleTemplateChange(idx, "template_type", e.target.value)
                    }
                  >
                    <option value="">Select Type</option>
                    <option value="prescription">Prescription</option>
                    <option value="lab_report">Lab Report</option>
                    <option value="discharge_summary">Discharge Summary</option>
                    <option value="imaging">Imaging</option>
                    <option value="consultation_note">Consultation Note</option>
                    <option value="vitals">Vitals</option>
                    <option value="other">Other</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeTemplate(idx)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <Button type="button" onClick={addTemplate}>
                Add Template
              </Button>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <ButtonLoader text="Adding ..." /> : "Add Hospital"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
