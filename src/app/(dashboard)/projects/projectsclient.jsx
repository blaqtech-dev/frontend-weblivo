
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Plus,
  Globe,
  MoreHorizontal,
  ExternalLink,
  Pencil,
  Trash2,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import "./projects.css";

export default function ProjectsClient({ initialProjects }) {
  const supabase = createClient();

  const [projects, setProjects] = useState(initialProjects);

  useEffect(() => {
  setProjects(initialProjects);
}, [initialProjects]);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [message, setMessage] = useState("");

  const filteredProjects = projects.filter((project) => {
    const searchText = search.toLowerCase();

    return (
      project.name?.toLowerCase().includes(searchText) ||
      project.business_name?.toLowerCase().includes(searchText)
    );
  });

  const handleDelete = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this website project? This action cannot be undone."
    );

    if (!confirmed) return;

    setDeleting(projectId);
    setMessage("");

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      setMessage(error.message);
      setDeleting(null);
      return;
    }

    setProjects((current) =>
      current.filter((project) => project.id !== projectId)
    );

    setDeleting(null);
    setOpenMenu(null);
  };

  return (
    <div className="projects-page">
      <section className="projects-heading">
        <div>
          <p className="projects-eyebrow">YOUR WORKSPACE</p>
          <h1>My Websites</h1>
          <p>Manage all your website projects in one place.</p>
        </div>

        <Link href="/create" className="projects-create-button">
          <Plus size={18} />
          Create website
        </Link>
      </section>

      <section className="projects-toolbar">
        <div className="projects-count">
          <strong>{projects.length}</strong>
          <span>{projects.length === 1 ? "Project" : "Projects"}</span>
        </div>

        <div className="projects-search">
          <Search size={17} />
          <input
            type="search"
            placeholder="Search websites..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {message && (
        <div className="projects-message">
          {message}
        </div>
      )}

      {filteredProjects.length > 0 ? (
        <section className="projects-grid">
          {filteredProjects.map((project) => (
            <article className="project-card" key={project.id}>
              <div className="project-preview">
                <div className="project-preview-top">
                  <span className="project-preview-logo">
                    <Globe size={19} />
                  </span>

                  <span className={`project-status ${project.status}`}>
                    {project.status}
                  </span>
                </div>

                <div className="project-preview-content">
                  <span className="project-preview-line long" />
                  <span className="project-preview-line medium" />
                  <span className="project-preview-line short" />
                </div>

                <div className="project-preview-bottom">
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className="project-card-details">
                <div className="project-card-title-row">
                  <div>
                    <h3>{project.name}</h3>
                    <p>
                      {project.business_name || "Business name not added"}
                    </p>
                  </div>

                  <div className="project-menu-wrapper">
                    <button
                      className="project-menu-button"
                      onClick={() =>
                        setOpenMenu(
                          openMenu === project.id ? null : project.id
                        )
                      }
                      aria-label="Project options"
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {openMenu === project.id && (
                      <div className="project-dropdown">
                        <button
                          onClick={() => handleDelete(project.id)}
                          disabled={deleting === project.id}
                        >
                          <Trash2 size={15} />
                          {deleting === project.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="project-description">
                  {project.description || "No description added yet."}
                </p>

                <div className="project-card-footer">
                  <span>
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>

                  <Link href={`/editor/${project.id}`}>
                    <Pencil size={14} />
                    Open project
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="projects-empty">
          <div className="projects-empty-icon">
            {search ? <Search size={27} /> : <Globe size={27} />}
          </div>

          <h2>
            {search ? "No matching websites" : "No websites yet"}
          </h2>

          <p>
            {search
              ? "Try searching with another name."
              : "Your website projects will appear here once you start creating."}
          </p>

          {!search && (
            <Link href="/create" className="projects-create-button">
              <Sparkles size={17} />
              Create your first website
            </Link>
          )}
        </section>
      )}
    </div>
  );
}
