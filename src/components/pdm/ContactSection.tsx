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
    <section id="contact" className="panel-surface p-4 sm:p-5">
      <h2 className="text-base font-semibold uppercase tracking-wide">Contact</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Built and integrated by Ahmad Munir — Data Science &amp; Machine Learning.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {LINKS.map(({ icon: Icon, label, value, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="group rounded-md border border-border bg-card/50 p-3 transition-colors hover:border-ring hover:bg-card"
          >
            <Icon className="size-4 text-primary" aria-hidden />
            <p className="label-caps mt-2">{label}</p>
            <p className="mt-0.5 truncate text-xs font-medium group-hover:text-accent">{value}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
