# Motion Brief — Supratim Sarkar Portfolio

## Look

Feel: Deep space, seen from a long way out — quiet, vast, and unhurried.
      Near-black ground with colour that drifts rather than moves, so the
      page feels like it's breathing rather than performing. Editorial and
      composed when still; the motion is the last ten percent, not the
      thing holding it together.

Palette:
  Background   #05030C   near-black void
  Surface      #0D0A18   raised panels, cards
  Foreground   #EDEAF5   primary text
  Muted        #8B84A8   secondary text, metadata
  Indigo       #2A1B5E   nebula, deep field
  Violet       #6B3FA0   nebula, mid
  Magenta      #A6329B   nebula, highlight
  Cyan         #4DD8E8   single accent — links, focus, active state only

Type:
  Display      Clash Display (500/600/700) — headings, wordmark, project titles
  Body         Inter (400/500) — prose, UI
  Micro        system mono stack — 11px uppercase labels: nav, eyebrows, tags
  Two loaded families plus the system mono, no more. Display goes big
  and tight; body stays quiet; labels run small and tracked wide.

Space: Airy. Wide outer margins, generous vertical rhythm between parts.
       Soft corners (12px) on cards, nothing sharper. Content column
       narrower than it wants to be — let the void do the work.
       
Ground: the shader runs behind the whole page, not just the hero - but it recedes after passing the hero section: lower intensity, slower, larger, until it reads as texture rather than motion. 

## Motion direction

Slow and weighted. Nothing snaps — everything eases out, and anything that
follows the cursor lags behind it rather than tracking it. If a movement
draws attention to itself, it's wrong.

## Hero  [content part]

- Treatment: full-screen shader — a slow drift of deep indigo, violet and
  magenta clouds over a near-black void, cyan catching the light at the
  edges, faint stars drifting behind, a soft glow at the centre
- Treatment: gentle parallax — the whole field drifts toward the cursor,
  eased so it lags and settles
- Treatment: pinned and scrubbed — as the visitor scrolls the pinned window,
  the field travels vertically and deepens, the palette evolves, and the
  central glow settles back
- Treatment: the headline arrives a line at a time rather than all at once,
  the eyebrow and subhead fading up a beat behind it
- Treatment: a scroll hint at the foot of the fold — a short segment looping
  slowly down a hairline track, pointing the visitor into the scroll. Still
  under prefers-reduced-motion.
- Why: two seconds to establish the tier, and a live surface that responds
  to the visitor says "this was built, not bought" in a way no image can.
  Scrubbing makes the scroll feel like the visitor is directing it. The
  headline reveal paces the message instead of dumping it.
- Treatment: the wordmark's two lines drift in the opposite directions as the pinned window scrubs - a few percent of their width at the most - and the whole mark leans a few pixels toward the cursor, with the same lag as the field. Adjustable in the dev panel. 
- Why: ties the type to the surface it sits on - the hero reads as one built thing, not text over a video.  

  -> Transition into About: parallax depth on the background as the hero
     unpins — the field keeps drifting, slower, behind the content
     Why: hands the visitor down the page with continuity, not a hard cut

## About  [content part]

- Treatment: the five story beats sit on one horizontal track - the sections pin and scroll scrubs sideways through them, one beat per screen, index numbers and a hairline marking the travel - the number under the beat on screen lifts to full foreground. 
- Treatment: the three stats fade up in a stagger and count up once, on first sight
- Treatment: the two course cards fade up a beat apart on first sight, then lift a little on hover - and the one that links takes a cyan border with it
- Why: the reveal gives the pair one arrival and then they hold, which is all a footnote to the story needs. The lift is the same calm hover language as the project cards, so there is one hover across the page. The cyan is the palette keeping its promise - it marks the card you can click, and it is the only colour in this part that means anything.
- Treatment: otherwise still — the heading holds
- Why: the story is chronological, and horizontal travel makes form match content. Still 'read, not watched' - one beat on screen at a time paces the reading instead of stacking it into a wall, and nothing moves while a beat is being read. 

