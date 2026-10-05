"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const steps = [
  {
    title: "Project Discussion",
    text: "We start by understanding your website requirements, goals, pages, features, and timeline.",
  },
  {
    title: "Website Planning",
    text: "The sitemap, page structure, and content are planned before the design work begins.",
  },
  {
    title: "Design & Development",
    text: "The approved design moves into development with the required features and integrations.",
  },
  {
    title: "Quality & Compliance Check",
    text: "Our QA team checks the website and makes sure each feature works smoothly across all devices.",
  },
  {
    title: "Launch & Support",
    text: "Once your website goes live, your team gets 30 days of support whenever help is needed.",
  },
];

const StepArrow = () => (
  <svg
    className="proc-arrow hidden md:block shrink-0 h-auto md:w-[60px] lg:w-[85px] xl:w-[110px] 2xl:w-[133px]"
    width="133"
    height="15"
    viewBox="0 0 133 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M-0.00032568 7.36328C-0.00032568 10.3088 2.38749 12.6966 5.33301 12.6966C8.27853 12.6966 10.6663 10.3088 10.6663 7.36328C10.6663 4.41776 8.27853 2.02995 5.33301 2.02995C2.38749 2.02995 -0.00032568 4.41776 -0.00032568 7.36328ZM132.04 8.07039C132.431 7.67986 132.431 7.0467 132.04 6.65617L125.676 0.292213C125.286 -0.0983109 124.652 -0.0983109 124.262 0.292213C123.871 0.682738 123.871 1.3159 124.262 1.70643L129.919 7.36328L124.262 13.0201C123.871 13.4107 123.871 14.0438 124.262 14.4343C124.652 14.8249 125.286 14.8249 125.676 14.4343L132.04 8.07039ZM5.33301 7.36328V8.36328H131.333V7.36328V6.36328H5.33301V7.36328Z"
      fill="black"
    />
  </svg>
);

const Process = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const titleSplit = SplitText.create(q(".proc-title"), {
          type: "words",
          mask: "words",
        });
        const textSplit = SplitText.create(q(".proc-text"), {
          type: "lines",
          mask: "lines",
        });

        const clear = "transform,opacity,visibility";

        /* ---------- Header ---------- */
        gsap
          .timeline({
            defaults: { ease: "expo.out", clearProps: clear },
            scrollTrigger: { trigger: q(".proc-head")[0], start: "top 80%", once: true },
            onComplete: () => {
              titleSplit.revert();
              textSplit.revert();
            },
          })
          .from(titleSplit.words, {
            yPercent: 120,
            rotate: 6,
            transformOrigin: "0% 100%",
            duration: 1.3,
            stagger: 0.05,
          })
          .from(textSplit.lines, { yPercent: 105, duration: 1.1, stagger: 0.08 }, 0.4);

        /* ---------- Box + steps ---------- */
        const tl = gsap.timeline({
          scrollTrigger: { trigger: q(".proc-box")[0], start: "top 80%", once: true },
        });

        tl.from(q(".proc-box"), {
          y: 60,
          autoAlpha: 0,
          duration: 1.2,
          ease: "power3.out",
          clearProps: clear,
        });

        q(".proc-step").forEach((step: HTMLElement, i: number) => {
          const inner = gsap.utils.selector(step);
          const at = 0.4 + i * 0.3;

          tl.from(
            inner(".proc-num"),
            { y: 30, autoAlpha: 0, duration: 0.9, ease: "expo.out", clearProps: clear },
            at,
          );

          if (inner(".proc-arrow").length) {
            tl.fromTo(
              inner(".proc-arrow"),
              { clipPath: "inset(0% 100% 0% 0%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 0.8,
                ease: "power2.inOut",
                clearProps: "clipPath",
              },
              at + 0.15,
            );
          }

          tl.from(
            inner(".proc-step-title"),
            { y: 20, autoAlpha: 0, duration: 0.9, ease: "expo.out", clearProps: clear },
            at + 0.2,
          ).from(
            inner(".proc-step-text"),
            { y: 20, autoAlpha: 0, duration: 0.9, ease: "expo.out", clearProps: clear },
            at + 0.3,
          );
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="py-[56px] md:py-[64px] lg:py-[80px] xl:py-[96px] 2xl:py-[104px] 3xl:py-[113px]"
    >
      <div>
        <div className="max-w-[1480px] mx-auto xl:px-10 md:px-6 px-4">
          <div className="proc-head text-center max-w-[934px] mx-auto">
            <h2 className="proc-title tracking-[-3%] text-black mt-[5px] text-[32px] leading-[36px] md:text-[38px] md:leading-[42px] lg:text-[42px] lg:leading-[46px] xl:text-[48px] xl:leading-[52px] 2xl:text-[54px] 2xl:leading-[58px] 3xl:text-[60px] 3xl:leading-[64px]">
              Thoughtful Process Behind Every Healthcare{" "}
              <span className="font-playfair tracking-[-9%] italic font-light">
                Website
              </span>
            </h2>
            <p className="proc-text font-medium text-black mt-[9px] text-[15px] leading-[22px] md:text-[16px] md:leading-[23px] xl:text-[18px] xl:leading-[25px]">
              A clear 5-step process designed to launch your healthcare website
              on time
            </p>
          </div>

          <div className="proc-box process-border w-full flex flex-col gap-7 px-6 py-7 rounded-[24px] mt-[24px] md:flex-row md:justify-between md:items-start md:gap-3 md:px-4 md:py-4 lg:px-6 lg:py-5 lg:rounded-[30px] xl:px-8 2xl:w-[1399px] 2xl:h-[280px] 2xl:px-10 2xl:py-5.5 2xl:rounded-[40px] 3xl:mt-[28px]">
            {steps.map((step, i) => (
<div
  key={step.title}
  className="proc-step relative pb-7 last:pb-0 after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-[linear-gradient(90deg,rgba(6,53,244,0)_0%,#0635F4_50%,rgba(6,53,244,0)_100%)] last:after:hidden md:pb-0 md:after:hidden md:max-w-[130px] lg:max-w-[175px] xl:max-w-[200px] 2xl:max-w-[223px]"
>
                <div className="flex items-center justify-between gap-2">
                  <h5 className="proc-num text-[#0635F4] tracking-[-3%] text-[40px] md:text-[26px] lg:text-[32px] xl:text-[40px] 2xl:text-[50px]">
                    {String(i + 1).padStart(2, "0")}
                  </h5>
                  {i < steps.length - 1 && <StepArrow />}
                </div>
                <h4 className="proc-step-title text-black mt-[8px] text-[20px] leading-[24px] md:text-[13px] md:leading-[15px] lg:mt-[12px] lg:text-[16px] lg:leading-[18px] xl:mt-[15px] xl:text-[20px] xl:leading-[21px] 2xl:mt-[19px] 2xl:text-[24px] 2xl:leading-[24px]">
                  {step.title}
                </h4>
                <p className="proc-step-text font-medium text-black mt-[8px] text-[15px] leading-[20px] md:mt-[6px] md:text-[11px] md:leading-[14px] lg:mt-[9px] lg:text-[13px] lg:leading-[16px] xl:mt-[11px] xl:text-[14px] xl:leading-[17px] 2xl:mt-[14px] 2xl:text-[16px] 2xl:leading-[18px]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;