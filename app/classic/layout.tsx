import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: `${site.name} — Résumé view`,
  description: site.description,
};

/** The scrolling, text-first version: the same content as the universe, readable in seconds. */
export default function ClassicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:bg-surface focus:px-4 focus:py-2 focus:text-accent"
      >
        Skip to content
      </a>
      <Header />
      {children}
      <Footer />
    </>
  );
}
