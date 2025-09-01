"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ButtonLoader from "../elements/ButtonLoader";

export default function LoginForm({ className, ...props }) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setError(error.message || "Unable to log in. Please try again.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    setLoading(false);

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              {/* Title */}
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your CareMitra account
                </p>
              </div>

              {/* Email */}
              <div className="grid gap-3">
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
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Error message */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-cyan-700 hover:bg-cyan-600 cursor-pointer"
                disabled={loading}
              >
                {loading ? <ButtonLoader text="Logging in..." /> : "Login"}
              </Button>

              {/* Divider */}
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>

              {/* Socials */}
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleOAuthLogin("apple")}
                  disabled={loading}
                >
                  Apple
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleOAuthLogin("google")}
                  disabled={loading}
                >
                  Google
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleOAuthLogin("facebook")}
                  disabled={loading}
                >
                  Meta
                </Button>
              </div>

              {/* Sign up */}
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>

          {/* Side image */}
          <div className="bg-muted relative hidden md:block">
            <img
              src="/images/login-bg.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.6]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-muted-foreground text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
