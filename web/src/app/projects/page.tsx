import { FolderOpen, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PROJECTS } from "@/lib/config";

export default function ProjectsPage() {
  return (
    <>
      <div className="page-header">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary-light transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <FolderOpen className="w-4 h-4 text-primary-light" />
            <span className="text-xs text-primary-light uppercase tracking-widest font-medium">
              Projects
            </span>
          </div>
          <h1 className="section-title text-2xl sm:text-3xl">Our Projects</h1>
          <p className="text-muted mt-2 text-sm sm:text-base max-w-lg">
            Websites and tools built by Woob Studios.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card rounded-xl overflow-hidden group"
            >
              {/* Gradient header */}
              <div className="relative h-36 bg-gradient-to-br from-primary/20 via-accent/10 to-surface-light flex items-center justify-center">
                <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                  {project.icon}
                </span>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4 text-primary-light" />
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-base mb-1.5">{project.name}</h3>
                <p className="text-sm text-muted leading-relaxed line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary-light border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-primary-light">
                  <span>{project.url.replace("https://", "")}</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
