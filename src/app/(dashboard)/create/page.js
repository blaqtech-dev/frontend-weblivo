
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Globe, Palette } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import "./create.css";


export default function CreateWebsitePage() {
  const router = useRouter();
  const supabase = createClient();
const [whatsapp, setWhatsapp] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [projectLimitReached, setProjectLimitReached] = useState(false);

  const [description, setDescription] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("idea") || "";
    }
    return "";
  });

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [businessHours, setBusinessHours] = useState("");
  const [style, setStyle] = useState("Modern");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
   setError("");
setProjectLimitReached(false);
setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("Please log in to create a website.");

      const projectData = {
        business_type: businessType,
        design_style: style,
     contact_details: {
  phone: phone.trim(),
  whatsapp: whatsapp.trim(),
  email: email.trim(),
  location: location.trim(),
  business_hours: businessHours.trim(),
},
      };

      const { data: projectId, error: createError } =
        await supabase.rpc("create_user_project", {
          p_name: `${businessName.trim()} Website`,
          p_business_name: businessName.trim(),
          p_description: description.trim(),
          p_site_data: projectData,
        });

      if (createError) {
        console.error("Project creation error:", createError);

     if (createError.message?.includes("PROJECT_LIMIT_REACHED")) {
  setProjectLimitReached(true);
  throw new Error(
    "You have reached your project limit. Upgrade your plan to create more websites."
  );
}

        if (
          createError.message?.includes("BILLING_ACCOUNT_NOT_FOUND")
        ) {
          throw new Error(
            "Your billing account could not be found. Please contact support."
          );
        }

        throw new Error(
          "Unable to create your website project. Please try again."
        );
      }

      if (!projectId) {
        throw new Error("Your project could not be created. Please try again.");
      }

      router.push(`/projects?created=${projectId}`);
    } catch (err) {
      setError(err.message || "Unable to create your website project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page">
      <Link href="/dashboard" className="create-back">
        <ArrowLeft size={18} />
        Back to dashboard
      </Link>

      <div className="create-header">
        <div className="create-icon">
          <Sparkles size={25} />
        </div>

        <h1>Create your website</h1>
        <p>
          Tell us about your business and the website you want to build.
          WEBLIVO will use these details to create your website.
        </p>
      </div>

      <form className="create-form" onSubmit={handleSubmit}>
        <div className="create-section-heading">
          <Globe size={19} />
          <h2>Business information</h2>
        </div>

        <div className="create-field">
          <label htmlFor="businessName">Business name</label>
          <input
            id="businessName"
            type="text"
            placeholder="e.g. Bella Beauty Studio"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            maxLength={80}
          />
        </div>

        <div className="create-field">
          <label htmlFor="businessType">
            What type of business do you run?
          </label>

          <select
            id="businessType"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            required
          >
            <option value="">Select your business type</option>
            <option value="Beauty and Salon">Beauty and Salon</option>
            <option value="Restaurant and Food">Restaurant and Food</option>
            <option value="Fashion and Clothing">Fashion and Clothing</option>
            <option value="Photography">Photography</option>
            <option value="Cleaning Services">Cleaning Services</option>
            <option value="Education and Tutoring">Education and Tutoring</option>
            <option value="Consulting">Consulting</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="create-field">
          <label htmlFor="description">
            Describe your business and website
          </label>

          <textarea
            id="description"
            placeholder="Tell us what your business offers, who your customers are, and what you want visitors to do on your website..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            required
            maxLength={1500}
          />

          <span className="create-hint">
            Be as clear as possible. This description will guide the AI later.
          </span>
        </div>

        <div className="create-divider" />

        <div className="create-section-heading">
          <Globe size={19} />
          <h2>Business contact information</h2>
        </div>

        <p className="create-hint">
          Add your business contact details so customers can reach you.
          These fields are optional and can be left blank.
        </p>

        <div className="create-field">
          <label htmlFor="phone">Phone number</label>
          <input
            id="phone"
            type="tel"
            placeholder="e.g. +234 801 234 5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={30}
          />
        </div>

        <div className="create-field">
  <label htmlFor="whatsapp">WhatsApp number</label>
  <input
    id="whatsapp"
    type="tel"
    placeholder="e.g. +234 801 234 5678"
    value={whatsapp}
    onChange={(e) => setWhatsapp(e.target.value)}
    maxLength={30}
  />
  <span className="create-hint">
    Customers can use this number to contact your business directly on WhatsApp.
  </span>
</div>

        <div className="create-field">
          <label htmlFor="email">Business email</label>
          <input
            id="email"
            type="email"
            placeholder="e.g. hello@yourbusiness.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={150}
          />
        </div>

        <div className="create-field">
          <label htmlFor="location">Business location</label>
          <input
            id="location"
            type="text"
            placeholder="e.g. Akungba, Ondo State"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            maxLength={200}
          />
        </div>

        <div className="create-field">
          <label htmlFor="businessHours">Business hours</label>
          <textarea
            id="businessHours"
            placeholder={"e.g. Monday - Saturday: 8 AM - 7 PM\nSunday: Closed"}
            value={businessHours}
            onChange={(e) => setBusinessHours(e.target.value)}
            rows={3}
            maxLength={500}
          />
        </div>

        <div className="create-divider" />

        <div className="create-section-heading">
          <Palette size={19} />
          <h2>Choose a design style</h2>
        </div>

        <div className="create-style-options">
          {["Modern", "Minimal", "Luxury", "Creative"].map((item) => (
            <button
              type="button"
              key={item}
              className={`create-style-option ${
                style === item ? "active" : ""
              }`}
              onClick={() => setStyle(item)}
            >
              {item}
              {style === item && <span>✓</span>}
            </button>
          ))}
        </div>

       {error && (
  <div className="create-error-box">
    <p className="create-error">{error}</p>

    {projectLimitReached && (
      <Link href="/pricing" className="create-pricing-link">
        View pricing plans →
      </Link>
    )}
  </div>
)}

        <button
          type="submit"
          className="create-submit"
          disabled={loading}
        >
          <Sparkles size={18} />
          {loading ? "Creating project..." : "Create website project"}
        </button>

        <p className="create-note">
          This step saves your project. AI website generation comes next.
        </p>
      </form>
    </div>
  );
}
