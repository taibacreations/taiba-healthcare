"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useIndustry } from "@/lib/industry";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const Impact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { content } = useIndustry();
  const impact = content.impact;

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const titleSplit = SplitText.create(q(".imp-title"), {
          type: "words",
          mask: "words",
        });
        const textSplit = SplitText.create(q(".imp-text"), {
          type: "lines",
          mask: "lines",
        });

        const clear = "transform,opacity,visibility,filter";

        /* ---------- Header ---------- */
        gsap
          .timeline({
            defaults: { ease: "expo.out", clearProps: clear },
            scrollTrigger: { trigger: q(".imp-head")[0], start: "top 80%", once: true },
            onComplete: () => {
              titleSplit.revert();
              textSplit.revert();
            },
          })
          .from(q(".imp-subtitle"), {
            y: 24,
            autoAlpha: 0,
            filter: "blur(6px)",
            duration: 1,
            ease: "power3.out",
          })
          .from(
            titleSplit.words,
            {
              yPercent: 120,
              rotate: 6,
              transformOrigin: "0% 100%",
              duration: 1.3,
              stagger: 0.05,
            },
            0.1,
          )
          .from(textSplit.lines, { yPercent: 105, duration: 1.1, stagger: 0.08 }, 0.45);

        /* ---------- Stats: line → number count-up → label ---------- */
        const items = q(".imp-stat");
        gsap.set(items, { "--line": 0 });

        const statsTl = gsap.timeline({
          scrollTrigger: { trigger: q(".imp-stats")[0], start: "top 85%", once: true },
        });

        items.forEach((item: HTMLElement, i: number) => {
          const inner = gsap.utils.selector(item);
          const numEl = inner(".imp-num")[0] as HTMLElement;
          const target = Number(numEl.dataset.value);
          const suffix = numEl.dataset.suffix ?? "";
          const counter = { val: 0 };
          const at = i * 0.15;

          numEl.textContent = `0${suffix}`;

          statsTl
            .to(item, { "--line": 1, duration: 0.9, ease: "expo.out" }, at)
            .from(
              inner(".imp-num"),
              { y: 30, autoAlpha: 0, duration: 1, ease: "expo.out", clearProps: clear },
              at,
            )
            .to(
              counter,
              {
                val: target,
                duration: 1.8,
                ease: "power3.out",
                onUpdate: () => {
                  numEl.textContent = `${Math.round(counter.val)}${suffix}`;
                },
              },
              at,
            )
            .from(
              inner(".imp-label"),
              { y: 16, autoAlpha: 0, duration: 0.9, ease: "power3.out", clearProps: clear },
              at + 0.2,
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
      className="pt-[48px] md:pt-[56px] lg:py-[64px] xl:py-[80px] 2xl:py-[96px] 3xl:py-[100px]"
    >
      <div className="max-w-[1620px] mx-auto xl:px-10 md:px-6 px-4">
        {/* Header */}
        <div className="imp-head text-center max-w-[760px] mx-auto">
          <h4 className="imp-subtitle uppercase text-black text-[16px] md:text-[18px] lg:text-[20px] 2xl:text-[22px]">
            {impact.eyebrow}
          </h4>
          <h2 className="imp-title uppercase tracking-[-3%] text-black mt-[5px] text-[32px] leading-[36px] md:text-[38px] md:leading-[42px] lg:text-[42px] lg:leading-[46px] xl:text-[48px] xl:leading-[52px] 2xl:text-[54px] 2xl:leading-[58px] 3xl:text-[60px] 3xl:leading-[64px]">
            {impact.titleStart}{" "}
            <span className="normal-case font-playfair tracking-[-9%] italic font-light">
              {impact.titleItalic}
            </span>
          </h2>
          <p className="imp-text font-medium text-black max-w-[720px] mx-auto mt-[9px] text-[15px] leading-[22px] md:text-[16px] md:leading-[23px] xl:text-[18px] xl:leading-[25px]">
            {impact.text}
          </p>
        </div>

        {/* Stats */}
        <div className="imp-stats grid grid-cols-2 md:grid-cols-4 mt-[28px] md:mt-[24px] xl:mt-[28px]">
          {impact.stats.map((s, i) => (
            <div
              key={s.label}
              className={`imp-stat relative flex flex-col items-center justify-center text-center py-6 md:py-[22px] lg:py-[26px] 2xl:py-[30px]
                border-[#E3E3E3] ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b" : ""} md:border-0
                md:after:absolute md:after:left-0 md:after:top-0 md:after:bottom-0 md:after:w-px md:after:bg-[#E3E3E3]
                md:after:origin-top md:after:scale-y-[var(--line,1)] md:first:after:hidden`}
            >
              <span
                className="imp-num font-calsans text-black leading-none tracking-[-2%] text-[40px] md:text-[44px] lg:text-[48px] xl:text-[52px] 2xl:text-[56px]"
                data-value={s.value}
                data-suffix={s.suffix}
              >
                {s.value}
                {s.suffix}
              </span>
              <span className="imp-label font-medium text-black mt-3 lg:mt-4 text-[15px] md:text-[16px] lg:text-[18px] xl:text-[19px] 2xl:text-[20px]">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Impact;