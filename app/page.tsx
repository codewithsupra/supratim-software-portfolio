import { Kiosk } from "@/components/kiosk/kiosk";

/**
 * The home page is a neon repair kiosk at night: each TV behind the counter is a project,
 * the radio is About, the lightbox is the Tiptap work and the mailbox is Contact. Every
 * station is also in the top bar, and the same content in plain reading order lives at
 * /classic ("Résumé view").
 */
export default function Home() {
  return (
    <main id="main">
      <Kiosk />
    </main>
  );
}
