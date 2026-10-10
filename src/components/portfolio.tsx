"use client";

import { useLayoutEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useIndustry } from "@/lib/industry";

/* File names: har industry folder mein yahi names (public/[industry]/...) */
const portfolioImages = [
  "portfolio3.webp",
  "portfolio1.webp",
  "portfolio2.webp",
  "portfolio3.webp",
  "portfolio1.webp",
  "portfolio2.webp",
  "portfolio3.webp",
  "portfolio1.webp",
  "portfolio2.webp",
];

/* Banner ko pata ho ke kitni slides hain (scroll ki lambai isi se nikalti hai) */
export const PORTFOLIO_COUNT = portfolioImages.length;

/* 1920 design values (3xl) */
const BASE = {
  activeW: 700,
  activeH: 833,
  inactiveW: 445,
  inactiveH: 622,
  inactiveTop: 155,
  extraH: 210,
};
const ROTATE_DEG = 15;
const SPACE_BETWEEN = 0;

/* Slide badalne ki raftaar (ms). Zyada = aur narm/aahista */
const SPEED = 1000;
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)"; // shuru aur aakhir dono narm

/* Har breakpoint ka scale factor */
const getScale = (w: number) => {
  if (w >= 1800) return 1; // 3xl
  if (w >= 1536) return 0.8; // 2xl
  if (w >= 1280) return 0.65; // xl
  if (w >= 1024) return 0.65; // lg
  if (w >= 768) return 0.5; // md
  return 0.38; // mobile
};

type Props = {
  /** Swiper bante hi (aur resize par dobara bante hi) Banner ko instance deta hai */
  onSwiper?: (swiper: SwiperType) => void;
};

const Portfolio = ({ onSwiper }: Props) => {
  const [scale, setScale] = useState(1);
  const { asset } = useIndustry();

  // paint se pehle sahi size, taake mobile par bara slider flash na ho
  useLayoutEffect(() => {
    const update = () => setScale(getScale(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const ACTIVE_WIDTH = Math.round(BASE.activeW * scale);
  const ACTIVE_HEIGHT = Math.round(BASE.activeH * scale);
  const INACTIVE_WIDTH = Math.round(BASE.inactiveW * scale);
  const INACTIVE_HEIGHT = Math.round(BASE.inactiveH * scale);
  const INACTIVE_TOP = Math.round(BASE.inactiveTop * scale);
  const SLIDE_HEIGHT = Math.round((BASE.activeH + BASE.extraH) * scale);
  const TRACK_WIDTH = ACTIVE_WIDTH * 3 + SPACE_BETWEEN * 2;

  return (
    <section className="flex justify-center relative">
      <div
        className="relative w-full mx-auto overflow-hidden"
        style={{ maxWidth: TRACK_WIDTH }}
      >
        <Swiper
          key={scale} // size badalne par Swiper dobara calculate kare
          className="portfolio-swiper"
          modules={[Autoplay, Navigation]}
          slidesPerView="auto"
          centeredSlides
          loop
          speed={SPEED}
          spaceBetween={SPACE_BETWEEN}
          allowTouchMove={false} // drag/swipe band: slides sirf scroll aur arrows se
          onSwiper={onSwiper}
          navigation={{
            prevEl: ".portfolio-prev",
            nextEl: ".portfolio-next",
          }}
        >
          {portfolioImages.map((file, i) => (
            <SwiperSlide
              key={i}
              style={{ width: ACTIVE_WIDTH, height: SLIDE_HEIGHT }}
              className="relative"
            >
              {({ isActive, isPrev, isNext }) => {
                const visible = isActive || isPrev || isNext;
                return (
                  <img
                    src={asset(file)}
                    alt="portfolio"
                    draggable={false}
                    className="absolute object-contain select-none"
                    style={{
                      width: isActive ? ACTIVE_WIDTH : INACTIVE_WIDTH,
                      height: isActive ? ACTIVE_HEIGHT : INACTIVE_HEIGHT,
                      top: isActive ? 0 : INACTIVE_TOP,
                      left: isActive ? 0 : isPrev ? "auto" : 0,
                      right: isPrev ? 0 : "auto",
                      zIndex: isActive ? 10 : 0,
                      opacity: visible ? 1 : 0,
                      pointerEvents: visible ? "auto" : "none",
                      transformOrigin: isPrev
                        ? "right top"
                        : isNext
                          ? "left top"
                          : "center top",
                      transform: isActive
                        ? "rotate(0deg)"
                        : isPrev
                          ? `rotate(-${ROTATE_DEG}deg)`
                          : isNext
                            ? `rotate(${ROTATE_DEG}deg)`
                            : "rotate(0deg)",
                      transition: `width ${SPEED}ms ${EASE}, height ${SPEED}ms ${EASE}, top ${SPEED}ms ${EASE}, transform ${SPEED}ms ${EASE}, opacity 400ms ease`,
                      willChange: "transform, opacity",
                    }}
                  />
                );
              }}
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="portfolio-prev portfolio-arrow flex justify-center items-center rounded-full absolute top-[46.2%] -translate-y-1/2 z-20 rotate-180 w-10 h-10 left-[3%] md:left-[6%] lg:w-[44px] lg:h-[44px] xl:left-[10%] 2xl:w-[50px] 2xl:h-[50px] 3xl:w-[57px] 3xl:h-[57px]">
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[14px] h-[14px] 3xl:w-[17px] 3xl:h-[17px]"
          >
            <path
              d="M15.7071 8.07136C16.0976 7.68084 16.0976 7.04768 15.7071 6.65715L9.34315 0.29319C8.95262 -0.0973344 8.31946 -0.0973344 7.92893 0.29319C7.53841 0.683714 7.53841 1.31688 7.92893 1.7074L13.5858 7.36426L7.92893 13.0211C7.53841 13.4116 7.53841 14.0448 7.92893 14.4353C8.31946 14.8259 8.95262 14.8259 9.34315 14.4353L15.7071 8.07136ZM0 7.36426V8.36426H15V7.36426V6.36426H0V7.36426Z"
              fill="black"
            />
          </svg>
        </button>

        <button className="portfolio-next portfolio-arrow flex justify-center items-center rounded-full absolute top-[46.2%] -translate-y-1/2 z-20 w-10 h-10 right-[3%] md:right-[6%] lg:w-[44px] lg:h-[44px] xl:right-[10%] 2xl:w-[50px] 2xl:h-[50px] 3xl:w-[57px] 3xl:h-[57px]">
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[14px] h-[14px] 3xl:w-[17px] 3xl:h-[17px]"
          >
            <path
              d="M15.7071 8.07136C16.0976 7.68084 16.0976 7.04768 15.7071 6.65715L9.34315 0.29319C8.95262 -0.0973344 8.31946 -0.0973344 7.92893 0.29319C7.53841 0.683714 7.53841 1.31688 7.92893 1.7074L13.5858 7.36426L7.92893 13.0211C7.53841 13.4116 7.53841 14.0448 7.92893 14.4353C8.31946 14.8259 8.95262 14.8259 9.34315 14.4353L15.7071 8.07136ZM0 7.36426V8.36426H15V7.36426V6.36426H0V7.36426Z"
              fill="black"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Portfolio;