"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useIndustry } from "@/lib/industry";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const EASE = "cubic-bezier(0.19, 1, 0.22, 1)";

const Faq = () => {
  const [open, setOpen] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { content } = useIndustry();
  const faq = content.faq;

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const titleSplit = SplitText.create(q(".faq-title"), {
          type: "words",
          mask: "words",
        });
        const textSplit = SplitText.create(q(".faq-text"), {
          type: "lines",
          mask: "lines",
        });

        const clear = "transform,opacity,visibility";

        gsap
          .timeline({
            defaults: { ease: "expo.out", clearProps: clear },
            scrollTrigger: { trigger: section, start: "top 75%", once: true },
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
          .from(textSplit.lines, { yPercent: 105, duration: 1.1, stagger: 0.08 }, 0.3)
          .from(
            q(".faq-item"),
            { y: 50, autoAlpha: 0, duration: 1.1, stagger: 0.08, ease: "power3.out" },
            0.4,
          );
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="py-[56px] md:py-[64px] lg:py-[80px] xl:py-[96px] 2xl:py-[112px]
        [--fp:18px] [--fpr:18px] [--ficon:26px]
        md:[--fp:24px] md:[--fpr:32px] md:[--ficon:30px]
        xl:[--fp:30px] xl:[--fpr:44px]"
    >
      <div className="max-w-[1470px] mx-auto xl:px-10 md:px-6 px-4">
        <div>
          <h2 className="faq-title leading-[100%] tracking-[-3%] text-black mt-[5px] text-[30px] md:text-[36px] lg:text-[40px] xl:text-[46px] 2xl:text-[50px]">
            {faq.titleStart}{" "}
            <span className="font-playfair tracking-[-9%] italic font-light">
              {faq.titleItalic}
            </span>
          </h2>
          <p className="faq-text font-medium text-black mt-[5px] text-[15px] leading-[24px] md:text-[16px] md:leading-[28px] xl:text-[18px] xl:leading-[34px]">
            {faq.text}
          </p>
        </div>

        <div className="flex flex-col gap-3 md:gap-4 xl:gap-5 mt-6">
          {faq.items.map((item, i) => {
            const isOpen = open === i;

            return (
              <div
                key={i}
                className={`faq-item rounded-[14px] md:rounded-[20px] border ${isOpen ? "is-open" : ""}`}
                style={{
                  background: isOpen ? "var(--brand)" : "#FFFFFF",
                  borderColor: isOpen ? "var(--brand)" : "#ACACAC",
                  transition: `background-color 0.5s ease, border-color 0.5s ease, box-shadow 0.6s ${EASE}`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex justify-between items-center gap-3 md:gap-6 text-left cursor-pointer"
                  style={{
                    padding: isOpen
                      ? "var(--fp) var(--fpr) 0 var(--fp)"
                      : "var(--fp) var(--fpr) var(--fp) var(--fp)",
                    transition: `padding 0.6s ${EASE}`,
                  }}
                  aria-expanded={isOpen}
                >
                  <span
                    className="faq-q font-calsans leading-[115%] md:leading-[100%] text-[18px] md:text-[22px] lg:text-[26px] xl:text-[30px]"
                    style={{
                      color: isOpen ? "#FFFFFF" : "#000000",
                      transition: `color 0.5s ease, translate 0.6s ${EASE}`,
                    }}
                  >
                    {item.q}
                  </span>

                  <span
                    className="faq-icon flex justify-center items-center rounded-full shrink-0"
                    style={{
                      width: "var(--ficon)",
                      height: "var(--ficon)",
                      background: isOpen ? "#FFFFFF" : "var(--brand)",
                      rotate: isOpen ? "180deg" : "0deg",
                      transition: `background-color 0.5s ease, rotate 0.6s ${EASE}`,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M1 6H11"
                        strokeWidth="2"
                        strokeLinecap="round"
                        style={{
                          stroke: isOpen ? "var(--brand)" : "#FFFFFF",
                          transition: "stroke 0.5s ease",
                        }}
                      />
                      <path
                        d="M6 1V11"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        style={{
                          transformBox: "fill-box",
                          transformOrigin: "center",
                          scale: isOpen ? "1 0" : "1 1",
                          transition: `scale 0.5s ${EASE}`,
                        }}
                      />
                    </svg>
                  </span>
                </button>

                <div
                  className="grid"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: `grid-template-rows 0.6s ${EASE}`,
                  }}
                >
                  <div className="overflow-hidden">
                    <p
                      className="font-medium leading-[1.3] md:leading-[1.2] text-white max-w-[1020px] text-[15px] md:text-[16px] xl:text-[18px]"
                      style={{
                        padding: "12px var(--fp) calc(var(--fp) + 8px) var(--fp)",
                        opacity: isOpen ? 1 : 0,
                        translate: isOpen ? "0 0" : "0 12px",
                        transition: isOpen
                          ? `opacity 0.6s ease 0.15s, translate 0.7s ${EASE} 0.15s`
                          : "opacity 0.2s ease, translate 0.3s ease",
                      }}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;