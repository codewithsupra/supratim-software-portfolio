"use client";

import { useState, useActionState } from "react";

type FieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

type FormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: FieldErrors;
};

const INITIAL_STATE: FormState = { status: "idle", message: "" };

async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";

  // Honeypot: bots fill hidden fields, humans don't
  const honeypot = (formData.get("website") as string | null) ?? "";
  if (honeypot) return { status: "error", message: "Submission rejected." };

  const fieldErrors: FieldErrors = {};
  if (!name) fieldErrors.name = "Name is required.";
  if (!email) {
    fieldErrors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }
  if (!message) fieldErrors.message = "Message is required.";
  else if (message.length < 10) fieldErrors.message = "Message must be at least 10 characters.";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors };
  }

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { status: "error", message: data.error ?? "Something went wrong. Please try again." };
    }

    return { status: "success", message: "Message sent! I'll get back to you soon." };
  } catch {
    return { status: "error", message: "Network error. Please check your connection and try again." };
  }
}

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, INITIAL_STATE);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (name: string) =>
    setTouched((prev) => ({ ...prev, [name]: true }));

  return (
    <section
      id="contact"
      className="bg-[#0d0d0d] py-24 md:py-32 px-6 md:px-12 lg:px-24"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
        {/* Left */}
        <div>
          <p className="text-violet-400 text-sm font-mono tracking-[0.25em] uppercase mb-4">
            Contact
          </p>
          <h2
            id="contact-heading"
            className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.95] tracking-tight text-white mb-8"
          >
            Let&apos;s work
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-indigo-400">
              together.
            </span>
          </h2>
          <p className="text-zinc-400 leading-relaxed max-w-md mb-10">
            I&apos;m open to full-time roles, contract work, and interesting collaborations. If you&apos;re
            building something ambitious, I&apos;d love to hear about it.
          </p>

          <div className="space-y-4">
            <a
              href="mailto:supratim347@gmail.com"
              className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group"
            >
              <span className="w-9 h-9 rounded-full border border-zinc-700 group-hover:border-violet-500 flex items-center justify-center transition-colors" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12v9H2V4zm0 0l6 5 6-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              supratim347@gmail.com
            </a>
            <a
              href="https://linkedin.com/in/supratimsarkar99"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group"
            >
              <span className="w-9 h-9 rounded-full border border-zinc-700 group-hover:border-violet-500 flex items-center justify-center transition-colors" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </span>
              linkedin.com/in/supratimsarkar99
            </a>
          </div>
        </div>

        {/* Right — form */}
        <div>
          {state.status === "success" ? (
            <div
              role="alert"
              aria-live="polite"
              className="border border-green-500/30 bg-green-500/10 rounded-3xl p-10 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L19 7" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-green-400 font-semibold text-lg">{state.message}</p>
            </div>
          ) : (
            <form
              action={formAction}
              noValidate
              className="space-y-5"
              aria-label="Contact form"
            >
              {/* Honeypot — hidden from humans, filled by bots */}
              <div aria-hidden="true" className="hidden">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              {/* Top-level error */}
              {state.status === "error" && !state.fieldErrors && (
                <div role="alert" aria-live="assertive" className="border border-red-500/30 bg-red-500/10 rounded-xl p-4 text-red-400 text-sm">
                  {state.message}
                </div>
              )}

              {/* Name */}
              <div>
                <label htmlFor="contact-name" className="block text-zinc-300 text-sm font-medium mb-1.5">
                  Name <span aria-hidden="true" className="text-violet-400">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  aria-required="true"
                  aria-describedby={state.fieldErrors?.name && touched.name ? "name-error" : undefined}
                  aria-invalid={!!(state.fieldErrors?.name && touched.name)}
                  onBlur={() => markTouched("name")}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all aria-invalid:border-red-500"
                  placeholder="Your name"
                />
                {state.fieldErrors?.name && touched.name && (
                  <p id="name-error" role="alert" className="mt-1.5 text-red-400 text-xs">
                    {state.fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="contact-email" className="block text-zinc-300 text-sm font-medium mb-1.5">
                  Email <span aria-hidden="true" className="text-violet-400">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-describedby={state.fieldErrors?.email && touched.email ? "email-error" : undefined}
                  aria-invalid={!!(state.fieldErrors?.email && touched.email)}
                  onBlur={() => markTouched("email")}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all aria-invalid:border-red-500"
                  placeholder="you@example.com"
                />
                {state.fieldErrors?.email && touched.email && (
                  <p id="email-error" role="alert" className="mt-1.5 text-red-400 text-xs">
                    {state.fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact-message" className="block text-zinc-300 text-sm font-medium mb-1.5">
                  Message <span aria-hidden="true" className="text-violet-400">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  aria-required="true"
                  aria-describedby={state.fieldErrors?.message && touched.message ? "message-error" : undefined}
                  aria-invalid={!!(state.fieldErrors?.message && touched.message)}
                  onBlur={() => markTouched("message")}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none aria-invalid:border-red-500"
                  placeholder="Tell me about what you're building..."
                />
                {state.fieldErrors?.message && touched.message && (
                  <p id="message-error" role="alert" className="mt-1.5 text-red-400 text-xs">
                    {state.fieldErrors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 px-6 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 flex items-center justify-center gap-2"
                aria-busy={isPending}
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
