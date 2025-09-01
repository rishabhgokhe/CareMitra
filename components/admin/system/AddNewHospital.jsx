"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";

export default function AddNewHospital() {
  const supabase = createBrowserSupabaseClient();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    contact_email: "",
    contact_phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);

  // ✅ Check user role
  useEffect(() => {
    const checkRole = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        toast.error("Not authenticated");
        return;
      }

      const { data, error: userErr } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (userErr) {
        toast.error("Error checking role");
        return;
      }

      if (data?.role === "system_admin") {
        setIsAllowed(true);
      } else {
        toast.error("Access denied. Only System Admins can add hospitals.");
      }
    };

    checkRole();
  }, [supabase]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("hospitals").insert([form]);

    if (error) {
      console.error(error);
      toast.error("Error adding hospital");
    } else {
      toast.success("Hospital added successfully!");
      setForm({
        name: "",
        slug: "",
        contact_email: "",
        contact_phone: "",
      });
    }

    setLoading(false);
  };

  if (!isAllowed) {
    return (
      <div className="p-6 text-center text-red-500 font-medium">
        Checking permissions...
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Hospital</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                name="name"
                placeholder="Hospital Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Input
                type="text"
                name="slug"
                placeholder="Unique Slug"
                value={form.slug}
                onChange={handleChange}
              />
            </div>
            <div>
              <Input
                type="email"
                name="contact_email"
                placeholder="Contact Email"
                value={form.contact_email}
                onChange={handleChange}
              />
            </div>
            <div>
              <Input
                type="tel"
                name="contact_phone"
                placeholder="Contact Phone"
                value={form.contact_phone}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Adding..." : "Add Hospital"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}