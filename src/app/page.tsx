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

export default function Home() {
  return (
    <div>
      <Banner />
      <Supporting />
      <Services />
      <Experience />
      <Work />
      <Process />
      <Tools />
      <Trusted />
      <Team />
      <Awards />
      <Faq />
      <Contact />
    </div>
  );
}
