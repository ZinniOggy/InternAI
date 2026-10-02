'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { DemoStateProvider } from "../context/DemoStateProvider";
import { useDemoState } from "../context/DemoStateProvider";
import WorkflowStepper from "./WorkflowStepper";

function getCurrentStep(pathname: string): number {
  if (pathname === "/") return 0;
  if (pathname === "/discover") return 2;
  if (pathname.startsWith("/internships/") && pathname.endsWith("/prepare")) return 5;
  if (pathname.startsWith("/internships/")) return 3;
  if (pathname === "/applications") return 7;
  return 0;
}

function AppShellContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isHydrated, resetDemo } = useDemoState();

  return (
    <div className="app-shell">
      <header className="site-nav">
        <Link className="wordmark" href="/" aria-label="InternAI dashboard">
          InternAI
        </Link>
        <nav className="site-nav-links" aria-label="Primary navigation">
          <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
            Dashboard
          </Link>
          <Link href="/discover" aria-current={pathname === "/discover" ? "page" : undefined}>
            Discover
          </Link>
          <Link href="/applications" aria-current={pathname === "/applications" ? "page" : undefined}>
            Applications
          </Link>
          <button
            className="reset-demo-button"
            type="button"
            disabled={!isHydrated}
            onClick={resetDemo}
          >
            Reset demo
          </button>
        </nav>
      </header>
      <WorkflowStepper currentStep={getCurrentStep(pathname)} />
      <main className="app-main">{children}</main>
    </div>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <DemoStateProvider>
      <AppShellContent>{children}</AppShellContent>
    </DemoStateProvider>
  );
}
