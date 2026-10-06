"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/* img: logo ki width apne circle ke percent mein (1920 par 119px circle) */
type Tool = { src: string; alt: string; pos: string; img: string };

const ringOuter: Tool[] = [
  { src: "/chatgpt.webp", alt: "chatgpt", pos: "top-[-4.3%] left-[calc(50%-var(--icon)/2)]", img: "w-[60.5%]" },
  { src: "/nextjs.webp", alt: "nextjs", pos: "top-[0%] left-[23.5%]", img: "w-[55.5%]" },
  { src: "/react.webp", alt: "react", pos: "top-[10.5%] left-[80%]", img: "w-[62.2%]" },
  { src: "/php.webp", alt: "php", pos: "top-[41.5%] left-[94.5%]", img: "w-[58%]" },
  { src: "/nodejs.webp", alt: "nodejs", pos: "top-[21%] left-[.5%]", img: "w-[47%]" },
];

const ringMiddle: Tool[] = [
  { src: "/wix.webp", alt: "wix", pos: "top-[-4.3%] left-[56%]", img: "w-[45.4%]" },
  { src: "/figma.webp", alt: "figma", pos: "top-[4%] left-[15.5%]", img: "w-[48.7%]" },
  { src: "/wordpress.webp", alt: "wordpress", pos: "top-[21%] left-[86.5%]", img: "w-[67.2%]" },
  { src: "/framer.webp", alt: "framer", pos: "top-[37%] left-[-6%]", img: "w-[51.3%]" },
];

const ringInner: Tool[] = [
  { src: "/webflow.webp", alt: "webflow", pos: "top-[-7%] left-[29.5%]", img: "w-[64.7%]" },
  { src: "/ghl.webp", alt: "ghl", pos: "top-[17%] left-[-.5%]", img: "w-[73.1%]" },
  { src: "/shopify.webp", alt: "shopify", pos: "top-[3%] left-[72%]", img: "w-[48.7%]" },
  { src: "/n8n.webp", alt: "n8n", pos: "top-[34.5%] left-[91%]", img: "w-[62.2%]" },
];

const ToolIcon = ({ tool }: { tool: Tool }) => (
  <div
    className={`tool-icon bg-[#FEFEFF] border border-gray-200 w-[var(--icon)] h-[var(--icon)] rounded-full absolute ${tool.pos} flex justify-center items-center`}
  >
    <img src={tool.src} alt={tool.alt} className={`tool-img ${tool.img} h-auto`} />
  </div>
);

