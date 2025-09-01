"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import ButtonLoader from "../elements/ButtonLoader";

export default function SignUpForm({ className, ...props }) {
  const supabase = createBrowserSupabaseClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || "Something went wrong.");
    } else {
      toast.success("Account created successfully!");

      if (data.user) {
        await supabase.from("users").insert({
          id: data.user.id,
          name,
          email,
        });
      }

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-lg">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Form */}
          <form onSubmit={handleSignUp} className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Create your account</h1>
              <p className="text-muted-foreground">Join CareMitra today</p>
            </div>

            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-cyan-700 hover:bg-cyan-600 cursor-pointer"
              disabled={loading}
            >
              {loading ? <ButtonLoader text="Signing up..." /> : "Sign Up"}
            </Button>

            {/* Divider */}
            <div className="relative text-center text-sm">
              <span className="bg-card px-2 text-muted-foreground relative z-10">
                Or continue with
              </span>
              <div className="absolute inset-0 top-1/2 border-t" />
            </div>

            {/* Socials */}
            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" type="button" className="w-full">
                Apple
              </Button>
              <Button variant="outline" type="button" className="w-full">
                Google
              </Button>
              <Button variant="outline" type="button" className="w-full">
                Meta
              </Button>
            </div>

            {/* Already have account */}
            <div className="text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>

          {/* Side Image */}
          <div className="bg-muted relative hidden md:block">
            <img
              src="/images/login-bg.png"
              alt="Signup Illustration"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.6]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-muted-foreground text-center text-xs mt-2">
        By signing up, you agree to our{" "}
        <a href="#" className="underline underline-offset-2">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-2">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
