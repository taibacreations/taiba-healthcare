"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "swiper/css";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const testimonials = [
  { poster: "/trusteds1.png", video: "/video1.mp4" },
  { poster: "/trusteds1.png", video: "/video2.mp4" },
  { poster: "/trusteds1.png", video: "/video3.mp4" },
  { poster: "/trusteds1.png", video: "/video1.mp4" },
  { poster: "/trusteds1.png", video: "/video2.mp4" },
  { poster: "/trusteds1.png", video: "/video3.mp4" },
];

/* 1920 design values */
const BASE = {
  activeW: 476,
  activeH: 555,
  sideW: 449,
  sideH: 480,
  space: 10,
  radius: 38,
  arrow: 58,
  play: 62,
};
const TILT_DEG = 13;
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const MOBILE_ARROW_GAP = 12; // mobile par screen ke kinare se faasla

/* Har breakpoint ka scale factor */
const getScale = (w: number) => {
  if (w >= 1536) return 1; // 2xl + 3xl: original
  if (w >= 1280) return 0.85; // xl
  if (w >= 1024) return 0.68; // lg
  if (w >= 768) return 0.5; // md
  return (w * 0.62) / BASE.activeW; // mobile: active slide = screen ka 62%
};

const ArrowIcon = () => (
  <svg
    width="16"
    height="15"
    viewBox="0 0 16 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.7071 8.07136C16.0976 7.68084 16.0976 7.04768 15.7071 6.65715L9.34315 0.29319C8.95262 -0.0973344 8.31946 -0.0973344 7.92893 0.29319C7.53841 0.683714 7.53841 1.31688 7.92893 1.7074L13.5858 7.36426L7.92893 13.0211C7.53841 13.4116 7.53841 14.0448 7.92893 14.4353C8.31946 14.8259 8.95262 14.8259 9.34315 14.4353L15.7071 8.07136ZM0 7.36426V8.36426H15V7.36426V6.36426H0V7.36426Z"
      fill="white"
    />
  </svg>
);

function getTransform(isActive: boolean, isPrev: boolean, isNext: boolean) {
  if (isActive) return "perspective(1200px) rotateY(0deg)";
  if (isPrev) return `perspective(1200px) rotateY(${TILT_DEG}deg)`;
  if (isNext) return `perspective(1200px) rotateY(-${TILT_DEG}deg)`;
  return "perspective(1200px) rotateY(0deg)";
}

