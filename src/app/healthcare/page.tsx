import type { Metadata } from "next";
import { IndustryProvider } from "@/lib/industry";
import { healthcare } from "@/content/healthcare";
import Awards from "@/components/awards";
import Banner from "@/components/banner";
import Contact from "@/components/contact";
import Experience from "@/components/experience";
import Faq from "@/components/faq";
import Process from "@/components/process";
import Services from "@/components/services";
import Supporting from "@/components/supporting";
import Team from "@/components/team";
import Tools from "@/components/tools";
import Trusted from "@/components/trusted";
import Work from "@/components/work";
import Impact from "@/components/impact";

export const metadata: Metadata = {
  title: "Healthcare Website Design That Wins Patient Trust | TAIBA",
  description:
    "HIPAA-aware, SEO-ready healthcare websites for clinics, dentists & therapists. Online booking, local SEO & mobile-first design that brings in new patients.",
};

export default function HealthcarePage() {
  return (
    <IndustryProvider content={healthcare}>
      <main data-theme="healthcare">
        <Banner />
        <Supporting />
        <Services />
        <Experience />
        <Impact />
        <Work />
        <Process />
        <Tools />
        <Trusted />
        <Team />
        <Awards />
        <Faq />
        <Contact />
      </main>
    </IndustryProvider>
  );
}