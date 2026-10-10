import type { Metadata } from "next";
import { IndustryProvider } from "@/lib/industry";
import { shopify } from "@/content/shopify";
import Awards from "@/components/awards";
import Banner from "@/components/banner";
import Contact from "@/components/contact";
import Experience from "@/components/shopify/experience";
import Faq from "@/components/faq";
import Process from "@/components/process";
import Services from "@/components/services";
import Supporting from "@/components/supporting";
import Team from "@/components/team";
import Tools from "@/components/shopify/tools";
import Trusted from "@/components/trusted";
import Work from "@/components/work";
import Impact from "@/components/impact";

export const metadata: Metadata = {
  title: "Shopify Store Design That Turns Visitors Into Customers | TAIBA",
  description:
    "Fast, conversion-focused Shopify stores with SEO-ready product pages, smooth checkout, and mobile-first design built to grow your sales.",
};

export default function ShopifyPage() {
  return (
    <IndustryProvider content={shopify}>
      <main data-theme="shopify">
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