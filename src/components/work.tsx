"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import ArrowIcon from "./arrow-icon";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/* Card ke andar ki shared classes (2xl+ par original 1920 values) */
const CARD =
  "work-card relative bg-white border border-[#F0F0F0] work-shadow rounded-[13px] w-full 2xl:h-[451px]";
const NUM =
  "work-num tracking-[-3%] text-[#FAFAFA] absolute bottom-[-10%] right-3 xl:right-5 text-[120px] md:text-[90px] lg:text-[120px] xl:text-[160px] 2xl:text-[200px]";
const BODY =
  "relative px-5 py-5 md:px-3 md:py-3 lg:px-4 lg:py-4 xl:px-5 xl:py-5 2xl:px-6 2xl:py-[24px]";
const TAG =
  "bg-[#0635F4] text-white rounded-full max-w-fit text-[12px] px-4 py-1 md:text-[10px] md:px-3 lg:text-[11px] lg:px-4 xl:text-[12px] xl:px-5 2xl:text-[13px] 2xl:px-6 2xl:py-1.5";
const TITLE =
  "text-black mt-[14px] text-[22px] leading-[26px] md:mt-[8px] md:text-[17px] md:leading-[20px] lg:mt-[12px] lg:text-[21px] lg:leading-[24px] xl:mt-[15px] xl:text-[24px] xl:leading-[26px] 2xl:mt-[19px] 2xl:text-[28px]";
const TEXT =
  "font-medium text-black text-[15px] leading-[20px] md:text-[12px] md:leading-[15px] lg:text-[14px] lg:leading-[17px] xl:text-[15px] xl:leading-[18px] 2xl:text-[16px] 2xl:leading-[18px]";
const LINK =
  "work-link tracking-[1%] text-black text-[15px] leading-[20px] md:text-[12px] lg:text-[13px] xl:text-[14px] 2xl:text-[15px]";

const Work = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const titleSplit = SplitText.create(q(".work-title"), {
          type: "words",
          mask: "words",
        });
        const textSplit = SplitText.create(q(".work-text"), {
          type: "lines",
          mask: "lines",
        });

        /* ---------- Header ---------- */
        gsap
          .timeline({
            defaults: { ease: "expo.out", clearProps: "transform,opacity,visibility" },
            scrollTrigger: { trigger: q(".work-head")[0], start: "top 80%", once: true },
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

        /* ---------- Cards ---------- */
        const cards = q(".work-card");
        gsap.set(cards, { y: 80, scale: 0.96, autoAlpha: 0 });

        ScrollTrigger.batch(cards, {
          start: "top 88%",
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              y: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 1.2,
              ease: "power3.out",
              stagger: 0.12,
              clearProps: "transform,opacity,visibility",
            });

            gsap.from(
              batch.map((card) => card.querySelector(".work-img img")),
              {
                scale: 1.15,
                duration: 1.6,
                ease: "expo.out",
                stagger: 0.12,
                clearProps: "transform",
              },
            );
          },
        });

        /* ---------- Button ---------- */
        gsap.from(q(".work-btn"), {
          y: 30,
          scale: 0.9,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.12,
          ease: "back.out(1.7)",
          clearProps: "transform,opacity,visibility",
          scrollTrigger: { trigger: q(".work-btns")[0], start: "top 92%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="pt-[48px] md:pt-[56px] lg:pt-[64px] xl:pt-[72px] 2xl:pt-[80px] 3xl:pt-[85px]"
    >
      <div>
        <div className="max-w-[1480px] mx-auto xl:px-10 md:px-6 px-4">
          <div className="work-head text-center max-w-[675px] mx-auto">
            <h2 className="work-title tracking-[-3%] text-black mt-[5px] text-[32px] leading-[36px] md:text-[38px] md:leading-[42px] lg:text-[42px] lg:leading-[46px] xl:text-[48px] xl:leading-[52px] 2xl:text-[54px] 2xl:leading-[58px] 3xl:text-[60px] 3xl:leading-[64px]">
              Our Work,{" "}
              <span className="font-playfair tracking-[-9%] italic font-light">
                Your Inspiration
              </span>
            </h2>
            <p className="work-text font-medium text-black mt-[9px] text-[15px] leading-[22px] md:text-[16px] md:leading-[23px] xl:text-[18px] xl:leading-[25px]">
              Explore how we turn ideas into thoughtful, impactful digital
              experiences designed to solve real challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-[25px] mt-[24px] 3xl:mt-[28px]">
            {/* Card 1 */}
            <div className={CARD}>
              <h6 className={NUM}>01</h6>
              <div className="work-img overflow-hidden rounded-t-[13px]">
                <img src="/work1.webp" alt="work" className="w-full aspect-[9/5]" />
              </div>
              <div className={BODY}>
                
                <h3 className={`${TITLE} 2xl:leading-[20px]`}>
                  Alpha Morris Website Design
                </h3>
                <p className={`${TEXT} mt-[10px] mb-[8px] md:mt-[8px] md:mb-[6px] lg:mt-[12px] xl:mt-[15px] 2xl:mt-[19px] 2xl:mb-[9px]`}>
                  Custom healthcare website designed to build trust, explain
                  services clearly, and drive patient inquiries.
                </p>
                <Link href={"#"} className={LINK}>
                  Learn More
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className={CARD}>
              <h6 className={NUM}>02</h6>
              <div className="work-img overflow-hidden rounded-t-[13px]">
                <img src="/work2.webp" alt="work" className="w-full aspect-[9/5]" />
              </div>
              <div className={BODY}>
                
                <h3 className={`${TITLE} 2xl:leading-[20px]`}>
                  Magnolia Smiles Website
                </h3>
                <p className={`${TEXT} mt-[10px] mb-[16px] md:mt-[8px] md:mb-[10px] lg:mt-[12px] lg:mb-[16px] xl:mt-[15px] xl:mb-[22px] 2xl:mt-[19px] 2xl:mb-[28px]`}>
                  A conversion focused site built to book more patients.
                </p>
                <Link href={"#"} className={LINK}>
                  Learn More
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className={CARD}>
              <h6 className={NUM}>03</h6>
              <div className="work-img overflow-hidden rounded-t-[13px]">
                <img src="/work3.webp" alt="work" className="w-full aspect-[9/5]" />
              </div>
              <div className={BODY}>
                
                <h3 className={`${TITLE} 2xl:leading-[29px]`}>
                  Addiction Recovery <br /> Website Redesign
                </h3>
                <p className={`${TEXT} mt-[5px] mb-[8px] md:mb-[6px] 2xl:mb-[9px]`}>
                  High-converting landing page built to drive sales.
                </p>
                <Link href={"#"} className={LINK}>
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          <div className="work-btns group flex w-fit mx-auto items-center justify-center text-center mt-[28px] md:mt-[32px] 3xl:mt-[38px]">
            <Link
              href="https://taibacreations.com/case-studies"
              target="_blank"
              rel="noopener noreferrer"
              className="work-btn btn-roll inline-flex items-center justify-center text-[16px] md:text-[18px] leading-[31px] text-white tracking-[1%] bg-[#2D2D2D] rounded-full w-[120px] md:w-[132px] h-[46px]"
            >
              <span className="roll">
                <span data-text="See All">See All</span>
              </span>
            </Link>
            <Link
              href="https://taibacreations.com/case-studies"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="See all case studies"
              className="work-btn btn-arrow btn-arrow-dark relative inline-flex justify-center items-center rounded-full w-[46px] h-[46px] shrink-0 bg-[#2D2D2D]"
            >
              <span className="arrow-swap">
                <ArrowIcon />
                <ArrowIcon />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;