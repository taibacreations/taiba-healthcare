"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useIndustry } from "@/lib/industry";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { content, asset } = useIndustry();
  const experience = content.experience;

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const titleSplit = SplitText.create(q(".exp-title"), {
          type: "words",
          mask: "words",
        });
        const textSplit = SplitText.create(q(".exp-text"), {
          type: "lines",
          mask: "lines",
        });

        /* Panel ka kona: mobile par 40px, md+ par panel ki width ke hisaab se (1920 par 94px) */
        const panel = q(".exp-panel")[0] as HTMLElement | undefined;
        const r =
          window.innerWidth < 768 || !panel
            ? 40
            : Math.round((panel.offsetWidth * 94) / 794);

        const logos = q(".exp-logos");

        /* ---------- Left visuals ---------- */
        const visualsTl = gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: section, start: "top 75%", once: true },
          })
          .fromTo(
            q(".exp-panel"),
            { clipPath: `inset(0% 100% 0% 0% round 0px ${r}px ${r}px 0px)` },
            {
              clipPath: `inset(0% 0% 0% 0% round 0px ${r}px ${r}px 0px)`,
              duration: 1.5,
              ease: "expo.inOut",
              clearProps: "clipPath",
            },
          )
          .from(
            q(".exp-doctors"),
            {
              y: 120,
              autoAlpha: 0,
              duration: 1.6,
              clearProps: "transform,opacity,visibility",
            },
            0.6,
          );

        if (logos.length) {
          visualsTl.from(
            logos,
            {
              scale: 0.85,
              autoAlpha: 0,
              duration: 1.4,
              clearProps: "opacity,visibility",
            },
            0.8,
          );

          /* ---------- Logos: scroll parallax ---------- */
          gsap.to(logos, {
            yPercent: -10,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        visualsTl.from(
          q(".exp-blur"),
          { autoAlpha: 0, duration: 1.2, clearProps: "opacity,visibility" },
          1,
        );

        /* ---------- Heading + text ---------- */
        gsap
          .timeline({
            defaults: { ease: "expo.out", clearProps: "transform,opacity,visibility" },
            scrollTrigger: { trigger: q(".exp-title")[0], start: "top 80%", once: true },
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

        /* ---------- Timeline list: dot → text → line ---------- */
        const items = q(".exp-item");
        gsap.set(items, { "--line": 0 });

        const listTl = gsap.timeline({
          scrollTrigger: { trigger: q(".exp-list")[0], start: "top 80%", once: true },
        });

        items.forEach((item: HTMLElement, i: number) => {
          const inner = gsap.utils.selector(item);
          const at = i * 0.22;

          listTl
            .from(
              inner(".exp-dot"),
              {
                scale: 0,
                duration: 0.6,
                ease: "back.out(2.5)",
                clearProps: "transform",
              },
              at,
            )
            .from(
              inner(".exp-label"),
              {
                x: 40,
                autoAlpha: 0,
                duration: 0.9,
                ease: "expo.out",
                clearProps: "transform,opacity,visibility",
              },
              at + 0.05,
            )
            .to(item, { "--line": 1, duration: 0.5, ease: "power2.inOut" }, at + 0.2);
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden py-[24px] md:py-[16px] lg:py-[22px] xl:py-[28px] 2xl:py-[34px] 3xl:py-[42px]"
    >
      <div className="flex flex-col md:flex-row">
        {/* Left visual */}
        <div className="relative w-full">
          <div
            className="exp-panel relative rounded-l-none w-[73.5%] aspect-[794/897] rounded-r-[40px] md:aspect-auto md:w-[318px] md:h-[359px] md:rounded-r-[38px] lg:w-[423px] lg:h-[478px] lg:rounded-r-[50px] xl:w-[529px] xl:h-[598px] xl:rounded-r-[63px] 2xl:w-[635px] 2xl:h-[718px] 2xl:rounded-r-[75px] 3xl:w-[794px] 3xl:h-[897px] 3xl:rounded-r-[94px]"
            style={{ background: "var(--grad-panel)" }}
          >
            {experience.logos && (
              <img
                src={asset(experience.logos)}
                alt=""
                className="exp-logos h-auto absolute left-1/2 -translate-x-1/2 top-[24%] w-[73.4%] md:w-[233px] lg:w-[311px] xl:w-[389px] 2xl:w-[466px] 3xl:w-[583px]"
              />
            )}
          </div>
          <img
            src={asset(experience.image)}
            alt={experience.imageAlt}
            className="exp-doctors h-auto absolute top-[12%] left-0 w-full md:w-[432px] lg:w-[576px] xl:w-[720px] 2xl:w-[864px] 3xl:w-[1080px]"
          />
          <img
            src={asset("banner-blur.webp")}
            alt=""
            className="exp-blur absolute w-full bottom-[-12%] md:bottom-[-7%] xl:bottom-[-12%] h-[90px] md:h-[127px] xl:h-[159px] 2xl:h-[191px] 3xl:h-[239px]"
          />
        </div>

        {/* Right content */}
        <div className="relative shrink-0 px-5 mt-10 md:px-0 md:mt-[40px] md:w-[360px] md:left-[-2%] lg:mt-[60px] lg:w-[440px] lg:left-[-4%] xl:mt-[80px] xl:w-[560px] 2xl:mt-[96px] 2xl:w-[640px] 2xl:left-[-6%] 3xl:mt-[118px] 3xl:w-auto 3xl:left-[-11.5%] 3xl:shrink">
          <div>
            <h2 className="exp-title tracking-[-3%] text-black mt-[5px] text-[30px] leading-[34px] md:text-[26px] md:leading-[30px] lg:text-[34px] lg:leading-[38px] xl:text-[42px] xl:leading-[46px] 2xl:text-[50px] 2xl:leading-[54px] 3xl:text-[60px] 3xl:leading-[64px]">
              {experience.titleStart}{" "}
              <span className="font-playfair tracking-[-9%] italic font-light">
                {experience.titleItalic}
              </span>
            </h2>
            <p className="exp-text font-medium text-black mt-[9px] text-[15px] leading-[22px] max-w-[586px] md:text-[12px] md:leading-[17px] md:max-w-[340px] lg:text-[14px] lg:leading-[20px] lg:max-w-[420px] xl:text-[16px] xl:leading-[22px] xl:max-w-[500px] 2xl:text-[17px] 2xl:leading-[24px] 2xl:max-w-[560px] 3xl:text-[18px] 3xl:leading-[25px] 3xl:max-w-[586px]">
              {experience.text}
            </p>
          </div>

          <div className="exp-list flex flex-col mt-6 gap-4 md:mt-[16px] md:gap-3 lg:mt-[24px] lg:gap-4 xl:mt-[30px] xl:gap-5 2xl:mt-[34px] 2xl:gap-6 3xl:mt-[38px] 3xl:gap-7">
            {experience.features.map((label) => (
              <div
                key={label}
                className="exp-item relative flex items-center gap-3 lg:gap-4 xl:gap-5 after:absolute after:top-1/2 after:w-px after:bg-brand last:after:hidden after:left-[7.5px] after:h-[calc(100%+16px)] md:after:h-[calc(100%+12px)] lg:after:left-[9.5px] lg:after:h-[calc(100%+16px)] xl:after:left-[11.5px] xl:after:h-[calc(100%+20px)] 2xl:after:h-[calc(100%+24px)] 3xl:after:h-[calc(100%+28px)]"
              >
                <div className="exp-dot relative z-10 shrink-0 w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 bg-brand rounded-full blue-border" />
                <p className="exp-label font-semibold text-black text-[16px] md:text-[13px] lg:text-[16px] xl:text-[19px] 2xl:text-[22px] 3xl:text-[24px]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;