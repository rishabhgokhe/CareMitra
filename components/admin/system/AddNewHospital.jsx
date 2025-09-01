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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...form, location: form.location };

    const { error } = await supabase.from("hospitals").insert([payload]);

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
        location: {
          address: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
        },
      });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Add New Hospital</CardTitle>
          <CardDescription>
            Fill in the details below to create a new hospital.
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
                placeholder="City Hospital"
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
                placeholder="city-hospital"
                value={form.slug}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500">
                Lowercase, no spaces, use hyphens. Used in URLs.
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                placeholder="contact@hospital.com"
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
                placeholder="+91 12345 67890"
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
                  placeholder="City"
                  value={form.location.city}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  placeholder="State"
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
                  placeholder="Country"
                  value={form.location.country}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  placeholder="Pincode"
                  value={form.location.pincode}
                  onChange={handleChange}
                />
              </div>
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
