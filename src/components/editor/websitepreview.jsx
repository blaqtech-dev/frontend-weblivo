
"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  Sparkles,
   Pencil,
  Check,
    MessageCircle,
  X,
  Menu,
} from "lucide-react";
import "./websitepreview.css";
import BookingForm from "../website/bookingform";
import EnquiryForm from "../website/enquiryform";

const navigationLabels = {
  about: "About",
  services: "Services",
  features: "Why Choose Us",
  gallery: "Gallery",
  testimonials: "Reviews",
  contact: "Contact",
};





function hexToRgb(hex) {
  const value = String(hex || "").replace("#", "");

  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    return { r: 23, g: 23, b: 23 };
  }

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function getLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);

  const channels = [r, g, b].map((value) => {
    const channel = value / 255;

    return channel <= 0.04045
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });

  return (
    0.2126 * channels[0] +
    0.7152 * channels[1] +
    0.0722 * channels[2]
  );
}

function getContrastRatio(color1, color2) {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

function getReadableTextColor(background) {
  const black = "#111827";
  const white = "#FFFFFF";

  return getContrastRatio(background, black) >=
    getContrastRatio(background, white)
    ? black
    : white;
}

function getAccessibleBrandColor(foreground, background) {
  const original = hexToRgb(foreground);

  if (getContrastRatio(foreground, background) >= 4.5) {
    return foreground;
  }

  const black = "#111827";
  const white = "#FFFFFF";

  const target =
    getContrastRatio(background, black) >=
    getContrastRatio(background, white)
      ? black
      : white;

  const destination = hexToRgb(target);

  for (let step = 1; step <= 100; step++) {
    const amount = step / 100;

    const adjusted = {
      r: Math.round(original.r + (destination.r - original.r) * amount),
      g: Math.round(original.g + (destination.g - original.g) * amount),
      b: Math.round(original.b + (destination.b - original.b) * amount),
    };

    const result =
      "#" +
      [adjusted.r, adjusted.g, adjusted.b]
        .map((value) => value.toString(16).padStart(2, "0"))
        .join("");

    if (getContrastRatio(result, background) >= 4.5) {
      return result;
    }
  }

  return target;
}


function getWhatsAppLink(number) {
  const cleanNumber = String(number || "").replace(/\D/g, "");

  if (cleanNumber.length < 8 || cleanNumber.length > 15) {
    return null;
  }

  const message = encodeURIComponent(
    "Hello, I'm interested in your services."
  );

  return `https://wa.me/${cleanNumber}?text=${message}`;
}


function EditableText({
  value,
  onSave,
  editable = true,
  multiline = false,
  className = "",
  as = "span",
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");

  const Tag = as;

  const startEditing = () => {
    setDraft(value || "");
    setEditing(true);
  };

  const save = () => {
    onSave(draft);
    setEditing(false);
  };

 if (!editable || !onSave) {
  return <Tag className={className}>{value}</Tag>;
}

  if (editing) {
    return (
      <span className={`preview-editing ${className}`}>
        {multiline ? (
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            autoFocus
          />
        ) : (
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            autoFocus
          />
        )}

        <button type="button" onClick={save} title="Save text">
          <Check size={15} />
        </button>

        <button
          type="button"
          onClick={() => setEditing(false)}
          title="Cancel editing"
        >
          <X size={15} />
        </button>
      </span>
    );
  }

  return (
    <Tag className={`preview-editable ${className}`}>
      {value}
      <button
        type="button"
        className="preview-edit-button"
        onClick={startEditing}
        title="Edit this text"
      >
        <Pencil size={13} />
      </button>
    </Tag>
  );
}




export default function WebsitePreview({
  websiteData,
  uploadedImages = [],
  contactDetails = {},
  onTextChange,
  projectId,
  bookingEnabled = false,
  isPublished = false,
}) {
const isEditable = typeof onTextChange === "function";

const servicesSection = websiteData?.sections?.find(
  (section) => section.type === "services"
);

const bookingServices = servicesSection?.items || [];
      const [menuOpen, setMenuOpen] = useState(false);
      const whatsappLink = getWhatsAppLink(contactDetails.whatsapp);

  if (!websiteData || !Array.isArray(websiteData.sections)) {
    return <p>Website preview is not available.</p>;
  }

  const {
    siteName,
    description,
    theme,
    sections,
    designStyle,
    header,
  } = websiteData;


const primaryColor = theme?.primaryColor || "#171717";
const secondaryColor = theme?.secondaryColor || "#f5e6df";

const primaryTextOnWhite = getAccessibleBrandColor(
  primaryColor,
  "#FFFFFF"
);

const primaryTextOnSecondary = getAccessibleBrandColor(
  primaryColor,
  secondaryColor
);

const primaryButtonText = getReadableTextColor(primaryColor);
const secondaryBackgroundText = getReadableTextColor(secondaryColor);


  const heroImage = uploadedImages.find(
    (image) => image.placement === "hero"
  );

  const aboutImageUpload = uploadedImages.find(
  (image) => image.placement === "about"
);

  const logoImage = uploadedImages.find(
    (image) => image.placement === "logo"
  );

  // Older uploads without a placement remain visible in the gallery.
  const galleryImages = uploadedImages.filter(
    (image) => !image.placement || image.placement === "gallery"
  );

  const navigationSections = sections.filter(
    (section, index, array) =>
      navigationLabels[section.type] &&
      array.findIndex((item) => item.type === section.type) === index
  );

  const heroSection = sections.find(
    (section) => section.type === "hero"
  );

  const heroLayout = heroSection?.layout || "split";
  const logoPosition = header?.logoPosition || "left";
  const headerLayout = header?.layout || "standard";

  const renderSection = (section, index) => {
    const items = Array.isArray(section.items) ? section.items : [];

    switch (section.type) {
      case "hero": {
        const imageUrl = heroImage?.url || section.image?.url;
        const layout = section.layout || "split";

        return (
          <section
            className={`preview-hero preview-hero-${layout}`}
            id="top"
            key={index}
            style={
              layout === "image-background" && imageUrl
                ? { "--hero-image": `url("${imageUrl}")` }
                : undefined
            }
          >
            <div className="preview-hero-content">
              <span className="preview-eyebrow">
                <Sparkles size={14} />
                Welcome to {siteName}
              </span>
<h1>
  <EditableText
    value={section.heading}
    editable={isEditable}
    onSave={(value) => onTextChange?.(index, "heading", value)}
  />
</h1>

            <p>
  <EditableText
    multiline
    editable={isEditable}
    value={section.subheading || section.content || description}
    onSave={(value) => {
      if (section.subheading) {
        onTextChange?.(index, "subheading", value);
      } else if (section.content) {
        onTextChange?.(index, "content", value);
      } else {
        onTextChange?.(null, "description", value);
      }
    }}
  />
</p>

              <a href="#contact" className="preview-primary-button">
                Discover More <ArrowRight size={17} />
              </a>
            </div>

            {layout !== "centered" &&
              layout !== "image-background" && (
                <div className="preview-hero-media">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={`${siteName} featured`}
                    />
                  ) : (
                    <div className="preview-hero-placeholder">
                      <Sparkles size={38} />
                      <span>Your main business image</span>
                    </div>
                  )}
                </div>
              )}
          </section>
        );
      }

   
   

case "about": {
  const requestedLayout = section.layout || "default";

  const supportedLayouts = [
    "centered",
    "split",
    "minimal",
    "image-left",
    "image-right",
  ];

  const aboutLayout = supportedLayouts.includes(requestedLayout)
    ? requestedLayout
    : "default";

  // Use the uploaded About image first.
  // Fall back to the website's hero image.
  const generatedHeroImage = heroSection?.image?.url;

const aboutImage =
  aboutImageUpload?.url ||
  section.image?.url ||
  heroImage?.url ||
  generatedHeroImage;

  const effectiveLayout = aboutImage
    ? "image-right"
    : "centered";

  return (
    <section
      className={`preview-section preview-about preview-layout-${effectiveLayout}`}
      id="about"
      key={index}
    >
      <div className="preview-about-content">
        <div className="preview-about-heading">
          <div className="preview-section-label">OUR STORY</div>

          <h2>
            <EditableText
              editable={isEditable}
              value={section.heading}
              onSave={(value) =>
                onTextChange?.(index, "heading", value)
              }
            />
          </h2>
        </div>

        <div className="preview-about-description">
          <p>
            <EditableText
              editable={isEditable}
              multiline
              value={section.content || section.subheading || ""}
              onSave={(value) =>
                onTextChange?.(
                  index,
                  section.content ? "content" : "subheading",
                  value
                )
              }
            />
          </p>
        </div>
      </div>

      {aboutImage && (
        <div className="preview-about-media">
          <img
            src={aboutImage}
            alt={`${siteName} story`}
            loading="lazy"
          />
        </div>
      )}
    </section>
  );
}


      case "services":
        return (
          <section
            className="preview-section"
            id="services"
            key={index}
          >
            <div className="preview-section-label">WHAT WE OFFER</div>
           <h2>
  <EditableText
    value={section.heading}
    editable={isEditable}
    onSave={(value) => onTextChange?.(index, "heading", value)}
  />
</h2>
            <p className="preview-section-intro">
              {section.subheading}
            </p>

            <div className="preview-service-grid">
              {items.map((item, itemIndex) => (
                <article className="preview-service-card" key={itemIndex}>
                  <div className="preview-service-icon">
                    <Sparkles size={20} />
                  </div>

                 <h3>
  <EditableText
    value={typeof item === "string" ? item : item.title}
    editable={isEditable}
    onSave={(value) =>
      onTextChange?.(
        index,
        typeof item === "string" ? "value" : "title",
        value,
        itemIndex
      )
    }
  />
</h3>

                 {typeof item === "object" && item.description && (
  <p>
    <EditableText
      multiline
      editable={isEditable}
      value={item.description}
      onSave={(value) =>
        onTextChange?.(index, "description", value, itemIndex)
      }
    />
  </p>
)}
                </article>
              ))}
            </div>
          </section>
        );

      case "features":
        return (
          <section
            className="preview-section preview-features"
            id="features"
            key={index}
          >
          <div className="preview-section-label">THE DIFFERENCE</div>

<h2>
  <EditableText
    value={section.heading}
    editable={isEditable}
    onSave={(value) => onTextChange?.(index, "heading", value)}
  />
</h2>

<p>{section.subheading || section.content}</p>

            <div className="preview-feature-list">
              {items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <CheckCircle2 size={19} />
                  <span>
                    {typeof item === "string" ? item : item.title}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      case "testimonials":
        return items.length > 0 ? (
          <section
            className="preview-section"
            id="testimonials"
            key={index}
          >
            <div className="preview-section-label">CUSTOMER REVIEWS</div>
            <h2>{section.heading}</h2>

            <div className="preview-service-grid">
              {items.map((item, itemIndex) => (
                <article className="preview-service-card" key={itemIndex}>
                  <div className="preview-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={15} fill="currentColor" />
                    ))}
                  </div>

                  <p>
                    {typeof item === "string"
                      ? item
                      : item.content || item.description || ""}
                  </p>

                  {typeof item === "object" && item.name && (
                    <strong>{item.name}</strong>
                  )}
                </article>
              ))}
            </div>
          </section>
        ) : null;
case "gallery": {
  const galleryItems = [
    ...items.map((item) => ({
      ...(typeof item === "object" ? item : { caption: item }),
      image:
        typeof item === "object" ? item.image?.url || null : null,
    })),
  ];

  // Uploaded images are added without removing AI-generated details.
  galleryImages.forEach((uploadedImage, imageIndex) => {
    const existingItem = galleryItems[imageIndex];

    if (existingItem) {
      existingItem.image = uploadedImage.url;
    } else {
      galleryItems.push({
        image: uploadedImage.url,
        title: "",
        description: "",
        price: "",
        category: "",
        caption: "",
      });
    }
  });

  return (
    <section
      className="preview-section preview-gallery-section"
      id="gallery"
      key={index}
    >
      <div className="preview-section-heading">
        <div className="preview-section-label">OUR COLLECTION</div>

        <h2>
          <EditableText
            value={section.heading}
            editable={isEditable}
            onSave={(value) =>
              onTextChange?.(index, "heading", value)
            }
          />
        </h2>

        {section.subheading && (
          <p>{section.subheading}</p>
        )}
      </div>

      <div className="preview-gallery-grid">
        {galleryItems.map((item, itemIndex) => (
          <article className="preview-gallery-item" key={itemIndex}>
            <div className="preview-gallery-image">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title || item.caption || `${siteName} gallery image`}
                  loading="lazy"
                />
              ) : (
                <div className="preview-gallery-placeholder">
                  <Sparkles size={22} />
                  <span>
                    {item.title || item.caption || "Gallery image"}
                  </span>
                </div>
              )}
            </div>

            {(item.title || isEditable) && (
              <h3 className="preview-gallery-title">
                <EditableText
                  value={item.title || ""}
                  editable={isEditable}
                  onSave={(value) =>
                    onTextChange?.(index, "title", value, itemIndex)
                  }
                />
              </h3>
            )}

            {(item.description || isEditable) && (
              <p className="preview-gallery-description">
                <EditableText
                  value={item.description || ""}
                  multiline
                  editable={isEditable}
                  onSave={(value) =>
                    onTextChange?.(index, "description", value, itemIndex)
                  }
                />
              </p>
            )}

            {(item.price || isEditable) && (
              <p className="preview-gallery-price">
                <EditableText
                  value={item.price || ""}
                  editable={isEditable}
                  onSave={(value) =>
                    onTextChange?.(index, "price", value, itemIndex)
                  }
                />
              </p>
            )}

            {item.caption && (
              <p className="preview-gallery-caption">
                <EditableText
                  value={item.caption}
                  editable={isEditable}
                  onSave={(value) =>
                    onTextChange?.(index, "caption", value, itemIndex)
                  }
                />
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
    case "contact":
  return (
    <section
      className="preview-section preview-contact"
      id="contact"
      key={index}
    >
      <div className="preview-section-label">LET'S CONNECT</div>

      <h2>
        <EditableText
          value={section.heading}
          editable={isEditable}
          onSave={(value) => onTextChange?.(index, "heading", value)}
        />
      </h2>

      <p>{section.content || section.subheading}</p>

      <div className="preview-contact-details">
        {contactDetails.phone && (
          <div>
            <strong>Phone:</strong>{" "}
            <a href={`tel:${contactDetails.phone}`}>
              {contactDetails.phone}
            </a>
          </div>
        )}

        {contactDetails.whatsapp && (
  <div>
    <strong>WhatsApp:</strong>{" "}
    <a
      href={whatsappLink || "#"}
      target="_blank"
      rel="noopener noreferrer"
    >
      {contactDetails.whatsapp}
    </a>
  </div>
)}

        {contactDetails.email && (
          <div>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${contactDetails.email}`}>
              {contactDetails.email}
            </a>
          </div>
        )}

        {contactDetails.location && (
          <div>
            <strong>Location:</strong> {contactDetails.location}
          </div>
        )}

        {contactDetails.business_hours && (
          <div>
            <strong>Business hours:</strong>
            <p style={{ whiteSpace: "pre-line" }}>
              {contactDetails.business_hours}
            </p>
          </div>
        )}

        {!contactDetails.phone &&
          !contactDetails.email &&
          !contactDetails.whatsapp &&
          !contactDetails.location &&
          !contactDetails.business_hours && (
            <p>Contact information has not been added yet.</p>
          )}
      </div>

      {contactDetails.phone ? (
        <a
          href={`tel:${contactDetails.phone}`}
          className="preview-primary-button"
        >
          Call Us <ArrowRight size={17} />
        </a>
      ) : contactDetails.email ? (
        <a
          href={`mailto:${contactDetails.email}`}
          className="preview-primary-button"
        >
          Email Us <ArrowRight size={17} />
        </a>
      ) : null}
    </section>
  );

      case "footer":
        return (
          <footer className="preview-footer" id="footer" key={index}>
            <h3>{siteName}</h3>
            <p>{section.content || description}</p>
            <span>
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </span>
          </footer>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`website-preview preview-${String(
        designStyle || "modern"
      ).toLowerCase()}`}
     
style={{
  "--preview-primary": primaryColor,
  "--preview-secondary": secondaryColor,
  "--preview-primary-on-white": primaryTextOnWhite,
  "--preview-primary-on-secondary": primaryTextOnSecondary,
  "--preview-primary-contrast": primaryButtonText,
  "--preview-secondary-contrast": secondaryBackgroundText,
}}

    >
      <header
        className={`preview-navbar preview-header-${headerLayout} preview-logo-${logoPosition}`}
      >
       <a href="#top" className="preview-brand">
  {logoImage?.url ? (
    <img src={logoImage.url} alt={`${siteName} logo`} />
  ) : (
    <EditableText
    editable={isEditable}
      value={siteName}
      onSave={(value) => onTextChange?.(null, "siteName", value)}
    />
  )}
</a>

           <button
          type="button"
          className="preview-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={menuOpen ? "preview-nav-open" : ""}>
          <a href="#top" onClick={() => setMenuOpen(false)}>
            Home
          </a>

          {navigationSections.map((section) => (
            <a
              href={`#${section.type}`}
              key={section.type}
              onClick={() => setMenuOpen(false)}
            >
              {navigationLabels[section.type]}
            </a>
          ))}
        </nav>
      </header>
<main>
  {/* Main website sections */}
  {sections
    .filter(
      (section) =>
        section.type !== "contact" &&
        section.type !== "footer"
    )
    .map(renderSection)}

  {/* Appointment booking */}
  {bookingEnabled && (
    <BookingForm
      projectId={projectId}
      services={bookingServices}
      isPublished={isPublished}
    />
  )}

  {/* Contact section */}
  {/* Contact section */}
  {sections
    .filter((section) => section.type === "contact")
    .map(renderSection)}

  {/* Customer Enquiry Form */}
  <EnquiryForm
    projectId={projectId}
    isPublished={isPublished}
  />

  {/* Footer */}
  {sections
    .filter((section) => section.type === "footer")
    .map(renderSection)}
</main>
      {whatsappLink && (
        <a
          href={whatsappLink}
          className="preview-whatsapp-button"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          title="Chat with us on WhatsApp"
        >
          <MessageCircle size={25} />
          <span>Chat with us</span>
        </a>
      )}
    </div>
  );
}
