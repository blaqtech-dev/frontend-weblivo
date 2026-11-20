
"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  Mail,
  Phone,
  LoaderCircle,
  RefreshCw,
  User,
  MessageCircle,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import "./enquiries.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EnquiriesPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadEnquiries(selectedProject);
    } else {
      setEnquiries([]);
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
        throw new Error("Please log in to view your enquiries.");
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

  const loadEnquiries = async (projectId) => {
    try {
      setEnquiriesLoading(true);
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
        `${API_URL}/api/enquiries/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to load enquiries.");
      }

      setEnquiries(result.enquiries || []);
    } catch (err) {
      setError(err.message || "Unable to load enquiries.");
      setEnquiries([]);
    } finally {
      setEnquiriesLoading(false);
    }
  };

  const updateStatus = async (enquiryId, status) => {
    try {
      setUpdatingId(enquiryId);
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
        `${API_URL}/api/enquiries/${selectedProject}/${enquiryId}`,
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
        throw new Error(result.message || "Unable to update enquiry.");
      }

      setEnquiries((previous) =>
        previous.map((enquiry) =>
          enquiry.id === enquiryId
            ? result.enquiry
            : enquiry
        )
      );
    } catch (err) {
      setError(err.message || "Unable to update enquiry.");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const newCount = enquiries.filter(
    (item) => item.status === "new"
  ).length;

  const contactedCount = enquiries.filter(
    (item) => item.status === "contacted"
  ).length;

  const resolvedCount = enquiries.filter(
    (item) => item.status === "resolved"
  ).length;

  if (loading) {
    return (
      <div className="enquiries-loading">
        <LoaderCircle className="enquiries-spinner" size={25} />
        <p>Loading your enquiries...</p>
      </div>
    );
  }

  return (
    <div className="enquiries-page">
      <div className="enquiries-header">
        <div>
          <span className="enquiries-eyebrow">
            WEBSITE MANAGEMENT
          </span>
          <h1>Customer Enquiries</h1>
          <p>
            Manage messages and questions from visitors to your websites.
          </p>
        </div>

        <button
          type="button"
          className="enquiries-refresh"
          onClick={() =>
            selectedProject && loadEnquiries(selectedProject)
          }
          disabled={!selectedProject || enquiriesLoading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {projects.length > 0 && (
        <div className="enquiries-project-select">
          <label htmlFor="enquiry-project">
            Select published website
          </label>

          <select
            id="enquiry-project"
            value={selectedProject}
            onChange={(event) =>
              setSelectedProject(event.target.value)
            }
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
        <div className="enquiries-error">
          {error}
        </div>
      )}

      {projects.length > 0 && (
        <div className="enquiries-stats">
          <div className="enquiries-stat-card">
            <MessageSquare size={20} />
            <div>
              <strong>{enquiries.length}</strong>
              <span>Total enquiries</span>
            </div>
          </div>

          <div className="enquiries-stat-card">
            <Clock size={20} />
            <div>
              <strong>{newCount}</strong>
              <span>New enquiries</span>
            </div>
          </div>

          <div className="enquiries-stat-card">
            <MessageCircle size={20} />
            <div>
              <strong>{contactedCount}</strong>
              <span>Contacted</span>
            </div>
          </div>

          <div className="enquiries-stat-card">
            <CheckCircle2 size={20} />
            <div>
              <strong>{resolvedCount}</strong>
              <span>Resolved</span>
            </div>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="enquiries-empty">
          <MessageSquare size={38} />
          <h2>No published websites yet</h2>
          <p>
            Publish a website before receiving customer enquiries.
          </p>
        </div>
      ) : enquiriesLoading ? (
        <div className="enquiries-loading">
          <LoaderCircle className="enquiries-spinner" size={25} />
          <p>Loading customer enquiries...</p>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="enquiries-empty">
          <MessageSquare size={38} />
          <h2>No enquiries yet</h2>
          <p>
            Messages submitted through your website will appear here.
          </p>
        </div>
      ) : (
        <div className="enquiries-list">
          {enquiries.map((enquiry) => (
            <article className="enquiry-card" key={enquiry.id}>
              <div className="enquiry-card-top">
                <div>
                  <span
                    className={`enquiry-status ${enquiry.status}`}
                  >
                    {enquiry.status}
                  </span>

                  <h3>{enquiry.customer_name}</h3>

                  <p className="enquiry-subject">
                    {enquiry.subject}
                  </p>
                </div>

                <div className="enquiry-date">
                  {formatDate(enquiry.created_at)}
                </div>
              </div>

              <div className="enquiry-customer-details">
                {enquiry.customer_email && (
                  <a href={`mailto:${enquiry.customer_email}`}>
                    <Mail size={15} />
                    {enquiry.customer_email}
                  </a>
                )}

                {enquiry.customer_phone && (
                  <a href={`tel:${enquiry.customer_phone}`}>
                    <Phone size={15} />
                    {enquiry.customer_phone}
                  </a>
                )}
              </div>

              <div className="enquiry-message">
                <strong>Customer message</strong>
                <p>{enquiry.message}</p>
              </div>

              <div className="enquiry-card-actions">
                {enquiry.customer_email && (
                  <a
                    href={`mailto:${enquiry.customer_email}?subject=${encodeURIComponent(
                      `Re: ${enquiry.subject}`
                    )}`}
                    className="enquiry-contact-button"
                  >
                    <Mail size={15} />
                    Reply by email
                  </a>
                )}

                {enquiry.status !== "contacted" &&
                  enquiry.status !== "resolved" && (
                    <button
                      type="button"
                      className="enquiry-contacted-button"
                      disabled={updatingId === enquiry.id}
                      onClick={() =>
                        updateStatus(enquiry.id, "contacted")
                      }
                    >
                      <CheckCircle2 size={15} />
                      Mark contacted
                    </button>
                  )}

                {enquiry.status !== "resolved" && (
                  <button
                    type="button"
                    className="enquiry-resolved-button"
                    disabled={updatingId === enquiry.id}
                    onClick={() =>
                      updateStatus(enquiry.id, "resolved")
                    }
                  >
                    <CheckCircle2 size={15} />
                    Mark resolved
                  </button>
                )}

                {enquiry.status !== "new" && (
                  <button
                    type="button"
                    className="enquiry-reset-button"
                    disabled={updatingId === enquiry.id}
                    onClick={() =>
                      updateStatus(enquiry.id, "new")
                    }
                  >
                    Reopen
                  </button>
                )}

                {updatingId === enquiry.id && (
                  <LoaderCircle
                    size={17}
                    className="enquiries-spinner"
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