const Tools = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const titleSplit = SplitText.create(q(".tool-title"), {
          type: "words",
          mask: "words",
        });

        const cleanups: (() => void)[] = [];

        /* ---------- Mouse: ring parallax + magnetic icons ---------- */
        const startInteractions = () => {
          if (!window.matchMedia("(pointer: fine)").matches) return;

          const rings = q(".tool-ring").map((ring: HTMLElement, i: number) => ({
            depth: [6, 12, 18][i],
            xTo: gsap.quickTo(ring, "x", { duration: 1.6, ease: "power3" }),
            yTo: gsap.quickTo(ring, "y", { duration: 1.6, ease: "power3" }),
          }));

          // icon ke asal size se hadein (1920 par 119px → 110 / 60)
          const size = (q(".tool-icon")[0] as HTMLElement | undefined)?.offsetWidth ?? 119;
          const RADIUS = size * 0.92; // magnetic khinchav ki had
          const HOVER = size / 2; // cursor icon ke upar

          const icons = q(".tool-icon").map((el: HTMLElement) => ({
            el,
            xTo: gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" }),
            yTo: gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" }),
            sTo: gsap.quickTo(el, "scale", { duration: 0.6, ease: "power3" }),
            active: false,
          }));

          const release = (icon: (typeof icons)[number]) => {
            icon.active = false;
            icon.el.classList.remove("is-near");
            gsap.to(icon.el, {
              x: 0,
              y: 0,
              scale: 1,
              duration: 1.2,
              ease: "elastic.out(1, 0.4)",
              overwrite: "auto",
            });
          };

          const onMove = (e: MouseEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            rings.forEach((r) => {
              r.xTo(nx * r.depth * 2);
              r.yTo(ny * r.depth);
            });

            icons.forEach((icon) => {
              const rect = icon.el.getBoundingClientRect();
              // magnetic pull ko hata kar asli center
              const cx = rect.left + rect.width / 2 - (gsap.getProperty(icon.el, "x") as number);
              const cy = rect.top + rect.height / 2 - (gsap.getProperty(icon.el, "y") as number);
              const dx = e.clientX - cx;
              const dy = e.clientY - cy;
              const dist = Math.hypot(dx, dy);

              if (dist < RADIUS) {
                const pull = 1 - dist / RADIUS;
                const isOver = dist < HOVER;

                icon.active = true;
                icon.el.classList.toggle("is-near", isOver);
                icon.xTo(dx * 0.3 * pull);
                icon.yTo(dy * 0.3 * pull);
                icon.sTo(isOver ? 1.12 : 1);
              } else if (icon.active) {
                release(icon);
              }
            });
          };

          const onLeave = () => {
            rings.forEach((r) => {
              r.xTo(0);
              r.yTo(0);
            });
            icons.forEach((icon) => icon.active && release(icon));
          };

          section.addEventListener("mousemove", onMove);
          section.addEventListener("mouseleave", onLeave);
          cleanups.push(() => {
            section.removeEventListener("mousemove", onMove);
            section.removeEventListener("mouseleave", onLeave);
          });
        };

        /* ---------- Entrance ---------- */
        const tl = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top 70%", once: true },
          onComplete: () => {
            titleSplit.revert();
            startInteractions();
          },
        });

        tl.from(q(".tool-ring"), {
          scale: 0.7,
          autoAlpha: 0,
          duration: 1.6,
          stagger: 0.15,
          ease: "expo.out",
          clearProps: "transform,opacity,visibility",
        })
          .from(
            q(".tool-icon"),
            {
              scale: 0,
              autoAlpha: 0,
              duration: 0.9,
              stagger: { each: 0.06, from: "random" },
              ease: "back.out(1.8)",
              clearProps: "transform,opacity,visibility",
            },
            0.5,
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
            0.7,
          );

        /* ---------- Idle float (logo apne circle ke andar) ---------- */
        q(".tool-img").forEach((img: HTMLElement) => {
          gsap.to(img, {
            y: gsap.utils.random(-5, 5),
            duration: gsap.utils.random(2, 3.5),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: gsap.utils.random(0, 1.5),
          });
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
      className="bg-[url(/tool.png)] bg-cover bg-center bg-no-repeat relative
        [--icon:40px] h-[330px] pt-[20px]
        sm:[--icon:50px] sm:h-[337px] sm:pt-[24px]
        md:[--icon:50px] md:h-[337px] md:pt-[24px]
        lg:[--icon:63px] lg:h-[426px] lg:pt-[30px]
        xl:[--icon:79px] xl:h-[536px] xl:pt-[38px]
        2xl:[--icon:95px] 2xl:h-[642px] 2xl:pt-[46px]
        3xl:[--icon:119px] 3xl:h-[803px] 3xl:pt-[57px]"
    >
      <img
        src="/tools-blur.png"
        alt="blur"
        className="absolute w-full top-[-26%] z-10 h-[130px] sm:h-[183px] lg:h-[231px] xl:h-[290px] 2xl:h-[348px] 3xl:h-[435px]"
      />
      <img
        src="/tools-blur.png"
        alt="blur"
        className="absolute w-full bottom-[-23%] z-10 h-[130px] sm:h-[183px] lg:h-[231px] xl:h-[290px] 2xl:h-[348px] 3xl:h-[435px]"
      />

      <div className="flex flex-col justify-center items-center relative z-20 md:mt-0 mt-[7vh]">
        {/* Bahar wala ring: mobile par screen ke hisaab se, taake kinare ke icons na katein */}
        <div className="tool-ring relative rounded-full border border-white md:border-2 w-[calc(112vw-100px)] h-[calc(112vw-100px)] sm:w-[560px] sm:h-[560px] lg:w-[706px] lg:h-[706px] xl:w-[889px] xl:h-[889px] 2xl:w-[1066px] 2xl:h-[1066px] 3xl:w-[1333px] 3xl:h-[1333px]">
          {ringOuter.map((tool) => (
            <ToolIcon key={tool.alt} tool={tool} />
          ))}
        </div>

        {/* Beech wala ring: bahar wale ka 80.1% */}
        <div className="tool-ring absolute top-[11.7%] rounded-full border border-white md:border-2 w-[calc((112vw-100px)*0.801)] h-[calc((112vw-100px)*0.801)] sm:w-[449px] sm:h-[449px] lg:w-[566px] lg:h-[566px] xl:w-[712px] xl:h-[712px] 2xl:w-[854px] 2xl:h-[854px] 3xl:w-[1068px] 3xl:h-[1068px]">
          {ringMiddle.map((tool) => (
            <ToolIcon key={tool.alt} tool={tool} />
          ))}
        </div>

        {/* Andar wala ring: bahar wale ka 57.9% */}
        <div className="tool-ring absolute top-[23.5%] rounded-full border border-white md:border-2 w-[calc((112vw-100px)*0.579)] h-[calc((112vw-100px)*0.579)] sm:w-[324px] sm:h-[324px] lg:w-[409px] lg:h-[409px] xl:w-[515px] xl:h-[515px] 2xl:w-[618px] 2xl:h-[618px] 3xl:w-[772px] 3xl:h-[772px]">
          {ringInner.map((tool) => (
            <ToolIcon key={tool.alt} tool={tool} />
          ))}
        </div>
      </div>

      <div className="text-center mx-auto absolute left-1/2 -translate-x-1/2 z-30 w-full top-[74%] max-w-[260px] sm:top-[75%] sm:max-w-[240px] lg:max-w-[280px] xl:max-w-[340px] 2xl:max-w-[410px] 3xl:max-w-[511px]">
        <h2 className="tool-title tracking-[-3%] text-black mt-[5px] text-[26px] leading-[30px] sm:text-[24px] sm:leading-[26px] lg:text-[32px] lg:leading-[34px] xl:text-[40px] xl:leading-[43px] 2xl:text-[48px] 2xl:leading-[51px] 3xl:text-[60px] 3xl:leading-[64px]">
          Tools & Technologies{" "}
          <span className="font-playfair tracking-[-9%] italic font-light">
            We Build With
          </span>
        </h2>
      </div>
    </section>
  );
};

export default Tools;