"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useIndustry } from "@/lib/industry";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/* Icon size: har breakpoint par height, width icon ki shakal se (1920 par ~64px) */
const ICON =
  "svc-icon shrink-0 w-auto object-contain h-[44px] md:h-[34px] lg:h-[42px] xl:h-[50px] 2xl:h-[56px] 3xl:h-[64px]";

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { content, asset } = useIndustry();
  const services = content.services;

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const titleSplit = SplitText.create(q(".svc-title"), {
          type: "words",
          mask: "words",
        });
        const textSplit = SplitText.create(q(".svc-text"), {
          type: "lines",
          mask: "lines",
        });

        const clear = "transform,opacity,visibility,filter";

        /* ---------- Header ---------- */
        gsap
          .timeline({
            defaults: { ease: "expo.out", duration: 1.2, clearProps: clear },
            scrollTrigger: {
              trigger: q(".svc-head")[0],
              start: "top 80%",
              once: true,
            },
            onComplete: () => {
              titleSplit.revert();
              textSplit.revert();
            },
          })
          .from(q(".svc-subtitle"), {
            y: 24,
            autoAlpha: 0,
            filter: "blur(6px)",
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

        /* ---------- Cards: har row screen par aate hi ---------- */
        const cards = q(".svc-card");
        gsap.set(cards, { y: 80, scale: 0.96, autoAlpha: 0 });

        ScrollTrigger.batch(cards, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              y: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 1.2,
              ease: "power3.out",
              stagger: 0.12,
              clearProps: "transform,opacity,visibility",
            }),
        });

        /* ---------- Spotlight (cursor ke saath roshni) ---------- */
        if (!window.matchMedia("(pointer: fine)").matches) return;

        const onMove = (e: MouseEvent) => {
          const card = (e.target as Element).closest<HTMLElement>(".svc-card");
          if (!card) return;
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${e.clientX - r.left}px`);
          card.style.setProperty("--my", `${e.clientY - r.top}px`);
        };

        section.addEventListener("mousemove", onMove);
        return () => section.removeEventListener("mousemove", onMove);
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="pb-12 md:pb-16 3xl:pb-[20px]">
      <div className="mt-[16px] 3xl:mt-[24px]">
        <div>
          <div className="svc-head text-center max-w-[810px] mx-auto px-5 md:px-0">
            <h4 className="svc-subtitle text-black text-[18px] md:text-[20px] lg:text-[22px] 2xl:text-[24px]">
              {services.eyebrow}
            </h4>
            <h2 className="svc-title tracking-[-3%] text-black mt-[5px] text-[32px] leading-[36px] md:text-[38px] md:leading-[42px] lg:text-[42px] lg:leading-[46px] xl:text-[48px] xl:leading-[52px] 2xl:text-[54px] 2xl:leading-[58px] 3xl:text-[60px] 3xl:leading-[64px]">
              {services.titleStart}{" "}
              <span className="font-playfair tracking-[-9%] italic font-light">
                {services.titleItalic}
              </span>
            </h2>
            <p className="svc-text font-medium text-black max-w-[623px] mx-auto mt-[9px] text-[15px] leading-[22px] md:text-[16px] md:leading-[23px] xl:text-[18px] xl:leading-[25px]">
              {services.text}
            </p>
          </div>

          <div className="svc-grid max-w-[1480px] mx-auto xl:px-5 md:px-6 px-4 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 2xl:gap-6 3xl:gap-7 mt-[28px] md:mt-[32px] 3xl:mt-[41px]">
            {services.items.map((s, i) => (
              <div
                key={s.title}
                className="svc-card w-full rounded-[16px] lg:rounded-[20px] border border-[#B5B5B5] px-6 py-5 md:px-5 md:py-4 lg:px-6 xl:px-8 3xl:px-10 3xl:min-h-[300px]"
              >
                <div className="flex justify-between items-center gap-3">
                  <h4 className="svc-num text-neutral tracking-[1.7%] text-[44px] md:text-[36px] lg:text-[42px] xl:text-[48px] 2xl:text-[54px] 3xl:text-[60px]">
                    {String(i + 1).padStart(2, "0")}
                  </h4>
                  <img src={asset(s.icon)} alt="" className={ICON} />
                </div>
                <h3 className="svc-heading text-black leading-[123%] whitespace-pre-line text-[24px] md:text-[18px] lg:text-[22px] xl:text-[26px] 2xl:text-[29px] 3xl:text-[32px]">
                  {s.title}
                </h3>
                <p className="svc-desc text-black leading-[142%] font-medium mt-[5px] text-[16px] md:text-[13px] lg:text-[15px] xl:text-[17px] 2xl:text-[18px]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;