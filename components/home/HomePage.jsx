"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Features from "./Features";
import CTA from "./CTA";
import CustomLinkButton from "../elements/CustomLinkButton";

import CircleArrowUp03Icon from "@/public/jsx-icons/CircleArrowUp03Icon";
import InformationCircleIcon from "@/public/jsx-icons/InformationCircleIcon";
import Image from "next/image";

const HomePage = () => {
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const mockupRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(heroRef.current, { opacity: 0, y: 40, duration: 1 })
        .from(headingRef.current, { opacity: 0, y: 40, duration: 1 }, "-=0.7")
        .from(
          subheadingRef.current,
          { opacity: 0, y: 30, duration: 0.9 },
          "-=0.6"
        )
        .from(
          mockupRef.current,
          { opacity: 0, scale: 0.9, duration: 1 },
          "-=0.3"
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <main
      className="min-h-screen relative overflow-hidden 
                  bg-gradient-to-b from-sky-100 via-white to-teal-100 
                dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 
                  transition-colors"
    >
      <section
        ref={heroRef}
        className="relative py-24 md:py-36 text-center container mx-auto px-6 max-w-screen-lg z-100"
      >
        <span
          className="inline-flex items-center text-sm md:text-base font-medium 
                    text-green-700 border border-green-600/30 bg-green-50 
                    px-4 py-1 rounded-full mb-6
                    shadow-[0_0_15px_rgba(34,197,94,0.6)] dark:shadow-[0_0_20px_rgba(34,197,94,0.8)] 
                    transition-shadow duration-500 hover:shadow-[0_0_25px_rgba(34,197,94,0.9)]"
        >
          ❤️ Your Health, Your Control
        </span>

        <h1
          ref={headingRef}
          className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight"
        >
          Your{" "}
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
            Health History
          </span>{" "}
          — Secure, Accessible, Trusted
        </h1>

        <p
          ref={subheadingRef}
          className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          CareMitra is your personal health wallet. Powered by{" "}
          <span className="font-semibold text-yellow-500">blockchain</span>,
          designed for patients, and trusted by hospitals.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <CustomLinkButton href="/login" leftIcon={<CircleArrowUp03Icon />}>
            Get Started
          </CustomLinkButton>
          <CustomLinkButton href="/info" leftIcon={<InformationCircleIcon />}>
            Learn More
          </CustomLinkButton>
        </div>

        {/* Mockup Preview */}
        <div ref={mockupRef} className="mt-16 relative flex justify-center">
          <div className="relative w-full max-w-4xl rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 via-white to-purple-100" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.6),transparent_50%)]" />
            <Image
              src="/images/preview.png"
              alt="Health Wallet Preview"
              width={1200}
              height={700}
              priority
              className="relative z-10 w-full h-auto object-contain"
            />
          </div>
        </div>
      </section>
      <Features />
      <CTA />
    </main>
  );
};

export default HomePage;
