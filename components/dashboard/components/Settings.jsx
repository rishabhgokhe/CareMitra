"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ThemeToggle from "@/components/elements/ThemeToggle";
import Image from "next/image";
import toast from "react-hot-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, parse } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("/images/profile.png");
  const [gender, setGender] = useState("Unknown");
  const [dob, setDob] = useState(null);
  const [dobInput, setDobInput] = useState(""); // for typing DOB
  const [bloodGroup, setBloodGroup] = useState("");
  const [uploading, setUploading] = useState(false);

  // Doctor-specific fields (readonly)
  const [qualification, setQualification] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [rating, setRating] = useState(0);
  const [experienceYears, setExperienceYears] = useState(0);

  const genderOptions = ["Male", "Female", "Other", "Unknown"];
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        const {
          data: { user: authUser },
          error: authErr,
        } = await supabase.auth.getUser();

        if (authErr || !authUser) {
          router.push("/login");
          return;
        }

        setUserId(authUser.id);

        const { data: userData, error: userErr } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle();

        if (userErr) throw userErr;

        if (userData) {
          setEmail(userData.email || "");
          setDisplayName(userData.name || "");
          setPhone(userData.phone || "");
          setAvatar(userData.avatar_url || "/images/profile.png");
          setGender(userData.gender || "Unknown");
          const dobDate = userData.dob ? new Date(userData.dob) : null;
          setDob(dobDate);
          setDobInput(dobDate ? format(dobDate, "yyyy-MM-dd") : "");
          setBloodGroup(userData.blood_group || "");
        }

        const { data: doctorData, error: docErr } = await supabase
          .from("doctors")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle();

        if (docErr) throw docErr;

        if (doctorData) {
          setQualification(doctorData.qualification || "");
          setSpecialization(doctorData.specialization || "");
          setRating(doctorData.rating || 0);
          setExperienceYears(doctorData.experience_years || 0);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [supabase, router]);

  const handleUploadPhoto = async (event) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0)
        throw new Error("You must select an image to upload.");

      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/upload_avatar", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setAvatar(data.url);

      const { error: updateErr } = await supabase
        .from("users")
        .update({ avatar_url: data.url })
        .eq("id", userId);

      if (updateErr) throw updateErr;

      toast.success("Avatar uploaded and saved!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!userId) return;

    let parsedDob = null;
    if (dobInput) {
      parsedDob = parse(dobInput, "yyyy-MM-dd", new Date());
    }

    try {
      const { error: userErr } = await supabase.from("users").upsert(
        {
          id: userId,
          name: displayName,
          phone,
          gender,
          dob: parsedDob,
          blood_group: bloodGroup,
        },
        { onConflict: "id" }
      );
      if (userErr) throw userErr;

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-500 dark:text-gray-300">
        Loading...
      </p>
    );

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Settings</h1>

      {/* Profile */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center gap-4">
            <Image
              src={avatar || "/images/profile.png"}
              alt="Profile"
              width={96}
              height={96}
              className="rounded-full border"
            />
            <p className="font-medium">{email}</p>
            <Input
              type="file"
              accept="image/*"
              onChange={handleUploadPhoto}
              disabled={uploading}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <Label>Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date of Birth</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={dobInput}
                  onChange={(e) => setDobInput(e.target.value)}
                  className="flex-1"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Pick</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dob}
                      onSelect={(date) => {
                        setDob(date);
                        setDobInput(date ? format(date, "yyyy-MM-dd") : "");
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label>Blood Group</Label>
              <Select value={bloodGroup} onValueChange={setBloodGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((bg) => (
                    <SelectItem key={bg} value={bg}>
                      {bg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="mt-4 w-full" onClick={handleProfileUpdate}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Info */}
      {(qualification || specialization || rating) && (
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Doctor Info</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground font-semibold">
                Qualification
              </p>
              <p>{qualification || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground font-semibold">
                Specialization
              </p>
              <p>{specialization || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground font-semibold">
                Experience (Years)
              </p>
              <p>{experienceYears}</p>
            </div>
            <div>
              <p className="text-muted-foreground font-semibold">Rating</p>
              <p>{rating}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preferences */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label>Theme</Label>
          <ThemeToggle />
        </CardContent>
      </Card>

      {/* Account */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="password">Change Password</Label>
            <Input id="password" type="password" placeholder="New password" />
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
