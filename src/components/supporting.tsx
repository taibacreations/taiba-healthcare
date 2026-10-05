"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import ArrowIcon from "./arrow-icon";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const Supporting = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    videoRef.current?.play();
    setPlaying(true);
  };

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const titleSplit = SplitText.create(q(".sup-title"), {
          type: "words",
          mask: "words",
        });
        const textSplit = SplitText.create(q(".sup-text"), {
          type: "lines",
          mask: "lines",
        });

        const cleanups: (() => void)[] = [];

        /* ---------- Companies: 3D tilt + glare ---------- */
        const startCompaniesTilt = () => {
          if (!window.matchMedia("(pointer: fine)").matches) return;

          const tilt = q(".sup-companies-tilt")[0] as HTMLElement | undefined;
          const glare = q(".sup-glare")[0] as HTMLElement | undefined;
          if (!tilt || !glare) return;

          gsap.set(tilt, { transformPerspective: 1200, transformOrigin: "50% 60%" });

          const rotY = gsap.quickTo(tilt, "rotationY", { duration: 1.2, ease: "power3" });
          const rotX = gsap.quickTo(tilt, "rotationX", { duration: 1.2, ease: "power3" });
          const moveX = gsap.quickTo(tilt, "x", { duration: 1.2, ease: "power3" });
          const gx = gsap.quickTo(glare, "--gx", { duration: 0.6, ease: "power3" });
          const gy = gsap.quickTo(glare, "--gy", { duration: 0.6, ease: "power3" });

          const onMove = (e: MouseEvent) => {
            const r = tilt.getBoundingClientRect();
            const nx = gsap.utils.clamp(-1, 1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2));
            const ny = gsap.utils.clamp(-1, 1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2));

            rotY(nx * 9);
            rotX(ny * -7);
            moveX(nx * 14);
            gx(((e.clientX - r.left) / r.width) * 100);
            gy(((e.clientY - r.top) / r.height) * 100);
          };

          const onEnter = () => gsap.to(glare, { opacity: 1, duration: 0.6, ease: "power2.out" });
          const onLeave = () => {
            rotY(0);
            rotX(0);
            moveX(0);
            gsap.to(glare, { opacity: 0, duration: 0.8, ease: "power2.out" });
          };

          section.addEventListener("mousemove", onMove);
          section.addEventListener("mouseenter", onEnter);
          section.addEventListener("mouseleave", onLeave);
          cleanups.push(() => {
            section.removeEventListener("mousemove", onMove);
            section.removeEventListener("mouseenter", onEnter);
            section.removeEventListener("mouseleave", onLeave);
          });
        };

        /* ---------- Entrance ---------- */
        const tl = gsap.timeline({
          defaults: {
            ease: "power3.out",
            duration: 1,
            clearProps: "transform,opacity,visibility,filter",
          },
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
          onComplete: () => {
            titleSplit.revert();
            textSplit.revert();
            startCompaniesTilt();
          },
        });

        tl.from(q(".sup-companies"), {
          y: 80,
          scale: 0.94,
          autoAlpha: 0,
          filter: "blur(14px)",
          duration: 1.6,
          ease: "expo.out",
        })
          .from(q(".sup-subtitle"), { y: 24, autoAlpha: 0, filter: "blur(6px)" }, 0.4)
          .from(
            titleSplit.words,
            {
              yPercent: 120,
              rotate: 6,
              transformOrigin: "0% 100%",
              duration: 1.3,
              stagger: 0.05,
              ease: "expo.out",
            },
            0.5,
          )
          .from(
            textSplit.lines,
            { yPercent: 105, duration: 1.1, stagger: 0.08, ease: "expo.out" },
            0.85,
          )
          .from(
            q(".sup-btn"),
            { y: 30, scale: 0.9, autoAlpha: 0, stagger: 0.12, ease: "back.out(1.7)" },
            1.05,
          );

        /* ---------- Companies: scroll parallax (wrapper par) ---------- */
        gsap.to(q(".sup-companies-wrap"), {
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        /* ---------- Play button pop (har screen par) ---------- */
        gsap.from(q(".play-circle"), {
          scale: 0,
          autoAlpha: 0,
          duration: 1.1,
          ease: "back.out(2)",
          clearProps: "transform,opacity,visibility",
          scrollTrigger: {
            trigger: q(".sup-video")[0],
            start: "top 55%",
            once: true,
          },
        });

        return () => cleanups.forEach((fn) => fn());
      });

      /* ---------- Video: scroll reveal sirf md+ par (mobile par nahi) ---------- */
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const videoTrigger = {
          trigger: q(".sup-video")[0],
          start: "top 90%",
          end: "top 30%",
          scrub: 1,
        };

        gsap.fromTo(
          q(".sup-video"),
          { clipPath: "inset(0% 14% 24% 14% round 30px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 30px)",
            ease: "none",
            scrollTrigger: videoTrigger,
          },
        );

        gsap.fromTo(
          q(".sup-video video"),
          { scale: 1.25, transformOrigin: "50% 0%" },
          { scale: 1, ease: "none", scrollTrigger: { ...videoTrigger } },
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="pb-[48px] md:pb-[56px] lg:pb-[64px] xl:pb-[70px] 2xl:pb-[80px] 3xl:pb-[95px]"
    >
      <div>
        <div>
          <div className="sup-companies-wrap flex justify-center items-center px-4 md:px-6 md:-mt-[14px]">
            <div className="sup-companies-tilt relative w-full max-w-[1185px] will-change-transform">
              <img
                src="/companies.webp"
                alt="companies"
                className="sup-companies block w-full h-auto"
              />
              {/* Glare: sirf coins par (image hi mask hai) */}
              <div
                className="sup-glare absolute inset-0 pointer-events-none"
                style={
                  {
                    "--gx": 50,
                    "--gy": 30,
                    opacity: 0,
                    background:
                      "radial-gradient(circle at calc(var(--gx) * 1%) calc(var(--gy) * 1%), rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 35%)",
                    mixBlendMode: "soft-light",
                    WebkitMaskImage: "url(/companies.webp)",
                    maskImage: "url(/companies.webp)",
                    WebkitMaskSize: "100% 100%",
                    maskSize: "100% 100%",
                  } as React.CSSProperties
                }
              />
            </div>
          </div>

          <div className="text-center max-w-[500px] 3xl:max-w-[690px] mx-auto px-5 md:px-0 relative -mt-3 md:mt-[-9%] lg:mt-[-10%] xl:mt-[-9.6%] 2xl:mt-[-8%] 3xl:mt-[-6.4%]">
            <h4 className="sup-subtitle text-black text-[18px] md:text-[20px] lg:text-[22px] 2xl:text-[24px]">
              Our Healthcare Clients
            </h4>
            <h2 className="sup-title tracking-[-3%] text-black mt-[5px] text-[32px] leading-[36px] md:text-[38px] md:leading-[42px] lg:text-[42px] lg:leading-[46px] xl:text-[48px] xl:leading-[52px] 2xl:text-[54px] 2xl:leading-[58px] 3xl:text-[60px] 3xl:leading-[64px]">
              Supporting Healthcare Businesses{" "}
              <span className="font-playfair tracking-[-9%] italic font-light">
                Worldwide
              </span>
            </h2>
            <p className="sup-text font-medium text-black max-w-[623px] mx-auto mt-[9px] text-[15px] leading-[22px] md:text-[16px] md:leading-[23px] xl:text-[18px] xl:leading-[25px]">
              At TAIBA Creations, we build healthcare websites around your
              patients to build trust and encourage more appointments.
            </p>

            <div className="group inline-flex items-center justify-center mt-[20px] md:mt-[28px]">
              <button className="sup-btn btn-roll text-[16px] md:text-[18px] leading-[31px] text-white tracking-[1%] bg-[#2D2D2D] rounded-full w-[170px] md:w-[187px] h-[46px]">
                <span className="roll">
                  <span data-text="Explore Our Work">Explore Our Work</span>
                </span>
              </button>
              <button className="sup-btn btn-arrow btn-arrow-dark relative flex justify-center items-center rounded-full w-[46px] h-[46px] shrink-0 bg-[#2D2D2D]">
                <span className="arrow-swap">
                  <ArrowIcon />
                  <ArrowIcon />
                </span>
              </button>
            </div>
          </div>

          {/* Video */}
          <div className="sup-video video-wrap relative mx-auto overflow-hidden w-[calc(100%-32px)] md:w-[calc(100%-48px)] xl:w-[calc(100%-80px)] max-w-[1440px] aspect-[16/11] md:aspect-[1440/604] rounded-[16px] md:rounded-[30px] mt-[40px] md:mt-[64px] lg:mt-[80px] xl:mt-[90px] 2xl:mt-[100px] 3xl:mt-[120px]">
            <video
              ref={videoRef}
              src="/supporting-video.mp4"
              poster="/poster.webp"
              preload="metadata"
              playsInline
              controls={playing}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              className="w-full h-full object-cover"
            />

            {!playing && (
              <button
                onClick={handlePlay}
                aria-label="Play video"
                className="play-btn absolute inset-0 flex justify-center items-center bg-black/20 transition-colors duration-500 hover:bg-black/30"
              >
                <span className="play-circle flex justify-center items-center rounded-full bg-white/80 backdrop-blur-md w-[56px] h-[56px] md:w-[72px] md:h-[72px] xl:w-[90px] xl:h-[90px]">
                  <svg
                    width="28"
                    height="32"
                    viewBox="0 0 28 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-1 w-[18px] h-[20px] md:w-[22px] md:h-[25px] xl:w-[28px] xl:h-[32px]"
                  >
                    <path d="M28 16L0 32V0L28 16Z" fill="#2D2D2D" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Supporting;