## Project grid  [content part]

- Treatment: each card reveals as it enters - the screenshot unmasks upward while the image settles form a slight overscale, then index, title and meta follow a beat behind; cards arrive as a staggered wave
- Treatment: a small, calm lift on hover, and a slight zoom on the screenshot. No cyan on the border here - the work is the colour.
- Why: the unmask presents the screenshots as the evidence and the staggers leads the eye across the work in the order laid out, which is the one place choreography genuinely serves the reader. The hover confirms focus without demanding attention the work should be getting. Nothing spins, flips, or bounces.

  -> Transition into Contact: none — a clean, quiet arrival
     Why: the visitor is about to act. Stillness signals "this is the point."

## Contact  [content part]

- Treatment: still, by decision. The one exception is hover feedback on
  the actions themselves - the email link takes the site-wide sweep, and
  the submit button answers hover with a colour shift.
- Why: the conversion moment must be frictionless. Anything moving here
  competes with the one action I want, and a form that animates while
  you're filling it in is actively hostile. No treatment earns a place -
  but the actions still have to answer the cursor, or the form reads dead.
  
## Footer  [content part]

- Treatment: the skills band loops as a slow, seamless marquee, and scroll velocity nudges it - faster while the page moves, settling back when it stops. Should remain still under prefers-reduced-motion.
- Why: one flourish after the conversion moment, where nothing is left to compete with. The velocity link makes it feel wired to the page rather than looped like a GIF. 
- Treatment: the wordmark is set like the hero headline, and its letters bounce one at a time as the cursor crosses them. Still under prefers-reduced-motion.
- Why: the mark that led the visitor in signs the page off, and this is the one place on the site where a moment of play costs nothing - everything that had to be read has been read. It rewards a cursor that's still exploring rather than asking for attention: nothing moves until someone goes looking for it. 

## Site-wide

- Treatment: every link takes an underline that sweeps in on hover - nav, footer, project links, the email - one hover language for text across the page. Interactive text also shifts colour on hover, muted toward foreground in the chrome, toward cyan where the palette allows it; the sweep and the shift are the whole hover vocabulary for text.
- Treatment: past the hero, the nav bar fades in a glassmorphic ground - blurred and slightly tinted - so it stays readable over copy and screenshots without blocking them.
- Treatment: on narrow screens the bar collapses to the wordmark and a menu that fades and slides open and closed; the glass stays, the active-state tracking is desktop only 
- Why: navigation stays reachable without sitting on the choreography, and the nav doubles as a quiet progress indicator. The glass is what lets one bar cross a shader, then text, then images, and read on all three. Every section stays reachable on every device. 

## Excluded

- Preloader with a percentage counter — cut. This site ships as kilobytes;
  a loading screen would be adding perceived wait to look serious. If the
  shader needs a beat to compile, that's a fade-in, not a progress bar.
- Magnetic buttons — cut. Fun to build, mildly annoying to use.
- SplitText on body copy — cut. Restricted to the hero headline only.
  If everything reveals, nothing reads as important.

## Content

Six projects, real, deployed, linked — full copy in CONTENT.md:
  01  Verdict               LLM Evals · Statistics · 2026
  02  Durable Agent Engine  Backend · Queues · 2026
  03  Pulse                 Backend · Monitoring · 2026
  04  OSS Finder            Full-Stack · Web App · 2026
  05  Anchor                Offline-First · CRDTs · 2026
  06  Aria                  Accessibility · AI · 2026

About panels: Tiptap (two merged pull requests) and Verdict (now building).

Contact: supratim347@gmail.com — form posts and is tested end to end
before ship.

## Audience

Teams hiring backend and full-stack engineers.
The test at audit is not "does this belong on Awwwards" — it's
"would that person reach out."