
"use client";

import { useState } from "react";
import "./bookingform.css";

export default function BookingForm({
  projectId,
  services = [],
  isPublished = false,
}) {
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    serviceName: "",
    bookingDate: "",
    bookingTime: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const serviceOptions = services
    .map((service) =>
      typeof service === "string" ? service : service?.title
    )
    .filter(Boolean);

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
        message: "Booking submissions are available on the published website.",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
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
        throw new Error(result.message || "Booking submission failed.");
      }

      setFeedback({
        type: "success",
        message: "Your booking request has been submitted successfully!",
      });

      setForm({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        serviceName: "",
        bookingDate: "",
        bookingTime: "",
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
    <section className="booking-section" id="booking">
      <div className="booking-heading">
        <span>BOOK AN APPOINTMENT</span>
        <h2>Schedule Your Visit</h2>
        <p>
          Choose your preferred service, date and time.
          We'll get back to you to confirm your booking.
        </p>
      </div>

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="booking-fields">
          <div className="booking-field">
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

          <div className="booking-field">
            <label>Phone Number *</label>
            <input
              name="customerPhone"
              value={form.customerPhone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              maxLength={30}
              required
            />
          </div>

          <div className="booking-field">
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

          <div className="booking-field">
            <label>Select Service *</label>
            <select
              name="serviceName"
              value={form.serviceName}
              onChange={handleChange}
              required
            >
              <option value="">Choose a service</option>
              {serviceOptions.map((service, index) => (
                <option key={`${service}-${index}`} value={service}>
                  {service}
                </option>
              ))}
              {serviceOptions.length === 0 && (
                <option value="General Appointment">
                  General Appointment
                </option>
              )}
            </select>
          </div>

          <div className="booking-field">
            <label>Preferred Date *</label>
            <input
              type="date"
              name="bookingDate"
              value={form.bookingDate}
              onChange={handleChange}
              min={new Date().toLocaleDateString("en-CA")}
              required
            />
          </div>

          <div className="booking-field">
            <label>Preferred Time *</label>
            <input
              type="time"
              name="bookingTime"
              value={form.bookingTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="booking-field">
          <label>Additional Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Any additional information?"
            maxLength={1000}
            rows={4}
          />
        </div>

        {feedback && (
          <p className={`booking-feedback ${feedback.type}`}>
            {feedback.message}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Request Appointment"}
        </button>

        {!isPublished && (
          <p className="booking-preview-note">
            This is a preview. Bookings can be submitted after publishing.
          </p>
        )}
      </form>
    </section>
  );
}
