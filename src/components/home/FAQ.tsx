"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does the AI recommendation engine work?",
    answer:
      "Our AI analyzes your browsing history, saved properties, and preferences to suggest listings that match your lifestyle. The more you interact with properties, the better the recommendations become.",
  },
  {
    question: "How do I list my property on Rentivo?",
    answer:
      "Sign up for an owner account, click 'Become an Owner', and fill out the property listing form with photos, description, pricing, and amenities. Your listing goes live after a quick review.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept all major credit cards through our secure Stripe integration. You can pay rent, security deposits, and advance payments directly through the platform.",
  },
  {
    question: "Is there a fee for renters?",
    answer:
      "Rentivo is free for renters to browse and search properties. There are no hidden fees or commissions. You only pay the rent and any applicable deposits to the property owner.",
  },
  {
    question: "Can I schedule property viewings?",
    answer:
      "Yes! You can contact property owners directly through the platform to arrange viewings. Our chat assistant can also help you coordinate scheduling.",
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Got questions? We have answers.
          </p>
        </div>

        <div className="mt-16 space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.question}
              className="overflow-hidden rounded-2xl border"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.4,
                delay: i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left"
                aria-expanded={openIndex === i}
              >
                <span className="pr-4 text-sm font-medium text-foreground">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
