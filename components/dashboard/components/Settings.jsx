"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [email, setEmail] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [uploading, setUploading] = useState(false);

  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
      } else {
        setEmail(user.email);
        setDisplayName(user.user_metadata?.displayName || "");
        setPhone(user.user_metadata?.phone || "");
        setAvatar(user.user_metadata?.avatar_url || "/images/profile.png");
      }
    };

    getUser();
  }, [supabase, router]);

  const handleProfileUpdate = async () => {
    const { error } = await supabase.auth.updateUser({
      data: {
        displayName,
        phone,
        avatar_url: avatar,
      },
    });

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
    }
  };

  const handleUploadPhoto = async (event) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      // Upload to Cloudinary via your API route
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Upload failed");

      setAvatar(data.url); // Set new avatar URL locally

      toast.success("Photo uploaded, click save to update.");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

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
            <div>
              <p className="font-medium">{email ?? "Loading..."}</p>
              <p className="text-sm text-muted-foreground">
                Your registered account
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleUploadPhoto}
                disabled={uploading}
              />
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
