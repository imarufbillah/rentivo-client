"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Message sent! We will get back to you soon.");
  };

  const inputClass =
    "w-full rounded-xl border bg-card py-2.5 px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Contact Us
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Have a question or need help? We would love to hear from you.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border bg-card p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground"
                >
                  Name
                </label>
                <input
                  id="name"
                  required
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="subject"
                className="text-sm font-medium text-foreground"
              >
                Subject
              </label>
              <input
                id="subject"
                required
                placeholder="How can we help?"
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-sm font-medium text-foreground"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                required
                className={inputClass}
                placeholder="Tell us more..."
              />
            </div>
            <Button
              type="submit"
              className="rounded-full"
              disabled={submitted}
            >
              {submitted ? (
                "Sent!"
              ) : (
                <>
                  Send Message
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="space-y-6 lg:col-span-2">
          {[
            {
              icon: Mail,
              title: "Email",
              value: "support@rentivo.com",
            },
            {
              icon: Phone,
              title: "Phone",
              value: "+1 (555) 123-4567",
            },
            {
              icon: MapPin,
              title: "Address",
              value: "123 Rental Street\nNew York, NY 10001",
            },
          ].map(({ icon: Icon, title, value }) => (
            <div key={title} className="flex gap-4 rounded-2xl border bg-card p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold">{title}</h3>
                <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