const Trusted = () => {
  const [playing, setPlaying] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // paint se pehle sahi size, taake mobile par bara slider flash na ho
  useLayoutEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setScale(getScale(w));
      setIsMobile(w < 768);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* Scale ke hisaab se saari values */
  const ACTIVE_WIDTH = Math.round(BASE.activeW * scale);
  const ACTIVE_HEIGHT = Math.round(BASE.activeH * scale);
  const SIDE_WIDTH = Math.round(BASE.sideW * scale);
  const SIDE_HEIGHT = Math.round(BASE.sideH * scale);
  const SPACE_BETWEEN = Math.round(BASE.space * scale);
  const RADIUS = Math.max(16, Math.round(BASE.radius * scale));
  const ARROW_SIZE = Math.max(40, Math.round(BASE.arrow * scale));
  const PLAY_SIZE = Math.max(48, Math.round(BASE.play * scale));
  const TRACK_WIDTH = ACTIVE_WIDTH * 3 + SPACE_BETWEEN * 2;

  /* Arrows: md+ par side slide ke kinare par (aadha bahar), mobile par screen ke andar */
  const ARROW_OFFSET = isMobile ? MOBILE_ARROW_GAP : ACTIVE_WIDTH - SIDE_WIDTH;
  const PREV_TRANSFORM = isMobile ? "translateY(-50%)" : "translate(-50%, -50%)";
  const NEXT_TRANSFORM = isMobile ? "translateY(-50%)" : "translate(50%, -50%)";

  /** Active: all corners. Left slide: outer (left) corners. Right slide: outer (right) corners. */
  const getRadius = (isActive: boolean, isPrev: boolean, isNext: boolean) => {
    if (isActive) return `${RADIUS}px`;
    if (isPrev) return `${RADIUS}px 0 0 ${RADIUS}px`;
    if (isNext) return `0 ${RADIUS}px ${RADIUS}px 0`;
    return `${RADIUS}px`;
  };

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const titleSplit = SplitText.create(q(".trusted-title"), {
          type: "words",
          mask: "words",
        });

        gsap
          .timeline({
            scrollTrigger: { trigger: section, start: "top 75%", once: true },
            onComplete: () => titleSplit.revert(),
          })
          .from(titleSplit.words, {
            yPercent: 120,
            rotate: 6,
            transformOrigin: "0% 100%",
            duration: 1.3,
            stagger: 0.05,
            ease: "expo.out",
          })
          .from(
            q(".trusted-slider .swiper"),
            {
              y: 100,
              scale: 0.94,
              autoAlpha: 0,
              duration: 1.5,
              ease: "expo.out",
              clearProps: "transform,opacity,visibility",
            },
            0.3,
          )
          // andar wala button: is par position wala transform nahi, is liye sab saaf kar sakte hain
          .from(
            q(".trusted-arrow"),
            {
              scale: 0.4,
              autoAlpha: 0,
              duration: 0.9,
              stagger: 0.1,
              ease: "back.out(2.2)",
              clearProps: "transform,opacity,visibility",
            },
            1,
          );
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-20 py-[56px] md:py-[64px] lg:py-[80px] xl:py-[96px] 2xl:py-[104px] 3xl:py-[113px]"
    >
      <div className="text-center relative z-30 px-5 md:px-0">
        <h2 className="trusted-title tracking-[-3%] text-black mt-[5px] text-[32px] leading-[36px] md:text-[38px] md:leading-[42px] lg:text-[42px] lg:leading-[46px] xl:text-[48px] xl:leading-[52px] 2xl:text-[54px] 2xl:leading-[58px] 3xl:text-[60px] 3xl:leading-[64px]">
          Trusted by Growing{" "}
          <span className="font-playfair tracking-[-9%] italic font-light">
            Healthcare Practices
          </span>
        </h2>
      </div>

      <div
        className="trusted-slider relative w-full mx-auto mt-[24px] md:mt-[28px] 3xl:mt-[38px]"
        style={{ maxWidth: TRACK_WIDTH }}
      >
        <Swiper
          key={scale} // size badalne par Swiper dobara calculate kare
          slidesPerView="auto"
          centeredSlides
          loop
          speed={700}
          spaceBetween={SPACE_BETWEEN}
          onSwiper={(s) => (swiperRef.current = s)}
          onSlideChange={() => setPlaying(null)}
        >
          {testimonials.map((item, i) => (
            <SwiperSlide
              key={i}
              style={{ width: ACTIVE_WIDTH, height: ACTIVE_HEIGHT }}
              className="relative"
            >
              {({ isActive, isPrev, isNext }) => {
                const visible = isActive || isPrev || isNext;
                const isPlaying = isActive && playing === i;

                return (
                  <div
                    className={`trusted-card absolute overflow-hidden ${isActive ? "is-active" : ""}`}
                    style={{
                      width: isActive ? ACTIVE_WIDTH : SIDE_WIDTH,
                      height: isActive ? ACTIVE_HEIGHT : SIDE_HEIGHT,
                      top: isActive ? 0 : (ACTIVE_HEIGHT - SIDE_HEIGHT) / 2,
                      left: isPrev ? "auto" : 0,
                      right: isPrev ? 0 : "auto",
                      zIndex: isActive ? 10 : 0,
                      opacity: visible ? 1 : 0,
                      pointerEvents: visible ? "auto" : "none",
                      borderRadius: getRadius(isActive, isPrev, isNext),
                      transform: getTransform(isActive, isPrev, isNext),
                      isolation: "isolate",
                      WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                      transition: `width 700ms ${EASE}, height 700ms ${EASE}, top 700ms ${EASE}, transform 700ms ${EASE}, border-radius 700ms ${EASE}, opacity 300ms ease`,
                      willChange: "transform, opacity",
                    }}
                  >
                    {isPlaying ? (
                      <video
                        src={item.video}
                        poster={item.poster}
                        className="block w-full h-full object-cover"
                        autoPlay
                        controls
                        playsInline
                      />
                    ) : (
                      <>
                        <img
                          src={item.poster}
                          alt="testimonial"
                          draggable={false}
                          className="block w-full h-full object-cover cursor-grab select-none"
                        />
                        {isActive && (
                          <button
                            onClick={() => setPlaying(i)}
                            className="trusted-play absolute rounded-full bg-black flex justify-center items-center"
                            style={{
                              width: PLAY_SIZE,
                              height: PLAY_SIZE,
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              zIndex: 5,
                            }}
                            aria-label="Play video"
                          >
                            <svg
                              width="14"
                              height="16"
                              viewBox="0 0 14 16"
                              fill="none"
                            >
                              <path d="M13 8L1 15V1L13 8Z" fill="white" />
                            </svg>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                );
              }}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Prev: bahar wala div sirf position, andar wala button animation/hover */}
        <div
          className="absolute"
          style={{
            top: "50%",
            left: ARROW_OFFSET,
            transform: PREV_TRANSFORM,
            zIndex: 30,
          }}
        >
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className="trusted-arrow trusted-arrow-prev rounded-full flex justify-center items-center cursor-pointer"
            style={{ width: ARROW_SIZE, height: ARROW_SIZE, background: "#0A3CFF" }}
            aria-label="Previous"
          >
            <span className="rotate-180 flex">
              <ArrowIcon />
            </span>
          </button>
        </div>

        {/* Next */}
        <div
          className="absolute"
          style={{
            top: "50%",
            right: ARROW_OFFSET,
            transform: NEXT_TRANSFORM,
            zIndex: 30,
          }}
        >
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            className="trusted-arrow rounded-full flex justify-center items-center cursor-pointer"
            style={{ width: ARROW_SIZE, height: ARROW_SIZE, background: "#0A3CFF" }}
            aria-label="Next"
          >
            <ArrowIcon />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Trusted;