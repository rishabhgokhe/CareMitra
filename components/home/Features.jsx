"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  ShieldCheck,
  FileText,
  Smartphone,
  Share2,
  Database,
  Brain,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const cardsRef = useRef([]);

  const features = [
    {
      icon: FileText,
      title: "Unified Health History",
      description:
        "All your medical records stored securely in one place, accessible anytime.",
    },
    {
      icon: ShieldCheck,
      title: "Blockchain Security",
      description:
        "Every record is encrypted, tamper-proof, and trusted across providers.",
    },
    {
      icon: Smartphone,
      title: "Instant Access",
      description:
        "View reports, prescriptions, and appointments from your mobile wallet.",
    },
    {
      icon: Share2,
      title: "Smart Record Sharing",
      description:
        "Control who can access your health data — doctors, labs, insurers.",
    },
    {
      icon: Database,
      title: "Hospital Integration",
      description:
        "Seamlessly integrates with hospital EMRs for automatic record syncing.",
    },
    {
      icon: Brain,
      title: "AI Health Insights",
      description:
        "Personalized recommendations powered by AI to support better healthcare decisions.",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(paraRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
      });
      gsap.from(cardsRef.current, {
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 0.9,
        delay: 0.4,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-gradient-to-b from-white via-teal-50 to-sky-50 
                 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors"
    >
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2
            ref={headingRef}
            className="text-3xl md:text-5xl font-bold mb-4 tracking-tight"
          >
            Why{" "}
            <span className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
              CareMitra?
            </span>
          </h2>
          <p
            ref={paraRef}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Unlike traditional hospital systems, CareMitra keeps you in control
            —
            <span className="font-semibold text-teal-600 dark:text-cyan-400">
              {" "}
              your records, your rules.
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={(el) => (cardsRef.current[index] = el)}
              className="group"
            >
              <Card
                className="h-full shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 
                           rounded-2xl border border-gray-200/60 dark:border-gray-800/60 
                           bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                                bg-gradient-to-r from-teal-500/10 to-cyan-500/10 blur-xl"
                />
                <CardContent className="relative p-8 text-center">
                  <div
                    className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-teal-500 to-cyan-600 
                               rounded-2xl flex items-center justify-center shadow-lg
                               group-hover:scale-110 group-hover:shadow-cyan-400/40 transition-all duration-500"
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
