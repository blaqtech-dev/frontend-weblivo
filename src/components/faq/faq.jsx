
"use client";

import { useState } from "react";
import { Plus, Minus, Sparkles } from "lucide-react";

import "./faq.css";

const questions = [
  {
    question: "Do I need coding knowledge to use WEBLIVO?",
    answer:
      "No. WEBLIVO is designed for business owners, entrepreneurs and individuals who want professional websites without writing code. You simply describe what you need and customize the result.",
  },
  {
    question: "How does WEBLIVO generate websites?",
    answer:
      "You describe your business and the website you want. Our AI uses your description to create a website structure, content and design that you can review and customize.",
  },
  {
    question: "Can I edit my website after it has been generated?",
    answer:
      "Yes. You will be able to edit text, images, colours and website sections through the WEBLIVO visual editor without needing to modify code.",
  },
  {
    question: "Can I publish my website online?",
    answer:
      "Yes. WEBLIVO is being built to let you publish your website online and share it with customers. Custom domain connections will be available according to your plan.",
  },
  {
    question: "What are AI credits?",
    answer:
      "AI credits are units used for AI-powered actions such as generating websites. Your plan determines how many credits you receive. We will clearly show your available balance in your dashboard.",
  },
  {
    question: "Can I start using WEBLIVO for free?",
    answer:
      "Yes. WEBLIVO will offer a free plan so you can explore the platform and try creating your first website before deciding whether to upgrade.",
  },
  {
    question: "How can I pay for a subscription?",
    answer:
      "Our planned payment provider is Paystack. Nigerian customers will be able to pay in naira using supported payment methods. Payment options and subscription availability will be confirmed at launch.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="faq-container">
        <div className="faq-heading">
          <span className="faq-label">
            <Sparkles size={15} />
            GOT QUESTIONS?
          </span>

          <h2>
            Frequently asked
            <span> questions.</span>
          </h2>

          <p>
            Everything you need to know about creating,
            customizing and publishing websites with WEBLIVO.
          </p>
        </div>

        <div className="faq-list">
          {questions.map((item, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                className={`faq-item ${isOpen ? "faq-active" : ""}`}
                key={item.question}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleQuestion(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="faq-question-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="faq-question-text">
                    {item.question}
                  </span>

                  <span className="faq-toggle">
                    {isOpen ? (
                      <Minus size={19} />
                    ) : (
                      <Plus size={19} />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div
                    className="faq-answer"
                    id={`faq-answer-${index}`}
                  >
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="faq-bottom">
          <div>
            <h3>Still have questions?</h3>
            <p>
              We're building WEBLIVO to make website creation simpler.
            </p>
          </div>

          <a href="mailto:support@weblivo.com">
            Contact support
          </a>
        </div>
      </div>
    </section>
  );
}
