import { footer, elsewhere } from "@/lib/content";
import { elsewhereIcons, ArrowUpIcon } from "@/components/icons";
import { FooterMarquee } from "@/components/footer-marquee";
import { FooterWordmark } from "@/components/footer-wordmark";

export function Footer() {
  return (
    <footer className="w-full border-t border-muted/20 pt-16 pb-10">
      <FooterMarquee />

      <div className="mx-auto w-full max-w-[68rem] px-6 pt-16 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="mono-label text-muted">
              {footer.locationEyebrow}
            </p>
            <FooterWordmark />
            <p className="mt-10">
              <a
                href="#main"
                className="inline-flex items-center gap-3 text-sm text-muted transition-colors duration-300 hover:text-fg"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-muted/30">
                  <ArrowUpIcon className="h-4 w-4" />
                </span>
                <span className="link-sweep">{footer.backToTop}</span>
              </a>
            </p>
          </div>

          <nav aria-label={footer.elsewhereLabel}>
            <p className="mono-label text-muted">
              {footer.elsewhereLabel}
            </p>
            <ul className="mt-4 flex flex-col">
              {elsewhere.map((link) => {
                const Icon = elsewhereIcons[link.label];
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-sweep flex items-center justify-between gap-4 border-b border-muted/20 py-4 transition-colors duration-300 hover:text-accent"
                    >
                      <span className="flex items-center gap-4">
                        <Icon className="h-5 w-5" />
                        <span className="font-display text-lg">
                          {link.label}
                        </span>
                      </span>
                      <span className="text-sm text-muted">
                        {link.handle}
                        <span className="sr-only"> (opens in new tab)</span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-muted/20 pt-8 text-xs text-muted sm:flex-row sm:items-center">
          <p>{footer.copyright}</p>
          <p>{footer.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}
