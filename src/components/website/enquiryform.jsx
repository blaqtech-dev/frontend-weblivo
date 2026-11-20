
"use client";

import { useState } from "react";
import "./enquiryform.css";

export default function EnquiryForm({
  projectId,
  isPublished = false,
}) {
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!isPublished || !projectId) {
      setFeedback({
        type: "error",
        message: "Enquiries can be submitted after publishing this website.",
      });
      return;
    }

    if (!form.customerEmail.trim() && !form.customerPhone.trim()) {
      setFeedback({
        type: "error",
        message: "Please provide an email address or phone number.",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enquiries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId,
            ...form,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Enquiry submission failed.");
      }

      setFeedback({
        type: "success",
        message: "Your enquiry has been sent successfully! We'll get back to you soon.",
      });

      setForm({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="enquiry-section" id="enquiry">
      <div className="enquiry-heading">
        <span>GET IN TOUCH</span>
        <h2>Have a Question?</h2>
        <p>
          We'd love to hear from you. Send us a message
          and we'll get back to you as soon as possible.
        </p>
      </div>

      <form className="enquiry-form" onSubmit={handleSubmit}>
        <div className="enquiry-fields">
          <div className="enquiry-field">
            <label>Your Name *</label>
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Enter your full name"
              maxLength={100}
              required
            />
          </div>

          <div className="enquiry-field">
            <label>Email Address</label>
            <input
              type="email"
              name="customerEmail"
              value={form.customerEmail}
              onChange={handleChange}
              placeholder="Enter your email"
              maxLength={254}
            />
          </div>

          <div className="enquiry-field">
            <label>Phone Number</label>
            <input
              type="tel"
              name="customerPhone"
              value={form.customerPhone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              maxLength={30}
            />
          </div>

          <div className="enquiry-field">
            <label>Subject</label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="What is your enquiry about?"
              maxLength={150}
            />
          </div>
        </div>

        <div className="enquiry-field">
          <label>Your Message *</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Tell us how we can help you..."
            maxLength={3000}
            rows={5}
            required
          />
        </div>

        <p className="enquiry-contact-note">
          Please provide at least one contact method: email or phone number.
        </p>

        {feedback && (
          <p className={`enquiry-feedback ${feedback.type}`}>
            {feedback.message}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Enquiry"}
        </button>

        {!isPublished && (
          <p className="enquiry-preview-note">
            This is a preview. Enquiries can be submitted after publishing.
          </p>
        )}
      </form>
    </section>
  );
}
