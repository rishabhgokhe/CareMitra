import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomLinkButton from "@/components/elements/CustomLinkButton";
import { Sparkles } from "lucide-react";

export default function PremiumInfoCard({ expanded }) {
  return (
    <div
      className={`mt-auto sm:p-4 transition-all duration-300 ease-in-out transform-gpu
        ${
          expanded
            ? "opacity-100 scale-100 translate-x-0"
            : "opacity-0 scale-95 -translate-x-4 pointer-events-none"
        }`}
    >
      <Card>
        <CardHeader className="p-2 md:p-4">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            CareMitra Premium
          </CardTitle>
          <CardDescription>
            Unlock advanced AI health insights, unlimited record storage, and
            priority support with our premium plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
          <CustomLinkButton
            href="/pricing"
            // rightIcon={<Sparkles className="h-4 w-4" />}
            className="w-full text-sm"
          >
            Upgrade to Premium
          </CustomLinkButton>
        </CardContent>
      </Card>
    </div>
  );
}