"use client";

import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Links from "./links";
import Portfolio, { PORTFOLIO_COUNT } from "./portfolio";
import ArrowIcon from "./arrow-icon";
import { useIndustry } from "@/lib/industry";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

/* Har slide ke liye kitna scroll (px). Kam = tez slides, zyada = aahista */
const SCROLL_PER_SLIDE = 1500;

/* Pin kitna upar lage (px). Zyada = aur upar, kam = neeche */
const PIN_OFFSET = 100;
/* Pin par portfolio ka top screen ke top se kam az kam itna neeche rahe (px) */
const PORTFOLIO_TOP_GAP = 20;

/* Box ke icons: sab ki height barabar, width icon ki shakal se (1920 par 58px) */
const BOX_ICON_HEIGHT =
  "h-[34px] md:h-[30px] lg:h-[36px] xl:h-[44px] 2xl:h-[50px] 3xl:h-[58px]";

const Banner = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const lenis = useLenis();
  const { content, asset } = useIndustry();
  const banner = content.banner;

  /* Swiper bante hi (resize par dobara bhi) instance lo aur pin positions dobara naapo */
  const handleSwiper = (swiper: SwiperType) => {
    swiperRef.current = swiper;
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  /* CTA: smooth scroll to contact section */
  const goToContact = () => {
    const target = document.getElementById("contact");
    if (!target) return;

    if (lenis) {
      lenis.scrollTo(target, { duration: 1.6 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);

      gsap.set(section, { visibility: "visible" });

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ---------- Scroll se slides: hero ka neecha hissa screen par aate hi pin ---------- */
        const steps = PORTFOLIO_COUNT - 1;
        let lastStep = 0;

        ScrollTrigger.create({
          trigger: section,
          // Pin un dono mein se jo pehle aaye:
          // 1) hero ka neecha kinara screen ke neeche se PIN_OFFSET upar
          // 2) portfolio ka top screen ke top se PORTFOLIO_TOP_GAP neeche (taake upar se na kate)
          start: () => {
            const sectionTop =
              section.getBoundingClientRect().top + window.scrollY;
            const portfolio = q(".anim-portfolio")[0] as
              | HTMLElement
              | undefined;

            const bottomAlign =
              sectionTop +
              section.offsetHeight -
              window.innerHeight +
              PIN_OFFSET;
            const portfolioAlign = portfolio
              ? sectionTop + portfolio.offsetTop - PORTFOLIO_TOP_GAP
              : bottomAlign;

            // hero screen se chhota ho to shuru se hi (section ka top)
            return Math.max(sectionTop, Math.min(bottomAlign, portfolioAlign));
          },
          end: () => `+=${steps * SCROLL_PER_SLIDE}`,
          pin: section,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 1, // pin sab se pehle naapo, taake neeche ke sections sahi jagah trigger hon
          onUpdate: (self) => {
            const swiper = swiperRef.current;
            if (!swiper) return;

            const step = Math.round(self.progress * steps);
            const diff = step - lastStep;
            if (!diff) return;
            lastStep = step;

            // ek qadam aage/peeche, taake arrows/drag se badli hui slide se hi aage chale
            if (diff === 1) swiper.slideNext();
            else if (diff === -1) swiper.slidePrev();
            else {
              // bohot tez scroll par seedha sahi slide par
              const target =
                (((swiper.realIndex + diff) % PORTFOLIO_COUNT) +
                  PORTFOLIO_COUNT) %
                PORTFOLIO_COUNT;
              swiper.slideToLoop(target);
            }
          },
        });

        const titleSplit = SplitText.create(q(".anim-title"), {
          type: "words",
          mask: "words",
        });
        const textSplit = SplitText.create(q(".anim-text"), {
          type: "lines",
          mask: "lines",
        });

        const cleanups: (() => void)[] = [];
        const bg = q(".anim-bg");

        /* ---------- Background: entrance zoom (layer hamesha thori bari rahegi) ---------- */
        gsap.fromTo(
          bg,
          { scale: 1.2 },
          { scale: 1.08, duration: 2.4, ease: "expo.out" },
        );

        /* ---------- Mouse parallax: H1 + background (entrance ke baad) ---------- */
        const startInteractions = () => {
          if (!window.matchMedia("(pointer: fine)").matches) return;

          const title = q(".anim-title");
          const titleX = gsap.quickTo(title, "x", {
            duration: 1.4,
            ease: "power3",
          });
          const titleY = gsap.quickTo(title, "y", {
            duration: 1.4,
            ease: "power3",
          });
          const bgX = gsap.quickTo(bg, "x", { duration: 2, ease: "power3" });
          const bgY = gsap.quickTo(bg, "y", { duration: 2, ease: "power3" });

          const onMove = (e: MouseEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            titleX(nx * 18);
            titleY(ny * 10);
            bgX(nx * -30);
            bgY(ny * -20);
          };
          const onLeave = () => {
            titleX(0);
            titleY(0);
            bgX(0);
            bgY(0);
          };

          section.addEventListener("mousemove", onMove);
          section.addEventListener("mouseleave", onLeave);
          cleanups.push(() => {
            section.removeEventListener("mousemove", onMove);
            section.removeEventListener("mouseleave", onLeave);
          });
        };

        /* ---------- Entrance timeline ---------- */
        const tl = gsap.timeline({
          defaults: {
            ease: "power3.out",
            duration: 1,
            clearProps: "transform,opacity,visibility,filter",
          },
          onComplete: () => {
            titleSplit.revert();
            textSplit.revert();
            startInteractions();
          },
        });

        tl.from(
          q(".anim-blur"),
          { y: 160, autoAlpha: 0, duration: 1.8, ease: "expo.out" },
          0,
        )
          .from(
            q(".anim-logo"),
            {
              y: -40,
              scale: 0.9,
              autoAlpha: 0,
              filter: "blur(12px)",
              duration: 1.2,
            },
            0.1,
          )
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
            0.2,
          )
          .from(
            textSplit.lines,
            { yPercent: 105, duration: 1.1, stagger: 0.08, ease: "expo.out" },
            0.6,
          )
          .from(
            q(".anim-btn"),
            {
              y: 30,
              scale: 0.9,
              autoAlpha: 0,
              stagger: 0.12,
              ease: "back.out(1.7)",
            },
            0.85,
          )
          .from(
            q(".anim-links"),
            { x: 80, autoAlpha: 0, duration: 1.2, ease: "expo.out" },
            0.7,
          )
          .from(
            q(".anim-portfolio .swiper"),
            {
              y: 160,
              scale: 0.92,
              autoAlpha: 0,
              filter: "blur(10px)",
              duration: 1.6,
              ease: "expo.out",
            },
            0.6,
          )
          .from(
            q(".anim-portfolio .portfolio-arrow"),
            {
              scale: 0.4,
              autoAlpha: 0,
              duration: 0.9,
              stagger: 0.1,
              ease: "back.out(2.2)",
            },
            1.3,
          )
          .from(
            q(".anim-box"),
            { y: 80, autoAlpha: 0, duration: 1.3, ease: "expo.out" },
            1,
          )
          .from(
            q(".anim-box-item"),
            { y: 24, autoAlpha: 0, filter: "blur(6px)", stagger: 0.12 },
            1.2,
          )
          .from(
            q(".anim-box .gradient-border"),
            { scaleY: 0, duration: 0.9, stagger: 0.1, ease: "expo.out" },
            1.35,
          );

        /* Subtitle (sirf jis page par ho): logo ke baad */
        if (q(".anim-subtitle").length) {
          tl.from(
            q(".anim-subtitle"),
            {
              y: 24,
              autoAlpha: 0,
              filter: "blur(6px)",
              duration: 1,
              ease: "expo.out",
            },
            0.15,
          );
        }

        /* ---------- Scroll parallax ---------- */
        gsap.to(q(".anim-hero-head"), {
          y: -90,
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(bg, {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        return () => cleanups.forEach((fn) => fn());
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="invisible isolate relative overflow-hidden flex flex-col md:block pb-0 md:h-[780px] lg:h-[922px] xl:h-[960px] 2xl:h-[1037px] 3xl:h-[1134px]"
    >
      {/* Background layer (mouse + scroll parallax) */}
      <div
        className="anim-bg absolute -z-10 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          inset: 0,
          transform: "scale(1.08)",
          backgroundImage: `url(${asset("banner.webp")})`,
        }}
      />

      <img
        src={asset("banner-blur.webp")}
        alt="blur"
        className="anim-blur absolute w-full z-10 h-[220px] bottom-[-10%] md:bottom-[-20%] md:h-[300px] lg:h-[400px]"
      />

      {/* Glass box */}
      <div
        className="
    anim-box banner-box order-5
    md:rounded-[40px]
    rounded-[20px]
     mx-auto z-30
    w-[calc(100%-32px)] max-w-[640px] py-5
    absolute md:mt-0 md:py-0 md:max-w-none
    bottom-3 left-1/2 -translate-x-1/2
    md:w-[560px] md:h-[96px]
    lg:bottom-5
    lg:w-[620px] lg:h-[110px]
    xl:w-[760px] xl:h-[130px]
    2xl:w-[900px] 2xl:h-[150px]
    3xl:w-[1060px] 3xl:h-[171px]
    bg-[linear-gradient(105.87deg,rgba(255,255,255,0.7)_3.04%,rgba(255,255,255,0.7)_96.05%)]
    backdrop-blur-[23.1px]
  "
      >
        <div className="flex items-center h-full">
          {banner.boxItems.map((item, i) => (
            <div key={item.label} className="contents">
              {i > 0 && (
                <span className="gradient-border h-[50px] md:h-[50px] lg:h-[60px] xl:h-[70px] 2xl:h-[80px] 3xl:h-[90px]" />
              )}
              <div className="anim-box-item box-item flex-1 flex flex-col justify-center items-center gap-2 lg:gap-3 px-1 text-center">
                <img
                  src={asset(item.icon)}
                  alt=""
                  className={`w-auto max-w-[80%] object-contain ${BOX_ICON_HEIGHT}`}
                />
                <h4 className="font-calsans capitalize text-hero-box-text text-[13px] md:text-[13px] lg:text-[15px] xl:text-[18px] 2xl:text-[21px] 3xl:text-[24px]">
                  {item.label}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social links */}
      <div className="anim-links order-3 relative flex justify-center mt-6 z-20 md:absolute md:mt-0 md:top-[240px] md:right-3 lg:top-[36.3%] lg:right-6 xl:right-10 3xl:right-11">
        <Links />
      </div>

      {/* Mobile par "contents" taake heading aur text flex order follow karein */}
      <div className="contents md:block">
        <div className="anim-hero-head order-1 text-center flex flex-col justify-center items-center mx-auto px-5 pt-10 max-w-[650px] md:px-0 md:pt-[50px] md:max-w-[440px] lg:pt-[50px] lg:max-w-[560px] xl:pt-[52px] xl:max-w-[680px] 2xl:pt-[56px] 2xl:max-w-[800px] 3xl:pt-[61px] 3xl:max-w-[948px]">
          <img
            src={asset("logo.svg")}
            alt="TAIBA Creations"
            className="anim-logo max-w-[180px] lg:max-w-none"
          />

          {/* Subtitle: sirf jis page ke content mein ho (jaise peptides) */}
          {banner.subtitle && (
            <p className="anim-subtitle font-normal text-hero-title tracking-[-0.02em] mt-5 text-[18px] leading-[24px] md:mt-[20px] md:text-[16px] md:leading-[20px] lg:mt-[30px] lg:text-[22px] lg:leading-[26px] xl:mt-[32px] xl:text-[26px] xl:leading-[30px] 2xl:mt-[34px] 2xl:text-[32px] 2xl:leading-[36px] 3xl:mt-[38px] 3xl:text-[38px] 3xl:leading-[42px]">
              {banner.subtitle}
            </p>
          )}

          <h1
            className={`anim-title text-hero-title tracking-[-0.03em] text-[36px] leading-[40px] md:text-[32px] md:leading-[34px] lg:text-[44px] lg:leading-[44px] xl:text-[54px] xl:leading-[54px] 2xl:text-[64px] 2xl:leading-[63px] 3xl:text-[76px] 3xl:leading-[75px] ${
              banner.subtitle
                ? "mt-2 lg:mt-3"
                : "mt-5 md:mt-[20px] lg:mt-[37px] xl:mt-[38px] 2xl:mt-[41px] 3xl:mt-[45px]"
            }`}
          >
            {banner.titleStart}
            {banner.titleItalic && (
              <>
                {" "}
                <span className="italic font-playfair font-light">
                  {banner.titleItalic}
                </span>
              </>
            )}
            {banner.titleEnd && <> {banner.titleEnd}</>}
          </h1>
        </div>

        <div className="order-2 relative w-full mx-auto px-5 mt-5 text-center text-hero-text z-10 max-w-[480px] md:absolute md:mx-0 md:px-0 md:mt-0 md:text-left md:left-[3%] md:top-[200px] md:max-w-[200px] lg:top-[27%] lg:max-w-[260px] xl:top-[30%] xl:max-w-[290px] 2xl:max-w-[350px] 3xl:left-[8.5%] 3xl:top-[32.5%] 3xl:max-w-[443px]">
          <p className="anim-text font-medium text-[16px] leading-[24px] md:text-[12px] md:leading-[17px] lg:text-[15px] lg:leading-[22px] xl:text-[17px] xl:leading-[25px] 2xl:text-[19px] 2xl:leading-[27px] 3xl:text-[22px] 3xl:leading-[31px]">
            {banner.text}
          </p>
          <div className="group inline-flex items-center mt-5 md:mt-3 lg:mt-[15px] xl:mt-[16px] 2xl:mt-[17px] 3xl:mt-[19px]">
            <button
              type="button"
              onClick={goToContact}
              className="anim-btn btn-roll btn-cta leading-[31px] bg-cta-bg text-cta-text rounded-full h-[46px] text-[15px] w-[250px] md:h-[36px] md:text-[11px] md:w-[170px] lg:h-[46px] lg:text-[13px] lg:w-[230px] xl:text-[15px] xl:w-[265px] 2xl:text-[17px] 2xl:w-[300px] 3xl:text-[18px] 3xl:w-[321px]"
            >
              <span className="roll">
                <span data-text={banner.cta}>{banner.cta}</span>
              </span>
            </button>
            <button
              type="button"
              onClick={goToContact}
              aria-label="Go to contact form"
              className="anim-btn btn-arrow arrow btn-cta-arrow relative flex justify-center items-center rounded-full w-[46px] h-[46px] md:w-[36px] md:h-[36px] lg:w-[46px] lg:h-[46px] shrink-0"
            >
              <span className="arrow-swap">
                <ArrowIcon />
                <ArrowIcon />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio */}
      <div className="anim-portfolio order-4 relative w-full mt-8 md:mt-0 md:absolute md:left-0 md:top-[320px] lg:top-[36%]">
        <Portfolio onSwiper={handleSwiper} />
      </div>
    </section>
  );
};

export default Banner;