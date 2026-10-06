"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const contactItems = [
  {
    label: "Email",
    value: "info@taibacreations.com",
    href: "mailto:info@taibacreations.com",
    icon: (
      <svg width="20" height="16" viewBox="0 0 20 16" fill="#497CFC">
        <rect x="1" y="1" width="18" height="14" rx="2" fill="#497CFC" />
        <path
          d="M2 3L10 9L18 3"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Availability",
    value: "Available 24/7",
    href: null,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#497CFC">
        <circle cx="12" cy="12" r="11" fill="#497CFC" />
        <path
          d="M7 12.5L10.5 16L17 8.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Phone Number",
    value: "+17747240949",
    href: "tel:+17747240949",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#497CFC">
        <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8z" />
      </svg>
    ),
  },
];

const inputClass =
  "ct-input w-full rounded-[10px] border border-[#D9D9D9] bg-[#FAFAFA] px-4 font-outfit text-black placeholder:text-[#2D2D2D66] outline-none focus:border-[#0033FF] transition-colors text-[16px] xl:text-[18px]";

const labelClass = "font-calsans text-[#2D2D2D] text-[16px] xl:text-[18px]";

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: form submit logic (API route / email service)
  };

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const titleSplit = SplitText.create(q(".ct-title"), {
          type: "words",
          mask: "words",
        });
        const textSplit = SplitText.create(q(".ct-text"), {
          type: "lines",
          mask: "lines",
        });

        const clear = "transform,opacity,visibility";

        /* ---------- Card + content ---------- */
        gsap
          .timeline({
            defaults: { ease: "expo.out", clearProps: clear },
            scrollTrigger: {
              trigger: q(".ct-card")[0],
              start: "top 80%",
              once: true,
            },
            onComplete: () => {
              titleSplit.revert();
              textSplit.revert();
            },
          })
          .from(q(".ct-card"), {
            y: 100,
            scale: 0.96,
            autoAlpha: 0,
            duration: 1.4,
          })
          .from(
            titleSplit.words,
            {
              yPercent: 120,
              rotate: 6,
              transformOrigin: "0% 100%",
              duration: 1.3,
              stagger: 0.04,
            },
            0.4,
          )
          .from(
            textSplit.lines,
            { yPercent: 105, duration: 1.1, stagger: 0.08 },
            0.75,
          )
          .from(
            q(".ct-item"),
            {
              x: -30,
              autoAlpha: 0,
              duration: 1,
              stagger: 0.1,
              ease: "power3.out",
            },
            0.9,
          )
          .from(
            q(".ct-field"),
            {
              y: 30,
              autoAlpha: 0,
              duration: 1,
              stagger: 0.08,
              ease: "power3.out",
            },
            0.5,
          )
          .from(
            q(".ct-btn"),
            { y: 24, autoAlpha: 0, duration: 1, ease: "back.out(1.6)" },
            0.95,
          );

        /* ---------- Watermark + footer (clip reveal, transform nahi chhedte) ---------- */
        gsap
          .timeline({
            scrollTrigger: {
              trigger: q(".ct-mark")[0],
              start: "top 95%",
              once: true,
            },
          })
          .fromTo(
            q(".ct-mark"),
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.6,
              ease: "expo.out",
              clearProps: "clipPath",
            },
          )
          .fromTo(
            q(".ct-footer"),
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.2,
              ease: "expo.out",
              clearProps: "clipPath",
            },
            0.3,
          );
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-[url(/contact.webp)] bg-cover bg-no-repeat bg-bottom overflow-hidden"
    >
      {/* Only covers the top transition */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#FFFFFF] to-transparent" />
      <img
        src="/taiba.png"
        alt="logo"
        className="ct-mark absolute left-1/2 -translate-x-1/2 bottom-0 w-[88%] max-w-none h-auto 3xl:w-auto"
      />

      <div className="relative z-10 px-4 pt-[64px] pb-[120px] md:pt-[80px] md:pb-[140px] lg:pt-[100px] lg:pb-[160px] xl:pt-[120px] xl:pb-[190px] 2xl:pt-[130px] 2xl:pb-[200px] 3xl:pt-[137px] 3xl:pb-[208px]">
        <div className="ct-card mx-auto flex flex-col md:flex-row overflow-hidden bg-white max-w-[1022px] rounded-[24px] md:rounded-[30px] xl:rounded-[40px]">
          {/* Left panel */}
          <div
            className="shrink-0 text-white px-6 py-8 md:w-[300px] md:px-7 md:py-8 lg:w-[360px] lg:px-11 lg:py-10 xl:w-[426px] xl:px-16 xl:py-[52px]"
            style={{
              background: "linear-gradient(180deg, #0033FF 0%, #5288FA 100%)",
            }}
          >
            <h2 className="ct-title font-calsans tracking-[-0.03em] text-[34px] leading-[36px] md:text-[30px] md:leading-[32px] lg:text-[38px] lg:leading-[38px] xl:text-[50px] xl:leading-[47px]">
              Your Next Patient Is Searching for{" "}
              <span className="font-playfair italic font-light tracking-[-0.09em]">
                You Right Now.
              </span>
            </h2>

            <p className="ct-text font-medium mt-3 text-[16px] leading-[23px] md:text-[15px] md:leading-[21px] lg:text-[16px] lg:leading-[23px] xl:text-[18px] xl:leading-[25px]">
              Make Sure Patients Find Your Clinic Before They Find Your
              Competitors
            </p>

            <div className="flex flex-col mt-7 gap-5 md:gap-4 xl:gap-6">
              {contactItems.map((item) => {
                const value = (
                  <span className="font-calsans tracking-[-0.02em] break-all text-[18px] leading-[24px] md:text-[15px] md:leading-[20px] lg:text-[18px] lg:leading-[24px] xl:text-[20px] xl:leading-[26px]">
                    {item.value}
                  </span>
                );

                return (
                  <div
                    key={item.label}
                    className="ct-item flex items-center gap-3 xl:gap-4"
                  >
                    <span className="ct-icon flex justify-center items-center rounded-full bg-white shrink-0 w-[44px] h-[44px] md:w-[40px] md:h-[40px] xl:w-[48px] xl:h-[48px]">
                      {item.icon}
                    </span>
                    <div className="flex flex-col gap-2 min-w-0">
                      <span className="font-medium leading-[13px] text-[15px] md:text-[14px] xl:text-[16px]">
                        {item.label}
                      </span>
                      {item.href ? <a href={item.href}>{value}</a> : value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right form */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 px-6 py-8 md:px-7 md:py-8 lg:px-12 lg:py-11 xl:px-16 xl:py-14"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 xl:gap-6">
              <label className="ct-field flex flex-col gap-2">
                <span className={labelClass}>Name</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  required
                  className={`${inputClass} h-[48px] xl:h-[50px]`}
                />
              </label>
              <label className="ct-field flex flex-col gap-2">
                <span className={labelClass}>Email</span>
                <input
                  type="email"
                  name="email"
                  placeholder="jane@clinic.com"
                  required
                  className={`${inputClass} h-[48px] xl:h-[50px]`}
                />
              </label>
            </div>

            <label className="ct-field flex flex-col gap-2 mt-5 xl:mt-6">
              <span className={labelClass}>Project Type</span>
              <input
                type="text"
                name="projectType"
                placeholder="Clinic Website Redesign"
                className={`${inputClass} h-[48px] xl:h-[50px]`}
              />
            </label>

            <label className="ct-field flex flex-col gap-2 mt-5 xl:mt-6">
              <span className={labelClass}>Message</span>
              <textarea
                data-lenis-prevent
                name="message"
                placeholder="Tell me about your vision..."
                rows={4}
                className={`${inputClass} resize-none py-3 h-[110px] xl:h-[122px]`}
              />
            </label>

            <button
              type="submit"
              className="ct-btn send-btn w-full flex justify-center items-center gap-2 mt-6 xl:mt-7 text-white font-calsans cursor-pointer h-[52px] xl:h-[56px] text-[16px] xl:text-[18px]"
              style={{
                borderRadius: 12,
                background: "linear-gradient(180deg, #0033FF 0%, #3D6EFF 100%)",
              }}
            >
              Send Message
              <svg width="12" height="11" viewBox="0 0 16 15" fill="none">
                <path
                  d="M15.7071 8.07136C16.0976 7.68084 16.0976 7.04768 15.7071 6.65715L9.34315 0.29319C8.95262 -0.0973344 8.31946 -0.0973344 7.92893 0.29319C7.53841 0.683714 7.53841 1.31688 7.92893 1.7074L13.5858 7.36426L7.92893 13.0211C7.53841 13.4116 7.53841 14.0448 7.92893 14.4353C8.31946 14.8259 8.95262 14.8259 9.34315 14.4353L15.7071 8.07136ZM0 7.36426V8.36426H15V7.36426V6.36426H0V7.36426Z"
                  fill="white"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Footer bar */}
      <div className="ct-footer absolute bottom-0 left-1/2 -translate-x-1/2 z-10 flex justify-center items-center text-white font-calsans text-center px-6 bg-[#0033FF] w-full max-w-[1056px] h-[52px] rounded-t-[40px] text-[13px] md:h-[60px] md:rounded-t-[70px] md:text-[16px] xl:h-[68px] xl:rounded-t-[90px] xl:text-[18px]">
        TAIBA Creations @ 2026. All Rights Reserved.
      </div>
    </section>
  );
};

export default Contact;
