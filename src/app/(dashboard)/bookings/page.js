
"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import "./bookings.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BookingsPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadBookings(selectedProject);
    } else {
      setBookings([]);
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const supabase = createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Please log in to view your bookings.");
      }

      const { data, error: projectError } = await supabase
        .from("projects")
        .select("id, name, business_name, status")
        .eq("user_id", user.id)
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (projectError) throw projectError;

      const publishedProjects = data || [];

      setProjects(publishedProjects);

      if (publishedProjects.length > 0) {
        setSelectedProject(publishedProjects[0].id);
      }
    } catch (err) {
      setError(err.message || "Unable to load your websites.");
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async (projectId) => {
    try {
      setBookingsLoading(true);
      setError("");

      const supabase = createClient();

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const response = await fetch(
        `${API_URL}/api/bookings/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to load bookings.");
      }

      setBookings(result.bookings || []);
    } catch (err) {
      setError(err.message || "Unable to load bookings.");
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      setUpdatingId(bookingId);
      setError("");

      const supabase = createClient();

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const response = await fetch(
        `${API_URL}/api/bookings/${selectedProject}/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to update booking.");
      }

      setBookings((previous) =>
        previous.map((booking) =>
          booking.id === bookingId
            ? result.booking
            : booking
        )
      );
    } catch (err) {
      setError(err.message || "Unable to update booking.");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (time) => {
    if (!time) return "Not specified";

    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-NG", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const pendingCount = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  if (loading) {
    return (
      <div className="bookings-loading">
        <LoaderCircle className="bookings-spinner" size={25} />
        <p>Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <div>
          <span className="bookings-eyebrow">WEBSITE MANAGEMENT</span>
          <h1>Appointment Bookings</h1>
          <p>Manage appointment requests from your customers.</p>
        </div>

        <button
          type="button"
          className="bookings-refresh"
          onClick={() =>
            selectedProject && loadBookings(selectedProject)
          }
          disabled={!selectedProject || bookingsLoading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {projects.length > 0 && (
        <div className="bookings-project-select">
          <label htmlFor="booking-project">
            Select published website
          </label>

          <select
            id="booking-project"
            value={selectedProject}
            onChange={(event) => setSelectedProject(event.target.value)}
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.business_name || project.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <div className="bookings-error">
          {error}
        </div>
      )}

      {projects.length > 0 && (
        <div className="bookings-stats">
          <div className="bookings-stat-card">
            <CalendarDays size={20} />
            <div>
              <strong>{bookings.length}</strong>
              <span>Total bookings</span>
            </div>
          </div>

          <div className="bookings-stat-card">
            <Clock size={20} />
            <div>
              <strong>{pendingCount}</strong>
              <span>Pending requests</span>
            </div>
          </div>

          <div className="bookings-stat-card">
            <CheckCircle2 size={20} />
            <div>
              <strong>{confirmedCount}</strong>
              <span>Confirmed</span>
            </div>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="bookings-empty">
          <CalendarDays size={38} />
          <h2>No published websites yet</h2>
          <p>
            Publish a website before receiving appointment bookings.
          </p>
        </div>
      ) : bookingsLoading ? (
        <div className="bookings-loading">
          <LoaderCircle className="bookings-spinner" size={25} />
          <p>Loading appointment requests...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bookings-empty">
          <CalendarDays size={38} />
          <h2>No bookings yet</h2>
          <p>
            Customer appointment requests for this website will appear here.
          </p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <article className="booking-card" key={booking.id}>
              <div className="booking-card-top">
                <div>
                  <span className={`booking-status ${booking.status}`}>
                    {booking.status}
                  </span>
                  <h3>{booking.customer_name}</h3>
                  <p className="booking-service">
                    {booking.service_name}
                  </p>
                </div>

                <div className="booking-date">
                  <strong>{formatDate(booking.booking_date)}</strong>
                  <span>{formatTime(booking.booking_time)}</span>
                </div>
              </div>

              <div className="booking-customer-details">
                <span>
                  <Phone size={15} />
                  {booking.customer_phone}
                </span>

                {booking.customer_email && (
                  <span>
                    <Mail size={15} />
                    {booking.customer_email}
                  </span>
                )}
              </div>

              {booking.message && (
                <div className="booking-customer-message">
                  <strong>Customer message</strong>
                  <p>{booking.message}</p>
                </div>
              )}

              <div className="booking-card-actions">
                {booking.status !== "confirmed" && (
                  <button
                    type="button"
                    className="booking-confirm-button"
                    disabled={updatingId === booking.id}
                    onClick={() => updateStatus(booking.id, "confirmed")}
                  >
                    <CheckCircle2 size={15} />
                    Confirm
                  </button>
                )}

                {booking.status !== "completed" &&
                  booking.status !== "cancelled" && (
                    <button
                      type="button"
                      className="booking-complete-button"
                      disabled={updatingId === booking.id}
                      onClick={() => updateStatus(booking.id, "completed")}
                    >
                      Mark completed
                    </button>
                  )}

                {booking.status !== "cancelled" &&
                  booking.status !== "completed" && (
                    <button
                      type="button"
                      className="booking-cancel-button"
                      disabled={updatingId === booking.id}
                      onClick={() => updateStatus(booking.id, "cancelled")}
                    >
                      <XCircle size={15} />
                      Cancel
                    </button>
                  )}

                {updatingId === booking.id && (
                  <LoaderCircle
                    size={17}
                    className="bookings-spinner"
                  />
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
