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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

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
  const [bloodGroup, setBloodGroup] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fetch user from auth & users table
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
          .select("id, name, email, phone, avatar_url, gender, dob, blood_group")
          .eq("id", authUser.id)
          .maybeSingle();

        if (userErr) throw userErr;

        if (userData) {
          setEmail(userData.email);
          setDisplayName(userData.name || "");
          setPhone(userData.phone || "");
          setAvatar(userData.avatar_url || "/images/profile.png");
          setGender(userData.gender || "Unknown");
          setDob(userData.dob ? new Date(userData.dob) : null);
          setBloodGroup(userData.blood_group || "");
        } else {
          setEmail(authUser.email || "");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [supabase, router]);

  // Upload avatar and save to users table
  const handleUploadPhoto = async (event) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0)
        throw new Error("You must select an image to upload.");

      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setAvatar(data.url);

      // Save immediately to users table
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

  // Update user profile
  const handleProfileUpdate = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase.from("users").upsert(
        {
          id: userId,
          name: displayName,
          phone,
          gender,
          dob: dob || null,
          blood_group: bloodGroup,
        },
        { onConflict: "id" }
      );

      if (error) throw error;

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
    return <p className="text-center mt-20 text-gray-500 dark:text-gray-300">Loading...</p>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Image
              src={avatar || "/images/profile.png"}
              alt="Profile"
              width={64}
              height={64}
              className="rounded-full border"
            />
            <div className="flex flex-col gap-2">
              <p className="font-medium">{email ?? "Loading..."}</p>
              <p className="text-sm text-muted-foreground">Your registered account</p>
              <Input type="file" accept="image/*" onChange={handleUploadPhoto} disabled={uploading} />
            </div>
          </div>

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
            <Label htmlFor="gender">Gender</Label>
            <Input
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              placeholder="Enter gender"
            />
          </div>

          <div>
            <Label>Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full text-left">
                  {dob ? format(dob, "PPP") : "Select date of birth"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dob}
                  onSelect={(date) => setDob(date)}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="bloodGroup">Blood Group</Label>
            <Input
              id="bloodGroup"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              placeholder="Enter blood group"
            />
          </div>

          <Button className="w-full" onClick={handleProfileUpdate}>
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Theme</Label>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      {/* Account */}
      <Card className="rounded-2xl">
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