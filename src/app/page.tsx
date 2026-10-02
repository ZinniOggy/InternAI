import Link from "next/link";

export default function Home() {
  return (
    <main className="dashboard">
      <header className="site-nav">
        <Link className="wordmark" href="/" aria-label="InternAI dashboard">
          InternAI
        </Link>
        <nav className="site-nav-links" aria-label="Primary navigation">
          <Link href="/" aria-current="page">Dashboard</Link>
          <Link href="/discover">Discover</Link>
          <Link href="/applications">Applications</Link>
        </nav>
      </header>

      <section className="hero-surface" aria-labelledby="hero-title">
        <div className="hero-content">
          <p className="eyebrow">INTERNSHIP DISCOVERY, WITH CLARITY</p>
          <h1 className="hero-title" id="hero-title">
            Find the internship that fits your next step.
          </h1>
          <p className="hero-summary">
            Explore opportunities with a clear view of what matches your profile.
          </p>
          <Link className="button button-hero" href="/discover">
            Discover internships <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="dashboard-content" aria-labelledby="dashboard-title">
        <div className="content-inner">
          <p className="eyebrow">YOUR DASHBOARD</p>
          <h2 className="section-title" id="dashboard-title">
            Opportunities, with the reasons behind each match.
          </h2>
          <p className="section-copy">
            Review your profile, compare internship fit, and prepare an application
            when you are ready.
          </p>
          <div className="dashboard-entry">
            <p className="dashboard-entry-copy">
              Start with the opportunities most relevant to your profile.
            </p>
            <Link className="button button-primary" href="/discover">
              Browse internships
            </Link>
          </div>
        </div>
      </section>

      <section className="teal-band" aria-labelledby="closing-title">
        <div className="teal-inner">
          <h2 className="teal-title" id="closing-title">
            Your next opportunity is waiting to be explored.
          </h2>
          <Link className="button button-teal" href="/discover">
            Discover internships
          </Link>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer-inner">InternAI · Internship discovery assistant</div>
      </footer>
    </main>
  );
}
