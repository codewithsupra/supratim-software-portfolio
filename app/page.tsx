import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Projects } from "@/components/projects";
import { Contact } from "@/components/contact";
import { NebulaProvider } from "@/components/nebula-uniforms";
import { ShaderBackground } from "@/components/shader-background";

export default function Home() {
  return (
    <main id="main">
      {/* The nebula is the page's ground — a fixed layer behind every part,
          receding to texture after the hero (MOTION_BRIEF: Look/Ground). */}
      <NebulaProvider>
        <ShaderBackground />
        <Hero />
        <About />
        <Projects />
        <Contact />
      </NebulaProvider>
    </main>
  );
}
