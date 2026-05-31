import { ArrowRight, BookOpen, Code2, Route, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const resources = [
  {
    index: "01",
    title: "Quick start",
    description:
      "Build the Kanari CLI, prepare your local environment, and run your first commands.",
    href: "/docs/introduction/getting-started",
    label: "Start setup",
    className: "",
  },
  {
    index: "02",
    title: "API reference",
    description:
      "Connect applications to Kanari REST and JSON-RPC surfaces with practical examples.",
    href: "/docs/api/api-reference",
    label: "Read API",
    className: "resource-card--purple",
  },
  {
    index: "03",
    title: "Move tooling",
    description:
      "Use the MoveVM workflow for packages, tests, modules, and secure execution.",
    href: "/docs/cli/move",
    label: "Open CLI docs",
    className: "resource-card--dark",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="home-hero section-wrap">
        <div>
          <p className="section-kicker">Kanari Documentation</p>
          <h1>
            Build with
            <br />
            <span>Kanari.</span>
          </h1>
          <p className="hero-description">
            Developer documentation for Kanari Network, the event-driven ledger
            powered by MoveVM, post-quantum cryptography, and verifiable
            metadata workflows.
          </p>
          <div className="hero-actions">
            <Link className="button button--dark" href="/docs">
              Start reading <ArrowRight size={16} />
            </Link>
            <Link
              className="button button--ghost"
              href="/docs/api/api-reference"
            >
              API reference
            </Link>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="network-graphic">
            <div className="network-glow network-glow--one" />
            <div className="network-glow network-glow--two" />
            <div className="network-rotor">
              <div className="network-orbit network-orbit--one" />
              <div className="network-orbit network-orbit--two" />
              <div className="network-orbit network-orbit--three" />
              <div className="network-node network-node--one">
                <span>SDK</span>
              </div>
              <div className="network-node network-node--two">
                <span>PQC</span>
              </div>
              <div className="network-node network-node--three">
                <span>API</span>
              </div>
              <div className="network-node network-node--four">
                <span>MOVE</span>
              </div>
              <div className="network-spark network-spark--one" />
              <div className="network-spark network-spark--two" />
              <div className="network-spark network-spark--three" />
            </div>
            <div className="network-core">
              <Image
                src="/kariicon1.png"
                alt=""
                width={92}
                height={92}
                priority
              />
            </div>
            <div className="hero-sticker hero-sticker--top">Docs ready</div>
            <div className="hero-sticker hero-sticker--bottom">Build fast</div>
          </div>
        </div>
      </section>

      <section className="section-wrap">
        <div className="section-heading">
          <p className="section-kicker">Developer paths</p>
          <h2>
            Find the shortest route
            <br />
            <span>to production.</span>
          </h2>
          <p>
            The docs are organized around practical workflows: configure the
            node, use the CLI, submit transfers, and integrate application APIs.
          </p>
        </div>

        <div className="resource-grid">
          {resources.map((resource) => (
            <Link
              className={`resource-card ${resource.className}`}
              href={resource.href}
              key={resource.title}
            >
              <span className="resource-card__index">{resource.index}</span>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <strong>
                {resource.label} <ArrowRight size={14} />
              </strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-wrap">
        <div className="resource-grid">
          <div className="resource-card">
            <span className="resource-card__index">
              <Code2 size={14} /> Code
            </span>
            <h3>Copy-ready examples</h3>
            <p>
              Commands and payloads are kept close to each concept so builders
              can move quickly.
            </p>
            <strong>Browse docs</strong>
          </div>
          <div className="resource-card resource-card--purple">
            <span className="resource-card__index">
              <ShieldCheck size={14} /> Trust
            </span>
            <h3>Secure by design</h3>
            <p>
              Follow patterns for verifiable metadata, signatures, and
              predictable resource flows.
            </p>
            <strong>Review model</strong>
          </div>
          <div className="resource-card">
            <span className="resource-card__index">
              <Route size={14} /> Flow
            </span>
            <h3>Clear paths</h3>
            <p>
              From local setup to API calls, each route is designed for
              repeatable implementation.
            </p>
            <strong>
              Open guide <BookOpen size={14} />
            </strong>
          </div>
        </div>
      </section>
    </main>
  );
}
