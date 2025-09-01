"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import Home01Icon from "@/public/jsx-icons/Home01Icon";

export default function NotFound() {
  const containerRef = useRef(null);
  const codeRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.from(containerRef.current, { opacity: 0, duration: 0.5 });
    tl.from(codeRef.current, { scale: 0.6, opacity: 0, duration: 0.6 });
    tl.from(messageRef.current, { y: 20, opacity: 0, duration: 0.5 }, "-=0.3");
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-900 p-6"
    >
      <div className="text-center bg-white dark:bg-zinc-800 p-10 rounded-2xl shadow-lg">
        <h3 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Oops! Something went wrong.
        </h3>

        <h2
          ref={codeRef}
          className="text-7xl font-extrabold text-gray-900 dark:text-gray-200 mb-4"
        >
          404
        </h2>

        <p
          ref={messageRef}
          className="text-gray-600 dark:text-gray-300 mb-8"
        >
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <Button
          asChild
          size="lg"
          variant="outline"
          className="space-x-2"
        >
          <a href="/">
            <Home01Icon className="inline-block w-5 h-5" />
            Return Home
          </a>
        </Button>
      </div>
    </div>
  );
}