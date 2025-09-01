"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import CustomLinkButton from "../elements/CustomLinkButton";
import MailSend01Icon from "@/public/jsx-icons/MailSend01Icon";

const CTA = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(paraRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
      });
      gsap.from(buttonRef.current, {
        y: 20,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden 
        bg-gradient-to-b from-sky-50 via-cyan-200 to-teal-200
        dark:from-sky-900 dark:via-cyan-950 dark:to-teal-950 
        text-gray-900 dark:text-white transition-colors"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.4),transparent_70%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_70%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.25),transparent_70%)] dark:bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_70%)]" />

      <div className="relative container mx-auto px-6 text-center">
        {/* Heading */}
        <h2
          ref={headingRef}
          className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
        >
          Take Control of Your{" "}
          <span className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
            Health Journey
          </span>{" "}
          Today
        </h2>

        <p
          ref={paraRef}
          className="text-lg md:text-xl text-gray-700 dark:text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Join thousands of patients and providers who trust{" "}
          <span className="font-semibold text-teal-600 dark:text-cyan-400">
            CareMitra
          </span>{" "}
          for secure, patient-centric healthcare management.
        </p>

        {/* CTA Button */}
        <div ref={buttonRef} className="relative z-10">
          <CustomLinkButton href="/signup" leftIcon={<MailSend01Icon />}>
            Create Free Account
          </CustomLinkButton>
        </div>
      </div>
    </section>
  );
};

export default CTA;
