import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomLinkButton from "@/components/elements/CustomLinkButton";
import MailSend01Icon from "@/public/jsx-icons/MailSend01Icon";

export default function InfoCard({ expanded }) {
  return (
    <div
      className={`mt-auto sm:p-4 transition-all duration-300 ease-in-out transform-gpu
        ${expanded ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-95 -translate-x-4 pointer-events-none"}`}
    >
      <Card x-chunk="dashboard-02-chunk-0" className="overflow-hidden">
        <CardHeader className="p-2 md:p-4">
          <CardTitle>Share Your Opinion</CardTitle>
          <CardDescription>
            We are constantly improving our app based on the feedback we receive. Please take a moment to share your thoughts with us.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
          <CustomLinkButton
            href="/feedback"
            rightIcon={<MailSend01Icon />}
            className="w-full text-sm"
          >
            Send Feedback
          </CustomLinkButton>
        </CardContent>
      </Card>
    </div>
  );
}