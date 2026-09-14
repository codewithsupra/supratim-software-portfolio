"use server";

import { contact } from "@/lib/content";

export interface ContactFormState {
  status: "idle" | "sent" | "failed";
  errors: { name?: string; email?: string; message?: string };
  values: { name: string; email: string; message: string };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 200;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;

export async function sendContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  // Honeypot: real visitors never see this field, so anything here is a bot.
  // Report success so the sender can't tell it was dropped.
  if (String(formData.get("company") ?? "").trim() !== "") {
    return {
      status: "sent",
      errors: {},
      values: { name: "", email: "", message: "" },
    };
  }

  const { errors: errorCopy } = contact.form;
  const errors: ContactFormState["errors"] = {};
  if (values.name === "" || values.name.length > MAX_NAME) {
    errors.name = errorCopy.name;
  }
  if (!EMAIL_PATTERN.test(values.email) || values.email.length > MAX_EMAIL) {
    errors.email = errorCopy.email;
  }
  if (values.message === "") {
    errors.message = errorCopy.message;
  } else if (values.message.length > MAX_MESSAGE) {
    errors.message = errorCopy.messageLength;
  }
  if (Object.keys(errors).length > 0) {
    return { status: "idle", errors, values };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !fromEmail || !toEmail) {
    console.error("Contact form: missing RESEND_API_KEY, CONTACT_FROM_EMAIL or CONTACT_TO_EMAIL");
    return { status: "failed", errors: {}, values };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Supratim Sarkar <${fromEmail}>`,
        to: [toEmail],
        reply_to: values.email,
        subject: `Portfolio contact from ${values.name}`,
        text: `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`,
      }),
    });

    if (!res.ok) {
      console.error("Contact form: Resend responded", res.status, await res.text());
      return { status: "failed", errors: {}, values };
    }
  } catch (err) {
    console.error("Contact form: Resend request failed", err);
    return { status: "failed", errors: {}, values };
  }

  return {
    status: "sent",
    errors: {},
    values: { name: "", email: "", message: "" },
  };
}
