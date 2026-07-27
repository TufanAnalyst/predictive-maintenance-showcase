/** Contact section — author links. */
import { Github, Linkedin, Mail } from "lucide-react";

const LINKS = [
  {
    icon: Mail,
    label: "Email",
    value: "ahmad.munir.data@gmail.com",
    href: "mailto:ahmad.munir.data@gmail.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "in/ahmad-munir-437430376",
    href: "https://www.linkedin.com/in/ahmad-munir-437430376",
  },
  {
    icon: Github,
    label: "GitHub Repository",
    value: "TufanAnalyst/Predictive-maintenance",
    href: "https://github.com/TufanAnalyst/Predictive-maintenance",
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="panel-surface p-6 sm:p-8">
      <h2 className="text-2xl font-semibold uppercase tracking-wide">Contact</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Built and integrated by Ahmad Munir — Data Science &amp; Machine Learning.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {LINKS.map(({ icon: Icon, label, value, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="group rounded-lg border border-border bg-card/50 p-5 transition-colors hover:border-ring hover:bg-card"
          >
            <Icon className="size-5 text-primary" aria-hidden />
            <p className="label-caps mt-3">{label}</p>
            <p className="mt-1 truncate text-sm font-medium group-hover:text-accent">{value}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
