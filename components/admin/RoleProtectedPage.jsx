"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import Loader from "@/components/elements/Loader";
import CustomLinkButton from "../elements/CustomLinkButton";
import Home01Icon from "../../public/jsx-icons/Home01Icon";

export default function RoleProtectedPage({ allowedRoles = [], children }) {
  const supabase = createBrowserSupabaseClient();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        toast.error("Not authenticated");
        setLoading(false);
        return;
      }

      const { data, error: userErr } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (userErr || !data) {
        toast.error("Error fetching user role");
        setLoading(false);
        return;
      }

      setRole(data.role);
      setLoading(false);
    };

    fetchRole();
  }, [supabase]);

  if (loading) {
    return <Loader text="Checking permissions..." />;
  }

  if (!allowedRoles.includes(role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <h2 className="text-2xl font-bold mb-2 text-red-500 dark:text-red-300">
          🚫 Access Denied
        </h2>
        <p className=" mb-6">You do not have permission to view this page.</p>
        <CustomLinkButton
          href="/dashboard"
          leftIcon={<Home01Icon className="mr-2" />}
        >
          Return Dashboard
        </CustomLinkButton>
      </div>
    );
  }

  return children({ role });
}
