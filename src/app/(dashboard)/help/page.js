
import "./help.css";

const faqs = [
  {
    question: "How do I create a website?",
    answer:
      "Go to Create Website, describe the website you want, and WEBLIVO will generate it for you.",
  },
  {
    question: "Can I edit my generated website?",
    answer:
      "Yes. Open your project from My Websites and use the editor to customize your website.",
  },
  {
    question: "How do I publish my website?",
    answer:
      "Open your completed project and click Publish to make your website available online.",
  },
  {
    question: "How do AI credits work?",
    answer:
      "Each successful AI website generation uses one credit. You can upgrade your plan when you need more credits.",
  },
  {
    question: "Can I upgrade or change my plan?",
    answer:
      "Yes. Visit the Pricing page to view available plans and upgrade your subscription.",
  },
  {
    question: "What if my website generation fails?",
    answer:
      "Failed generations should not consume your credit. If you experience a problem, contact our support team.",
  },
];

export default function HelpPage() {
  return (
    <main className="help-page">
      <section className="help-hero">
        <span className="help-eyebrow">WEBLIVO SUPPORT</span>
        <h1>How can we help you?</h1>
        <p>
          Find answers, get guidance, or reach out to our support team.
          We're here to help you get the best out of WEBLIVO.
        </p>
      </section>

      <section className="help-faq-section">
        <div className="help-section-heading">
          <span>HELP CENTER</span>
          <h2>Frequently asked questions</h2>
          <p>Quick answers to common questions about WEBLIVO.</p>
        </div>

        <div className="help-faq-list">
          {faqs.map((faq, index) => (
            <details className="help-faq" key={index}>
              <summary>
                <span>{faq.question}</span>
                <span className="help-faq-icon">+</span>
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="help-contact-section">
        <div className="help-contact-heading">
          <span>CONTACT US</span>
          <h2>Still need a hand?</h2>
          <p>
            Can't find what you're looking for? Contact us through any
            of the channels below.
          </p>
        </div>

        <div className="help-contact-grid">
          <a
            href="mailto:abiolaboluwatife28@gmail.com"
            className="help-contact-card"
          >
            <span className="help-contact-icon">✉</span>
            <div>
              <h3>Email support</h3>
              <p>abiolaboluwatife28@gmail.com</p>
              <small>Send us an email →</small>
            </div>
          </a>

          <a
            href="https://wa.me/2347038513843"
            target="_blank"
            rel="noopener noreferrer"
            className="help-contact-card"
          >
            <span className="help-contact-icon">◉</span>
            <div>
              <h3>WhatsApp support</h3>
              <p>07038513843</p>
              <small>Chat with us →</small>
            </div>
          </a>

          <a
            href="tel:07063367214"
            className="help-contact-card"
          >
            <span className="help-contact-icon">☎</span>
            <div>
              <h3>Call support</h3>
              <p>07063367214</p>
              <small>Give us a call →</small>
            </div>
          </a>
        </div>

        <div className="help-support-note">
          <span className="help-online-dot" />
          <p>
            Need assistance? Reach out and we'll get back to you as soon
            as possible.
          </p>
        </div>
      </section>
    </main>
  );
}
