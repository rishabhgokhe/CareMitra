"use client";

import { useEffect, useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ButtonLoader from "@/components/elements/ButtonLoader";
import toast from "react-hot-toast";

export default function EditHospital({ hospitalId }) {
  const supabase = createBrowserSupabaseClient();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    contact_email: "",
    contact_phone: "",
    location: { address: "", city: "", state: "", country: "", pincode: "" },
  });
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: hospital, error: hospitalErr } = await supabase
          .from("hospitals")
          .select("*")
          .eq("id", hospitalId)
          .single();
        if (hospitalErr) throw hospitalErr;

        setForm({
          name: hospital.name,
          slug: hospital.slug,
          contact_email: hospital.contact_email,
          contact_phone: hospital.contact_phone,
          location: hospital.location || {
            address: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
          },
        });

        const { data: tpls, error: tplErr } = await supabase
          .from("hospital_templates")
          .select("*")
          .eq("hospital_id", hospitalId);

        if (tplErr) throw tplErr;

        setTemplates(tpls.map((t) => ({ ...t, file: null })));
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch hospital data");
      }
    };
    fetchData();
  }, [hospitalId]);

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
    setTemplates((prev) => [
      ...prev,
      { file: null, template_type: "", hospital_id: hospitalId },
    ]);
  };

  const removeTemplate = async (index) => {
    const tpl = templates[index];

    if (tpl.id) {
      try {
        const res = await fetch("/api/upload/delete_template", {
          method: "POST",
          body: JSON.stringify({ templateId: tpl.id, hospitalId }),
          headers: { "Content-Type": "application/json" },
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Delete failed");

        toast.success("Template removed successfully!");
      } catch (err) {
        console.warn("Failed to delete template:", err);
        toast.error("Failed to delete template");
        return;
      }
    }

    setTemplates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: updateErr } = await supabase
        .from("hospitals")
        .update({ ...form, location: form.location })
        .eq("id", hospitalId);
      if (updateErr) throw updateErr;

      for (let tpl of templates) {
        if (tpl.file) {
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
          if (tpl.id) formData.append("template_id", tpl.id);

          const res = await fetch("/api/upload/upload_template", {
            method: "POST",
            body: formData,
          });
          const result = await res.json();
          if (res.status !== 200)
            throw new Error(result.error || "Upload failed");
        } else if (tpl.id) {
          await supabase
            .from("hospital_templates")
            .update({ template_type: tpl.template_type })
            .eq("id", tpl.id);
        }
      }

      toast.success("Hospital updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update hospital");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Edit Hospital</CardTitle>
          <CardDescription>
            Update hospital info and manage templates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hospital Info */}
            <InputGroup
              label="Hospital Name"
              value={form.name}
              name="name"
              onChange={handleChange}
            />
            <InputGroup
              label="Slug"
              value={form.slug}
              name="slug"
              onChange={handleChange}
            />
            <InputGroup
              label="Contact Email"
              value={form.contact_email}
              name="contact_email"
              onChange={handleChange}
              type="email"
            />
            <InputGroup
              label="Contact Phone"
              value={form.contact_phone}
              name="contact_phone"
              onChange={handleChange}
              type="tel"
            />

            {/* Location */}
            <InputGroup
              label="Address"
              value={form.location.address}
              name="address"
              onChange={handleChange}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                value={form.location.city}
                name="city"
                onChange={handleChange}
                placeholder="City"
              />
              <Input
                value={form.location.state}
                name="state"
                onChange={handleChange}
                placeholder="State"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                value={form.location.country}
                name="country"
                onChange={handleChange}
                placeholder="Country"
              />
              <Input
                value={form.location.pincode}
                name="pincode"
                onChange={handleChange}
                placeholder="Pincode"
              />
            </div>

            {/* Templates */}
            <div className="space-y-4">
              <Label>Manage Templates</Label>
              <ScrollArea className="h-48 border rounded p-2 space-y-2">
                {templates.map((tpl, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 border rounded p-2"
                  >
                    {/* Preview */}
                    {tpl.file ? (
                      tpl.file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(tpl.file)}
                          alt="preview"
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded text-sm text-gray-600">
                          {tpl.file.name}
                        </div>
                      )
                    ) : tpl.template_url ? (
                      tpl.template_url.endsWith(".pdf") ? (
                        <a
                          href={tpl.template_url}
                          target="_blank"
                          className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded text-sm text-gray-600"
                        >
                          PDF
                        </a>
                      ) : (
                        <img
                          src={tpl.template_url}
                          alt="preview"
                          className="w-16 h-16 object-cover rounded"
                        />
                      )
                    ) : null}

                    <div className="flex-1 space-y-1">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) =>
                          handleTemplateChange(idx, "file", e.target.files[0])
                        }
                        className="block w-full text-sm text-gray-600"
                      />
                      <select
                        value={tpl.template_type}
                        onChange={(e) =>
                          handleTemplateChange(
                            idx,
                            "template_type",
                            e.target.value
                          )
                        }
                        className="block w-full border rounded px-2 py-1"
                      >
                        <option value="">Select Type</option>
                        <option value="prescription">Prescription</option>
                        <option value="lab_report">Lab Report</option>
                        <option value="discharge_summary">
                          Discharge Summary
                        </option>
                        <option value="imaging">Imaging</option>
                        <option value="consultation_note">
                          Consultation Note
                        </option>
                        <option value="vitals">Vitals</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeTemplate(idx)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </ScrollArea>
              <Button onClick={addTemplate}>Add Template</Button>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <ButtonLoader text="Updating ..." />
              ) : (
                "Update Hospital"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function InputGroup({ label, ...props }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input {...props} />
    </div>
  );
}
