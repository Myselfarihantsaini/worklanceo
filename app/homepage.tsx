"use client";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Users,
  Zap,
  IndianRupee,
  ShieldCheck,
  Check,
  BriefcaseBusiness,
  ShoppingCart,
  Factory,
  Truck,
  Headphones,
  Building2,
  HeartPulse,
  Monitor,
  ChartNoAxesCombined,
  Landmark,
  HardHat,
  Wrench,
  Layers3,
  UserRound,
  Target,
  Handshake,
  Clock3,
  Menu,
  X,
  Globe2,
  FileCheck2,
  Star,
} from "lucide-react";
import "./homepage.css";

type Icon = typeof Users;
const industries: [string, Icon][] = [
  ["Business Services", BriefcaseBusiness],
  ["Retail & E-commerce", ShoppingCart],
  ["Manufacturing", Factory],
  ["Logistics & Delivery", Truck],
  ["BPO & Customer Support", Headphones],
  ["Hospitality", Building2],
  ["Healthcare", HeartPulse],
  ["Technology", Monitor],
  ["Sales & Marketing", ChartNoAxesCombined],
  ["Finance", Landmark],
  ["Construction", HardHat],
  ["Engineering", Wrench],
  ["And Many More", Globe2],
];
const solutions: [string, string, Icon][] = [
  [
    "Bulk Hiring",
    "Build teams for high-volume and multi-location requirements.",
    Users,
  ],
  [
    "Permanent Recruitment",
    "Find people ready to grow with your business.",
    BriefcaseBusiness,
  ],
  [
    "Entry-Level Hiring",
    "Bring new talent into your everyday operations.",
    UserRound,
  ],
  [
    "Skilled Workforce Hiring",
    "Connect with people who have the skills your roles need.",
    Wrench,
  ],
  [
    "Corporate Recruitment",
    "Hire across finance, HR, technology and management.",
    Building2,
  ],
  [
    "Frontline Workforce",
    "Support the teams closest to your customers and operations.",
    Headphones,
  ],
  [
    "Industry-Specific Hiring",
    "Shape your search around your sector and role requirements.",
    Target,
  ],
  [
    "Custom Hiring Projects",
    "Build a recruitment plan around your goals and timeline.",
    Layers3,
  ],
];

function CTA({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <a className={"wl-button" + (secondary ? " wl-secondary" : "")} href={href}>
      {children}
      <ArrowUpRight size={17} />
    </a>
  );
}

