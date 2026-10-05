"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/* img: logo ki width circle ke percent mein (1920 par 125px circle) */
const awards = [
  { src: "/fiverr.png", img: "w-[55.2%]", title: ["Fiverr", "Millionaire"] },
  { src: "/cpc.png", img: "w-[66.4%]", title: ["top Rated", "seller-cpc Pak"] },
  { src: "/verified.png", img: "w-[51.2%]", title: ["Vetted Pro", "on fiverr"] },
  { src: "/toprated.png", img: "w-[67.2%]", title: ["Fiverr top", "rated agency"] },
  { src: "/extraordinary.png", img: "w-[48%]", title: ["Extraordinary", "Freelancer"] },
];

const Awards = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const titleSplit = SplitText.create(q(".award-title"), {
          type: "words",
          mask: "words",
        });
        const textSplit = SplitText.create(q(".award-text"), {
          type: "lines",
          mask: "lines",
        });

        const clear = "transform,opacity,visibility";

        /* ---------- Header ---------- */
        gsap
          .timeline({
            defaults: { ease: "expo.out", clearProps: clear },
            scrollTrigger: { trigger: q(".award-head")[0], start: "top 80%", once: true },
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
          .from(textSplit.lines, { yPercent: 105, duration: 1.1, stagger: 0.08 }, 0.3);

        /* ---------- Cards ---------- */
        const cards = q(".award-card");
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
              stagger: 0.1,
              clearProps: clear,
            });

            gsap.from(
              batch.map((card) => card.querySelector(".award-circle")),
              {
                scale: 0.5,
                autoAlpha: 0,
                duration: 1,
                ease: "back.out(1.8)",
                stagger: 0.1,
                delay: 0.3,
                clearProps: clear,
              },
            );
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="py-[14px]">
      <div>
        <div className="award-head text-center px-5 md:px-0">
          <h2 className="award-title tracking-[-3%] text-black mt-[5px] text-[32px] leading-[36px] md:text-[38px] md:leading-[42px] lg:text-[42px] lg:leading-[46px] xl:text-[48px] xl:leading-[52px] 2xl:text-[54px] 2xl:leading-[58px] 3xl:text-[60px] 3xl:leading-[64px]">
            Awards &{" "}
            <span className="font-playfair tracking-[-9%] italic font-light">
              Recognition
            </span>
          </h2>
          <p className="award-text font-medium text-black mt-[5px] text-[17px] leading-[26px] md:text-[18px] md:leading-[27px] lg:text-[20px] lg:leading-[29px] xl:text-[22px] xl:leading-[31px] 2xl:text-[24px] 2xl:leading-[34px]">
            Recognized for excellence and consistent results
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:flex-nowrap md:justify-between md:items-center md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-0 max-w-[1470px] mx-auto xl:px-10 md:px-6 px-4 mt-[24px] md:mt-[28px] 2xl:mt-[35px]">
          {awards.map((award) => (
            <div
              key={award.src}
              className="award-card border border-[#ACACAC] w-[calc(50%-6px)] aspect-[255/302] rounded-[14px] md:w-auto md:flex-1 md:rounded-[12px] lg:rounded-[16px] 2xl:flex-none 2xl:w-[255px] 2xl:h-[302px] 2xl:aspect-auto 2xl:rounded-[20px]"
            >
              <div className="flex flex-col justify-center items-center text-center pt-[14.9%] gap-3 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6">
                <div className="award-circle flex justify-center items-center rounded-full w-[49%] aspect-square bg-[#F2F2F2]">
                  <img
                    src={award.src}
                    alt="Award"
                    className={`award-logo ${award.img} h-auto`}
                  />
                </div>
                <h3 className="capitalize text-black text-[18px] leading-[22px] md:text-[13px] md:leading-[16px] lg:text-[18px] lg:leading-[21px] xl:text-[22px] xl:leading-[26px] 2xl:text-[28px] 2xl:leading-[32px]">
                  {award.title[0]} <br /> {award.title[1]}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Awards;