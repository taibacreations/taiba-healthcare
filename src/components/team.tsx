"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import ArrowIcon from "./arrow-icon";
import Link from "next/link";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/*
  member: oonch-neech (offset) + photo aur naam ka faasla
  img: photo ki width har breakpoint par (2xl+ = 1920 ki original)
*/
const members = [
  {
    name: "khalid mahmood",
    src: "/team1.webp",
    member: "gap-3 md:gap-[10px] lg:gap-[14px] xl:gap-[17px] 2xl:gap-5",
    img: "w-[130px] md:w-[100px] lg:w-[134px] xl:w-[166px] 2xl:w-[191px]",
  },
  {
    name: "M. Ashraf",
    src: "/team2.webp",
    member:
      "gap-3 md:gap-[10px] md:-mt-[8px] lg:gap-[14px] lg:-mt-[11px] xl:gap-[17px] xl:-mt-[14px] 2xl:gap-5 2xl:-mt-4",
    img: "w-[156px] md:w-[120px] lg:w-[161px] xl:w-[200px] 2xl:w-[230px]",
  },
  {
    name: "Shazma Sidiq",
    src: "/team3.webp",
    member:
      "gap-3 md:gap-[8px] md:mt-[10px] lg:gap-[11px] lg:mt-[14px] xl:gap-[14px] xl:mt-[17px] 2xl:gap-4 2xl:mt-5",
    img: "w-[153px] md:w-[117px] lg:w-[158px] xl:w-[196px] 2xl:w-[225px]",
  },
  {
    name: "Akhtar Ali",
    src: "/team4.webp",
    member:
      "gap-3 md:gap-[12px] md:-mt-[4px] lg:gap-[17px] lg:-mt-[6px] xl:gap-[21px] xl:-mt-[7px] 2xl:gap-6 2xl:-mt-2",
    img: "w-[144px] md:w-[110px] lg:w-[148px] xl:w-[184px] 2xl:w-[212px]",
  },
  {
    name: "Rimsha Javed",
    src: "/team5.webp",
    member:
      "gap-3 md:gap-[10px] md:-mt-[15px] lg:gap-[13px] lg:-mt-[20px] xl:gap-[16px] xl:-mt-[24px] 2xl:gap-[19px] 2xl:-mt-7",
    img: "w-[134px] md:w-[102px] lg:w-[138px] xl:w-[171px] 2xl:w-[197px]",
  },
];

const Team = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const titleSplit = SplitText.create(q(".team-title"), {
          type: "words",
          mask: "words",
        });
        const textSplit = SplitText.create(q(".team-text"), {
          type: "lines",
          mask: "lines",
        });

        const clear = "transform,opacity,visibility";

        /* ---------- Header ---------- */
        gsap
          .timeline({
            defaults: { ease: "expo.out", clearProps: clear },
            scrollTrigger: { trigger: q(".team-head")[0], start: "top 80%", once: true },
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

        /* ---------- Members: beech se lehar ---------- */
        gsap
          .timeline({
            scrollTrigger: { trigger: q(".team-row")[0], start: "top 80%", once: true },
          })
          .from(q(".team-member"), {
            y: 80,
            scale: 0.9,
            autoAlpha: 0,
            duration: 1.3,
            ease: "expo.out",
            stagger: { each: 0.12, from: "center" },
            clearProps: clear,
          })
          .from(
            q(".team-name"),
            {
              y: 20,
              autoAlpha: 0,
              duration: 0.9,
              ease: "power3.out",
              stagger: { each: 0.12, from: "center" },
              clearProps: clear,
            },
            0.4,
          )
          .from(
            q(".team-btn"),
            {
              y: 30,
              scale: 0.9,
              autoAlpha: 0,
              duration: 1,
              stagger: 0.12,
              ease: "back.out(1.7)",
              clearProps: clear,
            },
            0.8,
          );

        /* ---------- Idle float (photo par) ---------- */
        q(".team-img").forEach((img: HTMLElement) => {
          gsap.to(img, {
            y: gsap.utils.random(-6, -3),
            duration: gsap.utils.random(2.2, 3.4),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: gsap.utils.random(0, 1.5),
          });
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="pb-[48px] md:pb-[56px] lg:pb-[64px] xl:pb-[80px] 2xl:pb-[95px]"
    >
      <div>
        <div className="team-head max-w-[608px] mx-auto text-center px-5 md:px-0">
          <h2 className="team-title tracking-[-3%] text-black mt-[5px] text-[32px] leading-[36px] md:text-[38px] md:leading-[42px] lg:text-[42px] lg:leading-[46px] xl:text-[48px] xl:leading-[52px] 2xl:text-[54px] 2xl:leading-[58px] 3xl:text-[60px] 3xl:leading-[64px]">
            Our{" "}
            <span className="font-playfair tracking-[-9%] italic font-light">
              Team
            </span>
          </h2>
          <p className="team-text font-medium text-black mt-[5px] text-[17px] leading-[26px] md:text-[18px] md:leading-[27px] lg:text-[20px] lg:leading-[29px] xl:text-[22px] xl:leading-[31px] 2xl:text-[24px] 2xl:leading-[34px]">
            45+ specialists across design, engineering, AI, and growth marketing
            dedicated to turning ideas into results.
          </p>
        </div>

        <div className="team-row flex flex-wrap justify-center gap-x-4 gap-y-8 md:flex-nowrap md:justify-between md:items-start md:gap-5 max-w-[1460px] mx-auto xl:px-10 md:px-6 px-4 mt-[24px]">
          {members.map((m) => (
            <div
              key={m.name}
              className={`team-member flex flex-col items-center justify-center w-[calc(50%-8px)] md:w-auto ${m.member}`}
            >
              <div className="team-photo">
                <img src={m.src} alt="Team" className={`team-img h-auto ${m.img}`} />
              </div>
              <h3 className="team-name text-[#030C38] capitalize text-center text-[18px] md:text-[14px] lg:text-[17px] xl:text-[21px] 2xl:text-[24px]">
                {m.name}
              </h3>
            </div>
          ))}
        </div>

        <div className="group flex w-fit mx-auto items-center justify-center text-center mt-[28px] md:mt-[32px] 2xl:mt-[38px]">
          <Link
            href="https://taibacreations.com/team/"
            target="_blank"
            rel="noopener noreferrer"
            className="team-btn btn-roll inline-flex items-center justify-center text-[16px] md:text-[18px] leading-[31px] text-white tracking-[1%] bg-[#2D2D2D] rounded-full w-[120px] md:w-[132px] h-[46px]"
          >
            <span className="roll">
              <span data-text="See All">See All</span>
            </span>
          </Link>
          <Link
            href="https://taibacreations.com/team/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="See all team members"
            className="team-btn btn-arrow btn-arrow-dark relative inline-flex justify-center items-center rounded-full w-[46px] h-[46px] shrink-0 bg-[#2D2D2D]"
          >
            <span className="arrow-swap">
              <ArrowIcon />
              <ArrowIcon />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Team;