import { Universe } from "@/components/universe/universe";

/**
 * The home page is a flyable solar system: the star is the About section, each planet a
 * project, a comet the open-source work and a relay station the contact details. The
 * same content in plain reading order lives at /classic, linked from the top bar.
 */
export default function Home() {
  return (
    <main id="main">
      <Universe />
    </main>
  );
}
