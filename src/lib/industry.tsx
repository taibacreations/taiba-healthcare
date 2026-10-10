"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { IndustryContent } from "@/content/types";

const IndustryContext = createContext<IndustryContent | null>(null);

export function IndustryProvider({
  content,
  children,
}: {
  content: IndustryContent;
  children: ReactNode;
}) {
  return <IndustryContext.Provider value={content}>{children}</IndustryContext.Provider>;
}

/* Har section mein: const { content, asset } = useIndustry(); */
export function useIndustry() {
  const content = useContext(IndustryContext);
  if (!content) {
    throw new Error("useIndustry ko IndustryProvider ke andar use karein");
  }

  /* asset("banner.webp") → "/healthcare/banner.webp" */
  const asset = (file: string) => `/${content.slug}/${file}`;

  return { content, asset };
}