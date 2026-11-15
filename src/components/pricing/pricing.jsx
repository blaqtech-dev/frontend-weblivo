
import Link from "next/link";
import {
  Check,
  Sparkles,
  Zap,
  Crown,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

import "./pricing.css";

const plans = [
  {
    name: "Free",
    description: "Explore WEBLIVO and bring your first website idea to life.",
    price: "₦0",
    period: "Forever",
    credits: "3 starter credits",
    icon: Sparkles,
    popular: false,
    features: [
      "1 website project",
      "3 AI generation credits",
      "Basic website templates",
      "Essential visual editing",
      "WEBLIVO subdomain",
    ],
    button: "Start for free",
    href: "/signup",
  },
  {
    name: "Starter",
    description: "Everything you need to establish your business online.",
    price: "₦3,000",
    period: "per month",
    credits: "30 credits every month",
    icon: Zap,
    popular: false,
    features: [
      "3 website projects",
      "30 monthly AI credits",
      "More website templates",
      "Advanced visual editing",
      "Publish your websites",
      "No coding required",
    ],
    button: "Choose Starter",
    href: "/signup",
  },
  {
    name: "Pro",
    description: "More creative freedom for businesses ready to grow.",
    price: "₦7,500",
    period: "per month",
    credits: "100 credits every month",
    icon: Crown,
    popular: true,
    features: [
      "10 website projects",
      "100 monthly AI credits",
      "Premium website templates",
      "Advanced customization",
      "Custom domain connection",
      "Priority AI generation",
    ],
    button: "Choose Pro",
    href: "/signup",
  },
];

export default function Pricing() {
  return (
    <section className="pricing-section" id="pricing">
      <div className="pricing-container">

        <div className="pricing-heading">
          <span className="pricing-label">
            <Sparkles size={15} />
            SIMPLE AND AFFORDABLE
          </span>

          <h2>
            Build more.
            <span> Pay only for what you need.</span>
          </h2>

          <p>
            Start with a free plan, explore your possibilities,
            and upgrade when your business needs more.
            No complicated pricing.
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <article
                className={`pricing-card ${
                  plan.popular ? "pricing-popular" : ""
                }`}
                key={plan.name}
              >
                {plan.popular && (
                  <span className="pricing-popular-tag">
                    RECOMMENDED
                  </span>
                )}

                <div className="pricing-icon">
                  <Icon size={23} />
                </div>

                <h3>{plan.name}</h3>

                <p className="pricing-description">
                  {plan.description}
                </p>

                <div className="pricing-price">
                  <strong>{plan.price}</strong>
                  <span>{plan.period}</span>
                </div>

                <div className="pricing-credit">
                  <Sparkles size={16} />
                  <span>{plan.credits}</span>
                </div>

                <Link
                  href={plan.href}
                  className="pricing-button"
                >
                  {plan.button}
                  <ArrowRight size={17} />
                </Link>

                <div className="pricing-divider" />

                <span className="pricing-includes">
                  PLAN INCLUDES
                </span>

                <ul className="pricing-features">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <span className="pricing-check">
                        <Check size={14} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="pricing-credit-info">
          <div className="pricing-credit-icon">
            <HelpCircle size={21} />
          </div>

          <div>
            <h3>What are AI credits?</h3>
            <p>
              AI credits power website generation and other
              AI features. Your plan determines how many credits
              you receive. We'll show your available balance
              inside your dashboard.
            </p>
          </div>
        </div>

        <div className="pricing-bottom">
          <p>
            Have questions about choosing a plan?
            <span> We're keeping WEBLIVO simple and accessible.</span>
          </p>

          <Link href="/signup">
            Get started <ArrowRight size={16} />
          </Link>
        </div>

        <p className="pricing-note">
          Prices are displayed in Nigerian Naira (NGN).
          Subscription payments will be processed securely through Paystack.
        </p>

      </div>
    </section>
  );
}
