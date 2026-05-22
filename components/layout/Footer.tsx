import Link from "next/link";
import { Github, Instagram, Linkedin, Twitter } from "lucide-react";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/members", label: "Members" },
  { href: "/auth/login", label: "Sign In" },
];

const socials = [
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
];

export function Footer() {
  return (
    <footer className="border-t border-text-primary/10 bg-bg-secondary/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-8 h-8 select-none rounded-lg overflow-hidden bg-white p-0.5 border border-text-primary/10 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Kaizen Tech Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold tracking-tight">
                <span className="text-accent-primary">Kaizen</span> Tech
              </h3>
            </div>
            <p className="text-text-muted text-sm max-w-xs">
              Build. Break. Iterate. — Your college tech community for hackers,
              builders, and innovators.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-text-muted">
              Navigate
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-accent-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-text-muted">
              Connect
            </h4>
            <div className="flex gap-4">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg glass hover:border-accent-primary/30 transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5 text-text-muted hover:text-accent-primary" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-text-primary/10 text-center text-sm text-text-muted">
          © {new Date().getFullYear()} Kaizen Tech. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
