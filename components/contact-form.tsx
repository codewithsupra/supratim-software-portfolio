"use client";

import { useActionState } from "react";
import { sendContactMessage, type ContactFormState } from "@/app/actions";
import { contact } from "@/lib/content";

const initialState: ContactFormState = {
  status: "idle",
  errors: {},
  values: { name: "", email: "", message: "" },
};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    initialState,
  );
  const { form } = contact;

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-name" className="mono-label text-muted">
          {form.name.label}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder={form.name.placeholder}
          defaultValue={state.values.name}
          aria-invalid={state.errors.name ? true : undefined}
          aria-describedby={state.errors.name ? "contact-name-error" : undefined}
          className="rounded-card border border-muted/30 bg-surface px-4 py-3 placeholder:text-muted/60 aria-invalid:border-magenta/60"
        />
        {state.errors.name && (
          <p id="contact-name-error" className="text-sm text-magenta">
            {state.errors.name}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-email" className="mono-label text-muted">
          {form.email.label}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={form.email.placeholder}
          defaultValue={state.values.email}
          aria-invalid={state.errors.email ? true : undefined}
          aria-describedby={
            state.errors.email ? "contact-email-error" : undefined
          }
          className="rounded-card border border-muted/30 bg-surface px-4 py-3 placeholder:text-muted/60 aria-invalid:border-magenta/60"
        />
        {state.errors.email && (
          <p id="contact-email-error" className="text-sm text-magenta">
            {state.errors.email}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="mono-label text-muted">
          {form.message.label}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          placeholder={form.message.placeholder}
          defaultValue={state.values.message}
          aria-invalid={state.errors.message ? true : undefined}
          aria-describedby={
            state.errors.message ? "contact-message-error" : undefined
          }
          className="resize-none rounded-card border border-muted/30 bg-surface px-4 py-3 placeholder:text-muted/60 aria-invalid:border-magenta/60"
        />
        {state.errors.message && (
          <p id="contact-message-error" className="text-sm text-magenta">
            {state.errors.message}
          </p>
        )}
      </div>

      {/* Honeypot — off-screen and untabbable; the action drops any
          submission that fills it. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer self-start rounded-full bg-fg px-8 py-4 font-display text-sm text-bg transition-colors duration-300 hover:bg-accent disabled:cursor-default disabled:opacity-60 disabled:hover:bg-fg"
        >
          {form.submit}
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {isPending ? (
            <span className="text-muted">{form.status.sending}</span>
          ) : state.status === "sent" ? (
            <span className="text-fg">{form.status.sent}</span>
          ) : state.status === "failed" ? (
            <span className="text-magenta">{form.status.failed}</span>
          ) : null}
        </p>
      </div>
    </form>
  );
}