function Brand() {
  return (
    <a className="wl-brand" href="/" aria-label="WorkLanceo home">
      <span className="wl-brand-symbol" aria-hidden="true">
        <img src="/worklanceo-logo.png" alt="" />
      </span>
      <span className="wl-wordmark">
        <strong>
          Work<span>Lanceo</span>
        </strong>
        <small>PEOPLE · POSSIBILITIES · PROGRESS</small>
      </span>
    </a>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false),
    [compact, setCompact] = useState(false);
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={"wl-nav" + (compact ? " wl-compact" : "")}>
      <Brand />
      <nav
        aria-label="Main navigation"
        className={open ? "wl-links is-open" : "wl-links"}
        id="wl-navigation"
      >
        {[
          ["For Employers", "/hire"],
          ["Our Solutions", "/solutions"],
          ["Resources", "/resources"],
          ["About Us", "/about"],
        ].map(([text, url]) => (
          <a href={url} key={text} onClick={() => setOpen(false)}>
            {text}
          </a>
        ))}
        <a className="wl-mobile-workspace" href="/workspace">
          My Workspace
        </a>
      </nav>
      <div className="wl-nav-actions">
        <a className="wl-workspace" href="/workspace">
          <UserRound size={18} />
          My Workspace
        </a>
        <a className="wl-button wl-btn-start" href="/hire">
          Start Hiring <ArrowRight size={17} />
        </a>
        <button
          className="wl-menu"
          aria-expanded={open}
          aria-controls="wl-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="wl-exact-banner-section">
      <div className="wl-banner-container">
        <img
          src="/hero-banner-exact.jpg"
          alt="WorkLanceo - Hire the Right People for Every Sector"
          className="wl-exact-banner-img"
          width="1024"
          height="332"
          fetchPriority="high"
        />
        {/* Invisible clickable hotspots aligned over the banner buttons */}
        <div className="wl-banner-hotspots" aria-hidden="true">
          <a
            href="#hiring-requirement"
            className="wl-hotspot-hire"
            title="I'm looking to hire"
          />
          <a
            href="#solutions"
            className="wl-hotspot-solutions"
            title="Explore our solutions"
          />
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  return null;
}
function HiringRequirementForm() {
  const [user, setUser] = useState<boolean | null>(null),
    [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    fetch("/api/session")
      .then((r) => r.json() as Promise<{ user?: unknown }>)
      .then((d) => setUser(!!d.user))
      .catch(() => setUser(false));
    const draft = sessionStorage.getItem("wl-hiring-draft");
    if (draft) {
      try {
        const data = JSON.parse(draft);
        const form = document.getElementById(
          "wl-hiring-form",
        ) as HTMLFormElement;
        Object.entries(data).forEach(([key, value]) => {
          const input = form.elements.namedItem(key);
          if (
            input instanceof HTMLInputElement ||
            input instanceof HTMLTextAreaElement ||
            input instanceof HTMLSelectElement
          ) {
            if (input instanceof HTMLInputElement && input.type === "checkbox")
              input.checked = value === "on";
            else input.value = String(value);
          }
        });
      } catch {
        sessionStorage.removeItem("wl-hiring-draft");
      }
    }
  }, []);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form));
    if (Number(raw.salaryMax) < Number(raw.salaryMin)) {
      setError("Maximum salary must be at least the minimum salary.");
      return;
    }
    if (!user) {
      sessionStorage.setItem("wl-hiring-draft", JSON.stringify(raw));
      window.location.assign(
        "/signin-with-google?return_to=" +
          encodeURIComponent("/#hiring-requirement"),
      );
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "requirement",
          title: raw.role,
          data: { ...raw, consent: true, sharedWithTeam: true },
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(result.error || "Could not submit. Please try again.");
      sessionStorage.removeItem("wl-hiring-draft");
      setMessage(
        "Your hiring requirement has been saved and shared with our recruitment team.",
      );
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not submit. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  const fields = [
    ["Company Name", "company", "text"],
    ["Your Name", "name", "text"],
    ["Work Email", "email", "email"],
    ["Phone Number", "phone", "tel"],
    ["City / Work Location", "city", "text"],
    ["Job Role", "role", "text"],
    ["Number of Openings", "headcount", "number"],
    ["Monthly Salary From (₹)", "salaryMin", "number"],
    ["Monthly Salary To (₹)", "salaryMax", "number"],
    ["Experience Required", "qualifications", "text"],
    ["Hiring Deadline", "joiningDate", "date"],
    ["Shifts / Working Days", "shifts", "text"],
  ];
  return (
    <section className="wl-section wl-form-section" id="hiring-requirement">
      <div>
        <p className="wl-eyebrow">LET'S BUILD YOUR TEAM</p>
        <h2>
          A better hire starts
          <br />
          with a clear brief.
        </h2>
        <p>
          Tell us about your business and the people you need. Our team can then
          review the role, location and timeline with you.
        </p>
        <ul>
          <li>
            <Check />
            Specific roles. Clear expectations.
          </li>
          <li>
            <Check />
            Your requirements, in one workspace.
          </li>
          <li>
            <Check />
            Support from sourcing to joining.
          </li>
        </ul>
        <a href="/tools">
          Plan your hiring budget <ArrowRight size={17} />
        </a>
      </div>
      <form id="wl-hiring-form" onSubmit={submit}>
        <h3>Your hiring requirement</h3>
        <p>
          All fields marked * are required.
          {!user &&
            " Sign in with Google to securely submit and track your brief."}
        </p>
        <div className="wl-form-grid">
          {fields.map(([label, name, type]) => (
            <label key={name}>
              {label} *
              <input
                name={name}
                type={type}
                required
                maxLength={type === "text" ? 160 : undefined}
                min={
                  type === "number"
                    ? 1
                    : type === "date"
                      ? new Date().toISOString().slice(0, 10)
                      : undefined
                }
                max={name === "headcount" ? 100000 : undefined}
                step={type === "number" ? 1 : undefined}
                pattern={name === "phone" ? "[6-9][0-9]{9}" : undefined}
                placeholder={
                  name === "phone" ? "10-digit Indian mobile" : undefined
                }
              />
            </label>
          ))}
          <label>
            Industry *
            <select name="industry" required defaultValue="">
              <option value="" disabled>
                Select industry
              </option>
              {industries.map(([name]) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
          <label>
            Hiring Solution *
            <select name="service" required defaultValue="">
              <option value="" disabled>
                Select solution
              </option>
              {solutions.map(([name]) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Job Description *
          <textarea name="details" required maxLength={4000} rows={3} />
        </label>
        <label>
          Additional Requirements
          <textarea name="additionalRequirements" maxLength={4000} rows={2} />
        </label>
        <label className="wl-consent">
          <input type="checkbox" name="consent" required />
          <span>
            I agree to share this requirement with the recruitment team under
            the <a href="/privacy">Privacy Policy</a>.
          </span>
        </label>
        {error && (
          <p className="wl-error" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="wl-success" role="status">
            {message} <a href="/workspace">View in My Workspace →</a>
          </p>
        )}
        <button className="wl-button" disabled={busy || user === null}>
          {busy
            ? "Submitting…"
            : user === null
              ? "Loading…"
              : user
                ? "Submit Hiring Requirement"
                : "Continue with Google to Submit"}
          <ArrowRight size={18} />
        </button>
      </form>
    </section>
  );
}
export function Footer() {
  return (
    <footer className="wl-footer">
      <div className="wl-footer-grid">
        <div>
          <Brand />
          <p>One partner. Every workforce need.</p>
          <a href="tel:+919057918251">+91 90579 18251</a>
          <a href="mailto:myselfarihantsaini@gmail.com">Talk to WorkLanceo</a>
        </div>
        {[
          [
            "For Employers",
            ["Start Hiring", "/hire"],
            ["Hiring Solutions", "/solutions"],
            ["Bulk Hiring", "/#solution-bulk-hiring"],
          ],
          [
            "For Candidates",
            ["Find Opportunities", "/#candidate-network"],
            ["Join Candidate Network", "/candidates"],
          ],
          [
            "Company",
            ["About Us", "/about"],
            ["Contact", "mailto:myselfarihantsaini@gmail.com"],
            [
              "Careers",
              "mailto:myselfarihantsaini@gmail.com?subject=Careers%20at%20WorkLanceo",
            ],
          ],
          [
            "Resources",
            ["Hiring Insights", "/resources"],
            ["FAQs", "/#faq"],
            ["Privacy Policy", "/privacy"],
            ["Terms", "/terms"],
          ],
        ].map(([title, ...links]) => (
          <div key={title as string}>
            <h3>{title}</h3>
            {(links as string[][]).map(([label, href]) => (
              <a href={href} key={label}>
                {label}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="wl-footer-bottom">
        <span>© 2026 WorkLanceo. All rights reserved.</span>
        <span>PEOPLE · POSSIBILITIES · PROGRESS</span>
      </div>
    </footer>
  );
}
export default function Homepage() {
  return (
    <div className="wl-home">
      <Hero />
      <StatsBar />
      <section className="wl-industries wl-section" id="industries">
        <p className="wl-eyebrow">ONE PARTNER. ALL SECTORS.</p>
        <h2>Great people, across your industry.</h2>
        <p>
          From entry-level and frontline teams to skilled specialists, office
          staff and leadership.
        </p>
        <div>
          {industries.map(([name, I]) => (
            <a href="/hire" key={name}>
              <I size={26} />
              <span>{name}</span>
            </a>
          ))}
        </div>
      </section>
      <section className="wl-section wl-process">
        <p className="wl-eyebrow">A CLEAR PATH FROM BRIEF TO JOINING</p>
        <h2>Hiring shouldn't be complicated.</h2>
        <p>
          Tell us who you need. WorkLanceo handles sourcing, initial screening
          and candidate coordination so your team can focus on choosing the
          right people.
        </p>
        <div>
          {[
            [
              "Share Requirement",
              "Define the role, location, pay and timeline.",
            ],
            [
              "We Source & Screen",
              "We shortlist against your role requirements.",
            ],
            ["You Interview", "Meet candidates and choose the right fit."],
            [
              "Candidate Joins",
              "Coordinate offers, joining and the next steps.",
            ],
          ].map(([title, desc], i) => (
            <article key={title}>
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="wl-section" id="solutions">
        <p className="wl-eyebrow">FLEXIBLE SUPPORT. FOCUSED DELIVERY.</p>
        <h2>
          One hiring partner.
          <br />
          Multiple workforce solutions.
        </h2>
        <div className="wl-solutions">
          {solutions.map(([title, desc, I]) => (
            <article
              key={title}
              id={"solution-" + title.toLowerCase().replaceAll(" ", "-")}
            >
              <I size={29} />
              <h3>{title}</h3>
              <p>{desc}</p>
              <a href="/solutions">
                Learn More <ArrowRight size={17} />
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className="wl-why wl-section">
        <div>
          <p className="wl-eyebrow">WHY WORKLANCEO</p>
          <h2>
            Built for businesses that need people — not hiring complexity.
          </h2>
          <p>
            Thoughtful screening. Clear communication. A hiring partner who
            helps you make the right decision, beyond forwarding résumés.
          </p>
          <CTA href="/hire">Build Your Team</CTA>
        </div>
        <div>
          {[
            "Pay for Successful Hiring",
            "Pre-screened Candidates",
            "Multi-sector Talent Network",
            "Quick Candidate Turnaround",
            "Dedicated Hiring Support",
            "Scalable Recruitment",
            "Transparent Process",
            "No Random CV Dumping",
          ].map((title) => (
            <article key={title}>
              <ShieldCheck size={23} />
              <h3>{title}</h3>
            </article>
          ))}
        </div>
      </section>
      <section className="wl-employer-cta wl-section">
        <div>
          <p className="wl-eyebrow">YOUR NEXT GREAT TEAM STARTS HERE</p>
          <h2>
            Tell us who you're hiring.
            <br />
            We'll start finding them.
          </h2>
          <p>
            Whether you need 5 people or 500, submit your requirement and let
            WorkLanceo build your candidate pipeline.
          </p>
        </div>
        <div className="wl-actions">
          <CTA href="#hiring-requirement">Start Hiring</CTA>
          <CTA secondary href="tel:+919057918251">
            Talk to WorkLanceo
          </CTA>
        </div>
      </section>
      <HiringRequirementForm />
      <section className="wl-candidate wl-section" id="candidate-network">
        <div>
          <p className="wl-eyebrow">FOR PEOPLE READY FOR THEIR NEXT STEP</p>
          <h2>Looking for your next opportunity?</h2>
          <p>
            Join WorkLanceo's candidate network and get considered for
            opportunities matching your profile.
          </p>
        </div>
        <CTA secondary href="/candidates">
          Join Candidate Network
        </CTA>
      </section>
      <section className="wl-section wl-faq" id="faq">
        <p className="wl-eyebrow">GOOD QUESTIONS. CLEAR ANSWERS.</p>
        <h2>A little clarity before we begin.</h2>
        {[
          [
            "Which sectors do you hire for?",
            "We support requirements across business services, technology, finance, retail, manufacturing, logistics, healthcare, hospitality and more. Share your role and location so we can confirm delivery scope.",
          ],
          [
            "Can I hire across multiple locations?",
            "Yes. Include the headcount, salary, shifts and timeline for each location in your brief. Scope and delivery timelines are agreed before engagement.",
          ],
          [
            "How are recruitment fees agreed?",
            "Success-based and fixed-fee hiring plans are scoped in writing. Fee triggers, taxes, replacement terms and exclusions are agreed before work begins. No upfront recruitment cost applies only to agreed success-based plans.",
          ],
          [
            "What happens after I submit?",
            "Your requirement is saved to your account and shared with the recruitment team for review and follow-up. You can view and track it in My Workspace.",
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
