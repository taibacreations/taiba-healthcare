"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

/* Lenis ke har scroll par ScrollTrigger ko update karo (pin, scrub, triggers sync rahein) */
const LenisScrollTriggerSync = () => {
  useLenis(ScrollTrigger.update);
  return null;
};

const SmoothScroll = ({ children }: { children: ReactNode }) => {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    /* Lenis ko GSAP ke ticker par chalao, taake dono ek hi frame par chalein */
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0); // lag par GSAP time skip na kare, warna Lenis ke saath jhatka

    /* Images aur fonts load hone ke baad positions dobara naapo */
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      gsap.ticker.remove(update);
      window.removeEventListener("load", refresh);
    };
  }, []);

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false, // raf GSAP ticker chalata hai (upar)
        lerp: 0.1, // smoothness: kam = zyada smooth
        smoothWheel: !reducedMotion,
        anchors: true, // #section links bhi smooth
      }}
    >
      <LenisScrollTriggerSync />
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;