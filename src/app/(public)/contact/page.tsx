"use client";

import { Mail, MessageSquare, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactPage = () => {
  return (
    <div className="min-h-dvh mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-balance">
          Contact Us
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-pretty text-muted-foreground">
          Have a question or need help? We would love to hear from you.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold">Email</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  support@rentivo.com
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  We typically respond within 24 hours
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold">Live Chat</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use the AI assistant in the bottom-right corner for instant help with finding properties.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Mail className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="font-display text-lg font-bold">Get in Touch</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              For property inquiries, rental support, or general questions, reach out to us via email or use the AI chat assistant.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a href="mailto:support@rentivo.com">
                <Button className="w-full rounded-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
              </a>
              <p className="text-xs text-muted-foreground">
                support@rentivo.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
