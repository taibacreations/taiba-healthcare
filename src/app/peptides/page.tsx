import type { Metadata } from "next";
import { IndustryProvider } from "@/lib/industry";
import { peptides } from "@/content/peptides";
import Awards from "@/components/awards";
import Banner from "@/components/banner";
import Contact from "@/components/contact";
import Experience from "@/components/peptides/experience";
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
  title: "Research Peptide Website Design, Compliance-Ready | TAIBA",
  description:
    "Compliance-aware, SEO-ready websites for research peptide suppliers. COA pages, batch tracking, bulk pricing & research-use disclaimers that build buyer trust.",
};

export default function PeptidesPage() {
  return (
    <IndustryProvider content={peptides}>
      <main data-theme="peptides">
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