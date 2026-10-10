/* Har industry page ka content. Har section convert hone par yahan uska type add hoga. */

export type IndustrySlug = "healthcare" | "shopify" | "peptides";

export type BoxItem = {
  label: string; // "100% SEO-Ready"
  icon: string; // file ka naam is industry ke folder mein: "icon1.webp"
};

export type BannerContent = {
  subtitle?: string; // heading ke upar chhoti line (optional): "Building Compliance-Ready Websites for"
  titleStart: string; // "Healthcare Websites"
  titleItalic?: string; // "That Will" (playfair italic, optional)
  titleEnd?: string; // "Help You To Win Patient Trust" (optional)
  text: string;
  cta: string;
  boxItems: [BoxItem, BoxItem, BoxItem];
};

export type SupportingContent = {
  eyebrow: string; // "Our Healthcare Clients"
  titleStart: string; // "Supporting Healthcare Businesses"
  titleItalic: string; // "Worldwide" (playfair italic)
  text: string;
  button: string; // "Explore Our Work"
  buttonLink: string;
};

export type ServiceItem = {
  title: string; // nayi line ke liye "\n" likhein
  desc: string;
  icon: string; // file ka naam is industry ke folder mein: "service-1.svg"
};

export type ServicesContent = {
  eyebrow: string; // "Services"
  titleStart: string; // "Extend Your Build Beyond"
  titleItalic: string; // "Launch" (playfair italic)
  text: string;
  items: ServiceItem[];
};

export type ExperienceContent = {
  titleStart: string; // "Websites Built for Better Patient"
  titleItalic: string; // "Experiences" (playfair italic)
  text: string;
  features: string[];
  image: string; // bari image: "doctors.webp"
  imageAlt: string;
  logos?: string; // panel ke upar logos (optional): "logos.webp"
};

export type ImpactStat = {
  value: number; // 148
  suffix: string; // "+" ya "%"
  label: string; // "Healthcare Clients"
};

export type ImpactContent = {
  eyebrow: string; // "Our Impact"
  titleStart: string; // "Real Results. Real"
  titleItalic: string; // "Growth." (playfair italic)
  text: string;
  stats: ImpactStat[];
};

export type WorkItem = {
  title: string; // nayi line ke liye "\n"
  desc: string;
  image: string; // file ka naam is industry ke folder mein: "work1.webp"
  link: string; // "Learn More" ka link
};

export type WorkContent = {
  titleStart: string; // "Our Work,"
  titleItalic: string; // "Your Inspiration" (playfair italic)
  text: string;
  items: WorkItem[];
  button: string; // "See All"
  buttonLink: string;
};

export type ProcessStep = {
  title: string;
  text: string;
};

export type ProcessContent = {
  titleStart: string; // "Thoughtful Process Behind Every Healthcare"
  titleItalic: string; // "Website" (playfair italic)
  text: string;
  steps: ProcessStep[];
};

export type ToolItem = {
  icon: string; // file ka naam is industry ke folder mein: "chatgpt.webp"
  alt: string;
  size: string; // circle ke andar logo ki width: "60.5%"
};

export type ToolsContent = {
  titleStart: string; // "Tools & Technologies"
  titleItalic: string; // "We Build With" (playfair italic)
  outer: ToolItem[]; // bahar wala ring: 5 icons
  middle: ToolItem[]; // beech wala ring: 4 icons
  inner: ToolItem[]; // andar wala ring: 4 icons
};

export type TrustedItem = {
  poster: string; // file ka naam is industry ke folder mein: "trusteds1.webp"
  video: string; // "video1.mp4"
};

export type TrustedContent = {
  titleStart: string; // "Trusted by Growing"
  titleItalic: string; // "Healthcare Practices" (playfair italic)
  items: TrustedItem[];
};

export type TeamMember = {
  name: string;
  photo: string; // file ka naam is industry ke folder mein: "team1.webp"
};

export type TeamContent = {
  titleStart: string; // "Our"
  titleItalic: string; // "Team" (playfair italic)
  text: string;
  members: TeamMember[]; // 5 members (design ki 5 jagahein)
  button: string; // "See All"
  buttonLink: string;
};

export type AwardItem = {
  logo: string; // file ka naam is industry ke folder mein: "fiverr.webp"
  size: string; // circle ke andar logo ki width: "55.2%"
  title: string; // nayi line ke liye "\n"
};

export type AwardsContent = {
  titleStart: string; // "Awards &"
  titleItalic: string; // "Recognition" (playfair italic)
  text: string;
  items: AwardItem[];
};

export type FaqItem = {
  q: string;
  a: string;
};

export type FaqContent = {
  titleStart: string; // "Frequently Asked"
  titleItalic: string; // "Questions" (playfair italic)
  text: string;
  items: FaqItem[];
};

export type ContactContent = {
  titleStart: string; // "Your Next Patient Is Searching for"
  titleItalic: string; // "You Right Now." (playfair italic)
  text: string;
  email: string;
  phone: string;
  availability: string; // "Available 24/7"
  emailPlaceholder: string; // "jane@clinic.com"
  projectPlaceholder: string; // "Clinic Website Redesign"
  footer: string; // "TAIBA Creations @ 2026. All Rights Reserved."
};

export type IndustryContent = {
  slug: IndustrySlug; // images isi folder se: /public/[slug]/...
  banner: BannerContent;
  supporting: SupportingContent;
  services: ServicesContent;
  experience: ExperienceContent;
  impact: ImpactContent;
  work: WorkContent;
  process: ProcessContent;
  tools: ToolsContent;
  trusted: TrustedContent;
  team: TeamContent;
  awards: AwardsContent;
  faq: FaqContent;
  contact: ContactContent;
};